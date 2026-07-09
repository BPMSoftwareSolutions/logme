#!/usr/bin/env node
const { formatsReportTruthSummary, runsReportTruthCommand } = require('../src/report-truth/report-truth');

const fast = process.argv.includes('--fast');
const result = runsReportTruthCommand({ writeEvidence: !fast });

process.stdout.write(`${formatsReportTruthSummary(result)}\n`);
process.exitCode = result.exitCode;
