const test = require('node:test');
const assert = require('node:assert/strict');

const { plansArchivePurge, ARCHIVE_PURGE_ACTIONS } = require('../src/plans-archive-purge/plans-archive-purge');

function buildsReferenceContext(overrides = {}) {
  return {
    manualPinRunIds: new Set(),
    now: new Date('2026-07-10T00:00:00.000Z'),
    ...overrides,
  };
}

function buildsArchivedRun(overrides = {}) {
  return {
    runId: 'run-1',
    year: '2026',
    archivedAt: '2026-01-01T00:00:00.000Z',
    hasManifest: true,
    totalByteSize: 1000,
    artifactCount: 3,
    ...overrides,
  };
}

test('plansArchivePurge assigns purge to an expired unreferenced archived run and requires approval', () => {
  const plan = plansArchivePurge([buildsArchivedRun()], buildsReferenceContext());

  assert.equal(plan.entries[0].action, ARCHIVE_PURGE_ACTIONS.PURGE);
  assert.equal(plan.entries[0].approvalRequired, true);
  assert.equal(plan.entries[0].bytesReclaimable, 1000);
});

test('plansArchivePurge assigns keep to a pinned archived run', () => {
  const plan = plansArchivePurge([buildsArchivedRun()], buildsReferenceContext({ manualPinRunIds: new Set(['run-1']) }));

  assert.equal(plan.entries[0].action, ARCHIVE_PURGE_ACTIONS.KEEP);
  assert.equal(plan.entries[0].approvalRequired, false);
  assert.equal(plan.entries[0].bytesReclaimable, 0);
});

test('plansArchivePurge assigns keep to a run within the retention window', () => {
  const plan = plansArchivePurge([buildsArchivedRun({ archivedAt: '2026-07-05T00:00:00.000Z' })], buildsReferenceContext());

  assert.equal(plan.entries[0].action, ARCHIVE_PURGE_ACTIONS.KEEP);
});

test('plansArchivePurge assigns investigate to a run with no manifest', () => {
  const plan = plansArchivePurge([buildsArchivedRun({ hasManifest: false, archivedAt: null })], buildsReferenceContext());

  assert.equal(plan.entries[0].action, ARCHIVE_PURGE_ACTIONS.INVESTIGATE);
  assert.equal(plan.entries[0].approvalRequired, false);
});
