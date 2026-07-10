const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { callsOpenAiChatCompletion } = require('../../packages/logme-llm-provider-primitives/src/calls-openai-chat-completion');

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const MAX_OUTPUT_TOKENS = 8192;
const RETRYABLE_TO_FALLBACK_FAILURE_TYPES = new Set(['provider-overloaded', 'rate-limit-error', 'model-not-found', 'unknown-error', 'timeout-error']);

function buildsPackageExtractionResponseSchema() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    type: 'OBJECT',
    properties: {
      classification: {
        type: 'STRING',
        enum: ['existing package', 'new package', 'retained domain body', 'rejected extraction', 'product-owner review required'],
      },
      targetPackage: { type: 'STRING', description: 'the existing or proposed new package name, or empty if not applicable' },
      extractedMethodNames: { type: 'ARRAY', items: { type: 'STRING' } },
      domainCallSiteGuidance: { type: 'STRING', description: 'how domain call sites should read after extraction, in domain language' },
      classificationReason: { type: 'STRING' },
    },
    required: ['classification', 'targetPackage', 'extractedMethodNames', 'domainCallSiteGuidance', 'classificationReason'],
  };
}

function rendersPackageExtractionPrompt(request) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    'You are the Package Extraction Worker for a code remediation pipeline.',
    'You PROPOSE whether a generic mechanic inside a domain body file should be extracted to a package. A deterministic gate, not you, decides whether the proposal is promoted.',
    'Ground every claim in the real mechanics and method names listed below. Do not invent method names or mechanics you cannot see.',
    '',
    'Classification rules:',
    '- "existing package": the mechanic belongs in one of the existing packages listed below.',
    '- "new package": the mechanic is generic and reusable but does not fit any existing package; propose a new package name.',
    '- "retained domain body": the mechanic is actually domain-specific despite the pattern match and should stay in the domain body.',
    '- "rejected extraction": the evidence is too weak to justify any move (for example, no grounded method names).',
    '- "product-owner review required": you cannot determine a safe classification from the evidence given.',
    '',
    `File path: ${request.filePath}`,
    'Existing packages:',
    request.existingPackages.map(rendersListLine).join('\n'),
    '',
    'Grounded generic mechanic candidates (real method names only):',
    request.groundedMechanics.map(rendersMechanicLine).join('\n') || '(none grounded with real method names)',
    '',
    'Respond with a JSON object: classification, targetPackage, extractedMethodNames, domainCallSiteGuidance, classificationReason.',
  ].join('\n');
}

function rendersListLine(value) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return `- ${value}`;
}

function rendersMechanicLine(mechanic) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return `- ${mechanic.mechanic}: ${mechanic.methodNames.join(', ')}`;
}

function buildsGeminiRequestBody(request) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    contents: [
      {
        role: 'user',
        parts: [{ text: rendersPackageExtractionPrompt(request) }],
      },
    ],
    generationConfig: {
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      responseMimeType: 'application/json',
      responseSchema: buildsPackageExtractionResponseSchema(),
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

async function callsPackageExtractionWorker(request, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const geminiResult = await callsGeminiForPackageExtraction(request, options);

  if (!geminiResult.callFailure || !RETRYABLE_TO_FALLBACK_FAILURE_TYPES.has(geminiResult.callFailure.type)) {
    return geminiResult;
  }

  const openAiApiKey = options.openAiApiKey || process.env.OPENAI_API_KEY;
  if (!openAiApiKey) {
    return geminiResult;
  }

  return callsOpenAiForPackageExtraction(request, options, openAiApiKey, geminiResult.callFailure);
}

async function callsGeminiForPackageExtraction(request, options) {
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

async function callsOpenAiForPackageExtraction(request, options, openAiApiKey, geminiCallFailure) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const openAiResult = await callsOpenAiChatCompletion(
    rendersPackageExtractionPrompt(request),
    buildsPackageExtractionResponseSchema(),
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
  buildsPackageExtractionResponseSchema,
  rendersPackageExtractionPrompt,
  callsPackageExtractionWorker,
};
