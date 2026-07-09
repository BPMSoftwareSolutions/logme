const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const REQUIRED_REQUEST_FIELDS = [
  'runId',
  'parentHarnessId',
  'parentBodyContractRef',
  'parentSelfConformanceReceiptRef',
  'allowedMutationPaths',
  'requestedCapability',
];

function findsMissingRequestField(request) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  function isFieldMissing(field) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return !Object.prototype.hasOwnProperty.call(request, field);
  }

  return REQUIRED_REQUEST_FIELDS.find(isFieldMissing) || null;
}

function buildsLlmHarnessAssignment(request) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const missingField = findsMissingRequestField(request);

  if (missingField) {
    throw new Error(`buildsLlmHarnessAssignment requires field "${missingField}" on the harness request`);
  }

  return {
    schemaVersion: 'llm-harness-request.schema.v1',
    runId: request.runId,
    parentHarnessId: request.parentHarnessId,
    parentBodyContractRef: request.parentBodyContractRef,
    parentSelfConformanceReceiptRef: request.parentSelfConformanceReceiptRef,
    allowedMutationPaths: request.allowedMutationPaths,
    requestedCapability: request.requestedCapability,
    assembledAt: new Date().toISOString(),
  };
}

module.exports = { buildsLlmHarnessAssignment };
