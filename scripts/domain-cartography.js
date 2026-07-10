#!/usr/bin/env node
const path = require('node:path');
const { runsDomainCartographer } = require('../src/runs-domain-cartographer/runs-domain-cartographer');

const runId = process.argv[2];

if (!runId) {
  process.stderr.write('usage: node scripts/domain-cartography.js <run-id>\n');
  process.exitCode = 1;
} else {
  const { domainMap, receipt } = runsDomainCartographer({ rootDir: path.join(__dirname, '..') }, runId);

  process.stdout.write(`Mapped ${domainMap.summary.totalFilesMapped} file(s) (${domainMap.summary.ambiguousFileCount} ambiguous) to ${receipt.evidencePath}\n`);
}
