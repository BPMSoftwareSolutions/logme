const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

function writesAdversarialReviewEvidence(config, runId, packetReview) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const reportRelativePath = `quality/domain-remediation/${runId}/review/${packetReview.packetId}.review.md`;
  const reportPath = path.join(config.rootDir, reportRelativePath);
  const reportContent = rendersAdversarialReviewReport(packetReview);

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, reportContent, 'utf8');

  return {
    reportPath,
    reportRelativePath,
    reportBytesWritten: Buffer.byteLength(reportContent, 'utf8'),
  };
}

function rendersAdversarialReviewReport(packetReview) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    `# Adversarial Review: ${packetReview.packetId}`,
    '',
    `Promotion verdict: ${packetReview.promotionVerdict}`,
    `High-risk objection count: ${packetReview.highRiskObjectionCount}`,
    '',
    '## Objections',
    '',
    ...rendersObjectionLines(packetReview.objections),
    '',
  ].join('\n');
}

function rendersObjectionLines(objections) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (objections.length === 0) {
    return ['_No objections raised._'];
  }

  const lines = [];
  for (const objection of objections) {
    lines.push(`- [${objection.severity}] ${objection.risk} (${objection.affectedPath}): ${objection.reasoning}`);
  }

  return lines;
}

module.exports = {
  rendersAdversarialReviewReport,
  writesAdversarialReviewEvidence,
};
