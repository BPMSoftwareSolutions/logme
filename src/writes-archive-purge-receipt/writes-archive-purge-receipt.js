const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const ARCHIVE_PURGE_RECEIPT_SCHEMA_VERSION = 'archive-purge.receipt.v1';

function writesArchivePurgeReceipt(rootDir, executionResult) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const receipt = {
    schemaVersion: ARCHIVE_PURGE_RECEIPT_SCHEMA_VERSION,
    purgeId: generatesPurgeId(),
    approvedBy: executionResult.approvedBy,
    approvedAt: executionResult.approvedAt,
    executedAt: new Date().toISOString(),
    archivePurgePlanHash: executionResult.archivePurgePlanHash,
    keptRuns: executionResult.keptRuns,
    purgedRuns: executionResult.purgedRuns,
    blockedActions: executionResult.blockedActions,
    bytesReclaimed: executionResult.bytesReclaimed,
    errors: executionResult.errors,
  };

  const receiptPath = path.join(rootDir, 'evidence', 'cleanup', 'archive-purge.receipt.v1.json');
  fs.mkdirSync(path.dirname(receiptPath), { recursive: true });
  fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');

  return { receiptPath, receipt };
}

function generatesPurgeId() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return `purge-${crypto.randomBytes(6).toString('hex')}`;
}

module.exports = {
  ARCHIVE_PURGE_RECEIPT_SCHEMA_VERSION,
  writesArchivePurgeReceipt,
};
