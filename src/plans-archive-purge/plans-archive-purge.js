const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { classifiesArchiveRetention } = require('../classifies-archive-retention/classifies-archive-retention');

const ARCHIVE_PURGE_ACTIONS = {
  KEEP: 'keep',
  PURGE: 'purge',
  INVESTIGATE: 'investigate',
};

const ARCHIVE_PURGE_PLAN_SCHEMA_VERSION = 'archive-purge-plan.v1';

const ACTION_BY_ARCHIVE_CLASSIFICATION = {
  'protected-pinned': ARCHIVE_PURGE_ACTIONS.KEEP,
  'within-retention-window': ARCHIVE_PURGE_ACTIONS.KEEP,
  'expired-purge-candidate': ARCHIVE_PURGE_ACTIONS.PURGE,
  'unsafe-to-purge': ARCHIVE_PURGE_ACTIONS.INVESTIGATE,
};

function plansArchivePurge(archivedRuns, referenceContext) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const entries = [];
  for (const archivedRun of archivedRuns) {
    entries.push(buildsArchivePurgePlanEntry(archivedRun, referenceContext));
  }

  return {
    schemaVersion: ARCHIVE_PURGE_PLAN_SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    entries,
  };
}

function buildsArchivePurgePlanEntry(archivedRun, referenceContext) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const retention = classifiesArchiveRetention(archivedRun, referenceContext);
  const action = ACTION_BY_ARCHIVE_CLASSIFICATION[retention.classification] || ARCHIVE_PURGE_ACTIONS.INVESTIGATE;

  return {
    runId: archivedRun.runId,
    year: archivedRun.year,
    action,
    reason: retention.reason,
    retentionClassification: retention.classification,
    bytesReclaimable: action === ARCHIVE_PURGE_ACTIONS.PURGE ? archivedRun.totalByteSize : 0,
    artifactCount: archivedRun.artifactCount,
    referencesFound: retention.references,
    approvalRequired: action === ARCHIVE_PURGE_ACTIONS.PURGE,
    archivedAt: archivedRun.archivedAt,
  };
}

module.exports = {
  ARCHIVE_PURGE_ACTIONS,
  ARCHIVE_PURGE_PLAN_SCHEMA_VERSION,
  plansArchivePurge,
};
