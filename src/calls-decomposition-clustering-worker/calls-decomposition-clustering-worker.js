const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { callsOpenAiChatCompletion } = require('../../packages/logme-llm-provider-primitives/src/calls-openai-chat-completion');

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const MAX_OUTPUT_TOKENS = 8192;
const RETRYABLE_TO_FALLBACK_FAILURE_TYPES = new Set(['provider-overloaded', 'rate-limit-error', 'model-not-found', 'unknown-error', 'timeout-error']);

function buildsDecompositionClusteringResponseSchema() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    type: 'OBJECT',
    properties: {
      subClusters: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            proposedFileStem: { type: 'STRING', description: 'kebab-case action-bearing file stem, e.g. calculates-execution-timing-metrics' },
            memberNames: { type: 'ARRAY', items: { type: 'STRING' } },
            responsibility: { type: 'STRING' },
          },
          required: ['proposedFileStem', 'memberNames', 'responsibility'],
        },
      },
    },
    required: ['subClusters'],
  };
}

function rendersDecompositionClusteringPrompt(request) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    'You are proposing a semantic decomposition for one call-graph-connected cluster of functions inside an oversized source file.',
    'You PROPOSE how to sub-divide this cluster into smaller, single-responsibility groups. A deterministic gate, not you, decides whether the split is safe and applies it.',
    'Every function listed below is real and already exists in the file. Do not invent functions. Every function must appear in exactly one proposed sub-cluster -- do not drop any and do not duplicate any.',
    'Group functions that share one clear responsibility together (for example: timing/metrics calculation, SLI/SLO evaluation, report rendering, CSV projection). Prefer 3 to 8 sub-clusters. Each proposedFileStem must be an action-bearing kebab-case name.',
    '',
    `Cluster size: ${request.memberNames.length} functions`,
    'Functions and what they call (within this cluster only):',
    request.memberNames.map(rendersMemberLine.bind(null, request.callGraph)).join('\n'),
    '',
    'Respond with a JSON object: subClusters, an array of { proposedFileStem, memberNames, responsibility }.',
  ].join('\n');
}

function rendersMemberLine(callGraph, memberName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const calledNames = callGraph[memberName] || [];
  return `- ${memberName}${calledNames.length > 0 ? ` (calls: ${calledNames.join(', ')})` : ''}`;
}

function buildsGeminiRequestBody(request) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    contents: [
      {
        role: 'user',
        parts: [{ text: rendersDecompositionClusteringPrompt(request) }],
      },
    ],
    generationConfig: {
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      responseMimeType: 'application/json',
      responseSchema: buildsDecompositionClusteringResponseSchema(),
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
    return buildsWorkerResultFromFailure({
      type: 'safety-blocked',
      message: 'Gemini blocked the response due to safety policy',
    });
  }

  return {
    rawResponseText: extractsGeminiResponseText(data),
    model,
    finishReason,
    usage: data.usageMetadata || null,
    callFailure: null,
  };
}

function buildsWorkerResultFromFailure(callFailure) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
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

async function callsDecompositionClusteringWorker(request, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const geminiResult = await callsGeminiForDecompositionClustering(request, options);

  if (!geminiResult.callFailure || !RETRYABLE_TO_FALLBACK_FAILURE_TYPES.has(geminiResult.callFailure.type)) {
    return geminiResult;
  }

  const openAiApiKey = options.openAiApiKey || process.env.OPENAI_API_KEY;
  if (!openAiApiKey) {
    return geminiResult;
  }

  return callsOpenAiForDecompositionClustering(request, options, openAiApiKey, geminiResult.callFailure);
}

async function callsGeminiForDecompositionClustering(request, options) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const apiKey = options.apiKey || process.env.LOC_GEMINI_API_KEY;
  const model = options.model || GEMINI_MODEL;
  const fetchImpl = options.fetchImpl || fetch;

  if (!apiKey) {
    return buildsWorkerResultFromFailure({
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
      return buildsWorkerResultFromFailure(await classifiesGeminiHttpFailure(response));
    }

    const data = await response.json();
    return buildsWorkerResultFromResponse(request, model, data);
  } catch (callError) {
    return buildsWorkerResultFromFailure(classifiesGeminiNetworkFailure(callError));
  }
}

async function callsOpenAiForDecompositionClustering(request, options, openAiApiKey, geminiCallFailure) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const openAiResult = await callsOpenAiChatCompletion(
    rendersDecompositionClusteringPrompt(request),
    buildsDecompositionClusteringResponseSchema(),
    { apiKey: openAiApiKey, fetchImpl: options.openAiFetchImpl || options.fetchImpl, model: options.openAiModel, maxOutputTokens: MAX_OUTPUT_TOKENS },
  );

  if (openAiResult.callFailure) {
    return buildsWorkerResultFromFailure({
      type: openAiResult.callFailure.type,
      message: `gemini fallback to openai also failed: gemini(${geminiCallFailure.type}) then openai(${openAiResult.callFailure.type}): ${openAiResult.callFailure.message}`,
    });
  }

  return {
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
  buildsDecompositionClusteringResponseSchema,
  rendersDecompositionClusteringPrompt,
  callsDecompositionClusteringWorker,
};
