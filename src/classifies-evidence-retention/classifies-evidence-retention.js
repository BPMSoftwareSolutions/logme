const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const RETENTION_CLASSIFICATIONS = {
  PROTECTED_CURRENT: 'protected-current',
  PROTECTED_RELEASE_CANDIDATE: 'protected-release-candidate',
  PROTECTED_PROMOTED: 'protected-promoted',
  PROTECTED_PINNED: 'protected-pinned',
  KEEP_RECENT: 'keep-recent',
  ARCHIVE_CANDIDATE: 'archive-candidate',
  DELETE_CANDIDATE: 'delete-candidate',
  UNSAFE_TO_DELETE: 'unsafe-to-delete',
};

const KEEP_RECENT_WINDOW_MILLISECONDS = 14 * 24 * 60 * 60 * 1000;

function classifiesEvidenceRetention(run, referenceContext) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const references = findsProtectingReferences(run, referenceContext);

  if (references.length > 0) {
    return buildsRetentionResult(protectedClassificationFor(references), references, run);
  }

  if (run.reportTruthStatus === null && run.reportVerdict === null) {
    return buildsRetentionResult(RETENTION_CLASSIFICATIONS.UNSAFE_TO_DELETE, [], run, 'run has no report verdict or report truth status to reason from');
  }

  if (isWithinKeepRecentWindow(run, referenceContext.now, referenceContext.keepRecentWindowMilliseconds)) {
    return buildsRetentionResult(RETENTION_CLASSIFICATIONS.KEEP_RECENT, [], run, 'run was modified within the keep-recent window');
  }

  if (run.artifactCount === 0) {
    return buildsRetentionResult(RETENTION_CLASSIFICATIONS.DELETE_CANDIDATE, [], run, 'run has no artifacts');
  }

  return buildsRetentionResult(RETENTION_CLASSIFICATIONS.ARCHIVE_CANDIDATE, [], run, 'run is older than the keep-recent window and unreferenced');
}

function findsProtectingReferences(run, referenceContext) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const references = [];

  if (referenceContext.latestEvidenceReportRunIds.has(run.runId)) {
    references.push({ reference: 'latest evidence report', classification: RETENTION_CLASSIFICATIONS.PROTECTED_CURRENT });
  }

  if (referenceContext.featureStatusContractRunIds.has(run.runId)) {
    references.push({ reference: 'feature status contract', classification: RETENTION_CLASSIFICATIONS.PROTECTED_CURRENT });
  }

  if (referenceContext.qaEvidenceBundleRunIds.has(run.runId)) {
    references.push({ reference: 'QA evidence bundle', classification: RETENTION_CLASSIFICATIONS.PROTECTED_RELEASE_CANDIDATE });
  }

  if (referenceContext.promotionDecisionRunIds.has(run.runId)) {
    references.push({ reference: 'promotion decision', classification: RETENTION_CLASSIFICATIONS.PROTECTED_PROMOTED });
  }

  if (referenceContext.piEvidenceDigestRunIds.has(run.runId)) {
    references.push({ reference: 'PI evidence digest', classification: RETENTION_CLASSIFICATIONS.PROTECTED_CURRENT });
  }

  if (referenceContext.reportTruthReceiptRunIds.has(run.runId)) {
    references.push({ reference: 'report truth receipt', classification: RETENTION_CLASSIFICATIONS.PROTECTED_CURRENT });
  }

  if (referenceContext.manualPinRunIds.has(run.runId)) {
    references.push({ reference: 'manual pin', classification: RETENTION_CLASSIFICATIONS.PROTECTED_PINNED });
  }

  return references;
}

function protectedClassificationFor(references) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const priorityOrder = [
    RETENTION_CLASSIFICATIONS.PROTECTED_PINNED,
    RETENTION_CLASSIFICATIONS.PROTECTED_PROMOTED,
    RETENTION_CLASSIFICATIONS.PROTECTED_RELEASE_CANDIDATE,
    RETENTION_CLASSIFICATIONS.PROTECTED_CURRENT,
  ];

  for (const candidate of priorityOrder) {
    if (hasReferenceWithClassification(references, candidate)) {
      return candidate;
    }
  }

  return RETENTION_CLASSIFICATIONS.PROTECTED_CURRENT;
}

function hasReferenceWithClassification(references, classification) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  for (const reference of references) {
    if (reference.classification === classification) {
      return true;
    }
  }

  return false;
}

function isWithinKeepRecentWindow(run, now, keepRecentWindowMilliseconds) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!run.lastModifiedAt) {
    return false;
  }

  const windowMilliseconds = typeof keepRecentWindowMilliseconds === 'number' ? keepRecentWindowMilliseconds : KEEP_RECENT_WINDOW_MILLISECONDS;
  const lastModifiedTime = new Date(run.lastModifiedAt).getTime();
  const nowTime = now instanceof Date ? now.getTime() : new Date(now).getTime();

  return nowTime - lastModifiedTime <= windowMilliseconds;
}

function buildsRetentionResult(classification, references, run, reason) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const isProtected = classification.startsWith('protected-');
  const referenceNames = collectsReferenceNames(references);
  const derivedReason = reason || `run is referenced by: ${referenceNames.join(', ')}`;

  return {
    runId: run.runId,
    classification,
    reason: derivedReason,
    references: referenceNames,
    isProtected,
  };
}

function collectsReferenceNames(references) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const referenceNames = [];
  for (const reference of references) {
    referenceNames.push(reference.reference);
  }

  return referenceNames;
}

module.exports = {
  RETENTION_CLASSIFICATIONS,
  KEEP_RECENT_WINDOW_MILLISECONDS,
  classifiesEvidenceRetention,
};
