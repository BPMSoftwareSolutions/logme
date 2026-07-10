const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const UNOWNED_EVIDENCE_CLASSIFICATION = 'unowned evidence';
const STALE_EVIDENCE_WINDOW_MILLISECONDS = 30 * 24 * 60 * 60 * 1000;

function buildsFeatureEvidenceIndex(catalog, now = new Date()) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const featureEntries = buildsFeatureEntries(catalog.runs, now);
  const unownedRunIds = findsUnownedEvidenceRunIds(catalog.runs);

  return {
    schemaVersion: 'feature-evidence-index.v1',
    generatedAt: new Date().toISOString(),
    features: featureEntries,
    unownedEvidence: {
      classification: UNOWNED_EVIDENCE_CLASSIFICATION,
      runIds: unownedRunIds,
    },
  };
}

function buildsFeatureEntries(runs, now) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const runsByFeature = groupsRunsByFeature(runs);
  const featureIds = Object.keys(runsByFeature).sort();
  const featureEntries = [];

  for (const featureId of featureIds) {
    featureEntries.push(buildsSingleFeatureEntry(featureId, runsByFeature[featureId], now));
  }

  return featureEntries;
}

function groupsRunsByFeature(runs) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const runsByFeature = {};

  for (const run of runs) {
    for (const featureId of run.featureIds) {
      if (!runsByFeature[featureId]) {
        runsByFeature[featureId] = [];
      }
      runsByFeature[featureId].push(run);
    }
  }

  return runsByFeature;
}

function buildsSingleFeatureEntry(featureId, featureRuns, now) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const scenarioIds = collectsScenarioIds(featureRuns);
  const staleCount = countsStaleRuns(featureRuns, now);
  const blockerCodes = collectsBlockerCodes(featureRuns);

  return {
    featureId,
    featureDocumentPath: `docs/features/${featureId}.feature.md`,
    scenarioIds,
    latestEvidenceRunIds: collectsRunIds(featureRuns),
    latestQaBundlePaths: [],
    latestPromotionDecisionPaths: [],
    blockerCodes,
    staleEvidenceCount: staleCount,
    missingEvidenceCount: scenarioIds.length === 0 ? 1 : 0,
    productOwnerNextAction: derivesNextAction(staleCount, blockerCodes),
  };
}

function collectsRunIds(featureRuns) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const runIds = [];
  for (const run of featureRuns) {
    runIds.push(run.runId);
  }

  return runIds.sort();
}

function collectsScenarioIds(featureRuns) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const scenarioIds = new Set();
  for (const run of featureRuns) {
    for (const scenarioId of run.scenarioIds) {
      scenarioIds.add(scenarioId);
    }
  }

  return Array.from(scenarioIds).sort();
}

function countsStaleRuns(featureRuns, now) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let staleCount = 0;
  for (const run of featureRuns) {
    if (isStaleRun(run, now)) {
      staleCount += 1;
    }
  }

  return staleCount;
}

function isStaleRun(run, now) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!run.lastModifiedAt) {
    return false;
  }

  const lastModifiedTime = new Date(run.lastModifiedAt).getTime();
  const nowTime = now instanceof Date ? now.getTime() : new Date(now).getTime();

  return nowTime - lastModifiedTime > STALE_EVIDENCE_WINDOW_MILLISECONDS;
}

function collectsBlockerCodes(featureRuns) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const blockerCodes = new Set();
  for (const run of featureRuns) {
    if (run.reportTruthStatus && (run.reportTruthStatus.toLowerCase().includes('block') || run.reportTruthStatus.toLowerCase().includes('fail'))) {
      blockerCodes.add('stale-report-projection');
    }
  }

  return Array.from(blockerCodes).sort();
}

function derivesNextAction(staleCount, blockerCodes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (blockerCodes.length > 0) {
    return 'resolve report truth blockers before promotion review';
  }

  if (staleCount > 0) {
    return 'refresh stale evidence before relying on it for delivery decisions';
  }

  return 'no action needed';
}

function findsUnownedEvidenceRunIds(runs) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const unownedRunIds = [];
  for (const run of runs) {
    if (run.featureIds.length === 0 && run.scenarioIds.length === 0) {
      unownedRunIds.push(run.runId);
    }
  }

  return unownedRunIds;
}

module.exports = {
  UNOWNED_EVIDENCE_CLASSIFICATION,
  STALE_EVIDENCE_WINDOW_MILLISECONDS,
  buildsFeatureEvidenceIndex,
};
