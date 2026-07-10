const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { buildsPiEvidenceDigest } = require('../builds-pi-evidence-digest/builds-pi-evidence-digest');

function writesPiEvidenceDigest(rootDir, piId, featureIndex, catalog) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const digest = buildsPiEvidenceDigest(piId, featureIndex, catalog);
  const reportPath = path.join(rootDir, 'evidence', 'index', 'pi', piId, 'pi-evidence-digest.report.md');
  const reportContent = rendersPiEvidenceDigestReport(digest);

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, reportContent, 'utf8');

  return { reportPath, digest, reportContent };
}

function rendersPiEvidenceDigestReport(digest) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    `# PI Evidence Digest: ${digest.piId}`,
    '',
    `Generated at: ${digest.generatedAt}`,
    '',
    '## Features Ready For PI Review',
    rendersListOrNone(digest.featuresReadyForPiReview),
    '',
    '## Features Blocked By Missing Evidence',
    rendersListOrNone(digest.featuresBlockedByMissingEvidence),
    '',
    '## Features Blocked By Stale Evidence',
    rendersListOrNone(digest.featuresBlockedByStaleEvidence),
    '',
    '## Latest Meaningful QA Bundles',
    rendersListOrNone(digest.latestMeaningfulQaBundles),
    '',
    '## Domain Body Risks That Affect Delivery',
    rendersListOrNone(digest.domainBodyRisksAffectingDelivery),
    '',
    '## Evidence Cleanup Recommendations',
    rendersCleanupRecommendations(digest.evidenceCleanupRecommendations),
    '',
    '## Product-Owner Decisions Needed',
    rendersListOrNone(digest.productOwnerDecisionsNeeded),
    '',
    'This digest summarizes PI-relevant evidence so the product owner does not need to inspect every raw run folder manually.',
    '',
  ].join('\n');
}

function rendersListOrNone(items) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (items.length === 0) {
    return '_none_';
  }

  const lines = [];
  for (const item of items) {
    lines.push(`- ${item}`);
  }

  return lines.join('\n');
}

function rendersCleanupRecommendations(recommendations) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (recommendations.length === 0) {
    return '_none_';
  }

  const lines = [];
  for (const recommendation of recommendations) {
    lines.push(`- ${recommendation.runId}: ${recommendation.retentionClassification}`);
  }

  return lines.join('\n');
}

module.exports = {
  writesPiEvidenceDigest,
};
