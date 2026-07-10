const test = require('node:test');
const assert = require('node:assert/strict');

const { callsOpenAiChatCompletion } = require('../packages/logme-llm-provider-primitives/src/calls-openai-chat-completion');

function buildsFakeJsonResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get() { return null; } },
    async json() { return body; },
    async text() { return JSON.stringify(body); },
  };
}

function buildsSchema() {
  return {
    type: 'OBJECT',
    properties: {
      featureId: { type: 'STRING' },
      confidence: { type: 'STRING', enum: ['low', 'medium', 'high'] },
      allowedDependencies: { type: 'ARRAY' },
    },
  };
}

test('callsOpenAiChatCompletion returns response text on a successful call', async () => {
  async function fakeFetch(url, requestInit) {
    const body = JSON.parse(requestInit.body);
    assert.equal(body.response_format.json_schema.schema.properties.featureId.type, 'string');
    assert.equal(requestInit.headers.Authorization, 'Bearer test-key');

    return buildsFakeJsonResponse({
      choices: [{ finish_reason: 'stop', message: { content: '{"featureId":"example"}' } }],
      usage: { prompt_tokens: 10, completion_tokens: 5 },
    });
  }

  const result = await callsOpenAiChatCompletion('prompt text', buildsSchema(), { apiKey: 'test-key', fetchImpl: fakeFetch });

  assert.equal(result.callFailure, null);
  assert.equal(result.rawResponseText, '{"featureId":"example"}');
  assert.equal(result.finishReason, 'stop');
  assert.deepEqual(result.usage, { prompt_tokens: 10, completion_tokens: 5 });
});

test('callsOpenAiChatCompletion returns authentication-error when no API key is available', async () => {
  const originalKey = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;

  try {
    async function fakeFetch() { return buildsFakeJsonResponse({}); }
    const result = await callsOpenAiChatCompletion('prompt text', buildsSchema(), { fetchImpl: fakeFetch });

    assert.equal(result.callFailure.type, 'authentication-error');
    assert.match(result.callFailure.message, /OPENAI_API_KEY/u);
  } finally {
    if (originalKey !== undefined) {
      process.env.OPENAI_API_KEY = originalKey;
    }
  }
});

test('callsOpenAiChatCompletion classifies a 429 as rate-limit-error', async () => {
  async function fakeFetch() { return buildsFakeJsonResponse({ error: 'too many requests' }, 429); }

  const result = await callsOpenAiChatCompletion('prompt text', buildsSchema(), { apiKey: 'test-key', fetchImpl: fakeFetch });

  assert.equal(result.callFailure.type, 'rate-limit-error');
});

test('callsOpenAiChatCompletion classifies a 503 as provider-overloaded', async () => {
  async function fakeFetch() { return buildsFakeJsonResponse({ error: 'overloaded' }, 503); }

  const result = await callsOpenAiChatCompletion('prompt text', buildsSchema(), { apiKey: 'test-key', fetchImpl: fakeFetch });

  assert.equal(result.callFailure.type, 'provider-overloaded');
});

test('callsOpenAiChatCompletion classifies a network throw as unknown-error', async () => {
  async function throwingFetch() { throw new Error('ECONNREFUSED'); }

  const result = await callsOpenAiChatCompletion('prompt text', buildsSchema(), { apiKey: 'test-key', fetchImpl: throwingFetch });

  assert.equal(result.callFailure.type, 'unknown-error');
  assert.match(result.callFailure.message, /ECONNREFUSED/u);
});
