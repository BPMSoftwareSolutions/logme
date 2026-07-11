#!/usr/bin/env node
const crypto = require('node:crypto');
const path = require('node:path');
const { LogMe } = require('../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../packages/logme-testimony-core/src/sample-method');
const { runsEvidenceCurationWorker } = require('../src/runs-evidence-curation-worker/runs-evidence-curation-worker');
const {
  capturesRealTelemetryForRealInvocation,
  buildsTelemetryEventsFromCapturedStream,
  writesRealTelemetryEventLog,
  emitsFeatureExecutionProofFromRealRun,
} = require('../src/emits-feature-execution-proof-from-real-run/emits-feature-execution-proof-from-real-run');

function parsesKeepRecentDaysArgument(argv) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const flagIndex = argv.indexOf('--keep-recent-days');
  if (flagIndex === -1) {
    return undefined;
  }

  const days = Number.parseFloat(argv[flagIndex + 1]);
  return Number.isNaN(days) ? undefined : days * 24 * 60 * 60 * 1000;
}

function parsesRunIdArgument(argv) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const flagIndex = argv.indexOf('--run-id');
  if (flagIndex === -1) {
    return `evidence-curate-${crypto.randomBytes(8).toString('hex')}`;
  }

  return argv[flagIndex + 1];
}

async function runsEvidenceCurationCli() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  try {
    const rootDir = path.join(__dirname, '..');
    const keepRecentWindowMilliseconds = parsesKeepRecentDaysArgument(process.argv.slice(2));
    const runStartedAt = new Date();
    const result = runsEvidenceCurationWorker(rootDir, { keepRecentWindowMilliseconds });
    const runFinishedAt = new Date();

    process.stdout.write(
      `Cataloged ${result.catalog.runCount} evidence run(s).\n`
      + `Latest evidence report: ${result.latestEvidenceReportPath}\n`
      + `Feature evidence index: ${result.featureIndexPath}\n`
      + `Cleanup plan: ${result.planPath}\n`
      + `Noisy evidence findings: ${result.noisyFindings.length}\n`
      + `Sprawl budget gate: ${result.sprawlGateResult.verdict}\n`,
    );
    process.exitCode = result.sprawlGateResult.verdict === 'FAIL' ? 1 : 0;

    if (process.env.EVIDENCE_PROOF_CAPTURE_CHILD !== '1' && process.env.EVIDENCE_CURATION_SKIP_PROOF !== '1') {
      await emitsFeatureExecutionProofForRealCurationRun(rootDir, result, runStartedAt, runFinishedAt, process.argv.slice(2));
    }
  } catch (error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}

async function emitsFeatureExecutionProofForRealCurationRun(rootDir, result, runStartedAt, runFinishedAt, cliArgs) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const runId = parsesRunIdArgument(cliArgs);
  const childArgs = [...cliArgs, '--run-id', runId];
  const captured = await capturesRealTelemetryForRealInvocation(
    path.join(__dirname, 'evidence-curation.js'),
    childArgs,
  );
  writesRealTelemetryEventLog(rootDir, runId, captured.telemetryEvents);

  writesInventoryScenarioProof(rootDir, runId, result, runStartedAt, runFinishedAt, captured);
  writesLatestEvidenceScenarioProof(rootDir, runId, result, runStartedAt, runFinishedAt, captured);
  writesFeatureTieOutScenarioProof(rootDir, runId, result, runStartedAt, runFinishedAt, captured);
  writesCleanupPlanScenarioProof(rootDir, runId, result, runStartedAt, runFinishedAt, captured);
  writesNoisyEvidenceScenarioProof(rootDir, runId, result, runStartedAt, runFinishedAt, captured);
  writesSprawlBudgetScenarioProof(rootDir, runId, result, runStartedAt, runFinishedAt, captured);

  process.stdout.write(`Feature execution proof emitted for run id: ${runId}\n`);
}

