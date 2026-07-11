#!/usr/bin/env node
const { formatsReportTruthSummary, runsReportTruthCommand } = require('../src/report-truth/report-truth');

const fast = process.argv.includes('--fast');
const completeWorkspace = process.argv.includes('--complete-workspace');
const result = runsReportTruthCommand({
  writeEvidence: !fast,
  auditScope: completeWorkspace ? 'complete workspace audit' : 'source-domain audit',
});

process.stdout.write(`${formatsReportTruthSummary(result)}\n`);
process.exitCode = result.exitCode;
