const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { guardsArchivePurgeReferences } = require('../guards-archive-purge-references/guards-archive-purge-references');
const { approvesEvidenceCleanup } = require('../approves-evidence-cleanup/approves-evidence-cleanup');
const { writesArchivePurgeReceipt } = require('../writes-archive-purge-receipt/writes-archive-purge-receipt');
const { ARCHIVE_PURGE_ACTIONS } = require('../plans-archive-purge/plans-archive-purge');

const ARCHIVE_PURGE_ADVISORY_GATES = [
  'protected reference check',
  'approval check',
  'plan hash check',
  'purge receipt check',
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

function executesArchivePurge(rootDir, plan, planHash, approvalRecord) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const guardResult = guardsArchivePurgeReferences(plan);
  const approvalResult = approvesEvidenceCleanup(approvalRecord, planHash);

  if (approvalResult.verdict !== 'PASS') {
    return buildsAdvisoryOnlyResult(approvalResult, guardResult);
  }

  const blockedRunIds = collectsBlockedRunIds(guardResult.blockedEntries);
  const approvedActionSet = new Set(approvalRecord.approvedActions);

  const keptRuns = [];
  const purgedRuns = [];
  const blockedActions = [];
  const errors = [];
  let bytesReclaimed = 0;

  for (const entry of plan.entries) {
    if (blockedRunIds.has(entry.runId)) {
      blockedActions.push({ runId: entry.runId, action: entry.action, reason: 'blocked by protected reference guard' });
      continue;
    }

    if (entry.action === ARCHIVE_PURGE_ACTIONS.KEEP) {
      keptRuns.push(entry.runId);
      continue;
    }

    if (entry.action === ARCHIVE_PURGE_ACTIONS.INVESTIGATE) {
      blockedActions.push({ runId: entry.runId, action: entry.action, reason: 'archived run requires product-owner investigation before purge' });
      continue;
    }

    if (!approvedActionSet.has(entry.action)) {
      blockedActions.push({ runId: entry.runId, action: entry.action, reason: 'action was not included in the approved actions list' });
      continue;
    }

    executesApprovedPurge(rootDir, entry, purgedRuns, errors);
    bytesReclaimed += entry.bytesReclaimable;
  }

  const executionResult = {
    approvedBy: approvalRecord.approvedBy,
    approvedAt: approvalRecord.approvedAt,
    archivePurgePlanHash: planHash,
    keptRuns,
    purgedRuns,
    blockedActions,
    bytesReclaimed,
    errors,
  };

  const { receiptPath, receipt } = writesArchivePurgeReceipt(rootDir, executionResult);

  return { verdict: 'EXECUTED', guardResult, approvalResult, executionResult, receiptPath, receipt };
}

function executesApprovedPurge(rootDir, entry, purgedRuns, errors) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  try {
    const archivedRunDir = path.join(rootDir, 'evidence', 'archive', entry.year, entry.runId);
    fs.rmSync(archivedRunDir, { recursive: true, force: true });
    purgedRuns.push({ runId: entry.runId, year: entry.year });
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
    advisoryGates: ARCHIVE_PURGE_ADVISORY_GATES,
  };
}

module.exports = {
  ARCHIVE_PURGE_ADVISORY_GATES,
  executesArchivePurge,
};
