#!/usr/bin/env node
const path = require('node:path');
const { runsRemediationPlanner } = require('../src/runs-remediation-planner/runs-remediation-planner');
const { runsCallWithTelemetryWindow, startsScenarioProofRun, writesCliRunScenarioProof } = require('../src/writes-cli-run-scenario-proof/writes-cli-run-scenario-proof');

const runId = process.argv[2];

if (!runId) {
  process.stderr.write('usage: node scripts/remediation-plan.js <run-id>\n');
  process.exitCode = 1;
} else {
  const rootDir = path.join(__dirname, '..');
  const { capturedEvents, runStartedAt } = startsScenarioProofRun();

  runsCallWithTelemetryWindow(capturedEvents, () => runsRemediationPlanner({ rootDir }, runId)).then((windowResult) => {
    const { backlog, receipt } = windowResult.workResult;

    process.stdout.write(`Wrote ${backlog.backlogItems.length} backlog item(s) to ${receipt.evidencePath}\n`);

    if (process.env.LOGME_AUDIT === '1') {
      const backlogEvidenceRelativePath = path.relative(rootDir, receipt.evidencePath).replace(/\\/gu, '/');

      const { packetPath } = writesCliRunScenarioProof({
        rootDir,
        runId,
        featureId: 'llm-domain-remediation',
        featureDocPath: 'docs/features/llm-domain-remediation.feature.md',
        scenarioId: 'create-a-remediation-backlog-from-a-frozen-evidence-run',
        scenarioName: 'Create a remediation backlog from a frozen evidence run',
        acceptanceLineRange: { start: 19, end: 41 },
        nodeWindows: [
          {
            nodeId: '01',
            nodeLabel: 'RUNS REMEDIATION PLANNER (BACKLOG FROM FROZEN EVIDENCE)',
            runtimePath: 'src/runs-remediation-planner/runs-remediation-planner.js',
            sourceLineRange: { start: 8, end: 18 },
            windowResult,
            requiredReceiptPaths: [backlogEvidenceRelativePath],
          },
        ],
        capturedEvents,
        runStartedAt,
        runEndedAt: windowResult.windowEndedAt,
        receiptSourcePaths: [backlogEvidenceRelativePath],
      });

      process.stderr.write(`[feature-execution-proof] wrote ${packetPath}\n`);
    }
  }).catch((error) => {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  });
}
