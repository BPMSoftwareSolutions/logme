#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { LogMe } = require('../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../packages/logme-testimony-core/src/sample-method');
const { executesArchivePurge } = require('../src/executes-archive-purge/executes-archive-purge');

function runsArchivePurgeExecuteCli() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = path.join(__dirname, '..');
  const planPath = path.join(rootDir, 'evidence', 'cleanup', 'archive-purge-plan.v1.json');
  const approvalPath = path.join(rootDir, 'evidence', 'cleanup', 'archive-purge-approval.v1.json');

  if (!fs.existsSync(planPath)) {
    process.stderr.write(`No archive purge plan found at ${planPath}. Run "npm run evidence:archive-purge-plan" first.\n`);
    process.exitCode = 1;
    return;
  }

  const planContent = fs.readFileSync(planPath, 'utf8');
  const planHash = crypto.createHash('sha256').update(planContent, 'utf8').digest('hex');
  const plan = JSON.parse(planContent);
  const approvalRecord = fs.existsSync(approvalPath) ? JSON.parse(fs.readFileSync(approvalPath, 'utf8')) : null;

  const result = executesArchivePurge(rootDir, plan, planHash, approvalRecord);

  if (result.verdict === 'ADVISORY_ONLY') {
    process.stdout.write(
      'Archive purge remains advisory only -- a deterministic gate did not pass:\n'
      + `Approval check: ${result.approvalResult.verdict}${result.approvalResult.reason ? ` (${result.approvalResult.reason})` : ''}\n`
      + 'Run "npm run evidence:archive-purge-approve -- --approved-by <name>" first.\n',
    );
    process.exitCode = 1;
    return;
  }

  process.stdout.write(
    'Archive purge executed.\n'
    + `Kept: ${result.executionResult.keptRuns.length}\n`
    + `Purged: ${result.executionResult.purgedRuns.length}\n`
    + `Blocked actions: ${result.executionResult.blockedActions.length}\n`
    + `Bytes reclaimed: ${result.executionResult.bytesReclaimed}\n`
    + `Errors: ${result.executionResult.errors.length}\n`
    + `Receipt: ${result.receiptPath}\n`,
  );
  process.exitCode = result.executionResult.errors.length > 0 ? 1 : 0;
}

runsArchivePurgeExecuteCli();
