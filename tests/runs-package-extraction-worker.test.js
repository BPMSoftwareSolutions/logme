const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { runsPackageExtractionWorker } = require('../src/runs-package-extraction-worker/runs-package-extraction-worker');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

test('runsPackageExtractionWorker reads frozen sprawl evidence and writes the package extraction plan without touching the evidence run', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-package-extraction-orchestrator-'));

  try {
    const runId = 'run-frozen-package-extraction';

    writesFile(
      path.join(tempDir, 'evidence/runs', runId, 'sprawl/domain-body-sprawl.contract.v1.json'),
      JSON.stringify({
        runId,
        evidencePath: `evidence/runs/${runId}/sprawl/domain-body-sprawl.contract.v1.json`,
        sourceFiles: [
          {
            filePath: 'src/a/a.js',
            classification: 'package extraction candidate',
            genericMechanicCandidates: [{ mechanic: 'sorting comparators', methodNames: [] }],
          },
        ],
      }),
    );

    async function fakeCallWorker() {
      return { rawResponseText: '{}', callFailure: null };
    }

    const sprawlPath = path.join(tempDir, 'evidence/runs', runId, 'sprawl/domain-body-sprawl.contract.v1.json');
    const beforeSprawl = fs.readFileSync(sprawlPath, 'utf8');

    const { packageExtractionPlan, receipt } = await runsPackageExtractionWorker(
      { rootDir: tempDir },
      runId,
      { callWorker: fakeCallWorker },
    );

    assert.equal(packageExtractionPlan.sections.length, 1);
    assert.equal(packageExtractionPlan.sections[0].classification, 'rejected extraction');
    assert.ok(fs.existsSync(receipt.reportPath));
    assert.equal(fs.readFileSync(sprawlPath, 'utf8'), beforeSprawl);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
