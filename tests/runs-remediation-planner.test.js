const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { runsRemediationPlanner } = require('../src/runs-remediation-planner/runs-remediation-planner');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

test('runsRemediationPlanner reads frozen evidence and writes a backlog without touching the evidence run', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-remediation-planner-'));

  try {
    const runId = 'run-frozen-001';

    writesFile(
      path.join(tempDir, 'evidence/runs', runId, 'domain-analysis/domain-body-analysis.contract.v1.json'),
      JSON.stringify({
        runId,
        evidencePath: `evidence/runs/${runId}/domain-analysis/domain-body-analysis.contract.v1.json`,
        sourceFiles: [
          { filePath: 'src/example/example.js', findingCodes: ['scenario-tieout-missing'] },
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

    const { backlog, receipt } = runsRemediationPlanner({ rootDir: tempDir }, runId);

    assert.equal(backlog.sourceRunId, runId);
    assert.equal(backlog.backlogItems.length, 1);
    assert.equal(backlog.backlogItems[0].packetId, 'domain-remediation-scenario-tieout');
    assert.ok(fs.existsSync(receipt.evidencePath));

    assert.equal(fs.readFileSync(analysisPath, 'utf8'), beforeAnalysis);
    assert.equal(fs.readFileSync(sprawlPath, 'utf8'), beforeSprawl);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
