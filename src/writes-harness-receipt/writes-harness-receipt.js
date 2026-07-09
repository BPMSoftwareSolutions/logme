const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

function resolvesEvidenceDirectory(promotionDecision, options) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const evidenceRoot = options.evidenceRoot || path.resolve(__dirname, '..', '..', 'evidence');
  return path.join(evidenceRoot, 'runs', 'fractal-llm-harness', promotionDecision.runId);
}

function buildsReceiptContent(promotionDecision, materializationResult, runResult) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    schemaVersion: 'harness-execution.receipt.v1',
    harnessId: promotionDecision.harnessId,
    runId: promotionDecision.runId,
    promotionDecision,
    materializationSummary: {
      leasedPaths: materializationResult.leasedPaths,
      writtenFiles: materializationResult.writtenFiles,
    },
    runSummary: {
      exitCode: runResult.exitCode,
      timedOut: runResult.timedOut,
      startedAt: runResult.startedAt,
      finishedAt: runResult.finishedAt,
    },
    writtenAt: new Date().toISOString(),
  };
}

function writesHarnessReceipt(promotionDecision, materializationResult, runResult, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const evidenceDirectory = resolvesEvidenceDirectory(promotionDecision, options);
  fs.mkdirSync(evidenceDirectory, { recursive: true });

  const receiptContent = buildsReceiptContent(promotionDecision, materializationResult, runResult);
  const receiptPath = path.join(evidenceDirectory, 'harness-execution.receipt.v1.json');
  const serializedReceipt = `${JSON.stringify(receiptContent, null, 2)}\n`;

  fs.writeFileSync(receiptPath, serializedReceipt, 'utf8');

  return {
    receiptPath,
    bytesWritten: Buffer.byteLength(serializedReceipt, 'utf8'),
    receiptContent,
  };
}

module.exports = { writesHarnessReceipt };
