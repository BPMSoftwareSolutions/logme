#!/usr/bin/env node
const path = require('node:path');
const { LogMe } = require('../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../packages/logme-testimony-core/src/sample-method');
const { runsEvidenceCurationWorker } = require('../src/runs-evidence-curation-worker/runs-evidence-curation-worker');

function runsEvidenceCurationCli() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  try {
    const result = runsEvidenceCurationWorker(path.join(__dirname, '..'));

    process.stdout.write(
      `Cataloged ${result.catalog.runCount} evidence run(s).\n`
      + `Latest evidence report: ${result.latestEvidenceReportPath}\n`
      + `Feature evidence index: ${result.featureIndexPath}\n`
      + `Cleanup plan: ${result.planPath}\n`
      + `Noisy evidence findings: ${result.noisyFindings.length}\n`
      + `Sprawl budget gate: ${result.sprawlGateResult.verdict}\n`,
    );
    process.exitCode = result.sprawlGateResult.verdict === 'FAIL' ? 1 : 0;
  } catch (error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}

runsEvidenceCurationCli();
