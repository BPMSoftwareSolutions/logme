const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { plansArchivePurge } = require('../plans-archive-purge/plans-archive-purge');

function writesArchivePurgePlan(rootDir, archivedRuns, referenceContext) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const plan = plansArchivePurge(archivedRuns, referenceContext);
  const planPath = path.join(rootDir, 'evidence', 'cleanup', 'archive-purge-plan.v1.json');
  const reportPath = path.join(rootDir, 'evidence', 'cleanup', 'archive-purge-plan.report.md');
  const planContent = `${JSON.stringify(plan, null, 2)}\n`;

  fs.mkdirSync(path.dirname(planPath), { recursive: true });
  fs.writeFileSync(planPath, planContent, 'utf8');
  fs.writeFileSync(reportPath, rendersArchivePurgePlanReport(plan), 'utf8');

  return {
    planPath,
    reportPath,
    plan,
    planHash: hashesPlanContent(planContent),
  };
}

function hashesPlanContent(planContent) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return crypto.createHash('sha256').update(planContent, 'utf8').digest('hex');
}

function rendersArchivePurgePlanReport(plan) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    '# Archive Purge Plan (Dry Run)',
    '',
    `Generated at: ${plan.generatedAt}`,
    '',
    'This is a dry run. No archived files were deleted while generating this plan.',
    '',
    '| Run ID | Year | Action | Approval Required | Bytes Reclaimable | Archived At | Reason |',
    '| --- | --- | --- | --- | --- | --- | --- |',
  ];

  for (const entry of plan.entries) {
    lines.push(`| ${entry.runId} | ${entry.year} | ${entry.action} | ${entry.approvalRequired ? 'yes' : 'no'} | ${entry.bytesReclaimable} | ${entry.archivedAt || '-'} | ${entry.reason} |`);
  }

  if (plan.entries.length === 0) {
    lines.push('| _none_ | | | | | | |');
  }

  lines.push('');

  return lines.join('\n');
}

module.exports = {
  writesArchivePurgePlan,
};
