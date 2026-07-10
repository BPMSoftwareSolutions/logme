#!/usr/bin/env node
const path = require('node:path');
const { LogMe } = require('../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../packages/logme-testimony-core/src/sample-method');
const { runsArchivePurgeWorker } = require('../src/runs-archive-purge-worker/runs-archive-purge-worker');

function parsesRetentionDaysArgument(argv) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const flagIndex = argv.indexOf('--retention-days');
  if (flagIndex === -1) {
    return undefined;
  }

  const days = Number.parseFloat(argv[flagIndex + 1]);
  return Number.isNaN(days) ? undefined : days * 24 * 60 * 60 * 1000;
}

function runsArchivePurgePlanCli() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  try {
    const archiveRetentionWindowMilliseconds = parsesRetentionDaysArgument(process.argv.slice(2));
    const result = runsArchivePurgeWorker(path.join(__dirname, '..'), { archiveRetentionWindowMilliseconds });

    const counts = { keep: 0, purge: 0, investigate: 0 };
    let bytesReclaimable = 0;
    for (const entry of result.plan.entries) {
      counts[entry.action] = (counts[entry.action] || 0) + 1;
      bytesReclaimable += entry.bytesReclaimable;
    }

    process.stdout.write(
      `Scanned ${result.archivedRuns.length} archived run(s).\n`
      + `Keep: ${counts.keep}, Purge: ${counts.purge}, Investigate: ${counts.investigate}\n`
      + `Bytes reclaimable if purged: ${bytesReclaimable}\n`
      + `Plan: ${result.planPath}\n`
      + `Report: ${result.reportPath}\n`,
    );
    process.exitCode = 0;
  } catch (error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}

runsArchivePurgePlanCli();
