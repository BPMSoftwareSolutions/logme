const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { buildsFeatureProofBodyPath, readsScenarioProofsFromRun, runsFeatureProofPromotion } = require('../src/runs-feature-proof-promotion/runs-feature-proof-promotion');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function seedsFeatureFile(tempDir, featureId) {
  writesFile(
    path.join(tempDir, 'docs', 'features', `${featureId}.feature.md`),
    [
      '```gherkin',
      'Feature: Feature X',
      '',
      '  Scenario: Scenario A',
      '    Given a precondition',
      '    Then an outcome',
      '',
      '  Scenario: Scenario B',
      '    Given a precondition',
      '    Then an outcome',
      '```',
      '',
    ].join('\n'),
  );
}

function seedsScenarioRunArtifacts(tempDir, runId, featureId, scenarioId, overrides = {}) {
  const scenarioDir = path.join(tempDir, 'evidence', 'runs', runId, 'features', featureId, 'scenarios', scenarioId);
  const proof = {
    schemaVersion: 'feature-execution.contract.v1',
    runId,
    featureId,
    scenarioId,
    scenarioName: overrides.scenarioName || 'Scenario A',
    generatedAt: overrides.generatedAt || '2026-07-09T12:00:05.000Z',
    acceptanceSource: { path: `docs/features/${featureId}.feature.md`, lineRange: { start: 4, end: 6 } },
    promotionDecision: overrides.promotionDecision || { status: 'proven', blockerCodes: [] },
  };
  writesFile(path.join(scenarioDir, 'feature-execution.contract.v1.json'), JSON.stringify(proof, null, 2));
  writesFile(path.join(scenarioDir, 'executable-body-contract.report.md'), '# report\n');
  return scenarioDir;
}

test('readsScenarioProofsFromRun reads every scenario proof for a feature and hashes its artifacts', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-feature-proof-'));

  try {
    seedsScenarioRunArtifacts(tempDir, 'run-1', 'feature-x', 'scenario-a');

    const scenarioProofs = readsScenarioProofsFromRun(tempDir, 'run-1', 'feature-x');

    assert.equal(scenarioProofs.length, 1);
    assert.equal(scenarioProofs[0].scenarioId, 'scenario-a');
    assert.ok(scenarioProofs[0].artifactHashes['feature-execution.contract.v1.json']);
    assert.ok(scenarioProofs[0].artifactHashes['executable-body-contract.report.md']);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('readsScenarioProofsFromRun returns an empty list when the run has no evidence for the feature', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-feature-proof-'));

  try {
    const scenarioProofs = readsScenarioProofsFromRun(tempDir, 'missing-run', 'feature-x');
    assert.deepEqual(scenarioProofs, []);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('runsFeatureProofPromotion performs a dry run by default and does not write the proof body', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-feature-proof-'));

  try {
    seedsFeatureFile(tempDir, 'feature-x');
    seedsScenarioRunArtifacts(tempDir, 'run-1', 'feature-x', 'scenario-a', { scenarioName: 'Scenario A' });
    seedsScenarioRunArtifacts(tempDir, 'run-1', 'feature-x', 'scenario-b', { scenarioName: 'Scenario B' });

    const result = runsFeatureProofPromotion({ rootDir: tempDir }, 'feature-x', 'run-1');

    assert.equal(result.written, false);
    assert.equal(fs.existsSync(buildsFeatureProofBodyPath(tempDir, 'feature-x')), false);
    assert.equal(result.body.promotionDecision, 'proven');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('runsFeatureProofPromotion writes docs/feature-proofs/<feature-id>.proof.md when write is true', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-feature-proof-'));

  try {
    seedsFeatureFile(tempDir, 'feature-x');
    seedsScenarioRunArtifacts(tempDir, 'run-1', 'feature-x', 'scenario-a', { scenarioName: 'Scenario A' });
    seedsScenarioRunArtifacts(tempDir, 'run-1', 'feature-x', 'scenario-b', { scenarioName: 'Scenario B' });

    const result = runsFeatureProofPromotion({ rootDir: tempDir }, 'feature-x', 'run-1', { write: true });

    assert.equal(result.written, true);
    const proofBodyPath = buildsFeatureProofBodyPath(tempDir, 'feature-x');
    assert.equal(proofBodyPath, path.join(tempDir, 'docs', 'feature-proofs', 'feature-x.proof.md'));

    const written = fs.readFileSync(proofBodyPath, 'utf8');
    assert.match(written, /selected proof run id: run-1/u);
    assert.match(written, new RegExp(`proof body hash: ${result.bodyHash}`, 'u'));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('runsFeatureProofPromotion leaves the feature not proven when one scenario is missing from the run', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-feature-proof-'));

  try {
    seedsFeatureFile(tempDir, 'feature-x');
    seedsScenarioRunArtifacts(tempDir, 'run-1', 'feature-x', 'scenario-a', { scenarioName: 'Scenario A' });

    const result = runsFeatureProofPromotion({ rootDir: tempDir }, 'feature-x', 'run-1', { write: true });

    assert.equal(result.body.promotionDecision, 'not proven');
    assert.deepEqual(result.body.scenarioCoverageSummary.missingScenarios, ['scenario-b']);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
