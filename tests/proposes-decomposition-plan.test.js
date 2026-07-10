const test = require('node:test');
const assert = require('node:assert/strict');

const { proposesDecompositionPlan } = require('../src/proposes-decomposition-plan/proposes-decomposition-plan');

test('proposesDecompositionPlan only includes files classified decompose before rename in the rename plan', () => {
  const analysisContract = {
    runId: 'run-1',
    evidencePath: 'evidence/runs/run-1/domain-analysis/domain-body-analysis.contract.v1.json',
    sourceFiles: [
      {
        filePath: 'src/big/big.js',
        executableMethodCount: 2,
        responsibilityClusters: [
          { name: 'build', methodNames: ['buildsThing'] },
          { name: 'validate', methodNames: ['validatesThing'] },
        ],
        decomposition: {
          proposedFiles: [
            { proposedFilePath: 'src/builds-thing/builds-thing.js', sourceMethodNames: ['buildsThing'], reason: 'extract build responsibility', contractActionRequired: 'declare a new contract entry' },
            { proposedFilePath: 'src/validates-thing/validates-thing.js', sourceMethodNames: ['validatesThing'], reason: 'extract validate responsibility', contractActionRequired: 'declare a new contract entry' },
          ],
        },
      },
      {
        filePath: 'src/small/small.js',
        executableMethodCount: 1,
        responsibilityClusters: [{ name: 'unclear-action', methodNames: ['readsThing'] }],
        decomposition: { proposedFiles: [] },
      },
    ],
  };

  const renamePlan = {
    evidencePath: 'quality/domain-remediation/run-1/rename-plan.v1.json',
    entries: [
      { currentPath: 'src/big/big.js', classification: 'decompose before rename' },
      { currentPath: 'src/small/small.js', classification: 'mechanical rename' },
    ],
  };

  const plan = proposesDecompositionPlan(analysisContract, renamePlan);

  assert.equal(plan.schemaVersion, 'decomposition-plan.report.v1');
  assert.equal(plan.sourceRunId, 'run-1');
  assert.equal(plan.reportPath, 'quality/domain-remediation/run-1/decomposition-plan.report.md');
  assert.equal(plan.sections.length, 1);

  const section = plan.sections[0];
  assert.equal(section.currentPath, 'src/big/big.js');
  assert.equal(section.currentResponsibilities.length, 2);
  assert.equal(section.proposedBodies.length, 2);
  assert.equal(section.proposedBodies[0].proposedPath, 'src/builds-thing/builds-thing.js');
  assert.ok(section.rollbackNotes.includes('src/big/big.js'));
});

test('proposesDecompositionPlan produces an empty section list when no files are classified decompose before rename', () => {
  const analysisContract = {
    runId: 'run-2',
    evidencePath: 'evidence/runs/run-2/domain-analysis/domain-body-analysis.contract.v1.json',
    sourceFiles: [],
  };

  const renamePlan = {
    evidencePath: 'quality/domain-remediation/run-2/rename-plan.v1.json',
    entries: [{ currentPath: 'src/small/small.js', classification: 'mechanical rename' }],
  };

  const plan = proposesDecompositionPlan(analysisContract, renamePlan);

  assert.equal(plan.sections.length, 0);
  assert.equal(plan.summary.totalCandidates, 0);
});
