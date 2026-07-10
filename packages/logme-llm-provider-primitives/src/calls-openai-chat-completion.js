const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

const OPENAI_BASE_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini';

function buildsOpenAiRequestBody(promptText, responseSchema, model, maxOutputTokens) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    model,
    max_tokens: maxOutputTokens,
    messages: [{ role: 'user', content: promptText }],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'worker_response',
        strict: true,
        schema: convertsToOpenAiJsonSchema(responseSchema),
      },
    },
  };
}

function convertsToOpenAiJsonSchema(geminiStyleSchema) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const properties = {};
  const propertyNames = Object.keys(geminiStyleSchema.properties);

  for (const propertyName of propertyNames) {
    properties[propertyName] = convertsPropertySchema(geminiStyleSchema.properties[propertyName]);
  }

  return {
    type: 'object',
    properties,
    required: propertyNames,
    additionalProperties: false,
  };
}

function convertsPropertySchema(propertySchema) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (propertySchema.type === 'ARRAY') {
    return { type: 'array', items: { type: 'string' } };
  }

  const converted = { type: 'string' };
  if (Array.isArray(propertySchema.enum)) {
    converted.enum = propertySchema.enum;
  }

  return converted;
}

function extractsOpenAiResponseText(data) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const choice = data.choices && data.choices[0];
  return (choice && choice.message && choice.message.content) || '';
}

async function classifiesOpenAiHttpFailure(response) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const errorText = await response.text();

  if (response.status === 401 || response.status === 403) {
    return { type: 'authentication-error', message: `OpenAI authentication failed: ${errorText}` };
  }

  if (response.status === 404) {
    return { type: 'model-not-found', message: `OpenAI model not found: ${errorText}` };
  }

  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    return { type: 'rate-limit-error', message: `OpenAI rate limited: ${errorText}`, retryAfter };
  }

  if (response.status >= 500) {
    return { type: 'provider-overloaded', message: `OpenAI provider error ${response.status}: ${errorText}` };
  }

  return { type: 'api-error', message: `OpenAI HTTP ${response.status}: ${errorText}` };
}

function classifiesOpenAiNetworkFailure(callError) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const message = callError && callError.message ? callError.message : String(callError);

  if (callError && callError.name === 'AbortError') {
    return { type: 'timeout-error', message };
  }

  return { type: 'unknown-error', message };
}

async function callsOpenAiChatCompletion(promptText, responseSchema, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
  const model = options.model || DEFAULT_OPENAI_MODEL;
  const maxOutputTokens = options.maxOutputTokens || 8192;
  const fetchImpl = options.fetchImpl || fetch;

  if (!apiKey) {
    return { rawResponseText: null, model: null, finishReason: null, usage: null, callFailure: { type: 'authentication-error', message: 'OPENAI_API_KEY is not set' } };
  }

  try {
    const response = await fetchImpl(OPENAI_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(buildsOpenAiRequestBody(promptText, responseSchema, model, maxOutputTokens)),
    });

    if (!response.ok) {
      const callFailure = await classifiesOpenAiHttpFailure(response);
      return { rawResponseText: null, model: null, finishReason: null, usage: null, callFailure };
    }

    const data = await response.json();
    const choice = data.choices && data.choices[0];

    return {
      rawResponseText: extractsOpenAiResponseText(data),
      model,
      finishReason: choice ? choice.finish_reason : null,
      usage: data.usage || null,
      callFailure: null,
    };
  } catch (callError) {
    return { rawResponseText: null, model: null, finishReason: null, usage: null, callFailure: classifiesOpenAiNetworkFailure(callError) };
  }
}

module.exports = {
  DEFAULT_OPENAI_MODEL,
  buildsOpenAiRequestBody,
  convertsToOpenAiJsonSchema,
  callsOpenAiChatCompletion,
};
