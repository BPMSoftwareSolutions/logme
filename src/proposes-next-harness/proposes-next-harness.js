const crypto = require('node:crypto');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

function sha256Hex(value) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

function mintsNextRunId(promotionDecision) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const digest = sha256Hex(`${promotionDecision.harnessId}:${promotionDecision.runId}:${new Date().toISOString()}`);
  return `run-${digest.slice(0, 12)}`;
}

function resolvesParentReceiptRef(promotionDecision) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return path.posix.join('evidence', 'runs', 'fractal-llm-harness', promotionDecision.runId, 'harness-execution.receipt.v1.json');
}

function proposesNextHarness(promotionDecision, materializationResult, requestedCapability) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (promotionDecision.decision !== 'PROMOTED') {
    throw new Error('proposesNextHarness requires a promotion decision of PROMOTED; a blocked harness has no parent-proof');
  }

  const nextHarnessId = `harness-${sha256Hex(`${promotionDecision.harnessId}:next`).slice(0, 12)}`;

  return {
    schemaVersion: 'llm-harness-request.schema.v1',
    runId: mintsNextRunId(promotionDecision),
    parentHarnessId: promotionDecision.harnessId,
    parentBodyContractRef: path.posix.join('src', 'generated-harnesses', promotionDecision.harnessId, 'body-contract.json'),
    parentSelfConformanceReceiptRef: resolvesParentReceiptRef(promotionDecision),
    allowedMutationPaths: [`src/generated-harnesses/${nextHarnessId}/`],
    requestedCapability,
    proposalOnly: true,
  };
}

module.exports = { proposesNextHarness };
