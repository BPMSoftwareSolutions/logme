const test = require('node:test');
const assert = require('node:assert/strict');

const { callsNamingDecompositionWorker, rendersNamingDecompositionPrompt } = require('../src/calls-naming-decomposition-worker/calls-naming-decomposition-worker');

function buildsRequest(overrides = {}) {
  return {
    filePath: 'packages/logme-config-primitives/src/reads-json-config-file.js',
    responsibilityClusterCount: 1,
    responsibilityClusters: [{ name: 'unclear-action', methodNames: ['readsJsonConfigFile'] }],
    ...overrides,
  };
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

test('rendersNamingDecompositionPrompt grounds the request in real method names and classification rules', () => {
  const prompt = rendersNamingDecompositionPrompt(buildsRequest());

  assert.match(prompt, /mechanical rename/u);
  assert.match(prompt, /decompose before rename/u);
  assert.match(prompt, /readsJsonConfigFile/u);
});

test('callsNamingDecompositionWorker returns raw response text on a successful call', async () => {
  async function fakeFetch() {
    return buildsFakeJsonResponse({
      candidates: [{ finishReason: 'STOP', content: { parts: [{ text: '{"classification":"mechanical rename"}' }] } }],
      usageMetadata: { promptTokenCount: 5, candidatesTokenCount: 8 },
    });
  }

  const result = await callsNamingDecompositionWorker(buildsRequest(), { apiKey: 'test-key', fetchImpl: fakeFetch });

  assert.equal(result.callFailure, null);
  assert.match(result.rawResponseText, /mechanical rename/u);
});

test('callsNamingDecompositionWorker classifies a 429 as rate-limit-error when no OpenAI fallback key is available', async () => {
  async function fakeFetch() { return buildsFakeJsonResponse({ error: 'too many requests' }, 429); }

  const originalOpenAiKey = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;

  try {
    const result = await callsNamingDecompositionWorker(buildsRequest(), { apiKey: 'test-key', fetchImpl: fakeFetch });

    assert.equal(result.callFailure.type, 'rate-limit-error');
  } finally {
    if (originalOpenAiKey !== undefined) {
      process.env.OPENAI_API_KEY = originalOpenAiKey;
    }
  }
});

test('callsNamingDecompositionWorker falls back to OpenAI when Gemini is provider-overloaded', async () => {
  async function fakeGeminiFetch() { return buildsFakeJsonResponse({ error: 'overloaded' }, 503); }
  async function fakeOpenAiFetch() {
    return buildsFakeJsonResponse({
      choices: [{ finish_reason: 'stop', message: { content: '{"classification":"mechanical rename"}' } }],
      usage: { prompt_tokens: 3, completion_tokens: 4 },
    });
  }

  const result = await callsNamingDecompositionWorker(buildsRequest(), {
    apiKey: 'test-key',
    fetchImpl: fakeGeminiFetch,
    openAiApiKey: 'openai-test-key',
    openAiFetchImpl: fakeOpenAiFetch,
  });

  assert.equal(result.callFailure, null);
  assert.equal(result.provider, 'openai');
  assert.equal(result.fallbackFrom, 'provider-overloaded');
});
