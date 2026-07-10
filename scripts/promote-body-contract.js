#!/usr/bin/env node
const path = require('node:path');
const { LogMe } = require('../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../packages/logme-testimony-core/src/sample-method');
const { runsBodyContractPromotion } = require('../src/runs-body-contract-promotion/runs-body-contract-promotion');

function runsPromoteBodyContractCli(runId, write) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const result = runsBodyContractPromotion({ rootDir: path.join(__dirname, '..') }, runId, { write });

  const promotedLines = [];
  for (const promotedPath of result.promotedPaths) {
    promotedLines.push(`  + ${promotedPath}`);
  }

  const skippedLines = [];
  for (const skippedEntry of result.skippedEntries) {
    skippedLines.push(`  - ${skippedEntry.path}: ${skippedEntry.reason}`);
  }

  process.stdout.write(
    `Promoted ${result.promotedPaths.length} path(s) into ${result.declaredContractPath}\n`
    + `${promotedLines.join('\n')}\n`
    + `Skipped ${result.skippedEntries.length} entry(ies)\n`
    + `${skippedLines.join('\n')}\n`
    + (write ? 'Contract file WRITTEN.\n' : 'Dry run only -- pass --write to apply.\n'),
  );
}

const runId = process.argv[2];
const write = process.argv.includes('--write');

if (!runId) {
  process.stderr.write('usage: node scripts/promote-body-contract.js <run-id> [--write]\n');
  process.exitCode = 1;
} else {
  runsPromoteBodyContractCli(runId, write);
}
