const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { writesScenarioTieOutEvidence } = require('../src/writes-scenario-tieout-evidence/writes-scenario-tieout-evidence');

test('writesScenarioTieOutEvidence writes the proposal under quality/domain-remediation/<run-id>/', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-tieout-evidence-'));

  try {
    const runId = 'run-tieout-write-1';
    const tieOutProposal = {
      schemaVersion: 'scenario-tieout.proposal.v1',
      sourceRunId: runId,
      evidencePath: `quality/domain-remediation/${runId}/scenario-tieout.proposal.v1.json`,
      mappings: [{ filePath: 'src/a/a.js' }],
    };

    const receipt = writesScenarioTieOutEvidence({ rootDir: tempDir }, tieOutProposal);

    const expectedPath = path.join(tempDir, 'quality', 'domain-remediation', runId, 'scenario-tieout.proposal.v1.json');
    assert.equal(receipt.evidencePath, expectedPath);
    assert.equal(receipt.mappingCount, 1);
    assert.ok(fs.existsSync(expectedPath));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
