const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { buildsFeatureExecutionProof } = require('../src/feature-execution-proof/feature-execution-proof');
const {
  buildsFeatureScopedAsciiReportPath,
  checksFeatureScopedAsciiReportPresentation,
  rendersFeatureScopedAsciiExecutionFlowReport,
  writesFeatureScopedAsciiExecutionFlowReport,
} = require('../src/feature-scoped-ascii-execution-flow-report/feature-scoped-ascii-execution-flow-report');

function buildsProofInput(overrides = {}) {
  return {
    runId: 'run-ascii-123',
    featureId: 'feature-scoped-ascii-execution-flow-report',
    scenarioId: 'render-hierarchical-ascii-executable-body-tree',
    scenarioName: 'Render hierarchical ASCII executable body tree',
    runStartedAt: '2026-07-09T12:00:00.000Z',
    receiptWrittenAt: '2026-07-09T12:00:04.000Z',
    generatedAt: '2026-07-09T12:00:05.000Z',
    acceptanceSource: {
      path: 'docs/features/feature-scoped-ascii-execution-flow-report.feature.md',
      lineRange: { start: 98, end: 182 },
    },
    declaredExecutableBody: [
      {
        nodeId: '01',
        nodeLabel: 'SURFACE RECEIVES REQUEST',
        contractPath: 'contracts/commands/feature-report.command.v1.json',
        runtimePath: 'src/feature-report/entrypoint.js',
        sourceLineRange: { start: 10, end: 18 },
        requiredReceiptPaths: ['evidence/runs/run-ascii-123/surface.receipt.v1.json'],
      },
      {
        nodeId: '02',
        nodeLabel: 'CANONICAL REQUEST BINDING',
        contractPath: 'contracts/feature-report/canonical-request.schema.v1.json',
        runtimePath: 'src/feature-report/canonical-request.js',
        sourceLineRange: { start: 20, end: 38 },
        requiredReceiptPaths: ['evidence/runs/run-ascii-123/canonical-request.receipt.v1.json'],
      },
    ],
    telemetryEvents: [
      {
        id: 'runtime-step-1',
        nodeId: '01',
        runtimePath: 'src/feature-report/entrypoint.js',
        timestamp: '2026-07-09T12:00:01.000Z',
        durationMs: 125,
        telemetryEventPath: 'evidence/runs/run-ascii-123/telemetry.events.v1.jsonl',
      },
      {
        id: 'runtime-step-2a',
        nodeId: '02',
        runtimePath: 'src/feature-report/canonical-request.js',
        timestamp: '2026-07-09T12:00:02.000Z',
        durationMs: 200,
        telemetryEventPath: 'evidence/runs/run-ascii-123/telemetry.events.v1.jsonl',
      },
      {
        id: 'runtime-step-2b',
        nodeId: '02',
        runtimePath: 'src/feature-report/canonical-request.js',
        timestamp: '2026-07-09T12:00:03.500Z',
        durationMs: 275,
        telemetryEventPath: 'evidence/runs/run-ascii-123/telemetry.events.v1.jsonl',
      },
    ],
    receiptSourcePaths: [
      'evidence/runs/run-ascii-123/surface.receipt.v1.json',
      'evidence/runs/run-ascii-123/canonical-request.receipt.v1.json',
    ],
    ...overrides,
  };
}

