const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { callsOpenAiChatCompletion } = require('../../packages/logme-llm-provider-primitives/src/calls-openai-chat-completion');

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const MAX_OUTPUT_TOKENS = 8192;
const RETRYABLE_TO_FALLBACK_FAILURE_TYPES = new Set(['provider-overloaded', 'rate-limit-error', 'model-not-found', 'unknown-error', 'timeout-error']);

function buildsContractStewardResponseSchema() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    type: 'OBJECT',
    properties: {
      bodyKind: { type: 'STRING', enum: ['product-domain body', 'package primitive', 'generated evidence', 'test body', 'scaffold or entrypoint', 'waiver'] },
      bodyId: { type: 'STRING', description: 'dotted identifier such as logme.report-provenance' },
      actionVerb: { type: 'STRING', description: 'the single primary action verb this body performs, or empty if bodyKind is not product-domain body' },
      responsibility: { type: 'STRING', description: 'one sentence describing what this body owns and why it is not part of another body' },
      allowedDependencies: { type: 'ARRAY', items: { type: 'STRING' } },
      decompositionStatus: { type: 'STRING', enum: ['single-responsibility', 'decomposition-recommended', 'decomposition-not-needed'] },
      waiverReason: { type: 'STRING', description: 'required only when bodyKind is waiver; otherwise empty' },
    },
    required: ['bodyKind', 'bodyId', 'actionVerb', 'responsibility', 'allowedDependencies', 'decompositionStatus', 'waiverReason'],
  };
}

function rendersContractStewardPrompt(request) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    'You are the Contract Steward Worker for a code remediation pipeline.',
    'You PROPOSE a file-system body contract entry for one executable file that is currently missing one. A deterministic gate, not you, decides whether the proposal is promoted.',
    'Ground every claim in the real method names listed below. Do not invent method names or behavior you cannot see.',
    'If the file does not belong in the product domain body (it is a package primitive, generated evidence, a test, scaffold, or entrypoint), say so in bodyKind instead of forcing a product-domain classification.',
    'If you genuinely cannot determine a responsibility from the evidence given, set bodyKind to "waiver" and explain why in waiverReason -- do not guess.',
    '',
    `File path: ${request.filePath}`,
    `Executable method count: ${request.executableMethodCount}`,
    '',
    'Responsibility clusters (real method names grouped by inferred action):',
    request.responsibilityClusters.map(rendersClusterLine).join('\n'),
    '',
    'Respond with a JSON object: bodyKind, bodyId, actionVerb, responsibility, allowedDependencies (array of package or path prefixes),',
    'decompositionStatus, and waiverReason.',
  ].join('\n');
}

function rendersClusterLine(cluster) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return `- ${cluster.name}: ${cluster.methodNames.join(', ')}`;
}

function buildsGeminiRequestBody(request) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    contents: [
      {
        role: 'user',
        parts: [{ text: rendersContractStewardPrompt(request) }],
      },
    ],
    generationConfig: {
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      responseMimeType: 'application/json',
      responseSchema: buildsContractStewardResponseSchema(),
    },
  };
}

function extractsGeminiResponseText(data) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const candidate = data.candidates && data.candidates[0];

  if (!candidate || !candidate.content || !Array.isArray(candidate.content.parts)) {
    return '';
  }

  const textParts = [];
  for (const part of candidate.content.parts) {
    textParts.push(part.text || '');
  }

  return textParts.join('');
}

function buildsWorkerResultFromResponse(request, model, data) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const candidate = data.candidates && data.candidates[0];
  const finishReason = candidate ? candidate.finishReason : null;

  if (finishReason === 'SAFETY') {
    return buildsWorkerResultFromFailure(request, {
      type: 'safety-blocked',
      message: 'Gemini blocked the response due to safety policy',
    });
  }

  return {
    filePath: request.filePath,
    rawResponseText: extractsGeminiResponseText(data),
    model,
    finishReason,
    usage: data.usageMetadata || null,
    callFailure: null,
  };
}

