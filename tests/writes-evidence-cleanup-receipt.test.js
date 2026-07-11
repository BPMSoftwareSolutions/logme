const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { writesEvidenceCleanupReceipt } = require('../src/writes-evidence-cleanup-receipt/writes-evidence-cleanup-receipt');

test('writesEvidenceCleanupReceipt writes a receipt with the required fields', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-receipt-'));

  try {
    const executionResult = {
      approvedBy: 'po@example.com',
      approvedAt: '2026-07-01T00:00:00.000Z',
      cleanupPlanHash: 'hash-abc',
      keptRuns: ['run-1'],
      archivedRuns: [
        {
          runId: 'run-2',
          archivePath: 'evidence/archive/2026/run-2.zip',
          manifestPath: 'evidence/archive/2026/run-2.archive-manifest.v1.json',
        },
      ],
      deletedRuns: [],
      blockedActions: [],
      bytesReclaimed: 500,
      errors: [],
    };

    const { receiptPath, receipt } = writesEvidenceCleanupReceipt(tempDir, executionResult);

    assert.equal(fs.existsSync(receiptPath), true);
    assert.ok(receipt.cleanupId);
    assert.equal(receipt.approvedBy, 'po@example.com');
    assert.ok(receipt.executedAt);
    assert.deepEqual(receipt.keptRuns, ['run-1']);
    assert.equal(receipt.bytesReclaimed, 500);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