function writesInventoryScenarioProof(rootDir, runId, result, runStartedAt, runFinishedAt, captured) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const declaredExecutableBody = [
    {
      nodeId: '01',
      nodeLabel: 'SCAN EVIDENCE RUNS',
      runtimePath: 'src/scans-evidence-runs/scans-evidence-runs.js',
      sourceLineRange: { start: 8, end: 22 },
      requiredReceiptPaths: [path.relative(rootDir, path.join(rootDir, 'evidence/index/evidence-catalog.v1.json')).split(path.sep).join('/')],
    },
    {
      nodeId: '02',
      nodeLabel: 'WRITE EVIDENCE CATALOG',
      runtimePath: 'src/writes-evidence-catalog/writes-evidence-catalog.js',
      sourceLineRange: { start: 14, end: 36 },
      requiredReceiptPaths: [path.relative(rootDir, path.join(rootDir, 'evidence/index/evidence-catalog.v1.json')).split(path.sep).join('/')],
    },
  ];
  const telemetryEventPath = path.relative(rootDir, path.join(rootDir, 'evidence/runs', runId, 'telemetry.events.v1.jsonl')).split(path.sep).join('/');
  const telemetryEvents = buildsTelemetryEventsFromCapturedStream(declaredExecutableBody, captured.telemetryEvents, telemetryEventPath);

  emitsFeatureExecutionProofFromRealRun({
    rootDir,
    runId,
    featureId: 'llm-evidence-curation-and-cleanup',
    scenarioId: 'inventory-evidence-runs-without-deleting-anything',
    scenarioName: 'Inventory evidence runs without deleting anything',
    acceptanceSource: { path: 'docs/features/llm-evidence-curation-and-cleanup.feature.md', lineRange: { start: 19, end: 43 } },
    declaredExecutableBody,
    runStartedAt: runStartedAt.toISOString(),
    receiptWrittenAt: runFinishedAt.toISOString(),
    telemetryEvents,
    receiptSourcePaths: [path.relative(rootDir, result.catalog ? path.join(rootDir, 'evidence/index/evidence-catalog.v1.json') : '').split(path.sep).join('/')],
  });
}

function writesLatestEvidenceScenarioProof(rootDir, runId, result, runStartedAt, runFinishedAt, captured) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const declaredExecutableBody = [
    {
      nodeId: '01',
      nodeLabel: 'SELECT LATEST MEANINGFUL EVIDENCE',
      runtimePath: 'src/selects-latest-meaningful-evidence/selects-latest-meaningful-evidence.js',
      sourceLineRange: { start: 6, end: 24 },
      requiredReceiptPaths: [path.relative(rootDir, path.join(rootDir, result.latestEvidenceReportPath)).split(path.sep).join('/')],
    },
    {
      nodeId: '02',
      nodeLabel: 'WRITE LATEST EVIDENCE REPORT',
      runtimePath: 'src/writes-latest-evidence-report/writes-latest-evidence-report.js',
      sourceLineRange: { start: 8, end: 23 },
      requiredReceiptPaths: [path.relative(rootDir, path.join(rootDir, result.latestEvidenceReportPath)).split(path.sep).join('/')],
    },
  ];
  const telemetryEventPath = path.relative(rootDir, path.join(rootDir, 'evidence/runs', runId, 'telemetry.events.v1.jsonl')).split(path.sep).join('/');
  const telemetryEvents = buildsTelemetryEventsFromCapturedStream(declaredExecutableBody, captured.telemetryEvents, telemetryEventPath);

  emitsFeatureExecutionProofFromRealRun({
    rootDir,
    runId,
    featureId: 'llm-evidence-curation-and-cleanup',
    scenarioId: 'produce-a-product-owner-latest-evidence-surface',
    scenarioName: 'Produce a product-owner latest evidence surface',
    acceptanceSource: { path: 'docs/features/llm-evidence-curation-and-cleanup.feature.md', lineRange: { start: 45, end: 62 } },
    declaredExecutableBody,
    runStartedAt: runStartedAt.toISOString(),
    receiptWrittenAt: runFinishedAt.toISOString(),
    telemetryEvents,
    receiptSourcePaths: [path.relative(rootDir, path.join(rootDir, result.latestEvidenceReportPath)).split(path.sep).join('/')],
  });
}

