#!/usr/bin/env node
const path = require('node:path');
const { runsAdversarialReviewWorker } = require('../src/runs-adversarial-review-worker/runs-adversarial-review-worker');

const runId = process.argv[2];

if (!runId) {
  process.stderr.write('usage: node scripts/adversarial-review.js <run-id>\n');
  process.exitCode = 1;
} else {
  const { packetReviews } = runsAdversarialReviewWorker({ rootDir: path.join(__dirname, '..') }, runId);

  let blockedCount = 0;
  for (const { packetReview, receipt } of packetReviews) {
    process.stdout.write(`${packetReview.packetId}: ${packetReview.promotionVerdict} (${packetReview.highRiskObjectionCount} high-risk objection(s)) -> ${receipt.reportRelativePath}\n`);
    if (packetReview.promotionVerdict === 'BLOCKED') {
      blockedCount += 1;
    }
  }

  process.exitCode = blockedCount > 0 ? 1 : 0;
}
