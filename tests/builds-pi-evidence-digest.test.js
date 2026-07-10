const test = require('node:test');
const assert = require('node:assert/strict');

const { buildsPiEvidenceDigest } = require('../src/builds-pi-evidence-digest/builds-pi-evidence-digest');

function buildsFeatureIndex(features) {
  return { schemaVersion: 'feature-evidence-index.v1', generatedAt: new Date().toISOString(), features, unownedEvidence: { classification: 'unowned evidence', runIds: [] } };
}

function buildsFeature(overrides = {}) {
  return {
    featureId: 'feature-x',
    featureDocumentPath: 'docs/features/feature-x.feature.md',
    scenarioIds: ['scenario-a'],
    latestEvidenceRunIds: ['run-1'],
    latestQaBundlePaths: [],
    latestPromotionDecisionPaths: [],
    blockerCodes: [],
    staleEvidenceCount: 0,
    missingEvidenceCount: 0,
    productOwnerNextAction: 'no action needed',
    ...overrides,
  };
}

function buildsCatalog(runs) {
  return { schemaVersion: 'evidence-catalog.v1', generatedAt: new Date().toISOString(), runCount: runs.length, runs };
}

function buildsRun(overrides = {}) {
  return {
    runId: 'run-1',
    piIds: ['pi-42'],
    releaseCandidateIds: [],
    retentionClassification: 'protected-current',
    ...overrides,
  };
}

test('buildsPiEvidenceDigest marks a feature with no blockers or stale/missing evidence as ready for review', () => {
  const digest = buildsPiEvidenceDigest('pi-42', buildsFeatureIndex([buildsFeature()]), buildsCatalog([buildsRun()]));

  assert.deepEqual(digest.featuresReadyForPiReview, ['feature-x']);
  assert.deepEqual(digest.featuresBlockedByMissingEvidence, []);
});

test('buildsPiEvidenceDigest marks a feature with missing evidence as blocked', () => {
  const feature = buildsFeature({ missingEvidenceCount: 1 });

  const digest = buildsPiEvidenceDigest('pi-42', buildsFeatureIndex([feature]), buildsCatalog([buildsRun()]));

  assert.deepEqual(digest.featuresBlockedByMissingEvidence, ['feature-x']);
  assert.deepEqual(digest.productOwnerDecisionsNeeded, ['feature-x']);
});

test('buildsPiEvidenceDigest includes cleanup recommendations only for runs tied to the requested PI', () => {
  const runs = [
    buildsRun({ runId: 'run-pi', piIds: ['pi-42'], retentionClassification: 'archive-candidate' }),
    buildsRun({ runId: 'run-other-pi', piIds: ['pi-99'], retentionClassification: 'archive-candidate' }),
  ];

  const digest = buildsPiEvidenceDigest('pi-42', buildsFeatureIndex([]), buildsCatalog(runs));

  assert.deepEqual(digest.evidenceCleanupRecommendations, [{ runId: 'run-pi', retentionClassification: 'archive-candidate' }]);
});
