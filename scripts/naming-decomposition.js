#!/usr/bin/env node
const path = require('node:path');
const { LogMe } = require('../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../packages/logme-testimony-core/src/sample-method');
const { runsNamingDecompositionWorker } = require('../src/runs-naming-decomposition-worker/runs-naming-decomposition-worker');

async function runsNamingDecompositionCli(runId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  try {
    const { renamePlan, renamePlanReceipt, decompositionPlan, decompositionPlanReceipt } = await runsNamingDecompositionWorker(
      { rootDir: path.join(__dirname, '..') },
      runId,
    );

    process.stdout.write(
      `Proposed ${renamePlan.summary.totalCandidates} rename entry(ies) `
      + `(${renamePlan.summary.resolvedEntries} resolved, ${renamePlan.summary.unresolvedEntries} unresolved) `
      + `to ${renamePlanReceipt.evidencePath}\n`
      + `Proposed ${decompositionPlan.summary.totalCandidates} decomposition section(s) `
      + `to ${decompositionPlanReceipt.reportPath}\n`,
    );
  } catch (error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}

const runId = process.argv[2];

if (!runId) {
  process.stderr.write('usage: node scripts/naming-decomposition.js <run-id>\n');
  process.exitCode = 1;
} else {
  runsNamingDecompositionCli(runId);
}
