const crypto = require('node:crypto');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const DRAFT_FIELD_NAMES = [
  'bodyContractDraft',
  'executionPathDraft',
  'testPlanDraft',
  'telemetryRequirementsDraft',
  'receiptCoverageDraft',
];

function sha256Hex(value) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

function mintsHarnessId(assignment) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const digest = sha256Hex(`${assignment.runId}:${JSON.stringify(assignment.allowedMutationPaths)}:${assignment.requestedCapability}`);
  return `harness-${digest.slice(0, 12)}`;
}

function buildsRejectedOutput(assignment, harnessId, parseFailureReason) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    schemaVersion: 'llm-harness-output.schema.v1',
    runId: assignment.runId,
    harnessId,
    proposalStatus: 'rejected-unparseable',
    bodyContractDraft: null,
    executionPathDraft: null,
    testPlanDraft: null,
    telemetryRequirementsDraft: null,
    receiptCoverageDraft: null,
    parseFailureReason,
  };
}

function parsesDraftField(rawOutputObject, fieldName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rawValue = rawOutputObject[fieldName];

  if (rawValue === undefined || rawValue === null) {
    return { value: null, fieldMissing: true };
  }

  if (typeof rawValue !== 'string') {
    return { value: rawValue, fieldMissing: false };
  }

  try {
    return { value: JSON.parse(rawValue), fieldMissing: false };
  } catch {
    return { value: rawValue, fieldMissing: false };
  }
}

function findsMissingDraftField(rawOutputObject) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  function isFieldMissing(fieldName) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return parsesDraftField(rawOutputObject, fieldName).fieldMissing;
  }

  return DRAFT_FIELD_NAMES.find(isFieldMissing) || null;
}

function parsesLlmHarnessOutput(workerResult, assignment) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const harnessId = mintsHarnessId(assignment);

  if (workerResult.callFailure) {
    return buildsRejectedOutput(assignment, harnessId, `worker call failed: ${workerResult.callFailure.type} - ${workerResult.callFailure.message}`);
  }

  if (!workerResult.rawResponseText) {
    return buildsRejectedOutput(assignment, harnessId, 'worker returned an empty response');
  }

  let rawOutputObject;

  try {
    rawOutputObject = JSON.parse(workerResult.rawResponseText);
  } catch (parseError) {
    return buildsRejectedOutput(assignment, harnessId, `response text was not valid JSON: ${parseError.message}`);
  }

  if (rawOutputObject === null || typeof rawOutputObject !== 'object') {
    return buildsRejectedOutput(assignment, harnessId, 'response JSON was not an object');
  }

  const missingField = findsMissingDraftField(rawOutputObject);

  if (missingField) {
    return buildsRejectedOutput(assignment, harnessId, `response is missing required field "${missingField}"`);
  }

  return {
    schemaVersion: 'llm-harness-output.schema.v1',
    runId: assignment.runId,
    harnessId,
    proposalStatus: 'proposed',
    bodyContractDraft: parsesDraftField(rawOutputObject, 'bodyContractDraft').value,
    executionPathDraft: parsesDraftField(rawOutputObject, 'executionPathDraft').value,
    testPlanDraft: parsesDraftField(rawOutputObject, 'testPlanDraft').value,
    telemetryRequirementsDraft: parsesDraftField(rawOutputObject, 'telemetryRequirementsDraft').value,
    receiptCoverageDraft: parsesDraftField(rawOutputObject, 'receiptCoverageDraft').value,
    parseFailureReason: null,
  };
}

module.exports = { parsesLlmHarnessOutput, mintsHarnessId };
