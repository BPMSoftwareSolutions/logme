const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

function buildsPiEvidenceDigest(piId, featureIndex, catalog) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const piRunIds = new Set(collectsPiRunIds(catalog.runs, piId));
  const relevantFeatures = selectsRelevantFeatures(featureIndex.features, piRunIds);

  return {
    schemaVersion: 'pi-evidence-digest.v1',
    piId,
    generatedAt: new Date().toISOString(),
    featuresReadyForPiReview: collectsFeatureIds(relevantFeatures.filter(isReadyForReview)),
    featuresBlockedByMissingEvidence: collectsFeatureIds(relevantFeatures.filter(isBlockedByMissingEvidence)),
    featuresBlockedByStaleEvidence: collectsFeatureIds(relevantFeatures.filter(isBlockedByStaleEvidence)),
    latestMeaningfulQaBundles: collectsQaBundleRunIds(catalog.runs, piRunIds),
    domainBodyRisksAffectingDelivery: collectsFeatureIds(relevantFeatures.filter(hasBlockers)),
    evidenceCleanupRecommendations: findsCleanupRecommendations(catalog.runs, piRunIds),
    productOwnerDecisionsNeeded: collectsFeatureIds(relevantFeatures.filter(needsProductOwnerDecision)),
  };
}

function selectsRelevantFeatures(features, piRunIds) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const relevantFeatures = [];
  for (const feature of features) {
    if (hasOverlappingRun(feature, piRunIds)) {
      relevantFeatures.push(feature);
    }
  }

  return relevantFeatures;
}

function collectsFeatureIds(features) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const featureIds = [];
  for (const feature of features) {
    featureIds.push(feature.featureId);
  }

  return featureIds;
}

function collectsPiRunIds(runs, piId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const runIds = [];
  for (const run of runs) {
    if (run.piIds.includes(piId)) {
      runIds.push(run.runId);
    }
  }

  return runIds;
}

function hasOverlappingRun(feature, piRunIds) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (piRunIds.size === 0) {
    return true;
  }

  for (const runId of feature.latestEvidenceRunIds) {
    if (piRunIds.has(runId)) {
      return true;
    }
  }

  return false;
}

function isReadyForReview(feature) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return feature.missingEvidenceCount === 0 && feature.staleEvidenceCount === 0 && feature.blockerCodes.length === 0;
}

function isBlockedByMissingEvidence(feature) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return feature.missingEvidenceCount > 0;
}

function isBlockedByStaleEvidence(feature) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return feature.missingEvidenceCount === 0 && feature.staleEvidenceCount > 0;
}

function hasBlockers(feature) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return feature.blockerCodes.length > 0;
}

function needsProductOwnerDecision(feature) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return feature.missingEvidenceCount > 0 || feature.blockerCodes.length > 0;
}

function collectsQaBundleRunIds(runs, piRunIds) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const qaBundleRunIds = [];
  for (const run of runs) {
    if (run.releaseCandidateIds.length > 0 && (piRunIds.size === 0 || piRunIds.has(run.runId))) {
      qaBundleRunIds.push(run.runId);
    }
  }

  return qaBundleRunIds;
}

function findsCleanupRecommendations(runs, piRunIds) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const recommendations = [];
  for (const run of runs) {
    const isPiRun = piRunIds.size === 0 || piRunIds.has(run.runId);
    if (isPiRun && (run.retentionClassification === 'archive-candidate' || run.retentionClassification === 'delete-candidate')) {
      recommendations.push({ runId: run.runId, retentionClassification: run.retentionClassification });
    }
  }

  return recommendations;
}

module.exports = {
  buildsPiEvidenceDigest,
};