function buildsWorkerResultFromFailure(request, callFailure) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    filePath: request.filePath,
    rawResponseText: null,
    model: null,
    finishReason: null,
    usage: null,
    callFailure,
  };
}

async function classifiesGeminiHttpFailure(response) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const errorText = await response.text();

  if (response.status === 401 || response.status === 403) {
    return { type: 'authentication-error', message: `Gemini authentication failed: ${errorText}` };
  }

  if (response.status === 404) {
    return { type: 'model-not-found', message: `Gemini model not found: ${errorText}` };
  }

  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    return { type: 'rate-limit-error', message: `Gemini rate limited: ${errorText}`, retryAfter };
  }

  if (response.status >= 500) {
    return { type: 'provider-overloaded', message: `Gemini provider error ${response.status}: ${errorText}` };
  }

  return { type: 'api-error', message: `Gemini HTTP ${response.status}: ${errorText}` };
}

function classifiesGeminiNetworkFailure(callError) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const message = callError && callError.message ? callError.message : String(callError);

  if (callError && callError.name === 'AbortError') {
    return { type: 'timeout-error', message };
  }

  return { type: 'unknown-error', message };
}

async function callsContractStewardWorker(request, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const geminiResult = await callsGeminiForContractSteward(request, options);

  if (!geminiResult.callFailure || !RETRYABLE_TO_FALLBACK_FAILURE_TYPES.has(geminiResult.callFailure.type)) {
    return geminiResult;
  }

  const openAiApiKey = options.openAiApiKey || process.env.OPENAI_API_KEY;
  if (!openAiApiKey) {
    return geminiResult;
  }

  return callsOpenAiForContractSteward(request, options, openAiApiKey, geminiResult.callFailure);
}

async function callsGeminiForContractSteward(request, options) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const apiKey = options.apiKey || process.env.LOC_GEMINI_API_KEY;
  const model = options.model || GEMINI_MODEL;
  const fetchImpl = options.fetchImpl || fetch;

  if (!apiKey) {
    return buildsWorkerResultFromFailure(request, {
      type: 'authentication-error',
      message: 'LOC_GEMINI_API_KEY is not set',
    });
  }

  try {
    const response = await fetchImpl(
      `${GEMINI_BASE_URL}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildsGeminiRequestBody(request)),
      },
    );

    if (!response.ok) {
      return buildsWorkerResultFromFailure(request, await classifiesGeminiHttpFailure(response));
    }

    const data = await response.json();
    return buildsWorkerResultFromResponse(request, model, data);
  } catch (callError) {
    return buildsWorkerResultFromFailure(request, classifiesGeminiNetworkFailure(callError));
  }
}

async function callsOpenAiForContractSteward(request, options, openAiApiKey, geminiCallFailure) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const openAiResult = await callsOpenAiChatCompletion(
    rendersContractStewardPrompt(request),
    buildsContractStewardResponseSchema(),
    { apiKey: openAiApiKey, fetchImpl: options.openAiFetchImpl || options.fetchImpl, model: options.openAiModel, maxOutputTokens: MAX_OUTPUT_TOKENS },
  );

  if (openAiResult.callFailure) {
    return buildsWorkerResultFromFailure(request, {
      type: openAiResult.callFailure.type,
      message: `gemini fallback to openai also failed: gemini(${geminiCallFailure.type}) then openai(${openAiResult.callFailure.type}): ${openAiResult.callFailure.message}`,
    });
  }

  return {
    filePath: request.filePath,
    rawResponseText: openAiResult.rawResponseText,
    model: openAiResult.model,
    finishReason: openAiResult.finishReason,
    usage: openAiResult.usage,
    callFailure: null,
    provider: 'openai',
    fallbackFrom: geminiCallFailure.type,
  };
}

module.exports = {
  buildsContractStewardResponseSchema,
  rendersContractStewardPrompt,
  callsContractStewardWorker,
};
