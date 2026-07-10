const test = require('node:test');
const assert = require('node:assert/strict');

const { callsPackageExtractionWorker, rendersPackageExtractionPrompt } = require('../src/calls-package-extraction-worker/calls-package-extraction-worker');

function buildsRequest(overrides = {}) {
  return {
    filePath: 'src/example/example.js',
    existingPackages: ['logme-config-primitives', 'logme-report-primitives'],
    groundedMechanics: [{ mechanic: 'path joining or path normalization', methodNames: ['formatsPath'] }],
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

test('rendersPackageExtractionPrompt grounds the request in real mechanics and existing packages', () => {
  const prompt = rendersPackageExtractionPrompt(buildsRequest());

  assert.match(prompt, /do not invent method names/iu);
  assert.match(prompt, /logme-config-primitives/u);
  assert.match(prompt, /formatsPath/u);
});

test('callsPackageExtractionWorker returns raw response text on a successful call', async () => {
  async function fakeFetch() {
    return buildsFakeJsonResponse({
      candidates: [{ finishReason: 'STOP', content: { parts: [{ text: '{"classification":"existing package"}' }] } }],
      usageMetadata: { promptTokenCount: 5, candidatesTokenCount: 8 },
    });
  }

  const result = await callsPackageExtractionWorker(buildsRequest(), { apiKey: 'test-key', fetchImpl: fakeFetch });

  assert.equal(result.callFailure, null);
  assert.match(result.rawResponseText, /existing package/u);
});

test('callsPackageExtractionWorker classifies a 429 as rate-limit-error when no OpenAI fallback key is available', async () => {
  async function fakeFetch() { return buildsFakeJsonResponse({ error: 'too many requests' }, 429); }

  const originalOpenAiKey = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;

  try {
    const result = await callsPackageExtractionWorker(buildsRequest(), { apiKey: 'test-key', fetchImpl: fakeFetch });

    assert.equal(result.callFailure.type, 'rate-limit-error');
  } finally {
    if (originalOpenAiKey !== undefined) {
      process.env.OPENAI_API_KEY = originalOpenAiKey;
    }
  }
});

test('callsPackageExtractionWorker falls back to OpenAI when Gemini is provider-overloaded', async () => {
  async function fakeGeminiFetch() { return buildsFakeJsonResponse({ error: 'overloaded' }, 503); }
  async function fakeOpenAiFetch() {
    return buildsFakeJsonResponse({
      choices: [{ finish_reason: 'stop', message: { content: '{"classification":"new package"}' } }],
      usage: { prompt_tokens: 3, completion_tokens: 4 },
    });
  }

  const result = await callsPackageExtractionWorker(buildsRequest(), {
    apiKey: 'test-key',
    fetchImpl: fakeGeminiFetch,
    openAiApiKey: 'openai-test-key',
    openAiFetchImpl: fakeOpenAiFetch,
  });

  assert.equal(result.callFailure, null);
  assert.equal(result.provider, 'openai');
  assert.equal(result.fallbackFrom, 'provider-overloaded');
});
