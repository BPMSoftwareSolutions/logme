const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { writesArchivePurgeReceipt } = require('../src/writes-archive-purge-receipt/writes-archive-purge-receipt');

test('writesArchivePurgeReceipt writes a receipt with the required fields', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-purge-receipt-'));

  try {
    const executionResult = {
      approvedBy: 'po@example.com',
      approvedAt: '2026-07-01T00:00:00.000Z',
      archivePurgePlanHash: 'hash-abc',
      keptRuns: ['run-1'],
      purgedRuns: [{ runId: 'run-2', year: '2025' }],
      blockedActions: [],
      bytesReclaimed: 500,
      errors: [],
    };

    const { receiptPath, receipt } = writesArchivePurgeReceipt(tempDir, executionResult);

    assert.equal(fs.existsSync(receiptPath), true);
    assert.ok(receipt.purgeId);
    assert.equal(receipt.approvedBy, 'po@example.com');
    assert.ok(receipt.executedAt);
    assert.deepEqual(receipt.keptRuns, ['run-1']);
    assert.equal(receipt.bytesReclaimed, 500);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
