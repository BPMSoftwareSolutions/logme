const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  buildsFeatureExecutionProof,
  buildsFeatureProofInventory,
  buildsFeatureProofPath,
  checksFeatureReportTruthGate,
  checksUnsupportedSlaClaims,
  discoversFeatureScenarios,
  projectsFeatureExecutionProofToCsv,
  rendersFeatureExecutionReport,
  writesFeatureExecutionProof,
  writesFeatureProofInventory,
} = require('../src/feature-execution-proof/feature-execution-proof');

function writesFeatureFile(rootDir) {
  const featuresRoot = path.join(rootDir, 'docs', 'features');
  fs.mkdirSync(featuresRoot, { recursive: true });
  const featurePath = path.join(featuresRoot, 'feature-execution-proof-source-of-truth.feature.md');
  fs.writeFileSync(featurePath, [
    '```gherkin',
    'Feature: Feature execution proof source of truth',
    '',
    '  Scenario: Inventory every feature scenario and proof state',
    '    Given committed feature files exist under `docs/features/`',
    '',
    '  Scenario: Write canonical JSON execution proof for a scenario',
    '    Given a feature scenario has been executed',
    '```',
    '',
  ].join('\n'), 'utf8');
  return featurePath;
}

function buildsProofInput(overrides = {}) {
  return {
    runId: 'run-123',
    featureId: 'feature-execution-proof-source-of-truth',
    scenarioId: 'write-canonical-json-execution-proof-for-a-scenario',
    scenarioName: 'Write canonical JSON execution proof for a scenario',
    runStartedAt: '2026-07-09T12:00:00.000Z',
    receiptWrittenAt: '2026-07-09T12:00:04.000Z',
    generatedAt: '2026-07-09T12:00:05.000Z',
    acceptanceSource: {
      path: 'docs/features/feature-execution-proof-source-of-truth.feature.md',
      lineRange: { start: 7, end: 8 },
    },
    declaredExecutableBody: [
      {
        nodeId: '01',
        nodeLabel: 'SURFACE RECEIVES REQUEST',
        contractPath: 'contracts/features/feature-execution.contract.v1.json',
        runtimePath: 'src/runs-feature-truth-command.js:1-8',
        sourceLineRange: { start: 1, end: 8 },
        requiredReceiptPaths: ['evidence/runs/run-123/request.receipt.v1.json'],
      },
      {
        nodeId: '02',
        nodeLabel: 'PROOF WRITER CLOSES EVIDENCE',
        contractPath: 'contracts/features/feature-execution.contract.v1.json',
        runtimePath: 'src/writes-feature-execution-proof.js:10-40',
        sourceLineRange: { start: 10, end: 40 },
        requiredReceiptPaths: ['evidence/runs/run-123/proof.receipt.v1.json'],
      },
      {
        nodeId: '03',
        nodeLabel: 'UNOBSERVED REQUIRED NODE',
        contractPath: 'contracts/features/feature-execution.contract.v1.json',
        runtimePath: 'src/unobserved.js:1-2',
        sourceLineRange: { start: 1, end: 2 },
        requiredReceiptPaths: ['evidence/runs/run-123/unobserved.receipt.v1.json'],
      },
    ],
    telemetryEvents: [
      {
        id: 'event-01-a',
        nodeId: '01',
        runtimePath: 'src/runs-feature-truth-command.js:1-8',
        timestamp: '2026-07-09T12:00:01.000Z',
        durationMs: 100,
        telemetryEventPath: 'evidence/runs/run-123/telemetry.events.v1.jsonl',
      },
      {
        id: 'event-02-a',
        nodeId: '02',
        runtimePath: 'src/writes-feature-execution-proof.js:10-40',
        timestamp: '2026-07-09T12:00:02.000Z',
        durationMs: 150,
        telemetryEventPath: 'evidence/runs/run-123/telemetry.events.v1.jsonl',
      },
      {
        id: 'event-02-b',
        nodeId: '02',
        runtimePath: 'src/writes-feature-execution-proof.js:10-40',
        timestamp: '2026-07-09T12:00:03.000Z',
        durationMs: 250,
        telemetryEventPath: 'evidence/runs/run-123/telemetry.events.v1.jsonl',
      },
    ],
    receiptSourcePaths: [
      'evidence/runs/run-123/request.receipt.v1.json',
      'evidence/runs/run-123/proof.receipt.v1.json',
    ],
    sloTargets: [
      {
        sloId: 'slo-cycle-under-5s',
        sliName: 'scenario cycle time ms',
        operator: '<=',
        target: 5000,
        unit: 'ms',
      },
      {
        sloId: 'slo-lead-under-1s',
        sliName: 'scenario lead time ms',
        operator: '<=',
        target: 1000,
        unit: 'ms',
      },
      {
        sloId: 'slo-not-measured',
        sliName: 'receipt write latency ms',
        operator: '<=',
        target: 10,
        unit: 'ms',
      },
    ],
    ...overrides,
  };
}

