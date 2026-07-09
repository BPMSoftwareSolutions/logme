const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  QA_PASSED,
  REQUIRED_BUNDLE_ARTIFACTS,
  buildsQaReadinessRows,
  buildsQualityBundlePath,
  buildsQualityInventory,
  rendersQaReadinessSection,
  runsQualityPromotionGate,
  writesQualityEvidenceBundle,
} = require('../src/end-user-quality-evidence-bundle/end-user-quality-evidence-bundle');

function writesFeatureFile(rootDir) {
  const featuresRoot = path.join(rootDir, 'docs', 'features');
  fs.mkdirSync(featuresRoot, { recursive: true });
  fs.writeFileSync(path.join(featuresRoot, 'end-user-quality-evidence-bundle.feature.md'), [
    '```gherkin',
    'Feature: End-user quality evidence bundle',
    '',
    '  Scenario: Inventory QA status for every feature scenario',
    '    Given committed feature files exist under `docs/features/`',
    '',
    '  Scenario: Create a QA evidence bundle for every QA attempt',
    '    Given an end-user QA test has run',
    '```',
    '',
  ].join('\n'), 'utf8');
}

function writesHumanReportFixtures(rootDir, runId, featureId, scenarioId) {
  const packetRoot = path.join(rootDir, 'evidence', 'runs', runId, 'features', featureId, 'scenarios', scenarioId);
  const sprawlRoot = path.join(rootDir, 'evidence', 'runs', runId, 'sprawl');
  fs.mkdirSync(packetRoot, { recursive: true });
  fs.mkdirSync(sprawlRoot, { recursive: true });
  fs.writeFileSync(path.join(packetRoot, 'executable-body-contract.report.md'), '# Executable proof\n\nrun-qa-1\n', 'utf8');
  fs.writeFileSync(path.join(packetRoot, 'execution-timeline.table.md'), '# Timeline\n\nrun-qa-1\n', 'utf8');
  fs.writeFileSync(path.join(packetRoot, 'method-execution-timeline.table.md'), '# Method timeline\n\nrun-qa-1\n', 'utf8');
  fs.writeFileSync(path.join(packetRoot, 'method-call-evidence.report.md'), '# Method evidence\n\nrun-qa-1\n', 'utf8');
  fs.writeFileSync(path.join(sprawlRoot, 'domain-body-sprawl.report.md'), '# Sprawl\n\nrun-qa-1\n', 'utf8');
  fs.writeFileSync(path.join(sprawlRoot, 'domain-body-sprawl-hotspots.table.md'), '| hotspot |\n| --- |\n', 'utf8');
  fs.writeFileSync(path.join(rootDir, 'report.md'), '# Global report\n\nrun-qa-1\n', 'utf8');
}

function buildsScenario(overrides = {}) {
  return {
    featureId: 'end-user-quality-evidence-bundle',
    scenarioId: 'create-a-qa-evidence-bundle-for-every-qa-attempt',
    scenarioName: 'Create a QA evidence bundle for every QA attempt',
    qaStatus: QA_PASSED,
    reviewerOrApprover: 'Ada PO',
    proofRunId: 'proof-run-1',
    ...overrides,
  };
}

function readsText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

