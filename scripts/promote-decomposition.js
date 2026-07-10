#!/usr/bin/env node
const path = require('node:path');
const { LogMe } = require('../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../packages/logme-testimony-core/src/sample-method');
const { runsDecompositionPromotion } = require('../src/runs-decomposition-promotion/runs-decomposition-promotion');

function runsPromoteDecompositionCli(currentFilePath, entryMethodName, newBodyName, write) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const result = runsDecompositionPromotion({ rootDir: path.join(__dirname, '..') }, currentFilePath, entryMethodName, newBodyName, { write });

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
    `Decomposing ${result.movedMethodNames.length} method(s) around "${result.entryMethodName}" into ${result.newFileRelativePath}\n`
    + `Moved: ${result.movedMethodNames.join(', ')}\n`
    + `${editLines.join('\n')}\n`
    + (write ? 'Files WRITTEN.\n' : 'Dry run only -- pass --write to apply.\n'),
  );
}

const currentFilePath = process.argv[2];
const entryMethodName = process.argv[3];
const newBodyName = process.argv[4];
const write = process.argv.includes('--write');

if (!currentFilePath || !entryMethodName || !newBodyName) {
  process.stderr.write('usage: node scripts/promote-decomposition.js <file-path> <entry-method-name> <new-body-name> [--write]\n');
  process.exitCode = 1;
} else {
  runsPromoteDecompositionCli(currentFilePath, entryMethodName, newBodyName, write);
}
