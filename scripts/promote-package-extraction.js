#!/usr/bin/env node
const path = require('node:path');
const { LogMe } = require('../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../packages/logme-testimony-core/src/sample-method');
const { runsPackageExtractionPromotion } = require('../src/runs-package-extraction-promotion/runs-package-extraction-promotion');

function runsPromotePackageExtractionCli(runId, methodName, write) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const result = runsPackageExtractionPromotion({ rootDir: path.join(__dirname, '..') }, runId, methodName, { write });

  if (!result.promotable) {
    process.stdout.write(`Not promotable: ${result.reason}\n`);
    process.exitCode = 1;
    return;
  }

  const editLines = [];
  for (const fileEdit of result.fileEdits) {
    editLines.push(`  ${fileEdit.kind}: ${fileEdit.filePath}`);
  }

  process.stdout.write(
    `Promoting "${result.methodName}" to ${result.targetPackage} (${result.packageFileRelativePath})\n`
    + `${editLines.join('\n')}\n`
    + (write ? 'Files WRITTEN.\n' : 'Dry run only -- pass --write to apply.\n'),
  );
}

const runId = process.argv[2];
const methodName = process.argv[3];
const write = process.argv.includes('--write');

if (!runId || !methodName) {
  process.stderr.write('usage: node scripts/promote-package-extraction.js <run-id> <method-name> [--write]\n');
  process.exitCode = 1;
} else {
  runsPromotePackageExtractionCli(runId, methodName, write);
}
