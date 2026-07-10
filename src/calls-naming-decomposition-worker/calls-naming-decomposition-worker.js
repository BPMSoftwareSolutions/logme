const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { callsOpenAiChatCompletion } = require('../../packages/logme-llm-provider-primitives/src/calls-openai-chat-completion');

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const MAX_OUTPUT_TOKENS = 8192;
const RETRYABLE_TO_FALLBACK_FAILURE_TYPES = new Set(['provider-overloaded', 'rate-limit-error', 'model-not-found', 'unknown-error', 'timeout-error']);

function buildsNamingDecompositionResponseSchema() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    type: 'OBJECT',
    properties: {
      classification: {
        type: 'STRING',
        enum: ['mechanical rename', 'rename plus contract update', 'decompose before rename', 'package-contract exception', 'product-owner review required'],
      },
      proposedActionVerb: { type: 'STRING', description: 'the single primary action verb, or empty if classification is not a rename' },
      proposedPath: { type: 'STRING', description: 'the proposed action-bearing file path, or empty if classification is not a rename' },
      responsibilityEvidence: { type: 'STRING', description: 'cites the real method names given below that justify the classification' },
      classificationReason: { type: 'STRING' },
    },
    required: ['classification', 'proposedActionVerb', 'proposedPath', 'responsibilityEvidence', 'classificationReason'],
  };
}

function rendersNamingDecompositionPrompt(request) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    'You are the Naming And Decomposition Worker for a code remediation pipeline.',
    'You PROPOSE a classification for one executable file whose name is a noun or capability label instead of an action-bearing name. A deterministic gate, not you, decides whether the proposal is promoted.',
    'Ground every claim in the real method names and cluster count listed below. Do not invent method names or behavior you cannot see.',
    '',
    'Classification rules:',
    '- "mechanical rename": the file has exactly one responsibility cluster. Propose a single action-bearing name for the whole file.',
    '- "rename plus contract update": one responsibility cluster, but the file is also missing a body contract entry.',
    '- "decompose before rename": the file has more than one responsibility cluster. Do not propose a single rename; recommend decomposition first.',
    '- "package-contract exception": the file is a foundational package primitive (e.g. core testimony/logging infrastructure) where a generic name is intentional and documented.',
    '- "product-owner review required": you cannot determine a safe classification from the evidence given.',
    '',
    `File path: ${request.filePath}`,
    `Responsibility cluster count: ${request.responsibilityClusterCount}`,
    'Responsibility clusters (real method names grouped by inferred action):',
    request.responsibilityClusters.map(rendersClusterLine).join('\n'),
    '',
    'Respond with a JSON object: classification, proposedActionVerb, proposedPath, responsibilityEvidence, classificationReason.',
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
        parts: [{ text: rendersNamingDecompositionPrompt(request) }],
      },
    ],
    generationConfig: {
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      responseMimeType: 'application/json',
      responseSchema: buildsNamingDecompositionResponseSchema(),
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

async function callsNamingDecompositionWorker(request, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const geminiResult = await callsGeminiForNamingDecomposition(request, options);

  if (!geminiResult.callFailure || !RETRYABLE_TO_FALLBACK_FAILURE_TYPES.has(geminiResult.callFailure.type)) {
    return geminiResult;
  }

  const openAiApiKey = options.openAiApiKey || process.env.OPENAI_API_KEY;
  if (!openAiApiKey) {
    return geminiResult;
  }

  return callsOpenAiForNamingDecomposition(request, options, openAiApiKey, geminiResult.callFailure);
}

async function callsGeminiForNamingDecomposition(request, options) {
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

async function callsOpenAiForNamingDecomposition(request, options, openAiApiKey, geminiCallFailure) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const openAiResult = await callsOpenAiChatCompletion(
    rendersNamingDecompositionPrompt(request),
    buildsNamingDecompositionResponseSchema(),
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
  buildsNamingDecompositionResponseSchema,
  rendersNamingDecompositionPrompt,
  callsNamingDecompositionWorker,
};
