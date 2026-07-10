const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { runsScenarioTieOutWorker } = require('../src/runs-scenario-tieout-worker/runs-scenario-tieout-worker');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

test('runsScenarioTieOutWorker reads the domain map, calls the worker, writes evidence, and runs the gate', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-tieout-orchestrator-'));

  try {
    const runId = 'run-tieout-orchestrator-1';

    writesFile(
      path.join(tempDir, 'quality/domain-remediation', runId, 'domain-map.proposal.v1.json'),
      JSON.stringify({
        sourceRunId: runId,
        evidencePath: `quality/domain-remediation/${runId}/domain-map.proposal.v1.json`,
        fileEntries: [
          { filePath: 'src/a/a.js', classification: 'product-domain body', hasScenarioTieOut: false, primaryBodyResponsibility: 'do-a' },
        ],
      }),
    );

    async function fakeCallWorker() {
      return {
        rawResponseText: JSON.stringify({
          featureId: '',
          scenarioId: '',
          evidenceSource: 'none',
          evidenceCitation: '',
          confidence: 'low',
          reasoning: 'no evidence found',
        }),
        callFailure: null,
      };
    }

    const { tieOutProposal, receipt, gateResult } = await runsScenarioTieOutWorker(
      { rootDir: tempDir },
      runId,
      { callWorker: fakeCallWorker },
    );

    assert.equal(tieOutProposal.mappings.length, 1);
    assert.ok(fs.existsSync(receipt.evidencePath));
    assert.equal(gateResult.verdict, 'BLOCKED');
    assert.equal(gateResult.blockedMappings.length, 1);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
