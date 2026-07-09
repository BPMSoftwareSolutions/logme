const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { writesHarnessReceipt } = require('../src/writes-harness-receipt/writes-harness-receipt');

function buildsPromotionDecision(overrides = {}) {
  return {
    schemaVersion: 'harness-promotion-decision.schema.v1',
    harnessId: 'harness-abc',
    runId: 'run-001',
    decision: 'PROMOTED',
    reason: 'telemetry and receipt coverage independently tied out',
    requiredFindingsMustBeZero: [],
    telemetryTieOut: { expected: [], observed: [], matches: true },
    receiptTieOut: { expected: [], observed: [], matches: true },
    selfPromotionAttempted: false,
    ...overrides,
  };
}

test('writesHarnessReceipt writes an evidence packet under evidence/runs/fractal-llm-harness/<runId>/', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-harness-receipt-'));

  try {
    const result = writesHarnessReceipt(
      buildsPromotionDecision(),
      { leasedPaths: ['/tmp/harness-abc'], writtenFiles: ['body-contract.json', 'index.js'] },
      { exitCode: 0, timedOut: false, startedAt: '2026-01-01T00:00:00.000Z', finishedAt: '2026-01-01T00:00:01.000Z' },
      { evidenceRoot: tempDir },
    );

    assert.equal(fs.existsSync(result.receiptPath), true);
    assert.ok(result.receiptPath.includes(path.join('runs', 'fractal-llm-harness', 'run-001')));
    assert.ok(result.bytesWritten > 0);
    assert.equal(result.receiptContent.schemaVersion, 'harness-execution.receipt.v1');
    assert.equal(result.receiptContent.promotionDecision.decision, 'PROMOTED');

    const fileContent = JSON.parse(fs.readFileSync(result.receiptPath, 'utf8'));
    assert.deepEqual(fileContent.promotionDecision, buildsPromotionDecision());
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('writesHarnessReceipt records the materialization and run summaries', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-harness-receipt-'));

  try {
    const result = writesHarnessReceipt(
      buildsPromotionDecision({ decision: 'BLOCKED' }),
      { leasedPaths: ['/tmp/harness-abc'], writtenFiles: ['body-contract.json'] },
      { exitCode: 1, timedOut: false, startedAt: '2026-01-01T00:00:00.000Z', finishedAt: '2026-01-01T00:00:02.000Z' },
      { evidenceRoot: tempDir },
    );

    assert.equal(result.receiptContent.runSummary.exitCode, 1);
    assert.deepEqual(result.receiptContent.materializationSummary.writtenFiles, ['body-contract.json']);
    assert.equal(result.receiptContent.promotionDecision.decision, 'BLOCKED');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
