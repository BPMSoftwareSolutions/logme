const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  buildsFeatureEvidenceIndexRow,
  buildsFeatureScenarioEvidencePacketPath,
  buildsNotExecutedFeatureEvidenceIndexRow,
  checksFeatureScenarioPromotionEvidence,
  rendersFeatureEvidenceIndex,
  writesFeatureScenarioEvidencePacket,
} = require('../src/per-feature-executable-body-evidence-reports/per-feature-executable-body-evidence-reports');

function buildsProofInput(overrides = {}) {
  return {
    runId: 'run-packet-123',
    featureId: 'per-feature-executable-body-evidence-reports',
    scenarioId: 'write-one-feature-scenario-evidence-packet-for-an-executed-scenario',
    scenarioName: 'Write one feature scenario evidence packet for an executed scenario',
    runStartedAt: '2026-07-09T12:00:00.000Z',
    receiptWrittenAt: '2026-07-09T12:00:04.000Z',
    generatedAt: '2026-07-09T12:00:05.000Z',
    acceptanceSource: {
      path: 'docs/features/per-feature-executable-body-evidence-reports.feature.md',
      lineRange: { start: 7, end: 28 },
    },
    declaredExecutableBody: [
      {
        nodeId: '01',
        nodeLabel: 'SURFACE RECEIVES REQUEST',
        contractPath: 'contracts/commands/per-feature-report.command.v1.json',
        runtimePath: 'src/per-feature-report/entrypoint.js',
        sourceLineRange: { start: 10, end: 18 },
        requiredReceiptPaths: ['evidence/runs/run-packet-123/surface.receipt.v1.json'],
      },
      {
        nodeId: '02',
        nodeLabel: 'WRITE EVIDENCE PACKET',
        contractPath: 'contracts/features/per-feature-evidence-packet.schema.v1.json',
        runtimePath: 'src/per-feature-report/writes-packet.js',
        sourceLineRange: { start: 20, end: 58 },
        requiredReceiptPaths: ['evidence/runs/run-packet-123/packet.receipt.v1.json'],
      },
    ],
    telemetryEvents: [
      {
        id: 'runtime-step-1',
        nodeId: '01',
        methodName: 'receivesPerFeatureReportRequest',
        methodKind: 'function',
        runtimePath: 'src/per-feature-report/entrypoint.js',
        timestamp: '2026-07-09T12:00:01.000Z',
        durationMs: 100,
        telemetryEventPath: 'evidence/runs/run-packet-123/telemetry.events.v1.jsonl',
      },
      {
        id: 'runtime-step-2',
        nodeId: '02',
        methodName: 'writesFeatureScenarioEvidencePacket',
        methodKind: 'function',
        runtimePath: 'src/per-feature-report/writes-packet.js',
        timestamp: '2026-07-09T12:00:02.000Z',
        durationMs: 250,
        telemetryEventPath: 'evidence/runs/run-packet-123/telemetry.events.v1.jsonl',
      },
    ],
    receiptSourcePaths: [
      'evidence/runs/run-packet-123/surface.receipt.v1.json',
      'evidence/runs/run-packet-123/packet.receipt.v1.json',
    ],
    ...overrides,
  };
}

function readsText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

