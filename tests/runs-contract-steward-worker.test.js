const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { runsContractStewardWorker } = require('../src/runs-contract-steward-worker/runs-contract-steward-worker');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

test('runsContractStewardWorker reads frozen analysis evidence, proposes entries, writes evidence, and runs the gate', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-contract-steward-'));

  try {
    const runId = 'run-frozen-contract-steward';

    writesFile(
      path.join(tempDir, 'evidence/runs', runId, 'domain-analysis/domain-body-analysis.contract.v1.json'),
      JSON.stringify({
        runId,
        evidencePath: `evidence/runs/${runId}/domain-analysis/domain-body-analysis.contract.v1.json`,
        sourceFiles: [
          {
            filePath: 'src/a/a.js',
            findingCodes: ['file-body-contract-missing'],
            responsibilityClusters: [{ name: 'build', methodNames: ['buildsA'] }],
          },
        ],
      }),
    );

    async function fakeCallWorker() {
      return {
        rawResponseText: JSON.stringify({
          bodyKind: 'waiver',
          bodyId: 'logme.a',
          actionVerb: '',
          responsibility: 'unclear ownership',
          allowedDependencies: [],
          decompositionStatus: 'single-responsibility',
          waiverReason: '',
        }),
        callFailure: null,
      };
    }

    const analysisPath = path.join(tempDir, 'evidence/runs', runId, 'domain-analysis/domain-body-analysis.contract.v1.json');
    const beforeAnalysis = fs.readFileSync(analysisPath, 'utf8');

    const { bodyContractPatch, receipt, gateResult } = await runsContractStewardWorker(
      { rootDir: tempDir },
      runId,
      { callWorker: fakeCallWorker },
    );

    assert.equal(bodyContractPatch.entries.length, 1);
    assert.ok(fs.existsSync(receipt.evidencePath));
    assert.equal(gateResult.verdict, 'BLOCKED');
    assert.equal(fs.readFileSync(analysisPath, 'utf8'), beforeAnalysis);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