function writesFeatureTieOutScenarioProof(rootDir, runId, result, runStartedAt, runFinishedAt, captured) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const declaredExecutableBody = [
    {
      nodeId: '01',
      nodeLabel: 'BUILD FEATURE EVIDENCE INDEX',
      runtimePath: 'src/builds-feature-evidence-index/builds-feature-evidence-index.js',
      sourceLineRange: { start: 7, end: 24 },
      requiredReceiptPaths: [path.relative(rootDir, path.join(rootDir, result.featureIndexPath)).split(path.sep).join('/')],
    },
    {
      nodeId: '02',
      nodeLabel: 'WRITE FEATURE EVIDENCE INDEX',
      runtimePath: 'src/writes-feature-evidence-index/writes-feature-evidence-index.js',
      sourceLineRange: { start: 7, end: 19 },
      requiredReceiptPaths: [path.relative(rootDir, path.join(rootDir, result.featureIndexPath)).split(path.sep).join('/')],
    },
  ];
  const telemetryEventPath = path.relative(rootDir, path.join(rootDir, 'evidence/runs', runId, 'telemetry.events.v1.jsonl')).split(path.sep).join('/');
  const telemetryEvents = buildsTelemetryEventsFromCapturedStream(declaredExecutableBody, captured.telemetryEvents, telemetryEventPath);

  emitsFeatureExecutionProofFromRealRun({
    rootDir,
    runId,
    featureId: 'llm-evidence-curation-and-cleanup',
    scenarioId: 'connect-evidence-to-feature-and-scenario-ownership',
    scenarioName: 'Connect evidence to feature and scenario ownership',
    acceptanceSource: { path: 'docs/features/llm-evidence-curation-and-cleanup.feature.md', lineRange: { start: 64, end: 85 } },
    declaredExecutableBody,
    runStartedAt: runStartedAt.toISOString(),
    receiptWrittenAt: runFinishedAt.toISOString(),
    telemetryEvents,
    receiptSourcePaths: [path.relative(rootDir, path.join(rootDir, result.featureIndexPath)).split(path.sep).join('/')],
  });
}

function writesCleanupPlanScenarioProof(rootDir, runId, result, runStartedAt, runFinishedAt, captured) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const declaredExecutableBody = [
    {
      nodeId: '01',
      nodeLabel: 'PLAN EVIDENCE CLEANUP',
      runtimePath: 'src/plans-evidence-cleanup/plans-evidence-cleanup.js',
      sourceLineRange: { start: 27, end: 39 },
      requiredReceiptPaths: [path.relative(rootDir, path.join(rootDir, result.planPath)).split(path.sep).join('/')],
    },
    {
      nodeId: '02',
      nodeLabel: 'WRITE EVIDENCE CLEANUP PLAN',
      runtimePath: 'src/writes-evidence-cleanup-plan/writes-evidence-cleanup-plan.js',
      sourceLineRange: { start: 8, end: 28 },
      requiredReceiptPaths: [path.relative(rootDir, path.join(rootDir, result.planPath)).split(path.sep).join('/')],
    },
  ];
  const telemetryEventPath = path.relative(rootDir, path.join(rootDir, 'evidence/runs', runId, 'telemetry.events.v1.jsonl')).split(path.sep).join('/');
  const telemetryEvents = buildsTelemetryEventsFromCapturedStream(declaredExecutableBody, captured.telemetryEvents, telemetryEventPath);

  emitsFeatureExecutionProofFromRealRun({
    rootDir,
    runId,
    featureId: 'llm-evidence-curation-and-cleanup',
    scenarioId: 'create-a-dry-run-cleanup-plan-before-destructive-action',
    scenarioName: 'Create a dry-run cleanup plan before destructive action',
    acceptanceSource: { path: 'docs/features/llm-evidence-curation-and-cleanup.feature.md', lineRange: { start: 129, end: 156 } },
    declaredExecutableBody,
    runStartedAt: runStartedAt.toISOString(),
    receiptWrittenAt: runFinishedAt.toISOString(),
    telemetryEvents,
    receiptSourcePaths: [path.relative(rootDir, path.join(rootDir, result.planPath)).split(path.sep).join('/')],
  });
}

