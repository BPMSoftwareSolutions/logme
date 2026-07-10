const test = require('node:test');
const assert = require('node:assert/strict');

const { buildsFeatureEvidenceIndex, UNOWNED_EVIDENCE_CLASSIFICATION } = require('../src/builds-feature-evidence-index/builds-feature-evidence-index');

function buildsCatalog(runs) {
  return { schemaVersion: 'evidence-catalog.v1', generatedAt: new Date().toISOString(), runCount: runs.length, runs };
}

function buildsRun(overrides = {}) {
  return {
    runId: 'run-1',
    lastModifiedAt: '2026-07-01T00:00:00.000Z',
    reportTruthStatus: 'tests pass, report truth gate passes',
    featureIds: [],
    scenarioIds: [],
    ...overrides,
  };
}

test('buildsFeatureEvidenceIndex groups runs by feature id and collects scenario ids', () => {
  const run = buildsRun({ featureIds: ['feature-x'], scenarioIds: ['scenario-a', 'scenario-b'] });

  const index = buildsFeatureEvidenceIndex(buildsCatalog([run]), new Date('2026-07-10T00:00:00.000Z'));

  assert.equal(index.features.length, 1);
  assert.equal(index.features[0].featureId, 'feature-x');
  assert.deepEqual(index.features[0].scenarioIds, ['scenario-a', 'scenario-b']);
  assert.equal(index.features[0].missingEvidenceCount, 0);
});

test('buildsFeatureEvidenceIndex classifies evidence with no feature or scenario tie-out as unowned', () => {
  const run = buildsRun({ featureIds: [], scenarioIds: [] });

  const index = buildsFeatureEvidenceIndex(buildsCatalog([run]), new Date('2026-07-10T00:00:00.000Z'));

  assert.equal(index.unownedEvidence.classification, UNOWNED_EVIDENCE_CLASSIFICATION);
  assert.deepEqual(index.unownedEvidence.runIds, ['run-1']);
});

test('buildsFeatureEvidenceIndex counts stale evidence beyond the freshness window', () => {
  const run = buildsRun({ featureIds: ['feature-x'], scenarioIds: ['scenario-a'], lastModifiedAt: '2026-01-01T00:00:00.000Z' });

  const index = buildsFeatureEvidenceIndex(buildsCatalog([run]), new Date('2026-07-10T00:00:00.000Z'));

  assert.equal(index.features[0].staleEvidenceCount, 1);
  assert.equal(index.features[0].productOwnerNextAction, 'refresh stale evidence before relying on it for delivery decisions');
});

test('buildsFeatureEvidenceIndex surfaces blocker codes for a blocked report truth run', () => {
  const run = buildsRun({ featureIds: ['feature-x'], scenarioIds: ['scenario-a'], reportTruthStatus: 'tests pass, report truth gate fails' });

  const index = buildsFeatureEvidenceIndex(buildsCatalog([run]), new Date('2026-07-10T00:00:00.000Z'));

  assert.deepEqual(index.features[0].blockerCodes, ['stale-report-projection']);
  assert.equal(index.features[0].productOwnerNextAction, 'resolve report truth blockers before promotion review');
});
