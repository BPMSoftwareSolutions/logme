#!/usr/bin/env node
const path = require('node:path');
const { LogMe } = require('../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../packages/logme-testimony-core/src/sample-method');
const { runsScenarioTieOutWorker } = require('../src/runs-scenario-tieout-worker/runs-scenario-tieout-worker');

async function runsScenarioTieOutCli(runId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  try {
    const { tieOutProposal, receipt, gateResult } = await runsScenarioTieOutWorker({ rootDir: path.join(__dirname, '..') }, runId);

    process.stdout.write(
      `Proposed ${tieOutProposal.summary.totalCandidates} tie-out(s) `
      + `(${tieOutProposal.summary.supportedMappings} supported, ${tieOutProposal.summary.unsupportedMappings} unsupported) `
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
  process.stderr.write('usage: node scripts/scenario-tieout.js <run-id>\n');
  process.exitCode = 1;
} else {
  runsScenarioTieOutCli(runId);
}
