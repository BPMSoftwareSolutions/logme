const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { writesRemediationBacklogEvidence } = require('../src/writes-remediation-backlog-evidence/writes-remediation-backlog-evidence');

test('writesRemediationBacklogEvidence writes the backlog under quality/domain-remediation/<run-id>/', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-remediation-backlog-'));

  try {
    const runId = 'run-xyz789';
    const backlog = {
      schemaVersion: 'remediation-backlog.v1',
      sourceRunId: runId,
      evidencePath: `quality/domain-remediation/${runId}/remediation-backlog.v1.json`,
      backlogItems: [{ packetId: 'domain-remediation-scenario-tieout' }],
    };

    const receipt = writesRemediationBacklogEvidence({ rootDir: tempDir }, backlog);

    assert.equal(receipt.backlogItemCount, 1);
    assert.ok(receipt.bytesWritten > 0);

    const expectedPath = path.join(tempDir, 'quality', 'domain-remediation', runId, 'remediation-backlog.v1.json');
    assert.equal(receipt.evidencePath, expectedPath);
    assert.ok(fs.existsSync(expectedPath));

    const written = JSON.parse(fs.readFileSync(expectedPath, 'utf8'));
    assert.equal(written.sourceRunId, runId);
    assert.equal(written.backlogItems.length, 1);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
