const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { selectsLatestMeaningfulEvidence } = require('../selects-latest-meaningful-evidence/selects-latest-meaningful-evidence');
const { readsEvidencePins } = require('../pins-evidence-run/pins-evidence-run');

function writesLatestEvidenceReport(rootDir, catalog) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const selection = selectsLatestMeaningfulEvidence(catalog);
  const pins = readsEvidencePins(rootDir);
  const cleanupReceiptPath = findsCleanupReceiptPath(rootDir);
  const reportPath = path.join(rootDir, 'evidence', 'index', 'latest-evidence.report.md');
  const reportContent = rendersLatestEvidenceReport(selection, pins, cleanupReceiptPath);

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, reportContent, 'utf8');

  return { reportPath, selection, reportContent };
}

function findsCleanupReceiptPath(rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const receiptPath = path.join(rootDir, 'evidence', 'cleanup', 'evidence-cleanup.receipt.v1.json');
  return fs.existsSync(receiptPath) ? 'evidence/cleanup/evidence-cleanup.receipt.v1.json' : null;
}

function rendersLatestEvidenceReport(selection, pins, cleanupReceiptPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    '# Latest Evidence',
    '',
    '## Latest Report Truth Run',
    rendersRunLink(selection.latestReportTruthRun),
    '',
    '## Latest Passing Report Truth Run',
    rendersRunLink(selection.latestPassingReportTruthRun),
    '',
    '## Latest Blocked Report Truth Run',
    rendersRunLink(selection.latestBlockedReportTruthRun),
    '',
    '## Latest Domain Analysis Run',
    rendersRunLink(selection.latestDomainAnalysisRun),
    '',
    '## Latest Sprawl Analysis Run',
    rendersRunLink(selection.latestSprawlAnalysisRun),
    '',
    '## Latest QA Bundle By Feature',
    rendersMapLines(selection.latestQaBundleByFeature),
    '',
    '## Latest Promotion-Relevant Evidence By Release Candidate',
    rendersMapLines(selection.latestPromotionRelevantEvidenceByReleaseCandidate),
    '',
    '## Evidence That Needs Product-Owner Attention',
    rendersListLines(selection.evidenceNeedingProductOwnerAttention),
    '',
    '## Pinned Evidence',
    rendersPinLines(pins),
    '',
    '## Cleanup Receipt',
    cleanupReceiptPath ? `- [${cleanupReceiptPath}](../../${cleanupReceiptPath})` : '_No cleanup has been executed yet._',
    '',
    `Obsolete runs (${selection.obsoleteRunIds.length}) are hidden from this default view. See the [complete catalog](evidence-catalog.report.md) for the full list.`,
    '',
  ].join('\n');
}

function rendersRunLink(runId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return runId ? `- [${runId}](../runs/${runId}/)` : '_none found_';
}

function rendersMapLines(map) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const keys = Object.keys(map);
  if (keys.length === 0) {
    return '_none found_';
  }

  const lines = [];
  for (const key of keys) {
    lines.push(`- ${key}: [${map[key]}](../runs/${map[key]}/)`);
  }

  return lines.join('\n');
}

function rendersListLines(items) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (items.length === 0) {
    return '_none found_';
  }

  const lines = [];
  for (const runId of items) {
    lines.push(`- [${runId}](../runs/${runId}/)`);
  }

  return lines.join('\n');
}

function rendersPinLines(pins) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (pins.length === 0) {
    return '_none pinned_';
  }

  const lines = [];
  for (const pin of pins) {
    lines.push(`- [${pin.runId}](../runs/${pin.runId}/) - ${pin.reason}`);
  }

  return lines.join('\n');
}

module.exports = {
  writesLatestEvidenceReport,
};
