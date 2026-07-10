#!/usr/bin/env node
const path = require('node:path');
const { runsRemediationPlanner } = require('../src/runs-remediation-planner/runs-remediation-planner');

const runId = process.argv[2];

if (!runId) {
  process.stderr.write('usage: node scripts/remediation-plan.js <run-id>\n');
  process.exitCode = 1;
} else {
  const { backlog, receipt } = runsRemediationPlanner({ rootDir: path.join(__dirname, '..') }, runId);

  process.stdout.write(`Wrote ${backlog.backlogItems.length} backlog item(s) to ${receipt.evidencePath}\n`);
}