test('buildsQualityInventory discovers every feature scenario and classifies latest QA status', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-qa-bundle-'));

  try {
    writesFeatureFile(tempDir);
    writesHumanReportFixtures(tempDir, 'proof-run-1', 'end-user-quality-evidence-bundle', 'create-a-qa-evidence-bundle-for-every-qa-attempt');
    writesQualityEvidenceBundle({
      rootDir: tempDir,
      releaseCandidateId: 'rc-1',
      qaRunId: 'run-qa-1',
      proofRunId: 'proof-run-1',
      startedAt: '2026-07-09T12:00:00.000Z',
      finishedAt: '2026-07-09T12:00:03.000Z',
      commandExecuted: 'npm run report:truth',
      testedFeatureScenarios: [buildsScenario()],
      reviewerOrApprover: 'Ada PO',
    });

    const inventory = buildsQualityInventory({
      rootDir: tempDir,
      proofRunId: 'proof-run-1',
      generatedAt: '2026-07-09T12:00:04.000Z',
      implementationIndex: {
        'create-a-qa-evidence-bundle-for-every-qa-attempt': 'implemented',
      },
    });

    assert.equal(inventory.rows.length, 2);
    assert.deepEqual(inventory.rows.map((row) => row.scenarioId), [
      'inventory-qa-status-for-every-feature-scenario',
      'create-a-qa-evidence-bundle-for-every-qa-attempt',
    ]);
    assert.equal(inventory.rows[0].qaStatus, 'not QAed');
    assert.equal(inventory.rows[1].qaStatus, 'QA passed');
    assert.equal(inventory.rows[1].latestQaRunId, 'run-qa-1');
    assert.equal(inventory.rows[1].qualityGateDecision, 'QA passed');
    assert.equal(inventory.rows[1].reviewerOrApprover, 'Ada PO');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('writes source-controlled QA bundle artifacts with provenance, report, hashes, and ids', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-qa-bundle-'));

  try {
    writesHumanReportFixtures(tempDir, 'proof-run-1', 'end-user-quality-evidence-bundle', 'create-a-qa-evidence-bundle-for-every-qa-attempt');
    const result = writesQualityEvidenceBundle({
      rootDir: tempDir,
      releaseCandidateId: 'rc-1',
      qaRunId: 'run-qa-1',
      proofRunId: 'proof-run-1',
      startedAt: '2026-07-09T12:00:00.000Z',
      finishedAt: '2026-07-09T12:00:03.000Z',
      commandExecuted: 'node qa --token=secret-value',
      testedFeatureScenarios: [buildsScenario()],
      htmlPreviews: [{
        sourceMarkdownReportPath: 'report.md',
        generatedHtmlPathOrArtifactUrl: 'quality/previews/report.html',
        screenshotPath: 'quality/previews/report.png',
        viewport: '1280x720',
        renderTimestamp: '2026-07-09T12:00:02.000Z',
        visualQaStatus: 'passed',
      }],
    });

    assert.equal(result.bundlePath, buildsQualityBundlePath(tempDir, 'rc-1', 'run-qa-1'));

    for (const artifact of REQUIRED_BUNDLE_ARTIFACTS) {
      const artifactPath = path.join(result.bundlePath, artifact);
      assert.equal(fs.existsSync(artifactPath), true, artifact);
      assert.match(readsText(artifactPath), /rc-1/);
      assert.match(readsText(artifactPath), /run-qa-1/);
    }

    const manifest = JSON.parse(readsText(path.join(result.bundlePath, 'qa-evidence-bundle.manifest.v1.json')));
    const machine = JSON.parse(readsText(path.join(result.bundlePath, 'machine-environment.v1.json')));
    const report = readsText(path.join(result.bundlePath, 'qa-evidence-bundle.report.md'));

    assert.equal(manifest.qualityGateDecision, 'QA passed');
    assert.equal(manifest.linkedReports.length, 7);
    assert.ok(manifest.linkedReports.every((linkedReport) => linkedReport.sha256.length === 64));
    assert.equal(machine.commandExecuted, 'node qa --token=[REDACTED]');
    assert.match(report, /## Product QA Decision/);
    assert.match(report, /Quality gate decision: QA passed/);
    assert.match(report, /## Generated HTML Previews Reviewed/);
    assert.match(readsText(path.join(result.bundlePath, 'html-preview.index.md')), /quality\/previews\/report\.html/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('blocks QA pass when required human proof reports are missing', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-qa-bundle-'));

  try {
    fs.writeFileSync(path.join(tempDir, 'report.md'), '# Global report\n', 'utf8');
    const result = writesQualityEvidenceBundle({
      rootDir: tempDir,
      releaseCandidateId: 'rc-missing',
      qaRunId: 'run-qa-missing',
      proofRunId: 'proof-run-missing',
      testedFeatureScenarios: [buildsScenario({ proofRunId: 'proof-run-missing' })],
    });

    assert.equal(result.gateDecision.qualityGateDecision, 'BLOCKED');
    assert.ok(result.gateDecision.blockerCodes.includes('qa-bundle-missing-human-proof-report'));
    assert.match(readsText(path.join(result.bundlePath, 'blocker-worklist.md')), /qa-bundle-missing-human-proof-report/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('promotion gate blocks missing bundles and passes immutable complete bundles', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-qa-bundle-'));

  try {
    const missing = runsQualityPromotionGate({
      rootDir: tempDir,
      releaseCandidateId: 'rc-none',
      decidedAt: '2026-07-09T12:00:00.000Z',
    });

    assert.equal(missing.qualityGateDecision, 'BLOCKED');
    assert.deepEqual(missing.blockerCodes, ['release-candidate-without-end-user-qa-bundle']);

    writesHumanReportFixtures(tempDir, 'proof-run-1', 'end-user-quality-evidence-bundle', 'create-a-qa-evidence-bundle-for-every-qa-attempt');
    writesQualityEvidenceBundle({
      rootDir: tempDir,
      releaseCandidateId: 'rc-1',
      qaRunId: 'run-qa-1',
      proofRunId: 'proof-run-1',
      testedFeatureScenarios: [buildsScenario()],
      startedAt: '2026-07-09T12:00:00.000Z',
      finishedAt: '2026-07-09T12:00:03.000Z',
    });
    const passed = runsQualityPromotionGate({
      rootDir: tempDir,
      releaseCandidateId: 'rc-1',
      decidedAt: '2026-07-09T12:00:04.000Z',
    });

    assert.equal(passed.qualityGateDecision, 'QA passed');
    assert.equal(passed.promotable, true);
    assert.equal(passed.immutable, true);
    assert.equal(JSON.parse(readsText(path.join(tempDir, 'quality', 'end-user-test-bundles', 'rc-1', 'run-qa-1', 'qa-gate-decision.v1.json'))).promotable, true);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('renders compact QA readiness rows for the global report without embedding bundle detail', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-qa-bundle-'));

  try {
    writesHumanReportFixtures(tempDir, 'proof-run-1', 'end-user-quality-evidence-bundle', 'create-a-qa-evidence-bundle-for-every-qa-attempt');
    writesQualityEvidenceBundle({
      rootDir: tempDir,
      releaseCandidateId: 'rc-1',
      qaRunId: 'run-qa-1',
      proofRunId: 'proof-run-1',
      testedFeatureScenarios: [buildsScenario()],
    });

    const rows = buildsQaReadinessRows(tempDir);
    const section = rendersQaReadinessSection(rows);

    assert.equal(rows.length, 1);
    assert.equal(rows[0].testedScenarioCount, 1);
    assert.match(section, /## QA Readiness/);
    assert.match(section, /quality\/end-user-test-bundles\/rc-1\/run-qa-1\/qa-evidence-bundle\.report\.md/);
    assert.match(section, /machine-environment\.v1\.json/);
    assert.doesNotMatch(section, /Executive QA Summary/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
