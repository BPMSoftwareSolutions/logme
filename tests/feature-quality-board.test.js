const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  writesFeatureQualityBoardProjection,
  writesFeatureStatusProjection,
} = require('../src/feature-quality-board/feature-quality-board');

function makesTempRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'logme-feature-board-'));
}

function writesFeature(rootDir, fileName, featureName, scenarioName = 'Primary scenario') {
  const featurePath = path.join(rootDir, 'docs', 'features', fileName);
  fs.mkdirSync(path.dirname(featurePath), { recursive: true });
  fs.writeFileSync(featurePath, [
    '```gherkin',
    `Feature: ${featureName}`,
    '',
    `  Scenario: ${scenarioName}`,
    '    Given a product owner needs visibility',
    '    When the projection runs',
    '    Then the status is visible',
    '```',
    '',
  ].join('\n'), 'utf8');
  return featurePath;
}

function writesProof(rootDir, featureId, scenarioId) {
  const proofPath = path.join(rootDir, 'evidence', 'runs', 'proof-run-001', 'features', featureId, 'scenarios', scenarioId, 'feature-execution.contract.v1.json');
  fs.mkdirSync(path.dirname(proofPath), { recursive: true });
  fs.writeFileSync(proofPath, `${JSON.stringify({
    runId: 'proof-run-001',
    featureId,
    scenarioId,
    blockerCodes: [],
    promotionDecision: { status: 'passed', blockerCodes: [] },
  }, null, 2)}\n`, 'utf8');
  return proofPath;
}

