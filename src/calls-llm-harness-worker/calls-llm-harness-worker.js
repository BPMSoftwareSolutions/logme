const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

const HARNESS_OUTPUT_DRAFT_FIELDS = [
  'harnessId',
  'proposalStatus',
  'bodyContractDraft',
  'executionPathDraft',
  'testPlanDraft',
  'telemetryRequirementsDraft',
  'receiptCoverageDraft',
];

function buildsLlmHarnessOutputResponseSchema() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const properties = {};

  for (const field of HARNESS_OUTPUT_DRAFT_FIELDS) {
    properties[field] = field === 'proposalStatus' || field === 'harnessId'
      ? { type: 'STRING' }
      : { type: 'STRING', description: `JSON-encoded ${field}` };
  }

  return {
    type: 'OBJECT',
    properties,
    required: HARNESS_OUTPUT_DRAFT_FIELDS,
  };
}

function rendersHarnessAssignmentPrompt(assignment) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    'You are proposing a bounded, self-testifying child harness for the Fractal LLM Harness system.',
    'You may PROPOSE a harness. You may never claim it is promoted, verified, or approved -- only the deterministic verifier decides that after the harness actually runs.',
    '',
    `Run id: ${assignment.runId}`,
    `Parent harness id: ${assignment.parentHarnessId || 'none (seed harness)'}`,
    `Requested capability: ${assignment.requestedCapability}`,
    `Allowed mutation paths (you may not propose touching anything outside these): ${JSON.stringify(assignment.allowedMutationPaths)}`,
    '',
    'Respond with a JSON object containing: harnessId (a short kebab-case identifier you propose),',
    'proposalStatus ("proposed"), bodyContractDraft, executionPathDraft, testPlanDraft,',
    'telemetryRequirementsDraft, and receiptCoverageDraft, each as a JSON-encoded string describing your plan.',
    'Do not claim telemetry was observed or a receipt was written -- describe only what you plan the harness to do.',
  ].join('\n');
}

function buildsGeminiRequestBody(assignment) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    contents: [
      {
        role: 'user',
        parts: [{ text: rendersHarnessAssignmentPrompt(assignment) }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
      responseSchema: buildsLlmHarnessOutputResponseSchema(),
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

  function extractsPartText(part) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return part.text || '';
  }

  return candidate.content.parts.map(extractsPartText).join('');
}

function buildsWorkerResultFromResponse(assignment, model, data) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const candidate = data.candidates && data.candidates[0];
  const finishReason = candidate ? candidate.finishReason : null;

  if (finishReason === 'SAFETY') {
    return buildsWorkerResultFromFailure(assignment, {
      type: 'safety-blocked',
      message: 'Gemini blocked the response due to safety policy',
    });
  }

  return {
    runId: assignment.runId,
    rawResponseText: extractsGeminiResponseText(data),
    rawResponseJson: null,
    model,
    finishReason,
    usage: data.usageMetadata || null,
    callFailure: null,
  };
}

function buildsWorkerResultFromFailure(assignment, callFailure) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    runId: assignment.runId,
    rawResponseText: null,
    rawResponseJson: null,
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

async function callsLlmHarnessWorker(assignment, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const apiKey = options.apiKey || process.env.LOC_GEMINI_API_KEY;
  const model = options.model || GEMINI_MODEL;
  const fetchImpl = options.fetchImpl || fetch;

  if (!apiKey) {
    return buildsWorkerResultFromFailure(assignment, {
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
        body: JSON.stringify(buildsGeminiRequestBody(assignment)),
      },
    );

    if (!response.ok) {
      return buildsWorkerResultFromFailure(assignment, await classifiesGeminiHttpFailure(response));
    }

    const data = await response.json();
    return buildsWorkerResultFromResponse(assignment, model, data);
  } catch (callError) {
    return buildsWorkerResultFromFailure(assignment, classifiesGeminiNetworkFailure(callError));
  }
}

module.exports = { callsLlmHarnessWorker, buildsLlmHarnessOutputResponseSchema };
