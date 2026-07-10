#!/usr/bin/env node
const path = require('node:path');
const { LogMe } = require('../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../packages/logme-testimony-core/src/sample-method');
const { runsContractStewardWorker } = require('../src/runs-contract-steward-worker/runs-contract-steward-worker');

async function runsContractStewardCli(runId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  try {
    const { bodyContractPatch, receipt, gateResult } = await runsContractStewardWorker({ rootDir: path.join(__dirname, '..') }, runId);

    process.stdout.write(
      `Proposed ${bodyContractPatch.summary.totalCandidates} contract entry(ies) `
      + `(${bodyContractPatch.summary.resolvedEntries} resolved, ${bodyContractPatch.summary.unresolvedEntries} unresolved) `
      + `to ${receipt.evidencePath}\n`
      + `Promotion gate: ${gateResult.verdict}\n`,
    );
    process.exitCode = gateResult.verdict === 'PASS' ? 0 : 1;
  } catch (error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}

const runId = process.argv[2];

if (!runId) {
  process.stderr.write('usage: node scripts/contract-steward.js <run-id>\n');
  process.exitCode = 1;
} else {
  runsContractStewardCli(runId);
}
