const test = require('node:test');
const assert = require('node:assert/strict');

const { callsScenarioTieOutWorker, rendersScenarioTieOutPrompt } = require('../src/calls-scenario-tieout-worker/calls-scenario-tieout-worker');

function buildsRequest(overrides = {}) {
  return {
    filePath: 'src/renders-report/renders-report.js',
    primaryBodyResponsibility: 'render-report',
    classification: 'product-domain body',
    candidateFeatureDocPaths: ['docs/features/example.feature.md'],
    candidateTestFilePaths: ['tests/renders-report.test.js'],
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

test('rendersScenarioTieOutPrompt tells the worker not to guess without evidence', () => {
  const prompt = rendersScenarioTieOutPrompt(buildsRequest());

  assert.match(prompt, /do not guess/iu);
  assert.match(prompt, /src\/renders-report\/renders-report\.js/u);
  assert.match(prompt, /docs\/features\/example\.feature\.md/u);
  assert.match(prompt, /tests\/renders-report\.test\.js/u);
});

test('callsScenarioTieOutWorker returns raw response text on a successful call', async () => {
  async function fakeFetch() {
    return buildsFakeJsonResponse({
      candidates: [{
        finishReason: 'STOP',
        content: { parts: [{ text: '{"featureId":"example","scenarioId":"feature:example#scenario:x"}' }] },
      }],
      usageMetadata: { promptTokenCount: 5, candidatesTokenCount: 8 },
    });
  }

  const result = await callsScenarioTieOutWorker(buildsRequest(), { apiKey: 'test-key', fetchImpl: fakeFetch });

  assert.equal(result.callFailure, null);
  assert.equal(result.filePath, 'src/renders-report/renders-report.js');
  assert.match(result.rawResponseText, /scenario:x/u);
  assert.deepEqual(result.usage, { promptTokenCount: 5, candidatesTokenCount: 8 });
});

test('callsScenarioTieOutWorker returns authentication-error when no API key is available', async () => {
  const originalKey = process.env.LOC_GEMINI_API_KEY;
  delete process.env.LOC_GEMINI_API_KEY;

  try {
    async function fakeFetch() { return buildsFakeJsonResponse({}); }
    const result = await callsScenarioTieOutWorker(buildsRequest(), { fetchImpl: fakeFetch });

    assert.equal(result.callFailure.type, 'authentication-error');
  } finally {
    if (originalKey !== undefined) {
      process.env.LOC_GEMINI_API_KEY = originalKey;
    }
  }
});

test('callsScenarioTieOutWorker classifies a 429 as rate-limit-error', async () => {
  async function fakeFetch() { return buildsFakeJsonResponse({ error: 'too many requests' }, 429); }

  const result = await callsScenarioTieOutWorker(buildsRequest(), { apiKey: 'test-key', fetchImpl: fakeFetch });

  assert.equal(result.callFailure.type, 'rate-limit-error');
});

test('callsScenarioTieOutWorker returns a safety-blocked callFailure when finishReason is SAFETY', async () => {
  async function fakeFetch() {
    return buildsFakeJsonResponse({ candidates: [{ finishReason: 'SAFETY', content: { parts: [] } }] });
  }

  const result = await callsScenarioTieOutWorker(buildsRequest(), { apiKey: 'test-key', fetchImpl: fakeFetch });

  assert.equal(result.rawResponseText, null);
  assert.equal(result.callFailure.type, 'safety-blocked');
});
