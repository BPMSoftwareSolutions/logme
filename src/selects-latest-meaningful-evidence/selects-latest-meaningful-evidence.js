const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const OBSOLETE_CLASSIFICATIONS = new Set(['delete-candidate', 'archive-candidate']);

function selectsLatestMeaningfulEvidence(catalog) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const runs = catalog.runs;

  return {
    latestReportTruthRun: selectsLatestByPredicate(runs, hasReportTruthStatus),
    latestPassingReportTruthRun: selectsLatestByPredicate(runs, isPassingReportTruthRun),
    latestBlockedReportTruthRun: selectsLatestByPredicate(runs, isBlockedReportTruthRun),
    latestDomainAnalysisRun: selectsLatestByPredicate(runs, hasReportVerdict),
    latestSprawlAnalysisRun: selectsLatestByPredicate(runs, hasSprawlArtifact),
    latestQaBundleByFeature: selectsLatestQaBundleByFeature(runs),
    latestPromotionRelevantEvidenceByReleaseCandidate: selectsLatestByReleaseCandidate(runs),
    evidenceNeedingProductOwnerAttention: selectsEvidenceNeedingAttention(runs),
    obsoleteRunIds: selectsObsoleteRunIds(runs),
  };
}

function hasReportTruthStatus(run) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return run.reportTruthStatus !== null;
}

function isPassingReportTruthRun(run) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return run.reportTruthStatus && run.reportTruthStatus.toLowerCase().includes('pass');
}

function isBlockedReportTruthRun(run) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return run.reportTruthStatus && (run.reportTruthStatus.toLowerCase().includes('block') || run.reportTruthStatus.toLowerCase().includes('fail'));
}

function hasReportVerdict(run) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return run.reportVerdict !== null;
}

function hasSprawlArtifact(run) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return run.piIds.length > 0 || run.releaseCandidateIds.length > 0;
}

function selectsLatestByPredicate(runs, predicate) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let latest = null;
  for (const run of runs) {
    if (predicate(run) && isNewerRun(run, latest)) {
      latest = run;
    }
  }

  return latest ? latest.runId : null;
}

function isNewerRun(candidate, current) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!current) {
    return true;
  }

  return (candidate.lastModifiedAt || '') > (current.lastModifiedAt || '');
}

function selectsLatestQaBundleByFeature(runs) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const latestByFeature = {};

  for (const run of runs) {
    for (const featureId of run.featureIds) {
      if (!latestByFeature[featureId] || isNewerRun(run, latestByFeature[featureId])) {
        latestByFeature[featureId] = run;
      }
    }
  }

  const result = {};
  for (const featureId of Object.keys(latestByFeature)) {
    result[featureId] = latestByFeature[featureId].runId;
  }

  return result;
}

function selectsLatestByReleaseCandidate(runs) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const latestByReleaseCandidate = {};

  for (const run of runs) {
    for (const releaseCandidateId of run.releaseCandidateIds) {
      if (!latestByReleaseCandidate[releaseCandidateId] || isNewerRun(run, latestByReleaseCandidate[releaseCandidateId])) {
        latestByReleaseCandidate[releaseCandidateId] = run;
      }
    }
  }

  const result = {};
  for (const releaseCandidateId of Object.keys(latestByReleaseCandidate)) {
    result[releaseCandidateId] = latestByReleaseCandidate[releaseCandidateId].runId;
  }

  return result;
}

function selectsEvidenceNeedingAttention(runs) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const needsAttention = [];
  for (const run of runs) {
    if (isBlockedReportTruthRun(run) || run.retentionClassification === 'unsafe-to-delete') {
      needsAttention.push(run.runId);
    }
  }

  return needsAttention;
}

function selectsObsoleteRunIds(runs) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const obsoleteRunIds = [];
  for (const run of runs) {
    if (OBSOLETE_CLASSIFICATIONS.has(run.retentionClassification)) {
      obsoleteRunIds.push(run.runId);
    }
  }

  return obsoleteRunIds;
}

module.exports = {
  OBSOLETE_CLASSIFICATIONS,
  selectsLatestMeaningfulEvidence,
};
