const test = require('node:test');
const assert = require('node:assert/strict');

const { callsLlmHarnessWorker } = require('../src/calls-llm-harness-worker/calls-llm-harness-worker');

function buildsAssignment(overrides = {}) {
  return {
    runId: 'run-001',
    parentHarnessId: null,
    requestedCapability: 'first-flow',
    allowedMutationPaths: ['src/generated-harnesses/harness-001/'],
    ...overrides,
  };
}

function buildsFakeFetch(response) {
  async function fakeFetch() {
    return response;
  }

  return fakeFetch;
}

function buildsFakeJsonResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get() { return null; } },
    async json() { return body; },
    async text() { return JSON.stringify(body); },
  };
}

test('callsLlmHarnessWorker returns raw response text on a successful call', async () => {
  const fakeFetch = buildsFakeFetch(buildsFakeJsonResponse({
    candidates: [{
      finishReason: 'STOP',
      content: { parts: [{ text: '{"harnessId":"harness-001"}' }] },
    }],
    usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 20 },
  }));

  const result = await callsLlmHarnessWorker(buildsAssignment(), { apiKey: 'test-key', fetchImpl: fakeFetch });

  assert.equal(result.callFailure, null);
  assert.equal(result.rawResponseText, '{"harnessId":"harness-001"}');
  assert.equal(result.finishReason, 'STOP');
  assert.equal(result.runId, 'run-001');
  assert.deepEqual(result.usage, { promptTokenCount: 10, candidatesTokenCount: 20 });
});

test('callsLlmHarnessWorker returns a safety-blocked callFailure when finishReason is SAFETY', async () => {
  const fakeFetch = buildsFakeFetch(buildsFakeJsonResponse({
    candidates: [{ finishReason: 'SAFETY', content: { parts: [] } }],
  }));

  const result = await callsLlmHarnessWorker(buildsAssignment(), { apiKey: 'test-key', fetchImpl: fakeFetch });

  assert.equal(result.rawResponseText, null);
  assert.equal(result.callFailure.type, 'safety-blocked');
});

test('callsLlmHarnessWorker classifies a 429 as rate-limit-error when no OpenAI fallback key is available', async () => {
  const fakeFetch = buildsFakeFetch(buildsFakeJsonResponse({ error: 'too many requests' }, 429));

  const originalOpenAiKey = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;

  try {
    const result = await callsLlmHarnessWorker(buildsAssignment(), { apiKey: 'test-key', fetchImpl: fakeFetch });

    assert.equal(result.callFailure.type, 'rate-limit-error');
  } finally {
    if (originalOpenAiKey !== undefined) {
      process.env.OPENAI_API_KEY = originalOpenAiKey;
    }
  }
});

test('callsLlmHarnessWorker classifies a 401 as authentication-error', async () => {
  const fakeFetch = buildsFakeFetch(buildsFakeJsonResponse({ error: 'bad key' }, 401));

  const result = await callsLlmHarnessWorker(buildsAssignment(), { apiKey: 'test-key', fetchImpl: fakeFetch });

  assert.equal(result.callFailure.type, 'authentication-error');
});

test('callsLlmHarnessWorker classifies a 500 as provider-overloaded when no OpenAI fallback key is available', async () => {
  const fakeFetch = buildsFakeFetch(buildsFakeJsonResponse({ error: 'internal' }, 500));

  const originalOpenAiKey = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;

  try {
    const result = await callsLlmHarnessWorker(buildsAssignment(), { apiKey: 'test-key', fetchImpl: fakeFetch });

    assert.equal(result.callFailure.type, 'provider-overloaded');
  } finally {
    if (originalOpenAiKey !== undefined) {
      process.env.OPENAI_API_KEY = originalOpenAiKey;
    }
  }
});

test('callsLlmHarnessWorker falls back to OpenAI when Gemini is provider-overloaded', async () => {
  const fakeGeminiFetch = buildsFakeFetch(buildsFakeJsonResponse({ error: 'internal' }, 500));
  async function fakeOpenAiFetch() {
    return buildsFakeJsonResponse({
      choices: [{ finish_reason: 'stop', message: { content: '{"harnessId":"harness-openai"}' } }],
      usage: { prompt_tokens: 3, completion_tokens: 4 },
    });
  }

  const result = await callsLlmHarnessWorker(buildsAssignment(), {
    apiKey: 'test-key',
    fetchImpl: fakeGeminiFetch,
    openAiApiKey: 'openai-test-key',
    openAiFetchImpl: fakeOpenAiFetch,
  });

  assert.equal(result.callFailure, null);
  assert.equal(result.provider, 'openai');
  assert.equal(result.fallbackFrom, 'provider-overloaded');
  assert.match(result.rawResponseText, /harness-openai/u);
});

test('callsLlmHarnessWorker returns authentication-error when no API key is available', async () => {
  const originalKey = process.env.LOC_GEMINI_API_KEY;
  delete process.env.LOC_GEMINI_API_KEY;

  try {
    const result = await callsLlmHarnessWorker(buildsAssignment(), { fetchImpl: buildsFakeFetch(buildsFakeJsonResponse({})) });

    assert.equal(result.callFailure.type, 'authentication-error');
    assert.match(result.callFailure.message, /LOC_GEMINI_API_KEY/);
  } finally {
    if (originalKey !== undefined) {
      process.env.LOC_GEMINI_API_KEY = originalKey;
    }
  }
});

test('callsLlmHarnessWorker classifies a network throw as unknown-error', async () => {
  async function throwingFetch() {
    throw new Error('ECONNREFUSED');
  }

  const result = await callsLlmHarnessWorker(buildsAssignment(), { apiKey: 'test-key', fetchImpl: throwingFetch });

  assert.equal(result.callFailure.type, 'unknown-error');
  assert.match(result.callFailure.message, /ECONNREFUSED/);
});

test('callsLlmHarnessWorker classifies an AbortError as timeout-error', async () => {
  async function abortingFetch() {
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';
    throw abortError;
  }

  const result = await callsLlmHarnessWorker(buildsAssignment(), { apiKey: 'test-key', fetchImpl: abortingFetch });

  assert.equal(result.callFailure.type, 'timeout-error');
});
