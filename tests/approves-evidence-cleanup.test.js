const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const {
  writesEvidenceCleanupApproval,
  approvesEvidenceCleanup,
  MISSING_APPROVAL_FINDING,
  PLAN_HASH_MISMATCH_FINDING,
} = require('../src/approves-evidence-cleanup/approves-evidence-cleanup');

test('approvesEvidenceCleanup blocks when there is no approval record', () => {
  const result = approvesEvidenceCleanup(null, 'abc123');

  assert.equal(result.verdict, 'BLOCKED');
  assert.equal(result.findingCode, MISSING_APPROVAL_FINDING);
});

test('approvesEvidenceCleanup blocks when the approved plan hash differs from the current plan hash', () => {
  const approvalRecord = {
    approvedBy: 'po@example.com',
    approvedAt: '2026-07-01T00:00:00.000Z',
    cleanupPlanPath: 'evidence/cleanup/evidence-cleanup-plan.v1.json',
    cleanupPlanHash: 'old-hash',
    approvedActions: ['delete'],
  };

  const result = approvesEvidenceCleanup(approvalRecord, 'new-hash');

  assert.equal(result.verdict, 'BLOCKED');
  assert.equal(result.findingCode, PLAN_HASH_MISMATCH_FINDING);
});

test('approvesEvidenceCleanup passes when the approval record is complete and hashes match', () => {
  const approvalRecord = {
    approvedBy: 'po@example.com',
    approvedAt: '2026-07-01T00:00:00.000Z',
    cleanupPlanPath: 'evidence/cleanup/evidence-cleanup-plan.v1.json',
    cleanupPlanHash: 'matching-hash',
    approvedActions: ['delete'],
  };

  const result = approvesEvidenceCleanup(approvalRecord, 'matching-hash');

  assert.equal(result.verdict, 'PASS');
});

test('writesEvidenceCleanupApproval writes an approval record with the required fields', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-approval-'));

  try {
    const { approvalPath, approval } = writesEvidenceCleanupApproval(tempDir, {
      approvedBy: 'po@example.com',
      cleanupPlanPath: 'evidence/cleanup/evidence-cleanup-plan.v1.json',
      cleanupPlanHash: 'hash-123',
      approvedActions: ['archive', 'delete'],
    });

    assert.equal(fs.existsSync(approvalPath), true);
    assert.equal(approval.approvedBy, 'po@example.com');
    assert.ok(approval.approvedAt);
    assert.deepEqual(approval.approvedActions, ['archive', 'delete']);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
