const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const ARCHIVE_RETENTION_CLASSIFICATIONS = {
  PROTECTED_PINNED: 'protected-pinned',
  WITHIN_RETENTION_WINDOW: 'within-retention-window',
  EXPIRED_PURGE_CANDIDATE: 'expired-purge-candidate',
  UNSAFE_TO_PURGE: 'unsafe-to-purge',
};

const DEFAULT_ARCHIVE_RETENTION_WINDOW_MILLISECONDS = 90 * 24 * 60 * 60 * 1000;

function classifiesArchiveRetention(archivedRun, referenceContext) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (referenceContext.manualPinRunIds.has(archivedRun.runId)) {
    return buildsArchiveRetentionResult(
      archivedRun,
      ARCHIVE_RETENTION_CLASSIFICATIONS.PROTECTED_PINNED,
      'manual pin',
      'archived run is protected by a manual pin',
    );
  }

  if (!archivedRun.hasManifest || !archivedRun.archivedAt) {
    return buildsArchiveRetentionResult(
      archivedRun,
      ARCHIVE_RETENTION_CLASSIFICATIONS.UNSAFE_TO_PURGE,
      null,
      'archived run has no archive manifest or archivedAt timestamp to reason from',
    );
  }

  if (isWithinRetentionWindow(archivedRun, referenceContext.now, referenceContext.archiveRetentionWindowMilliseconds)) {
    return buildsArchiveRetentionResult(
      archivedRun,
      ARCHIVE_RETENTION_CLASSIFICATIONS.WITHIN_RETENTION_WINDOW,
      null,
      'archived run is within the archive retention window',
    );
  }

  return buildsArchiveRetentionResult(
    archivedRun,
    ARCHIVE_RETENTION_CLASSIFICATIONS.EXPIRED_PURGE_CANDIDATE,
    null,
    'archived run is older than the archive retention window and unpinned',
  );
}

function isWithinRetentionWindow(archivedRun, now, archiveRetentionWindowMilliseconds) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const windowMilliseconds = typeof archiveRetentionWindowMilliseconds === 'number'
    ? archiveRetentionWindowMilliseconds
    : DEFAULT_ARCHIVE_RETENTION_WINDOW_MILLISECONDS;
  const archivedAtTime = new Date(archivedRun.archivedAt).getTime();
  const nowTime = now instanceof Date ? now.getTime() : new Date(now).getTime();

  return nowTime - archivedAtTime <= windowMilliseconds;
}

function buildsArchiveRetentionResult(archivedRun, classification, reference, reason) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    runId: archivedRun.runId,
    classification,
    reason,
    references: reference ? [reference] : [],
    isProtected: classification === ARCHIVE_RETENTION_CLASSIFICATIONS.PROTECTED_PINNED,
  };
}

module.exports = {
  ARCHIVE_RETENTION_CLASSIFICATIONS,
  DEFAULT_ARCHIVE_RETENTION_WINDOW_MILLISECONDS,
  classifiesArchiveRetention,
};
