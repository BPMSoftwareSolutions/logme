const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { writesRenamePlanEvidence } = require('../src/writes-rename-plan-evidence/writes-rename-plan-evidence');

test('writesRenamePlanEvidence writes the plan under quality/domain-remediation/<run-id>/', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-rename-plan-write-'));

  try {
    const runId = 'run-rename-write-1';
    const renamePlan = {
      schemaVersion: 'rename-plan.v1',
      sourceRunId: runId,
      evidencePath: `quality/domain-remediation/${runId}/rename-plan.v1.json`,
      entries: [{ currentPath: 'src/a/a.js' }],
    };

    const receipt = writesRenamePlanEvidence({ rootDir: tempDir }, renamePlan);

    const expectedPath = path.join(tempDir, 'quality', 'domain-remediation', runId, 'rename-plan.v1.json');
    assert.equal(receipt.evidencePath, expectedPath);
    assert.equal(receipt.entryCount, 1);
    assert.ok(fs.existsSync(expectedPath));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
