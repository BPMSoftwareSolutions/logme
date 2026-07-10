#!/usr/bin/env node
const path = require('node:path');
const { LogMe } = require('../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../packages/logme-testimony-core/src/sample-method');
const { runsPackageExtractionWorker } = require('../src/runs-package-extraction-worker/runs-package-extraction-worker');

async function runsPackageExtractionCli(runId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  try {
    const { packageExtractionPlan, receipt } = await runsPackageExtractionWorker({ rootDir: path.join(__dirname, '..') }, runId);

    process.stdout.write(
      `Proposed ${packageExtractionPlan.summary.totalCandidates} package extraction section(s) `
      + `(${packageExtractionPlan.summary.resolvedSections} resolved, ${packageExtractionPlan.summary.unresolvedSections} unresolved) `
      + `to ${receipt.reportPath}\n`,
    );
  } catch (error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}

const runId = process.argv[2];

if (!runId) {
  process.stderr.write('usage: node scripts/package-extraction.js <run-id>\n');
  process.exitCode = 1;
} else {
  runsPackageExtractionCli(runId);
}
