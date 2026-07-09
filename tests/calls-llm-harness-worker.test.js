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

test('callsLlmHarnessWorker classifies a 429 as rate-limit-error', async () => {
  const fakeFetch = buildsFakeFetch(buildsFakeJsonResponse({ error: 'too many requests' }, 429));

  const result = await callsLlmHarnessWorker(buildsAssignment(), { apiKey: 'test-key', fetchImpl: fakeFetch });

  assert.equal(result.callFailure.type, 'rate-limit-error');
});

test('callsLlmHarnessWorker classifies a 401 as authentication-error', async () => {
  const fakeFetch = buildsFakeFetch(buildsFakeJsonResponse({ error: 'bad key' }, 401));

  const result = await callsLlmHarnessWorker(buildsAssignment(), { apiKey: 'test-key', fetchImpl: fakeFetch });

  assert.equal(result.callFailure.type, 'authentication-error');
});

test('callsLlmHarnessWorker classifies a 500 as provider-overloaded', async () => {
  const fakeFetch = buildsFakeFetch(buildsFakeJsonResponse({ error: 'internal' }, 500));

  const result = await callsLlmHarnessWorker(buildsAssignment(), { apiKey: 'test-key', fetchImpl: fakeFetch });

  assert.equal(result.callFailure.type, 'provider-overloaded');
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
