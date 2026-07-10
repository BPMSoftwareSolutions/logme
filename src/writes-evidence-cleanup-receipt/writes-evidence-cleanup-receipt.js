const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const CLEANUP_RECEIPT_SCHEMA_VERSION = 'evidence-cleanup.receipt.v1';

function writesEvidenceCleanupReceipt(rootDir, executionResult) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const receipt = {
    schemaVersion: CLEANUP_RECEIPT_SCHEMA_VERSION,
    cleanupId: generatesCleanupId(),
    approvedBy: executionResult.approvedBy,
    approvedAt: executionResult.approvedAt,
    executedAt: new Date().toISOString(),
    cleanupPlanHash: executionResult.cleanupPlanHash,
    keptRuns: executionResult.keptRuns,
    archivedRuns: executionResult.archivedRuns,
    deletedRuns: executionResult.deletedRuns,
    blockedActions: executionResult.blockedActions,
    bytesReclaimed: executionResult.bytesReclaimed,
    errors: executionResult.errors,
  };

  const receiptPath = path.join(rootDir, 'evidence', 'cleanup', 'evidence-cleanup.receipt.v1.json');
  fs.mkdirSync(path.dirname(receiptPath), { recursive: true });
  fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');

  return { receiptPath, receipt };
}

function generatesCleanupId() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return `cleanup-${crypto.randomBytes(6).toString('hex')}`;
}

module.exports = {
  CLEANUP_RECEIPT_SCHEMA_VERSION,
  writesEvidenceCleanupReceipt,
};
