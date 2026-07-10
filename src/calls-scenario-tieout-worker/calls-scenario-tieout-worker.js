const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

function buildsScenarioTieOutResponseSchema() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    type: 'OBJECT',
    properties: {
      featureId: { type: 'STRING' },
      scenarioId: { type: 'STRING' },
      evidenceSource: { type: 'STRING', enum: ['feature document', 'test file', 'executable method', 'generated report section', 'receipt artifact', 'none'] },
      evidenceCitation: { type: 'STRING', description: 'the exact repo-relative path or method name that supports the mapping, or empty if evidenceSource is none' },
      confidence: { type: 'STRING', enum: ['low', 'medium', 'high'] },
      reasoning: { type: 'STRING' },
    },
    required: ['featureId', 'scenarioId', 'evidenceSource', 'evidenceCitation', 'confidence', 'reasoning'],
  };
}

function rendersScenarioTieOutPrompt(request) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    'You are the Scenario Tie-Out Worker for a code remediation pipeline.',
    'You PROPOSE a mapping from one executable source file to a feature id and scenario id. A deterministic gate, not you, decides whether the mapping is promoted.',
    'You must cite real, verifiable evidence for your claim. Do not invent a feature document, test file, or method name that is not listed below.',
    'If you cannot find real evidence tying this file to a specific feature and scenario, set evidenceSource to "none" and leave evidenceCitation empty -- do not guess.',
    'A folder name, a loose method name with no supporting document, or your own unsupported interpretation is NOT sufficient evidence.',
    '',
    `File path: ${request.filePath}`,
    `Primary responsibility (from domain cartography): ${request.primaryBodyResponsibility}`,
    `Classification: ${request.classification}`,
    '',
    'Candidate feature documents (repo-relative paths, choose one if it plausibly documents this file\'s behavior):',
    request.candidateFeatureDocPaths.map(rendersListLine).join('\n') || '(none found)',
    '',
    'Candidate test files for this source file:',
    request.candidateTestFilePaths.map(rendersListLine).join('\n') || '(none found)',
    '',
    'Respond with a JSON object: featureId, scenarioId (format feature:<feature-id>#scenario:<slug>),',
    'evidenceSource, evidenceCitation (the exact path or method name), confidence, and reasoning.',
  ].join('\n');
}

function rendersListLine(candidatePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return `- ${candidatePath}`;
}

function buildsGeminiRequestBody(request) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    contents: [
      {
        role: 'user',
        parts: [{ text: rendersScenarioTieOutPrompt(request) }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
      responseSchema: buildsScenarioTieOutResponseSchema(),
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

async function callsScenarioTieOutWorker(request, options = {}) {
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

module.exports = {
  buildsScenarioTieOutResponseSchema,
  rendersScenarioTieOutPrompt,
  callsScenarioTieOutWorker,
};
