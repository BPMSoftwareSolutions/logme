const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { writesDecompositionPlanEvidence } = require('../src/writes-decomposition-plan-evidence/writes-decomposition-plan-evidence');

test('writesDecompositionPlanEvidence writes a markdown report under quality/domain-remediation/<run-id>/', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-decomposition-plan-write-'));

  try {
    const runId = 'run-decomp-write-1';
    const decompositionPlan = {
      sourceRunId: runId,
      reportPath: `quality/domain-remediation/${runId}/decomposition-plan.report.md`,
      sourceArtifacts: {
        domainAnalysisContractPath: `evidence/runs/${runId}/domain-analysis/domain-body-analysis.contract.v1.json`,
        renamePlanPath: `quality/domain-remediation/${runId}/rename-plan.v1.json`,
      },
      summary: { totalCandidates: 1 },
      sections: [
        {
          currentPath: 'src/big/big.js',
          currentResponsibilities: [{ name: 'build', methodNames: ['buildsThing'] }],
          proposedBodies: [{ proposedPath: 'src/builds-thing/builds-thing.js', sourceMethodNames: ['buildsThing'], reason: 'extract', contractActionRequired: 'declare contract' }],
          scenarioTieOuts: 'not yet assigned',
          contractUpdates: 'add entries',
          importMigrationPlan: 'not yet determined',
          behaviorPreservingTests: 'add tests',
          rollbackNotes: 'revert to src/big/big.js',
        },
      ],
    };

    const receipt = writesDecompositionPlanEvidence({ rootDir: tempDir }, decompositionPlan);

    const expectedPath = path.join(tempDir, 'quality', 'domain-remediation', runId, 'decomposition-plan.report.md');
    assert.equal(receipt.reportPath, expectedPath);
    assert.equal(receipt.sectionCount, 1);
    assert.ok(fs.existsSync(expectedPath));

    const content = fs.readFileSync(expectedPath, 'utf8');
    assert.match(content, /# Decomposition Plan Report/u);
    assert.match(content, /src\/big\/big\.js/u);
    assert.match(content, /src\/builds-thing\/builds-thing\.js/u);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
