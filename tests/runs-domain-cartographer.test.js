const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { runsDomainCartographer } = require('../src/runs-domain-cartographer/runs-domain-cartographer');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

test('runsDomainCartographer reads frozen evidence and writes a domain map without touching the evidence run', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-domain-cartographer-'));

  try {
    const runId = 'run-frozen-cartography';

    writesFile(
      path.join(tempDir, 'evidence/runs', runId, 'domain-analysis/domain-body-analysis.contract.v1.json'),
      JSON.stringify({
        runId,
        evidencePath: `evidence/runs/${runId}/domain-analysis/domain-body-analysis.contract.v1.json`,
        sourceFiles: [
          {
            filePath: 'src/example/example.js',
            responsibilityClusters: [{ name: 'example-action', methodNames: ['doesExample'] }],
            featureScenarioTieOut: { status: 'missing scenario tie-out' },
            findingCodes: ['scenario-tieout-missing'],
          },
        ],
      }),
    );
    writesFile(
      path.join(tempDir, 'evidence/runs', runId, 'sprawl/domain-body-sprawl.contract.v1.json'),
      JSON.stringify({
        runId,
        evidencePath: `evidence/runs/${runId}/sprawl/domain-body-sprawl.contract.v1.json`,
        sourceFiles: [],
        artifactFindings: [],
      }),
    );

    const analysisPath = path.join(tempDir, 'evidence/runs', runId, 'domain-analysis/domain-body-analysis.contract.v1.json');
    const sprawlPath = path.join(tempDir, 'evidence/runs', runId, 'sprawl/domain-body-sprawl.contract.v1.json');
    const beforeAnalysis = fs.readFileSync(analysisPath, 'utf8');
    const beforeSprawl = fs.readFileSync(sprawlPath, 'utf8');

    const { domainMap, receipt } = runsDomainCartographer({ rootDir: tempDir }, runId);

    assert.equal(domainMap.sourceRunId, runId);
    assert.equal(domainMap.fileEntries.length, 1);
    assert.equal(domainMap.fileEntries[0].classification, 'product-domain body');
    assert.ok(fs.existsSync(receipt.evidencePath));
    assert.ok(fs.existsSync(receipt.reportPath));

    assert.equal(fs.readFileSync(analysisPath, 'utf8'), beforeAnalysis);
    assert.equal(fs.readFileSync(sprawlPath, 'utf8'), beforeSprawl);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
