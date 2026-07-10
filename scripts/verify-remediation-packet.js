#!/usr/bin/env node
const path = require('node:path');
const { runsVerificationWorker } = require('../src/runs-verification-worker/runs-verification-worker');

const runId = process.argv[2];
const packetId = process.argv[3];

if (!runId || !packetId) {
  process.stderr.write('usage: node scripts/verify-remediation-packet.js <run-id> <packet-id>\n');
  process.exitCode = 1;
} else {
  const { verificationReport, receipt } = runsVerificationWorker({ rootDir: path.join(__dirname, '..') }, runId, packetId);

  process.stdout.write(`Verification for ${packetId}: ${verificationReport.promotionDecision} -> ${receipt.reportRelativePath}\n`);
  process.exitCode = verificationReport.promotionDecision === 'PROMOTABLE' ? 0 : 1;
}
