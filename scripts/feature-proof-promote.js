#!/usr/bin/env node
const path = require('node:path');
const { LogMe } = require('../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../packages/logme-testimony-core/src/sample-method');
const { runsFeatureProofPromotion } = require('../src/runs-feature-proof-promotion/runs-feature-proof-promotion');

function readsFlagValue(argv, flagName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const index = argv.indexOf(flagName);
  return index === -1 ? undefined : argv[index + 1];
}

function runsFeatureProofPromoteCli() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const featureId = readsFlagValue(process.argv, '--feature');
  const runId = readsFlagValue(process.argv, '--run');
  const write = process.argv.includes('--write');

  if (!featureId || !runId) {
    process.stderr.write('usage: node scripts/feature-proof-promote.js --feature <feature-id> --run <run-id> [--write]\n');
    process.exitCode = 1;
    return;
  }

  const rootDir = path.join(__dirname, '..');
  const result = runsFeatureProofPromotion({ rootDir }, featureId, runId, { write });

  process.stdout.write(
    `${result.written ? 'wrote' : 'dry run of'} proof body at ${result.proofBodyPath}\n`
    + `promotion decision: ${result.body.promotionDecision}\n`
    + `proof body hash: ${result.bodyHash}\n`,
  );
}

runsFeatureProofPromoteCli();
