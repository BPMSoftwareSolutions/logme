const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const NOISY_FINDING_CODE = 'evidence-run-too-noisy-for-product-review';
const NOISY_ARTIFACT_COUNT_THRESHOLD = 25;
const RECOMMENDED_FIXES = [
  'create compact human report',
  'connect evidence to feature and scenario',
  'connect evidence to PI digest',
  'archive as low-value historical evidence',
  'delete after approval',
];

function detectsNoisyEvidenceRuns(runs, tieOutContext) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const findings = [];
  for (const run of runs) {
    const finding = detectsSingleRunNoise(run, tieOutContext);
    if (finding) {
      findings.push(finding);
    }
  }

  return findings;
}

function detectsSingleRunNoise(run, tieOutContext) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!hasCompactProductSummary(run, tieOutContext) && run.artifactCount >= NOISY_ARTIFACT_COUNT_THRESHOLD) {
    return {
      runId: run.runId,
      finding: NOISY_FINDING_CODE,
      artifactCount: run.artifactCount,
      recommendedFixes: RECOMMENDED_FIXES,
      reason: 'run has many low-level artifacts but no compact report, feature index, PI digest, or latest evidence summary reference',
    };
  }

  return null;
}

function hasCompactProductSummary(run, tieOutContext) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return hasCompactReportArtifact(run)
    || tieOutContext.featureIndexedRunIds.has(run.runId)
    || tieOutContext.piDigestRunIds.has(run.runId)
    || tieOutContext.latestEvidenceRunIds.has(run.runId);
}

function hasCompactReportArtifact(run) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return run.artifactPaths.some(isCompactReportPath);
}

function isCompactReportPath(artifactPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return artifactPath.endsWith('.report.md');
}

module.exports = {
  NOISY_FINDING_CODE,
  NOISY_ARTIFACT_COUNT_THRESHOLD,
  RECOMMENDED_FIXES,
  detectsNoisyEvidenceRuns,
};
