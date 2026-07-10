#!/usr/bin/env node
const path = require('node:path');
const { LogMe } = require('../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../packages/logme-testimony-core/src/sample-method');
const { runsDecompositionPromotion, runsFullFileDecompositionPromotion } = require('../src/runs-decomposition-promotion/runs-decomposition-promotion');

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

async function runsPromoteFullDecompositionCli(currentFilePath, write) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  try {
    const result = await runsFullFileDecompositionPromotion({ rootDir: path.join(__dirname, '..') }, currentFilePath, { write });

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
      `Decomposing ${currentFilePath} into ${result.fileEdits.length} file(s)\n`
      + `${editLines.join('\n')}\n`
      + (write ? 'Files WRITTEN.\n' : 'Dry run only -- pass --write to apply.\n'),
    );
  } catch (error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}

const currentFilePath = process.argv[2];
const isFullMode = process.argv.includes('--full');
const write = process.argv.includes('--write');

if (!currentFilePath) {
  process.stderr.write('usage: node scripts/promote-decomposition.js <file-path> <entry-method-name> <new-body-name> [--write]\n');
  process.stderr.write('   or: node scripts/promote-decomposition.js <file-path> --full [--write]\n');
  process.exitCode = 1;
} else if (isFullMode) {
  runsPromoteFullDecompositionCli(currentFilePath, write);
} else {
  const entryMethodName = process.argv[3];
  const newBodyName = process.argv[4];

  if (!entryMethodName || !newBodyName) {
    process.stderr.write('usage: node scripts/promote-decomposition.js <file-path> <entry-method-name> <new-body-name> [--write]\n');
    process.exitCode = 1;
  } else {
    runsPromoteDecompositionCli(currentFilePath, entryMethodName, newBodyName, write);
  }
}
