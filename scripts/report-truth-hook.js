#!/usr/bin/env node
const { buildsReportTruthHookMessage, runsReportTruthCommand } = require('../src/report-truth/report-truth');

const result = runsReportTruthCommand({ writeEvidence: false });

if (result.exitCode !== 0) {
  process.stderr.write(`${buildsReportTruthHookMessage(result)}\n`);
  process.exitCode = result.exitCode;
}
