#!/usr/bin/env node
const path = require('node:path');
const { runsDomainCartographer } = require('../src/runs-domain-cartographer/runs-domain-cartographer');
const { runsCallWithTelemetryWindow, startsScenarioProofRun, writesCliRunScenarioProof } = require('../src/writes-cli-run-scenario-proof/writes-cli-run-scenario-proof');

const runId = process.argv[2];

if (!runId) {
  process.stderr.write('usage: node scripts/domain-cartography.js <run-id>\n');
  process.exitCode = 1;
} else {
  const rootDir = path.join(__dirname, '..');
  const { capturedEvents, runStartedAt } = startsScenarioProofRun();

  runsCallWithTelemetryWindow(capturedEvents, () => runsDomainCartographer({ rootDir }, runId)).then((windowResult) => {
    const { domainMap, receipt } = windowResult.workResult;

    process.stdout.write(`Mapped ${domainMap.summary.totalFilesMapped} file(s) (${domainMap.summary.ambiguousFileCount} ambiguous) to ${receipt.evidencePath}\n`);

    if (process.env.LOGME_AUDIT === '1') {
      const evidenceRelativePath = path.relative(rootDir, receipt.evidencePath).replace(/\\/gu, '/');
      const reportRelativePath = path.relative(rootDir, receipt.reportPath).replace(/\\/gu, '/');

      const { packetPath } = writesCliRunScenarioProof({
        rootDir,
        runId,
        featureId: 'llm-domain-remediation',
        featureDocPath: 'docs/features/llm-domain-remediation.feature.md',
        scenarioId: 'map-executable-bodies-before-changing-implementation',
        scenarioName: 'Map executable bodies before changing implementation',
        acceptanceLineRange: { start: 59, end: 78 },
        nodeWindows: [
          {
            nodeId: '01',
            nodeLabel: 'RUNS DOMAIN CARTOGRAPHER (MAPS EVERY EXECUTABLE FILE)',
            runtimePath: 'src/runs-domain-cartographer/runs-domain-cartographer.js',
            sourceLineRange: { start: 8, end: 18 },
            windowResult,
            requiredReceiptPaths: [evidenceRelativePath, reportRelativePath],
          },
        ],
        capturedEvents,
        runStartedAt,
        runEndedAt: windowResult.windowEndedAt,
        receiptSourcePaths: [evidenceRelativePath, reportRelativePath],
      });

      process.stderr.write(`[feature-execution-proof] wrote ${packetPath}\n`);
    }
  }).catch((error) => {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  });
}
