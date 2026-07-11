const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  MISSING_PROOF_BODY_FINDING,
  MISSING_SCENARIO_FINDING,
  OPT_OUT_REASON,
  STALE_PROOF_BODY_FINDING,
  checksFeatureProofBodyFreshness,
  checksFeatureProofOptOut,
  checksFeatureStatusClaimsProofBody,
} = require('../src/checks-feature-proof-source-truth-gate/checks-feature-proof-source-truth-gate');
const { runsFeatureProofPromotion } = require('../src/runs-feature-proof-promotion/runs-feature-proof-promotion');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function seedsFeatureFile(tempDir, featureId, scenarioNames) {
  const lines = ['```gherkin', 'Feature: Feature X', ''];
  for (const scenarioName of scenarioNames) {
    lines.push(`  Scenario: ${scenarioName}`, '    Given a precondition', '    Then an outcome', '');
  }
  lines.push('```', '');
  writesFile(path.join(tempDir, 'docs', 'features', `${featureId}.feature.md`), lines.join('\n'));
}

function seedsScenarioRunArtifacts(tempDir, runId, featureId, scenarioId, scenarioName) {
  const scenarioDir = path.join(tempDir, 'evidence', 'runs', runId, 'features', featureId, 'scenarios', scenarioId);
  const proof = {
    schemaVersion: 'feature-execution.contract.v1',
    runId,
    featureId,
    scenarioId,
    scenarioName,
    generatedAt: '2026-07-09T12:00:05.000Z',
    acceptanceSource: { path: `docs/features/${featureId}.feature.md`, lineRange: { start: 4, end: 6 } },
    promotionDecision: { status: 'proven', blockerCodes: [] },
  };
  writesFile(path.join(scenarioDir, 'feature-execution.contract.v1.json'), JSON.stringify(proof, null, 2));
}

function seedsPromotedFeature(tempDir, featureId, scenarioNameToId) {
  seedsFeatureFile(tempDir, featureId, Object.values(scenarioNameToId));
  for (const [scenarioId, scenarioName] of Object.entries(scenarioNameToId)) {
    seedsScenarioRunArtifacts(tempDir, 'run-1', featureId, scenarioId, scenarioName);
  }
  runsFeatureProofPromotion({ rootDir: tempDir }, featureId, 'run-1', { write: true });
}

test('checksFeatureStatusClaimsProofBody passes non-proven claims without requiring a proof body', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-gate-'));
  try {
    const result = checksFeatureStatusClaimsProofBody(tempDir, 'feature-x', 'qa-blocked');
    assert.equal(result.verdict, 'PASS');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('checksFeatureStatusClaimsProofBody blocks a proven claim when no proof body is committed', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-gate-'));
  try {
    const result = checksFeatureStatusClaimsProofBody(tempDir, 'feature-x', 'proven');
    assert.equal(result.verdict, 'BLOCKED');
    assert.equal(result.findings[0].code, MISSING_PROOF_BODY_FINDING);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('checksFeatureStatusClaimsProofBody passes a proven claim once a proof body citing the run and hashes exists', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-gate-'));
  try {
    seedsPromotedFeature(tempDir, 'feature-x', { 'scenario-a': 'Scenario A' });

    const result = checksFeatureStatusClaimsProofBody(tempDir, 'feature-x', 'proven');
    assert.equal(result.verdict, 'PASS');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('checksFeatureProofBodyFreshness reports current when the proof body hash still matches the source feature', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-gate-'));
  try {
    seedsPromotedFeature(tempDir, 'feature-x', { 'scenario-a': 'Scenario A' });

    const freshness = checksFeatureProofBodyFreshness(tempDir, 'feature-x');
    assert.equal(freshness.status, 'current');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('checksFeatureProofBodyFreshness reports stale when the feature source document changes after promotion', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-gate-'));
  try {
    seedsPromotedFeature(tempDir, 'feature-x', { 'scenario-a': 'Scenario A' });

    seedsFeatureFile(tempDir, 'feature-x', ['Scenario A', 'Scenario A Extended']);

    const freshness = checksFeatureProofBodyFreshness(tempDir, 'feature-x');
    assert.equal(freshness.status, 'stale');
    assert.equal(freshness.findings[0].code, MISSING_SCENARIO_FINDING);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('checksFeatureProofBodyFreshness reports stale via source hash mismatch when scenario text changes without adding scenarios', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-gate-'));
  try {
    seedsPromotedFeature(tempDir, 'feature-x', { 'scenario-a': 'Scenario A' });

    writesFile(
      path.join(tempDir, 'docs', 'features', 'feature-x.feature.md'),
      ['```gherkin', 'Feature: Feature X', '', '  Scenario: Scenario A', '    Given a changed precondition', '    Then an outcome', '```', ''].join('\n'),
    );

    const freshness = checksFeatureProofBodyFreshness(tempDir, 'feature-x');
    assert.equal(freshness.status, 'stale');
    assert.equal(freshness.findings[0].code, STALE_PROOF_BODY_FINDING);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('checksFeatureProofOptOut opts out routine runs when the proof body is current', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-gate-'));
  try {
    seedsPromotedFeature(tempDir, 'feature-x', { 'scenario-a': 'Scenario A' });

    const optOut = checksFeatureProofOptOut(tempDir, 'feature-x');
    assert.equal(optOut.optedOut, true);
    assert.equal(optOut.optOutReason, OPT_OUT_REASON);
    assert.ok(optOut.proofBodyHash);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('checksFeatureProofOptOut re-enters proof execution when an invalidation condition is supplied', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-gate-'));
  try {
    seedsPromotedFeature(tempDir, 'feature-x', { 'scenario-a': 'Scenario A' });

    const optOut = checksFeatureProofOptOut(tempDir, 'feature-x', ['product owner requests proof refresh']);
    assert.equal(optOut.optedOut, false);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('checksFeatureProofOptOut does not opt out when no proof body has ever been promoted', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-gate-'));
  try {
    seedsFeatureFile(tempDir, 'feature-x', ['Scenario A']);

    const optOut = checksFeatureProofOptOut(tempDir, 'feature-x');
    assert.equal(optOut.optedOut, false);
    assert.equal(optOut.reason, 'no proof body exists');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
