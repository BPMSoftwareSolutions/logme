const test = require('node:test');
const assert = require('node:assert/strict');

const { plansEvidenceCleanup, CLEANUP_ACTIONS } = require('../src/plans-evidence-cleanup/plans-evidence-cleanup');

function buildsCatalog(runs) {
  return { schemaVersion: 'evidence-catalog.v1', generatedAt: new Date().toISOString(), runCount: runs.length, runs };
}

function buildsRun(overrides = {}) {
  return {
    runId: 'run-1',
    totalByteSize: 1000,
    artifactCount: 5,
    referencedBy: [],
    retentionClassification: 'archive-candidate',
    ...overrides,
  };
}

test('plansEvidenceCleanup assigns keep to protected and keep-recent runs', () => {
  const plan = plansEvidenceCleanup(buildsCatalog([buildsRun({ retentionClassification: 'protected-current', referencedBy: ['latest evidence report'] })]));

  assert.equal(plan.entries[0].action, CLEANUP_ACTIONS.KEEP);
  assert.equal(plan.entries[0].approvalRequired, false);
});

test('plansEvidenceCleanup assigns delete to delete-candidate runs and requires approval', () => {
  const plan = plansEvidenceCleanup(buildsCatalog([buildsRun({ retentionClassification: 'delete-candidate', totalByteSize: 5000 })]));

  assert.equal(plan.entries[0].action, CLEANUP_ACTIONS.DELETE);
  assert.equal(plan.entries[0].approvalRequired, true);
  assert.equal(plan.entries[0].bytesReclaimable, 5000);
  assert.match(plan.entries[0].rollbackOrRestorePath, /evidence\/archive/);
});

test('plansEvidenceCleanup assigns investigate to unsafe-to-delete runs', () => {
  const plan = plansEvidenceCleanup(buildsCatalog([buildsRun({ retentionClassification: 'unsafe-to-delete' })]));

  assert.equal(plan.entries[0].action, CLEANUP_ACTIONS.INVESTIGATE);
  assert.equal(plan.entries[0].approvalRequired, false);
});

test('plansEvidenceCleanup never sets bytesReclaimable for a keep action', () => {
  const plan = plansEvidenceCleanup(buildsCatalog([buildsRun({ retentionClassification: 'keep-recent', totalByteSize: 9999 })]));

  assert.equal(plan.entries[0].bytesReclaimable, 0);
});
