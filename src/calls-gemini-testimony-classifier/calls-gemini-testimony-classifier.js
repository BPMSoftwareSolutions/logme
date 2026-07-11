const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');

const CLASSIFICATIONS = Object.freeze([
  'audit boundary', 'product-domain-native', 'product-domain-boundary-case', 'package-boundary-summarized',
  'pure-utility-extract', 'telemetry-infrastructure-suppress', 'generated-evidence-ignore', 'product-owner-review-required',
]);
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

function buildsClassificationResponseSchema() {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsClassificationResponseSchema);
  return {
    type: 'OBJECT', properties: { classifications: { type: 'ARRAY', items: {
      type: 'OBJECT', properties: {
        sourcePath: { type: 'STRING' },
        sourceLineRange: { type: 'OBJECT', properties: { start: { type: 'INTEGER' }, end: { type: 'INTEGER' } }, required: ['start', 'end'] },
        currentMethodName: { type: 'STRING' }, observedTelemetryName: { type: 'STRING' }, inferredIntendedMethodName: { type: 'STRING' },
        auditBoundary: { type: 'STRING', enum: CLASSIFICATIONS }, reason: { type: 'STRING' },
        evidenceCitations: { type: 'ARRAY', items: { type: 'STRING' } }, confidence: { type: 'NUMBER' }, recommendedRemediationAction: { type: 'STRING' },
      },
      required: ['sourcePath', 'sourceLineRange', 'currentMethodName', 'observedTelemetryName', 'inferredIntendedMethodName', 'auditBoundary', 'reason', 'evidenceCitations', 'confidence', 'recommendedRemediationAction'],
    } } }, required: ['classifications'],
  };
}

function rendersClassifierPrompt(handoff) {
  if (process.env.LOGME_AUDIT === '1') LogMe(rendersClassifierPrompt);
  return [
    'You are the Gemini Testimony Classifier Worker.',
    'Classify every noisy call using only the bounded JSON packet below.',
    'Do not edit files. Do not assert promotion. Deterministic gates decide promotion.',
    `Allowed classifications: ${CLASSIFICATIONS.join(', ')}.`,
    'Return structured JSON matching requiredOutputSchema, never prose-only output.', '', JSON.stringify(handoff),
  ].join('\n');
}

function buildsGeminiRequestBody(handoff) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsGeminiRequestBody);
  return {
    contents: [{ role: 'user', parts: [{ text: rendersClassifierPrompt(handoff) }] }],
    generationConfig: { maxOutputTokens: 8192, responseMimeType: 'application/json', responseSchema: buildsClassificationResponseSchema() },
  };
}

function extractsGeminiText(data) {
  if (process.env.LOGME_AUDIT === '1') LogMe(extractsGeminiText);
  const candidate = data.candidates && data.candidates[0];
  if (!candidate || !candidate.content || !Array.isArray(candidate.content.parts)) return '';
  const parts = [];
  for (const part of candidate.content.parts) parts.push(part.text || '');
  return parts.join('');
}

async function callsGeminiTestimonyClassifier(handoff, options = {}) {
  if (process.env.LOGME_AUDIT === '1') LogMe(callsGeminiTestimonyClassifier);
  const apiKey = options.apiKey || process.env.LOC_GEMINI_API_KEY;
  const model = options.model || GEMINI_MODEL;
  const fetchImpl = options.fetchImpl || fetch;
  if (!apiKey) return { provider: 'gemini', model, retryCount: 0, fallbackReason: null, callFailure: { type: 'authentication-error', message: 'LOC_GEMINI_API_KEY is not set' } };
  try {
    const response = await fetchImpl(`${GEMINI_BASE_URL}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(buildsGeminiRequestBody(handoff)),
    });
    if (!response.ok) return { provider: 'gemini', model, retryCount: 0, fallbackReason: null, callFailure: { type: `http-${response.status}`, message: await response.text() } };
    const data = await response.json();
    return { provider: 'gemini', model, rawResponseText: extractsGeminiText(data), usage: data.usageMetadata || null, retryCount: 0, fallbackReason: null, callFailure: null };
  } catch (error) {
    return { provider: 'gemini', model, retryCount: 0, fallbackReason: null, callFailure: { type: error.name === 'AbortError' ? 'timeout-error' : 'network-error', message: error.message } };
  }
}

module.exports = { CLASSIFICATIONS, GEMINI_MODEL, buildsClassificationResponseSchema, buildsGeminiRequestBody, callsGeminiTestimonyClassifier, rendersClassifierPrompt };