function writesQaBundle(rootDir, options) {
  const bundlePath = path.join(rootDir, 'quality', 'end-user-test-bundles', options.releaseCandidateId, options.qaRunId);
  fs.mkdirSync(bundlePath, { recursive: true });
  const manifest = {
    schemaVersion: 'qa-evidence-bundle.manifest.v1',
    releaseCandidateId: options.releaseCandidateId,
    qaRunId: options.qaRunId,
    qaStatus: options.qaStatus,
    qualityGateDecision: options.qualityGateDecision,
    blockerCodes: options.blockerCodes || [],
    testedFeatureScenarios: [{
      featureId: options.featureId,
      scenarioId: options.scenarioId,
      scenarioName: options.scenarioName,
      qaStatus: options.qaStatus,
    }],
    linkedReports: [],
  };
  const gateDecision = {
    schemaVersion: 'qa-gate-decision.v1',
    releaseCandidateId: options.releaseCandidateId,
    qaRunId: options.qaRunId,
    qualityGateDecision: options.qualityGateDecision,
    promotable: options.promotable === true,
    blockerCodes: options.blockerCodes || [],
    blockerCount: (options.blockerCodes || []).length,
  };

  fs.writeFileSync(path.join(bundlePath, 'qa-evidence-bundle.manifest.v1.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  fs.writeFileSync(path.join(bundlePath, 'qa-gate-decision.v1.json'), `${JSON.stringify(gateDecision, null, 2)}\n`, 'utf8');
  fs.writeFileSync(path.join(bundlePath, 'machine-environment.v1.json'), `${JSON.stringify({ schemaVersion: 'machine-environment.v1' }, null, 2)}\n`, 'utf8');
  fs.writeFileSync(path.join(bundlePath, 'qa-evidence-bundle.report.md'), '# QA Evidence Bundle\n', 'utf8');
  return bundlePath;
}

test('writes one visible status sentinel and JSON status for every feature', () => {
  const rootDir = makesTempRoot();
  writesFeature(rootDir, 'sample-feature.feature.md', 'Sample feature');

  const result = writesFeatureStatusProjection({
    rootDir,
    generatedAt: '2026-07-10T00:00:00.000Z',
  });

  const sentinelPath = path.join(rootDir, 'docs', 'features', '_STATUS.not-implemented.sample-feature.md');
  const jsonPath = path.join(rootDir, 'docs', 'features', '_feature-status', 'sample-feature.status.v1.json');

  assert.equal(result.statuses.length, 1);
  assert.equal(fs.existsSync(sentinelPath), true);
  assert.equal(fs.existsSync(jsonPath), true);
  assert.match(fs.readFileSync(sentinelPath, 'utf8'), /Generated projection/);
  assert.match(fs.readFileSync(sentinelPath, 'utf8'), /source JSON contract: docs\/features\/_feature-status\/sample-feature.status.v1.json/);
});

test('marks implemented features without QA as implemented.not-tested', () => {
  const rootDir = makesTempRoot();
  writesFeature(rootDir, 'implemented-feature.feature.md', 'Implemented feature', 'Runs through proof');
  writesProof(rootDir, 'implemented-feature', 'runs-through-proof');

  const result = writesFeatureStatusProjection({
    rootDir,
    generatedAt: '2026-07-10T00:00:00.000Z',
  });

  assert.equal(result.statuses[0].displayStatus, 'implemented.not-tested');
  assert.equal(result.statuses[0].implementationStatus, 'implemented');
  assert.equal(result.statuses[0].executionProofStatus, 'proven');
  assert.equal(result.statuses[0].endUserQaStatus, 'not QAed');
  assert.equal(result.statuses[0].nextRecommendedAction, 'run the LLM end-user testing conveyor');
  assert.equal(fs.existsSync(path.join(rootDir, 'docs', 'features', '_STATUS.implemented.not-tested.implemented-feature.md')), true);
});

test('keeps QA pass separate from deterministic promotion', () => {
  const rootDir = makesTempRoot();
  writesFeature(rootDir, 'passed-feature.feature.md', 'Passed feature', 'Passes QA');
  writesProof(rootDir, 'passed-feature', 'passes-qa');
  writesQaBundle(rootDir, {
    releaseCandidateId: 'rc-001',
    qaRunId: 'qa-001',
    featureId: 'passed-feature',
    scenarioId: 'passes-qa',
    scenarioName: 'Passes QA',
    qaStatus: 'QA passed',
    qualityGateDecision: 'QA passed',
    promotable: false,
  });

  const result = writesFeatureStatusProjection({
    rootDir,
    generatedAt: '2026-07-10T00:00:00.000Z',
  });

  assert.equal(result.statuses[0].displayStatus, 'qa-passed');
  assert.equal(result.statuses[0].promotionStatus, 'not promoted');
  assert.equal(result.statuses[0].nextRecommendedAction, 'run deterministic promotion gate');
  assert.match(
    fs.readFileSync(path.join(rootDir, 'docs', 'features', '_STATUS.qa-passed.passed-feature.md'), 'utf8'),
    /QA passed is not the same as release promotion/,
  );
});

test('writes product-owner board JSON, Markdown, and tree projections', () => {
  const rootDir = makesTempRoot();
  writesFeature(rootDir, 'blocked-feature.feature.md', 'Blocked feature', 'Blocks QA');
  writesProof(rootDir, 'blocked-feature', 'blocks-qa');
  writesQaBundle(rootDir, {
    releaseCandidateId: 'rc-002',
    qaRunId: 'qa-002',
    featureId: 'blocked-feature',
    scenarioId: 'blocks-qa',
    scenarioName: 'Blocks QA',
    qaStatus: 'QA attempted blocked',
    qualityGateDecision: 'BLOCKED',
    blockerCodes: ['missing-evidence-report-md'],
  });

  const result = writesFeatureQualityBoardProjection({
    rootDir,
    generatedAt: '2026-07-10T00:00:00.000Z',
  });
  const boardPath = path.join(rootDir, 'docs', 'features', '_FEATURE-QUALITY-BOARD.md');
  const boardJsonPath = path.join(rootDir, 'docs', 'features', '_FEATURE-QUALITY-BOARD.v1.json');
  const treePath = path.join(rootDir, 'docs', 'features', '_FEATURE-QUALITY-TREE.txt');
  const board = JSON.parse(fs.readFileSync(boardJsonPath, 'utf8'));

  assert.equal(fs.existsSync(boardPath), true);
  assert.equal(fs.existsSync(treePath), true);
  assert.equal(board.totalFeatures, 1);
  assert.equal(board.featuresQaBlocked, 1);
  assert.equal(board.boardRows[0].displayStatus, 'qa-blocked');
  assert.equal(board.boardRows[0].topBlockerCode, 'missing-evidence-report-md');
  assert.match(fs.readFileSync(boardPath, 'utf8'), /PI Summary Counts/);
  assert.match(fs.readFileSync(treePath, 'utf8'), /_STATUS\.qa-blocked\.blocked-feature\.md/);
  assert.equal(result.findings.length, 0);
});

test('records sentinel mismatch as a board finding and replaces obsolete status files', () => {
  const rootDir = makesTempRoot();
  writesFeature(rootDir, 'drift-feature.feature.md', 'Drift feature');
  const featuresRoot = path.join(rootDir, 'docs', 'features');
  const obsoletePath = path.join(featuresRoot, '_STATUS.qa-passed.drift-feature.md');
  fs.writeFileSync(obsoletePath, '# hand authored stale claim\n\n- display status: qa-passed\n', 'utf8');

  const result = writesFeatureQualityBoardProjection({
    rootDir,
    generatedAt: '2026-07-10T00:00:00.000Z',
  });

  assert.equal(fs.existsSync(obsoletePath), false);
  assert.equal(fs.existsSync(path.join(featuresRoot, '_STATUS.not-implemented.drift-feature.md')), true);
  assert.equal(result.findings.some((finding) => finding.code === 'feature-status-filesystem-mismatch'), true);
  assert.equal(result.board.boardRows[0].displayStatus, 'stale');
});

test('records duplicate status sentinel finding before cleanup', () => {
  const rootDir = makesTempRoot();
  writesFeature(rootDir, 'duplicate-feature.feature.md', 'Duplicate feature');
  const featuresRoot = path.join(rootDir, 'docs', 'features');
  fs.writeFileSync(path.join(featuresRoot, '_STATUS.qa-passed.duplicate-feature.md'), '# generated-ish\n\n## Generated Signature\n', 'utf8');
  fs.writeFileSync(path.join(featuresRoot, '_STATUS.qa-blocked.duplicate-feature.md'), '# generated-ish\n\n## Generated Signature\n', 'utf8');

  const result = writesFeatureQualityBoardProjection({
    rootDir,
    generatedAt: '2026-07-10T00:00:00.000Z',
  });

  assert.equal(
    result.findings.some((finding) => finding.code === 'duplicate-feature-status-sentinel'),
    true,
  );
  assert.equal(fs.existsSync(path.join(featuresRoot, '_STATUS.not-implemented.duplicate-feature.md')), true);
});

test('marks a previously passing status stale when the source feature hash changes', () => {
  const rootDir = makesTempRoot();
  const featurePath = writesFeature(rootDir, 'stale-pass.feature.md', 'Stale pass', 'Passes QA');
  writesProof(rootDir, 'stale-pass', 'passes-qa');
  writesQaBundle(rootDir, {
    releaseCandidateId: 'rc-003',
    qaRunId: 'qa-003',
    featureId: 'stale-pass',
    scenarioId: 'passes-qa',
    scenarioName: 'Passes QA',
    qaStatus: 'QA passed',
    qualityGateDecision: 'QA passed',
    promotable: false,
  });

  writesFeatureStatusProjection({
    rootDir,
    generatedAt: '2026-07-10T00:00:00.000Z',
  });
  fs.appendFileSync(featurePath, '\n<!-- changed after QA evidence -->\n', 'utf8');

  const result = writesFeatureStatusProjection({
    rootDir,
    generatedAt: '2026-07-10T00:00:00.000Z',
  });

  assert.equal(result.statuses[0].displayStatus, 'stale');
  assert.equal(result.statuses[0].promotionStatus, 'not promoted');
  assert.deepEqual(result.statuses[0].staleReasons, [
    'source-feature-content-hash changed: docs/features/stale-pass.feature.md',
  ]);
  assert.equal(fs.existsSync(path.join(rootDir, 'docs', 'features', '_STATUS.stale.stale-pass.md')), true);
});
