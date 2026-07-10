const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { writesBodyContractPatchEvidence } = require('../src/writes-body-contract-patch-evidence/writes-body-contract-patch-evidence');

test('writesBodyContractPatchEvidence writes the patch under quality/domain-remediation/<run-id>/', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-contract-patch-'));

  try {
    const runId = 'run-patch-write-1';
    const bodyContractPatch = {
      schemaVersion: 'body-contract-patch.proposal.v1',
      sourceRunId: runId,
      evidencePath: `quality/domain-remediation/${runId}/body-contract-patch.proposal.v1.json`,
      entries: [{ path: 'src/a/a.js' }],
    };

    const receipt = writesBodyContractPatchEvidence({ rootDir: tempDir }, bodyContractPatch);

    const expectedPath = path.join(tempDir, 'quality', 'domain-remediation', runId, 'body-contract-patch.proposal.v1.json');
    assert.equal(receipt.evidencePath, expectedPath);
    assert.equal(receipt.entryCount, 1);
    assert.ok(fs.existsSync(expectedPath));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
