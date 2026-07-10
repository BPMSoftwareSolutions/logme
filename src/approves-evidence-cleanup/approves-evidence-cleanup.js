const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const APPROVAL_SCHEMA_VERSION = 'evidence-cleanup-approval.v1';
const MISSING_APPROVAL_FINDING = 'evidence-cleanup-approval-missing';
const PLAN_HASH_MISMATCH_FINDING = 'evidence-cleanup-plan-hash-mismatch';

function writesEvidenceCleanupApproval(rootDir, approval) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const record = {
    schemaVersion: APPROVAL_SCHEMA_VERSION,
    approvedBy: approval.approvedBy,
    approvedAt: approval.approvedAt || new Date().toISOString(),
    cleanupPlanPath: approval.cleanupPlanPath,
    cleanupPlanHash: approval.cleanupPlanHash,
    approvedActions: approval.approvedActions,
  };

  const approvalPath = path.join(rootDir, 'evidence', 'cleanup', 'evidence-cleanup-approval.v1.json');
  fs.mkdirSync(path.dirname(approvalPath), { recursive: true });
  fs.writeFileSync(approvalPath, `${JSON.stringify(record, null, 2)}\n`, 'utf8');

  return { approvalPath, approval: record };
}

function approvesEvidenceCleanup(approvalRecord, currentPlanHash) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!approvalRecord) {
    return { verdict: 'BLOCKED', findingCode: MISSING_APPROVAL_FINDING, reason: 'no cleanup approval record was found' };
  }

  if (!isCompleteApprovalRecord(approvalRecord)) {
    return { verdict: 'BLOCKED', findingCode: MISSING_APPROVAL_FINDING, reason: 'cleanup approval record is missing required fields' };
  }

  if (approvalRecord.cleanupPlanHash !== currentPlanHash) {
    return { verdict: 'BLOCKED', findingCode: PLAN_HASH_MISMATCH_FINDING, reason: 'approved plan hash does not match the current cleanup plan hash' };
  }

  return { verdict: 'PASS', findingCode: null, reason: null };
}

function isCompleteApprovalRecord(approvalRecord) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return Boolean(
    approvalRecord.approvedBy
    && approvalRecord.approvedAt
    && approvalRecord.cleanupPlanPath
    && approvalRecord.cleanupPlanHash
    && Array.isArray(approvalRecord.approvedActions)
    && approvalRecord.approvedActions.length > 0,
  );
}

module.exports = {
  APPROVAL_SCHEMA_VERSION,
  MISSING_APPROVAL_FINDING,
  PLAN_HASH_MISMATCH_FINDING,
  writesEvidenceCleanupApproval,
  approvesEvidenceCleanup,
};
