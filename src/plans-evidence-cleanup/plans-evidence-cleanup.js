const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const CLEANUP_ACTIONS = {
  KEEP: 'keep',
  PIN: 'pin',
  ARCHIVE: 'archive',
  DELETE: 'delete',
  INVESTIGATE: 'investigate',
};

const CLEANUP_PLAN_SCHEMA_VERSION = 'evidence-cleanup-plan.v1';

const ACTION_BY_CLASSIFICATION = {
  'protected-current': CLEANUP_ACTIONS.KEEP,
  'protected-release-candidate': CLEANUP_ACTIONS.KEEP,
  'protected-promoted': CLEANUP_ACTIONS.KEEP,
  'protected-pinned': CLEANUP_ACTIONS.PIN,
  'keep-recent': CLEANUP_ACTIONS.KEEP,
  'archive-candidate': CLEANUP_ACTIONS.ARCHIVE,
  'delete-candidate': CLEANUP_ACTIONS.DELETE,
  'unsafe-to-delete': CLEANUP_ACTIONS.INVESTIGATE,
};

const ACTIONS_REQUIRING_APPROVAL = new Set([CLEANUP_ACTIONS.ARCHIVE, CLEANUP_ACTIONS.DELETE]);

function plansEvidenceCleanup(catalog) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const entries = catalog.runs.map(buildsCleanupPlanEntry);

  return {
    schemaVersion: CLEANUP_PLAN_SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    entries,
  };
}

function buildsCleanupPlanEntry(run) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const action = ACTION_BY_CLASSIFICATION[run.retentionClassification] || CLEANUP_ACTIONS.INVESTIGATE;

  return {
    runId: run.runId,
    action,
    reason: describesReason(run, action),
    bytesReclaimable: action === CLEANUP_ACTIONS.DELETE ? run.totalByteSize : 0,
    artifactCount: run.artifactCount,
    protectionChecks: run.referencedBy.length > 0 ? run.referencedBy : ['none found'],
    referencesFound: run.referencedBy,
    approvalRequired: ACTIONS_REQUIRING_APPROVAL.has(action),
    rollbackOrRestorePath: action === CLEANUP_ACTIONS.DELETE ? `evidence/archive/<year>/${run.runId}/` : null,
  };
}

function describesReason(run, action) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (action === CLEANUP_ACTIONS.KEEP || action === CLEANUP_ACTIONS.PIN) {
    return `retention classification ${run.retentionClassification}: ${run.referencedBy.length > 0 ? `referenced by ${run.referencedBy.join(', ')}` : 'protected by policy'}`;
  }

  if (action === CLEANUP_ACTIONS.INVESTIGATE) {
    return `retention classification ${run.retentionClassification}: run has no report verdict or report truth status to reason from`;
  }

  return `retention classification ${run.retentionClassification}: no protecting reference was found`;
}

module.exports = {
  CLEANUP_ACTIONS,
  CLEANUP_PLAN_SCHEMA_VERSION,
  ACTIONS_REQUIRING_APPROVAL,
  plansEvidenceCleanup,
};
