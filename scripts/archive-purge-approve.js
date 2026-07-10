#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { LogMe } = require('../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../packages/logme-testimony-core/src/sample-method');
const { writesArchivePurgeApproval } = require('../src/approves-evidence-cleanup/approves-evidence-cleanup');

function parsesCliArguments(argv) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const options = { approvedBy: null };

  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--approved-by') {
      options.approvedBy = argv[index + 1];
      index += 1;
    }
  }

  return options;
}

function runsArchivePurgeApproveCli() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = path.join(__dirname, '..');
  const options = parsesCliArguments(process.argv.slice(2));

  if (!options.approvedBy) {
    process.stderr.write('usage: node scripts/archive-purge-approve.js --approved-by <name-or-email>\n');
    process.exitCode = 1;
    return;
  }

  const planPath = path.join(rootDir, 'evidence', 'cleanup', 'archive-purge-plan.v1.json');

  if (!fs.existsSync(planPath)) {
    process.stderr.write(`No archive purge plan found at ${planPath}. Run "npm run evidence:archive-purge-plan" first.\n`);
    process.exitCode = 1;
    return;
  }

  const planContent = fs.readFileSync(planPath, 'utf8');
  const archivePurgePlanHash = crypto.createHash('sha256').update(planContent, 'utf8').digest('hex');

  const { approvalPath, approval } = writesArchivePurgeApproval(rootDir, {
    approvedBy: options.approvedBy,
    cleanupPlanPath: 'evidence/cleanup/archive-purge-plan.v1.json',
    cleanupPlanHash: archivePurgePlanHash,
    approvedActions: ['purge'],
  });

  process.stdout.write(
    `Approved by ${approval.approvedBy} at ${approval.approvedAt}\n`
    + `Plan hash: ${approval.cleanupPlanHash}\n`
    + `Approval written to: ${approvalPath}\n`
    + 'Run "npm run evidence:archive-purge" to execute.\n',
  );
}

runsArchivePurgeApproveCli();
