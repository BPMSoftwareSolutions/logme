const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { plansEvidenceCleanup } = require('../plans-evidence-cleanup/plans-evidence-cleanup');

function writesEvidenceCleanupPlan(rootDir, catalog) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const plan = plansEvidenceCleanup(catalog);
  const planPath = path.join(rootDir, 'evidence', 'cleanup', 'evidence-cleanup-plan.v1.json');
  const reportPath = path.join(rootDir, 'evidence', 'cleanup', 'evidence-cleanup-plan.report.md');
  const planContent = `${JSON.stringify(plan, null, 2)}\n`;

  fs.mkdirSync(path.dirname(planPath), { recursive: true });
  fs.writeFileSync(planPath, planContent, 'utf8');
  fs.writeFileSync(reportPath, rendersCleanupPlanReport(plan), 'utf8');

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

function rendersCleanupPlanReport(plan) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    '# Evidence Cleanup Plan (Dry Run)',
    '',
    `Generated at: ${plan.generatedAt}`,
    '',
    'This is a dry run. No files were deleted, archived, or rewritten while generating this plan.',
    '',
    '| Run ID | Action | Approval Required | Bytes Reclaimable | Reason |',
    '| --- | --- | --- | --- | --- |',
  ];

  for (const entry of plan.entries) {
    lines.push(`| ${entry.runId} | ${entry.action} | ${entry.approvalRequired ? 'yes' : 'no'} | ${entry.bytesReclaimable} | ${entry.reason} |`);
  }

  if (plan.entries.length === 0) {
    lines.push('| _none_ | | | | |');
  }

  lines.push('');

  return lines.join('\n');
}

module.exports = {
  writesEvidenceCleanupPlan,
};
