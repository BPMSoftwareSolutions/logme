const test = require('node:test');
const assert = require('node:assert/strict');

const { selectsLatestMeaningfulEvidence } = require('../src/selects-latest-meaningful-evidence/selects-latest-meaningful-evidence');

function buildsCatalog(runs) {
  return { schemaVersion: 'evidence-catalog.v1', generatedAt: new Date().toISOString(), runCount: runs.length, runs };
}

function buildsRun(overrides = {}) {
  return {
    runId: 'run-1',
    lastModifiedAt: '2026-01-01T00:00:00.000Z',
    reportVerdict: null,
    reportTruthStatus: null,
    featureIds: [],
    scenarioIds: [],
    releaseCandidateIds: [],
    piIds: [],
    referencedBy: [],
    retentionClassification: 'keep-recent',
    ...overrides,
  };
}

test('selectsLatestMeaningfulEvidence picks the run with the latest lastModifiedAt for each category', () => {
  const older = buildsRun({ runId: 'run-old', lastModifiedAt: '2026-01-01T00:00:00.000Z', reportTruthStatus: 'tests pass, report truth gate passes' });
  const newer = buildsRun({ runId: 'run-new', lastModifiedAt: '2026-02-01T00:00:00.000Z', reportTruthStatus: 'tests pass, report truth gate passes' });

  const selection = selectsLatestMeaningfulEvidence(buildsCatalog([older, newer]));

  assert.equal(selection.latestReportTruthRun, 'run-new');
  assert.equal(selection.latestPassingReportTruthRun, 'run-new');
});

test('selectsLatestMeaningfulEvidence groups the latest QA bundle per feature', () => {
  const runA = buildsRun({ runId: 'run-a', featureIds: ['feature-x'], lastModifiedAt: '2026-01-01T00:00:00.000Z' });
  const runB = buildsRun({ runId: 'run-b', featureIds: ['feature-x'], lastModifiedAt: '2026-03-01T00:00:00.000Z' });

  const selection = selectsLatestMeaningfulEvidence(buildsCatalog([runA, runB]));

  assert.deepEqual(selection.latestQaBundleByFeature, { 'feature-x': 'run-b' });
});

test('selectsLatestMeaningfulEvidence surfaces obsolete runs separately from the default view', () => {
  const archiveCandidate = buildsRun({ runId: 'run-archive', retentionClassification: 'archive-candidate' });
  const deleteCandidate = buildsRun({ runId: 'run-delete', retentionClassification: 'delete-candidate' });
  const keepRun = buildsRun({ runId: 'run-keep', retentionClassification: 'keep-recent' });

  const selection = selectsLatestMeaningfulEvidence(buildsCatalog([archiveCandidate, deleteCandidate, keepRun]));

  assert.deepEqual(selection.obsoleteRunIds.sort(), ['run-archive', 'run-delete']);
});

test('selectsLatestMeaningfulEvidence flags unsafe-to-delete and blocked runs as needing product-owner attention', () => {
  const blocked = buildsRun({ runId: 'run-blocked', reportTruthStatus: 'tests pass, report truth gate fails' });
  const unsafe = buildsRun({ runId: 'run-unsafe', retentionClassification: 'unsafe-to-delete' });

  const selection = selectsLatestMeaningfulEvidence(buildsCatalog([blocked, unsafe]));

  assert.deepEqual(selection.evidenceNeedingProductOwnerAttention.sort(), ['run-blocked', 'run-unsafe']);
});
