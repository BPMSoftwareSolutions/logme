const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const DEFAULT_MAX_RUN_COUNT = 200;
const DEFAULT_MAX_TOTAL_BYTE_SIZE = 2 * 1024 * 1024 * 1024;

function gatesEvidenceSprawlBudget(catalog, selection, cleanupPlan, receiptExists, budget = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const maxRunCount = budget.maxRunCount || DEFAULT_MAX_RUN_COUNT;
  const maxTotalByteSize = budget.maxTotalByteSize || DEFAULT_MAX_TOTAL_BYTE_SIZE;
  const totalByteSize = sumsTotalByteSize(catalog.runs);
  const exceedsBudget = catalog.runs.length > maxRunCount || totalByteSize > maxTotalByteSize;

  if (!exceedsBudget) {
    return { verdict: 'PASS', warnings: [], failures: [] };
  }

  const cleanupCandidateCount = countsCleanupCandidates(cleanupPlan);
  const failures = findsFailureConditions(selection, cleanupPlan, receiptExists);

  if (failures.length > 0) {
    return { verdict: 'FAIL', warnings: [], failures };
  }

  const warnings = cleanupCandidateCount > 0
    ? [`evidence storage exceeds budget (${catalog.runs.length} runs, ${totalByteSize} bytes); ${cleanupCandidateCount} cleanup candidate(s) available`]
    : [];

  return { verdict: 'WARN', warnings, failures: [] };
}

function sumsTotalByteSize(runs) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let totalByteSize = 0;
  for (const run of runs) {
    totalByteSize += run.totalByteSize;
  }

  return totalByteSize;
}

function countsCleanupCandidates(cleanupPlan) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!cleanupPlan) {
    return 0;
  }

  let candidateCount = 0;
  for (const entry of cleanupPlan.entries) {
    if (entry.action === 'archive' || entry.action === 'delete') {
      candidateCount += 1;
    }
  }

  return candidateCount;
}

function findsFailureConditions(selection, cleanupPlan, receiptExists) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const failures = [];

  if (!selection || !selection.latestReportTruthRun) {
    failures.push('latest evidence cannot be identified');
  }

  if (!cleanupPlan) {
    failures.push('protected evidence cannot be found because no cleanup plan exists');
  }

  if (cleanupPlan && cleanupPlan.approvalExecuted && !receiptExists) {
    failures.push('cleanup receipts are missing after an approved cleanup');
  }

  return failures;
}

module.exports = {
  DEFAULT_MAX_RUN_COUNT,
  DEFAULT_MAX_TOTAL_BYTE_SIZE,
  gatesEvidenceSprawlBudget,
};