test('discoversFeatureScenarios inventories every scenario with source line ranges', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-feature-proof-'));

  try {
    const featurePath = writesFeatureFile(tempDir);
    const feature = discoversFeatureScenarios(featurePath);

    assert.equal(feature.featureId, 'feature-execution-proof-source-of-truth');
    assert.equal(feature.featureName, 'Feature execution proof source of truth');
    assert.deepEqual(feature.scenarios.map((scenario) => scenario.scenarioId), [
      'inventory-every-feature-scenario-and-proof-state',
      'write-canonical-json-execution-proof-for-a-scenario',
    ]);
    assert.equal(feature.scenarios[0].startLine, 4);
    assert.equal(feature.scenarios[0].endLine, 6);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('buildsFeatureProofInventory includes scenarios with no implementation yet', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-feature-proof-'));

  try {
    writesFeatureFile(tempDir);
    const inventory = buildsFeatureProofInventory({
      rootDir: tempDir,
      runId: 'run-123',
      generatedAt: '2026-07-09T12:00:00.000Z',
      implementationIndex: {
        'write-canonical-json-execution-proof-for-a-scenario': 'implemented',
      },
    });
    const outputPath = path.join(tempDir, 'evidence', 'runs', 'run-123', 'feature-proof-inventory.contract.v1.json');
    const writeResult = writesFeatureProofInventory(inventory, outputPath);

    assert.equal(inventory.scenarios.length, 2);
    assert.equal(inventory.scenarios[0].proofStatus, 'not implemented');
    assert.equal(inventory.scenarios[1].proofStatus, 'implemented not executed');
    assert.equal(fs.existsSync(writeResult.inventoryPath), true);
    assert.equal(JSON.parse(fs.readFileSync(outputPath, 'utf8')).runId, 'run-123');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('writes canonical JSON proof with repeated calls, observed metrics, and missing evidence statuses', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-feature-proof-'));

  try {
    const proof = buildsFeatureExecutionProof(buildsProofInput());
    const writeResult = writesFeatureExecutionProof(proof, { evidenceRoot: path.join(tempDir, 'evidence') });
    const written = JSON.parse(fs.readFileSync(writeResult.proofPath, 'utf8'));

    assert.equal(writeResult.proofPath, buildsFeatureProofPath(path.join(tempDir, 'evidence'), 'run-123', 'feature-execution-proof-source-of-truth', 'write-canonical-json-execution-proof-for-a-scenario'));
    assert.equal(written.schemaVersion, 'feature-execution.contract.v1');
    assert.equal(written.generatorName, 'LogMe feature execution proof');
    assert.equal(written.observedExecutionTimeline[1].callCount, 2);
    assert.deepEqual(written.observedExecutionTimeline[1].calls.map((call) => call.telemetryEventId), ['event-02-a', 'event-02-b']);
    assert.equal(written.observedExecutionTimeline[1].callSummary.totalDurationMs, 400);
    assert.equal(written.observedExecutionTimeline[2].status, 'not observed');
    assert.equal(written.observedExecutionTimeline[2].receiptStatus, 'missing');
    assert.equal(written.timingMetrics.scenarioLeadTimeMs, 4000);
    assert.equal(written.timingMetrics.scenarioCycleTimeMs, 2000);
    assert.equal(written.timingMetrics.totalObservedCalls, 3);
    assert.equal(written.promotionDecision.status, 'blocked');
    assert.ok(written.promotionDecision.blockerCodes.includes('telemetry-not-observed'));
    assert.ok(written.promotionDecision.blockerCodes.includes('required-receipt-missing'));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('calculates SLIs and SLO evaluations from proof evidence without passing missing evidence', () => {
  const proof = buildsFeatureExecutionProof(buildsProofInput());

  const telemetryCompleteness = proof.serviceLevelIndicators.find((sli) => sli.name === 'telemetry completeness percentage');
  const totalCalls = proof.serviceLevelIndicators.find((sli) => sli.name === 'total observed calls');

  assert.equal(telemetryCompleteness.value, (2 / 3) * 100);
  assert.equal(totalCalls.value, 3);
  assert.deepEqual(proof.sloEvaluations.map((evaluation) => evaluation.status), [
    'met',
    'missed',
    'not enough evidence',
  ]);
});

test('renders report and CSV as projections of canonical JSON proof', () => {
  const proof = {
    ...buildsFeatureExecutionProof(buildsProofInput()),
    proofPath: 'evidence/runs/run-123/features/feature-execution-proof-source-of-truth/scenarios/write-canonical-json-execution-proof-for-a-scenario/feature-execution.contract.v1.json',
  };
  const report = rendersFeatureExecutionReport(proof);
  const csv = projectsFeatureExecutionProofToCsv(proof);

  assert.match(report, /## Execution Proof/);
  assert.match(report, /Proof JSON: evidence\/runs\/run-123\/features/);
  assert.match(report, /call count\s+: 2/);
  assert.match(report, /receipt status\s+: missing/);
  assert.match(csv, /^run id,feature id,scenario id,node id,node label,runtime path,call index,timestamp,duration ms,elapsed since previous node ms,status,blocker code/m);
  assert.match(csv, /run-123,feature-execution-proof-source-of-truth,write-canonical-json-execution-proof-for-a-scenario,02,PROOF WRITER CLOSES EVIDENCE/);
  assert.match(csv, /,2,2026-07-09T12:00:03\.000Z,250,2000,observed,not observed/);
});

test('feature report truth gate rejects execution facts absent from JSON proof', () => {
  const proof = {
    ...buildsFeatureExecutionProof(buildsProofInput()),
    proofPath: 'evidence/runs/run-123/features/feature-execution-proof-source-of-truth/scenarios/write-canonical-json-execution-proof-for-a-scenario/feature-execution.contract.v1.json',
  };
  const report = [
    '# Proof report',
    '',
    '- Proof JSON: evidence/runs/run-123/features/feature-execution-proof-source-of-truth/scenarios/write-canonical-json-execution-proof-for-a-scenario/feature-execution.contract.v1.json',
    '- Promotion decision: proven',
    '- duration ms: 999999',
    '',
  ].join('\n');

  const result = checksFeatureReportTruthGate(report, proof);

  assert.equal(result.verdict, 'BLOCKED');
  assert.ok(result.findings.every((finding) => finding.code === 'feature-report-fact-without-json-proof'));
});

test('unsupported SLA claims produce the required finding code', () => {
  const proof = buildsFeatureExecutionProof(buildsProofInput());
  const findings = checksUnsupportedSlaClaims(proof, [
    {
      slaId: 'sla-product-response',
      supportingSloIds: ['slo-cycle-under-5s', 'slo-not-measured'],
    },
  ]);

  assert.deepEqual(findings.map((finding) => finding.code), ['sla-claim-without-slo-evidence']);
});
