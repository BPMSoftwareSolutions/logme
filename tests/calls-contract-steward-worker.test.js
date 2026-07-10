const test = require('node:test');
const assert = require('node:assert/strict');

const { callsContractStewardWorker, rendersContractStewardPrompt } = require('../src/calls-contract-steward-worker/calls-contract-steward-worker');

function buildsRequest(overrides = {}) {
  return {
    filePath: 'src/report-provenance/report-provenance.js',
    executableMethodCount: 3,
    responsibilityClusters: [{ name: 'build', methodNames: ['buildsReportProvenance'] }],
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

test('rendersContractStewardPrompt grounds the request in real method names and warns against guessing', () => {
  const prompt = rendersContractStewardPrompt(buildsRequest());

  assert.match(prompt, /do not guess/iu);
  assert.match(prompt, /src\/report-provenance\/report-provenance\.js/u);
  assert.match(prompt, /buildsReportProvenance/u);
});

test('callsContractStewardWorker returns raw response text on a successful call', async () => {
  async function fakeFetch() {
    return buildsFakeJsonResponse({
      candidates: [{
        finishReason: 'STOP',
        content: { parts: [{ text: '{"bodyKind":"product-domain body"}' }] },
      }],
      usageMetadata: { promptTokenCount: 5, candidatesTokenCount: 8 },
    });
  }

  const result = await callsContractStewardWorker(buildsRequest(), { apiKey: 'test-key', fetchImpl: fakeFetch });

  assert.equal(result.callFailure, null);
  assert.equal(result.filePath, 'src/report-provenance/report-provenance.js');
  assert.match(result.rawResponseText, /product-domain body/u);
});

test('callsContractStewardWorker returns authentication-error when no API key is available', async () => {
  const originalKey = process.env.LOC_GEMINI_API_KEY;
  delete process.env.LOC_GEMINI_API_KEY;

  try {
    async function fakeFetch() { return buildsFakeJsonResponse({}); }
    const result = await callsContractStewardWorker(buildsRequest(), { fetchImpl: fakeFetch });

    assert.equal(result.callFailure.type, 'authentication-error');
  } finally {
    if (originalKey !== undefined) {
      process.env.LOC_GEMINI_API_KEY = originalKey;
    }
  }
});

test('callsContractStewardWorker classifies a 500 as provider-overloaded when no OpenAI fallback key is available', async () => {
  async function fakeFetch() { return buildsFakeJsonResponse({ error: 'internal' }, 500); }

  const originalOpenAiKey = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;

  try {
    const result = await callsContractStewardWorker(buildsRequest(), { apiKey: 'test-key', fetchImpl: fakeFetch });

    assert.equal(result.callFailure.type, 'provider-overloaded');
  } finally {
    if (originalOpenAiKey !== undefined) {
      process.env.OPENAI_API_KEY = originalOpenAiKey;
    }
  }
});

test('callsContractStewardWorker falls back to OpenAI when Gemini is provider-overloaded', async () => {
  async function fakeGeminiFetch() { return buildsFakeJsonResponse({ error: 'internal' }, 500); }
  async function fakeOpenAiFetch() {
    return buildsFakeJsonResponse({
      choices: [{ finish_reason: 'stop', message: { content: '{"bodyKind":"product-domain body"}' } }],
      usage: { prompt_tokens: 3, completion_tokens: 4 },
    });
  }

  const result = await callsContractStewardWorker(buildsRequest(), {
    apiKey: 'test-key',
    fetchImpl: fakeGeminiFetch,
    openAiApiKey: 'openai-test-key',
    openAiFetchImpl: fakeOpenAiFetch,
  });

  assert.equal(result.callFailure, null);
  assert.equal(result.provider, 'openai');
  assert.equal(result.fallbackFrom, 'provider-overloaded');
  assert.match(result.rawResponseText, /product-domain body/u);
});
