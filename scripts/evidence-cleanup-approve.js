#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { LogMe } = require('../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../packages/logme-testimony-core/src/sample-method');
const { writesEvidenceCleanupApproval } = require('../src/approves-evidence-cleanup/approves-evidence-cleanup');

function parsesCliArguments(argv) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const options = { approvedBy: null, actions: [] };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === '--approved-by') {
      options.approvedBy = argv[index + 1];
      index += 1;
    } else if (argument === '--actions') {
      options.actions = trimsActionList(argv[index + 1]);
      index += 1;
    }
  }

  return options;
}

function trimsActionList(rawActions) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const trimmedActions = [];
  for (const action of rawActions.split(',')) {
    trimmedActions.push(action.trim());
  }

  return trimmedActions;
}

function runsEvidenceCleanupApproveCli() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = path.join(__dirname, '..');
  const options = parsesCliArguments(process.argv.slice(2));

  if (!options.approvedBy || options.actions.length === 0) {
    process.stderr.write('usage: node scripts/evidence-cleanup-approve.js --approved-by <name-or-email> --actions archive,delete\n');
    process.exitCode = 1;
    return;
  }

  const planPath = path.join(rootDir, 'evidence', 'cleanup', 'evidence-cleanup-plan.v1.json');

  if (!fs.existsSync(planPath)) {
    process.stderr.write(`No cleanup plan found at ${planPath}. Run "npm run evidence:curate" first.\n`);
    process.exitCode = 1;
    return;
  }

  const planContent = fs.readFileSync(planPath, 'utf8');
  const cleanupPlanHash = crypto.createHash('sha256').update(planContent, 'utf8').digest('hex');

  const { approvalPath, approval } = writesEvidenceCleanupApproval(rootDir, {
    approvedBy: options.approvedBy,
    cleanupPlanPath: 'evidence/cleanup/evidence-cleanup-plan.v1.json',
    cleanupPlanHash,
    approvedActions: options.actions,
  });

  process.stdout.write(
    `Approved by ${approval.approvedBy} at ${approval.approvedAt}\n`
    + `Actions: ${approval.approvedActions.join(', ')}\n`
    + `Plan hash: ${approval.cleanupPlanHash}\n`
    + `Approval written to: ${approvalPath}\n`
    + 'Run "npm run evidence:cleanup" to execute.\n',
  );
}

runsEvidenceCleanupApproveCli();
