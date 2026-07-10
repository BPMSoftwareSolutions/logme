const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { guardsEvidenceCleanupReferences } = require('../guards-evidence-cleanup-references/guards-evidence-cleanup-references');
const { approvesEvidenceCleanup } = require('../approves-evidence-cleanup/approves-evidence-cleanup');
const { archivesEvidenceRun } = require('../archives-evidence-run/archives-evidence-run');
const { writesEvidenceCleanupReceipt } = require('../writes-evidence-cleanup-receipt/writes-evidence-cleanup-receipt');
const { CLEANUP_ACTIONS } = require('../plans-evidence-cleanup/plans-evidence-cleanup');

const ADVISORY_GATES = [
  'protected reference check',
  'approval check',
  'plan hash check',
  'archive manifest check',
  'cleanup receipt check',
];

function collectsBlockedRunIds(blockedEntries) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const blockedRunIds = new Set();
  for (const entry of blockedEntries) {
    blockedRunIds.add(entry.runId);
  }

  return blockedRunIds;
}

function executesEvidenceCleanup(rootDir, plan, planHash, approvalRecord, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const guardResult = guardsEvidenceCleanupReferences(plan);
  const approvalResult = approvesEvidenceCleanup(approvalRecord, planHash);

  if (approvalResult.verdict !== 'PASS') {
    return buildsAdvisoryOnlyResult(approvalResult, guardResult);
  }

  const blockedRunIds = collectsBlockedRunIds(guardResult.blockedEntries);
  const approvedActionSet = new Set(approvalRecord.approvedActions);
  const now = options.now || new Date();
  const archiveFirst = options.allowDirectDelete !== true;

  const keptRuns = [];
  const archivedRuns = [];
  const deletedRuns = [];
  const blockedActions = [];
  const errors = [];
  let bytesReclaimed = 0;

  for (const entry of plan.entries) {
    if (blockedRunIds.has(entry.runId)) {
      blockedActions.push({ runId: entry.runId, action: entry.action, reason: 'blocked by protected reference guard' });
      continue;
    }

    if (entry.action === CLEANUP_ACTIONS.KEEP || entry.action === CLEANUP_ACTIONS.PIN) {
      keptRuns.push(entry.runId);
      continue;
    }

    if (entry.action === CLEANUP_ACTIONS.INVESTIGATE) {
      blockedActions.push({ runId: entry.runId, action: entry.action, reason: 'run requires product-owner investigation before cleanup' });
      continue;
    }

    if (!approvedActionSet.has(entry.action)) {
      blockedActions.push({ runId: entry.runId, action: entry.action, reason: 'action was not included in the approved actions list' });
      continue;
    }

    executesApprovedDestructiveAction(rootDir, entry, archiveFirst, approvalRecord, now, archivedRuns, deletedRuns, errors);
    bytesReclaimed += entry.bytesReclaimable;
  }

  const executionResult = {
    approvedBy: approvalRecord.approvedBy,
    approvedAt: approvalRecord.approvedAt,
    cleanupPlanHash: planHash,
    keptRuns,
    archivedRuns,
    deletedRuns,
    blockedActions,
    bytesReclaimed,
    errors,
  };

  const { receiptPath, receipt } = writesEvidenceCleanupReceipt(rootDir, executionResult);

  return { verdict: 'EXECUTED', guardResult, approvalResult, executionResult, receiptPath, receipt };
}

function executesApprovedDestructiveAction(rootDir, entry, archiveFirst, approvalRecord, now, archivedRuns, deletedRuns, errors) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  try {
    if (entry.action === CLEANUP_ACTIONS.ARCHIVE || archiveFirst) {
      const { manifest } = archivesEvidenceRun(rootDir, entry.runId, approvalRecord.approvedBy, now);
      archivedRuns.push({ runId: entry.runId, manifestPath: manifest.destinationPath });

      if (entry.action === CLEANUP_ACTIONS.DELETE) {
        deletedRuns.push({ runId: entry.runId, archivedFirst: true });
      }

      return;
    }

    deletedRuns.push({ runId: entry.runId, archivedFirst: false });
  } catch (executionError) {
    errors.push({ runId: entry.runId, action: entry.action, message: executionError.message });
  }
}

function buildsAdvisoryOnlyResult(approvalResult, guardResult) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    verdict: 'ADVISORY_ONLY',
    guardResult,
    approvalResult,
    executionResult: null,
    receiptPath: null,
    receipt: null,
    advisoryGates: ADVISORY_GATES,
  };
}

module.exports = {
  ADVISORY_GATES,
  executesEvidenceCleanup,
};