function writesNoisyEvidenceScenarioProof(rootDir, runId, result, runStartedAt, runFinishedAt, captured) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const declaredExecutableBody = [
    {
      nodeId: '01',
      nodeLabel: 'DETECT NOISY EVIDENCE RUNS',
      runtimePath: 'src/detects-noisy-evidence-runs/detects-noisy-evidence-runs.js',
      sourceLineRange: { start: 14, end: 28 },
      requiredReceiptPaths: [],
    },
  ];
  const telemetryEventPath = path.relative(rootDir, path.join(rootDir, 'evidence/runs', runId, 'telemetry.events.v1.jsonl')).split(path.sep).join('/');
  const telemetryEvents = buildsTelemetryEventsFromCapturedStream(declaredExecutableBody, captured.telemetryEvents, telemetryEventPath);
  const blockerFindings = result.noisyFindings.length > 0
    ? [{ code: 'evidence-run-too-noisy-for-product-review', reason: `${result.noisyFindings.length} run(s) found too noisy for product review in this real scan` }]
    : [];

  emitsFeatureExecutionProofFromRealRun({
    rootDir,
    runId,
    featureId: 'llm-evidence-curation-and-cleanup',
    scenarioId: 'detect-evidence-that-is-too-noisy-for-product-review',
    scenarioName: 'Detect evidence that is too noisy for product review',
    acceptanceSource: { path: 'docs/features/llm-evidence-curation-and-cleanup.feature.md', lineRange: { start: 265, end: 277 } },
    declaredExecutableBody,
    runStartedAt: runStartedAt.toISOString(),
    receiptWrittenAt: runFinishedAt.toISOString(),
    telemetryEvents,
    receiptSourcePaths: [],
    blockerFindings: [],
  });
}

function writesSprawlBudgetScenarioProof(rootDir, runId, result, runStartedAt, runFinishedAt, captured) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const declaredExecutableBody = [
    {
      nodeId: '01',
      nodeLabel: 'GATE EVIDENCE SPRAWL BUDGET',
      runtimePath: 'src/gates-evidence-sprawl-budget/gates-evidence-sprawl-budget.js',
      sourceLineRange: { start: 7, end: 33 },
      requiredReceiptPaths: [],
    },
  ];
  const telemetryEventPath = path.relative(rootDir, path.join(rootDir, 'evidence/runs', runId, 'telemetry.events.v1.jsonl')).split(path.sep).join('/');
  const telemetryEvents = buildsTelemetryEventsFromCapturedStream(declaredExecutableBody, captured.telemetryEvents, telemetryEventPath);
  const blockerFindings = result.sprawlGateResult.verdict === 'FAIL'
    ? result.sprawlGateResult.failures.map((failure) => ({ code: 'evidence-sprawl-budget-gate-failed', reason: failure }))
    : [];

  emitsFeatureExecutionProofFromRealRun({
    rootDir,
    runId,
    featureId: 'llm-evidence-curation-and-cleanup',
    scenarioId: 'enforce-an-evidence-sprawl-budget-without-blocking-fresh-delivery-evidence',
    scenarioName: 'Enforce an evidence sprawl budget without blocking fresh delivery evidence',
    acceptanceSource: { path: 'docs/features/llm-evidence-curation-and-cleanup.feature.md', lineRange: { start: 241, end: 246 } },
    declaredExecutableBody,
    runStartedAt: runStartedAt.toISOString(),
    receiptWrittenAt: runFinishedAt.toISOString(),
    telemetryEvents,
    receiptSourcePaths: [],
    blockerFindings,
  });
}

runsEvidenceCurationCli();