test('writes one feature scenario evidence packet with all required artifacts', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-feature-packet-'));

  try {
    const evidenceRoot = path.join(tempDir, 'evidence');
    const result = writesFeatureScenarioEvidencePacket(buildsProofInput(), {
      evidenceRoot,
      rootDir: tempDir,
    });
    const packetPath = buildsFeatureScenarioEvidencePacketPath(
      evidenceRoot,
      'run-packet-123',
      'per-feature-executable-body-evidence-reports',
      'write-one-feature-scenario-evidence-packet-for-an-executed-scenario',
    );
    const requiredArtifacts = [
      'executable-body-contract.report.md',
      'executable-body-tree.ascii.md',
      'execution-timeline.table.md',
      'method-execution-timeline.table.md',
      'method-call-evidence.report.md',
      'feature-execution.contract.v1.json',
      'telemetry.tieout.v1.json',
      'receipt-coverage.v1.json',
      'promotion-decision.v1.json',
      'feature-execution.receipt.v1.json',
    ];

    assert.equal(result.packetPath, packetPath);

    for (const artifact of requiredArtifacts) {
      const artifactPath = path.join(packetPath, artifact);
      assert.equal(fs.existsSync(artifactPath), true, artifact);
      const content = readsText(artifactPath);
      assert.match(content, /run-packet-123/);
      assert.match(content, /per-feature-executable-body-evidence-reports/);
      assert.match(content, /write-one-feature-scenario-evidence-packet-for-an-executed-scenario/);
    }

    const proof = JSON.parse(readsText(path.join(packetPath, 'feature-execution.contract.v1.json')));
    assert.equal(proof.schemaVersion, 'feature-execution.contract.v1');
    assert.equal(proof.timingMetrics.totalObservedCalls, 2);
    assert.equal(proof.methodTimingMetrics.totalObservedMethodCalls, 2);
    assert.equal(proof.observedExecutionTimeline[1].durationMs, 250);
    assert.equal(proof.observedExecutionTimeline[1].methodCalls[0].methodName, 'writesFeatureScenarioEvidencePacket');

    const report = readsText(path.join(packetPath, 'executable-body-contract.report.md'));
    assert.ok(report.indexOf('## Executable Body Tree') < report.indexOf('## Evidence Packet'));
    assert.match(report, /\[00\] ACCEPTANCE SOURCE/);
    assert.match(report, /\|-- telemetry/);
    assert.match(report, /\|   \|-- runtime step  : runtime-step-1/);
    assert.match(report, /\|   \|-- duration ms   : 250/);
    assert.match(report, /\|-- receipt/);
    assert.match(report, /`-- status/);
    assert.match(report, /Canonical JSON proof: evidence\/runs\/run-packet-123\/features\/per-feature-executable-body-evidence-reports\/scenarios\/write-one-feature-scenario-evidence-packet-for-an-executed-scenario\/feature-execution\.contract\.v1\.json/);

    const tree = readsText(path.join(packetPath, 'executable-body-tree.ascii.md'));
    assert.match(tree, /EXECUTABLE BODY CONTRACT - FILE-SYSTEM EXECUTION TREE/);

    const timeline = readsText(path.join(packetPath, 'execution-timeline.table.md'));
    assert.match(timeline, /\| runtime-step-2 \| 02 \| WRITE EVIDENCE PACKET \| src\/per-feature-report\/writes-packet\.js \| 2026-07-09T12:00:02\.000Z \| 2026-07-09T12:00:02\.000Z \| 250 \| 1000 \| 1 \| observed \| not observed \|/);

    const methodTimeline = readsText(path.join(packetPath, 'method-execution-timeline.table.md'));
    assert.match(methodTimeline, /writesFeatureScenarioEvidencePacket/);
    assert.match(methodTimeline, /runtime-step-2/);

    const methodAppendix = readsText(path.join(packetPath, 'method-call-evidence.report.md'));
    assert.match(methodAppendix, /# Method Call Evidence/);
    assert.match(methodAppendix, /writesFeatureScenarioEvidencePacket call 001/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('blocks scenario promotion when the feature evidence report is missing', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-feature-packet-'));

  try {
    const result = checksFeatureScenarioPromotionEvidence(
      path.join(tempDir, 'evidence'),
      'run-missing',
      'per-feature-executable-body-evidence-reports',
      'missing-scenario',
    );

    assert.equal(result.verdict, 'BLOCKED');
    assert.deepEqual(result.findings.map((finding) => finding.code), ['feature-executable-body-report-missing']);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('renders global feature evidence index as links without embedding full trees', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-feature-packet-'));

  try {
    const evidenceRoot = path.join(tempDir, 'evidence');
    const packet = writesFeatureScenarioEvidencePacket(buildsProofInput(), {
      evidenceRoot,
      rootDir: tempDir,
    });
    const rows = [
      buildsFeatureEvidenceIndexRow(packet.proof, packet.packetPath, tempDir),
      buildsNotExecutedFeatureEvidenceIndexRow('future-feature', 'future-scenario'),
    ];
    const index = rendersFeatureEvidenceIndex(rows);

    assert.match(index, /feature id \| scenario id \| feature verdict \| blocker count \| evidence packet path \| executable body report path \| execution timeline table path \| method execution timeline table path/);
    assert.match(index, /per-feature-executable-body-evidence-reports/);
    assert.match(index, /executable-body-contract\.report\.md/);
    assert.match(index, /execution-timeline\.table\.md/);
    assert.match(index, /method-execution-timeline\.table\.md/);
    assert.match(index, /future-feature \| future-scenario \| not executed/);
    assert.doesNotMatch(index, /EXECUTABLE BODY CONTRACT - FILE-SYSTEM EXECUTION TREE/);
    assert.doesNotMatch(index, /STERILE/);
    assert.doesNotMatch(index, /SLO met/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('generated run evidence stays ignored by source control defaults', () => {
  const gitignore = readsText(path.join(process.cwd(), '.gitignore'));

  assert.match(gitignore, /evidence\/runs\//);
  assert.doesNotMatch(gitignore, /!evidence\/runs/);
});

test('regenerated evidence report uses updated source-controlled template', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-feature-packet-'));

  try {
    const evidenceRoot = path.join(tempDir, 'evidence');
    const templatePath = path.join(tempDir, 'feature-report.template.md');
    fs.writeFileSync(templatePath, [
      '# {{title}}',
      '',
      '## Template Marker',
      '',
      'first template',
      '',
      '{{executableBodyTree}}',
      '',
    ].join('\n'), 'utf8');

    const first = writesFeatureScenarioEvidencePacket(buildsProofInput(), {
      evidenceRoot,
      rootDir: tempDir,
      reportTemplatePath: templatePath,
    });
    assert.match(readsText(first.paths.reportPath), /first template/);

    fs.writeFileSync(templatePath, [
      '# {{title}}',
      '',
      '## Template Marker',
      '',
      'updated template',
      '',
      '{{executableBodyTree}}',
      '',
    ].join('\n'), 'utf8');

    const second = writesFeatureScenarioEvidencePacket(buildsProofInput(), {
      evidenceRoot,
      rootDir: tempDir,
      reportTemplatePath: templatePath,
    });
    const report = readsText(second.paths.reportPath);

    assert.match(report, /updated template/);
    assert.doesNotMatch(report, /first template/);
    assert.match(report, /EXECUTABLE BODY CONTRACT - FILE-SYSTEM EXECUTION TREE/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