test('renders feature-scoped ASCII execution flow before dense timing details', () => {
  const proof = buildsFeatureExecutionProof(buildsProofInput());
  const report = rendersFeatureScopedAsciiExecutionFlowReport(proof, {
    rootDir: process.cwd(),
  });

  assert.match(report, /^# Render hierarchical ASCII executable body tree/);
  assert.ok(report.indexOf('## Execution Flow Sketch') < report.indexOf('## Dense Timing Projection'));
  assert.match(report, /REPORT TRUTH/);
  assert.match(report, /Promotion\s+: ALLOWED/);
  assert.match(report, /EXECUTABLE BODY CONTRACT - FILE-SYSTEM EXECUTION TREE/);
  assert.match(report, /\[00\] ACCEPTANCE SOURCE/);
  assert.match(report, /\|-- gherkin/);
  assert.match(report, /\|   `-- docs\/features\/feature-scoped-ascii-execution-flow-report\.feature\.md/);
  assert.match(report, /\[01\] SURFACE RECEIVES REQUEST/);
  assert.match(report, /\|-- contract/);
  assert.match(report, /\|   `-- contracts\/commands\/feature-report\.command\.v1\.json/);
  assert.match(report, /\|-- runtime/);
  assert.match(report, /\|   `-- src\/feature-report\/entrypoint\.js:10-18/);
  assert.match(report, /\|-- telemetry/);
  assert.match(report, /\|   \|-- status        : observed/);
  assert.match(report, /\|   \|-- runtime step  : runtime-step-1/);
  assert.match(report, /\|   \|-- first seen at : 2026-07-09T12:00:01\.000Z/);
  assert.match(report, /\|   \|-- last seen at  : 2026-07-09T12:00:01\.000Z/);
  assert.match(report, /\|   \|-- duration ms   : 125/);
  assert.match(report, /\|   \|-- elapsed prev  : 1000/);
  assert.match(report, /\|   \|-- call count    : 1/);
  assert.match(report, /\|   `-- path          : evidence\/runs\/run-ascii-123\/telemetry\.events\.v1\.jsonl/);
  assert.match(report, /\|-- receipt/);
  assert.match(report, /\|   `-- evidence\/runs\/run-ascii-123\/surface\.receipt\.v1\.json/);
  assert.match(report, /`-- status/);
  assert.match(report, /    `-- ok/);
  assert.match(report, /\[02\] CANONICAL REQUEST BINDING/);
  assert.match(report, /\|   \|-- duration ms   : 475/);
  assert.match(report, /\|   \|-- elapsed prev  : 1000/);
  assert.match(report, /\|   \|-- call count    : 2/);
  assert.doesNotMatch(report, /[^\x09\x0A\x0D\x20-\x7E]/);
});

test('renders missing telemetry and receipt as blocked inline node evidence', () => {
  const proof = buildsFeatureExecutionProof(buildsProofInput({
    telemetryEvents: [],
    receiptSourcePaths: [],
  }));
  const report = rendersFeatureScopedAsciiExecutionFlowReport(proof, {
    rootDir: process.cwd(),
  });

  assert.match(report, /Promotion\s+: BLOCKED/);
  assert.match(report, /\|   \|-- status        : not observed/);
  assert.match(report, /\|   \|-- runtime step  : not observed/);
  assert.match(report, /\|   \|-- first seen at : not observed/);
  assert.match(report, /\|   \|-- duration ms   : not observed/);
  assert.match(report, /\|   \|-- elapsed prev  : not observed/);
  assert.match(report, /\|   \|-- call count    : not observed/);
  assert.match(report, /\|-- receipt\n\|   `-- missing/);
  assert.match(report, /`-- status\n    \|-- blocked\n    \|-- blocker : telemetry-not-observed\n    `-- fix     : add runtime testimony tied to this body node/);
});

test('writes feature-scoped report under the run feature evidence directory', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-feature-ascii-'));

  try {
    const proof = buildsFeatureExecutionProof(buildsProofInput());
    const evidenceRoot = path.join(tempDir, 'evidence');
    const writeResult = writesFeatureScopedAsciiExecutionFlowReport(proof, {
      evidenceRoot,
      rootDir: tempDir,
    });

    assert.equal(writeResult.reportPath, buildsFeatureScopedAsciiReportPath(evidenceRoot, 'run-ascii-123', 'feature-scoped-ascii-execution-flow-report'));
    assert.equal(fs.existsSync(writeResult.reportPath), true);
    assert.match(fs.readFileSync(writeResult.reportPath, 'utf8'), /## Execution Flow Sketch/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('presentation gate rejects header-only or flat boxed execution trees', () => {
  const headerOnly = [
    '# Report',
    '',
    '## Execution Flow Sketch',
    '',
    '```text',
    'EXECUTABLE BODY CONTRACT - FILE-SYSTEM EXECUTION TREE',
    '```',
    '',
  ].join('\n');
  const flatBoxed = [
    '+------------------------------------------------------------+',
    '| EXECUTABLE BODY TREE                                      |',
    '+------------------------------------------------------------+',
    '| 01 SURFACE RECEIVES REQUEST                               |',
    '| contract  : contracts/feature.json                 ok     |',
    '| runtime   : src/feature.js:1-2                     ok     |',
    '| telemetry : evidence/runs/run/events.jsonl observed       |',
    '| receipt   : evidence/runs/run/receipt.json written        |',
    '| status    : ok                                            |',
    '+------------------------------------------------------------+',
    '',
  ].join('\n');

  const headerResult = checksFeatureScopedAsciiReportPresentation(headerOnly);
  const flatResult = checksFeatureScopedAsciiReportPresentation(flatBoxed);

  assert.equal(headerResult.verdict, 'BLOCKED');
  assert.ok(headerResult.findings.some((finding) => finding.code === 'executable-body-tree-missing'));
  assert.equal(flatResult.verdict, 'BLOCKED');
  assert.ok(flatResult.findings.some((finding) => finding.code === 'executable-body-tree-shape-mismatch'));
});

test('presentation gate passes rendered hierarchical reports', () => {
  const proof = buildsFeatureExecutionProof(buildsProofInput());
  const report = rendersFeatureScopedAsciiExecutionFlowReport(proof, {
    rootDir: process.cwd(),
  });
  const result = checksFeatureScopedAsciiReportPresentation(report);

  assert.equal(result.verdict, 'PASS');
  assert.deepEqual(result.findings, []);
});
