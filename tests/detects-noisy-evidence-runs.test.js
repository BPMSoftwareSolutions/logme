const test = require('node:test');
const assert = require('node:assert/strict');

const { detectsNoisyEvidenceRuns, NOISY_FINDING_CODE } = require('../src/detects-noisy-evidence-runs/detects-noisy-evidence-runs');

function buildsTieOutContext(overrides = {}) {
  return {
    featureIndexedRunIds: new Set(),
    piDigestRunIds: new Set(),
    latestEvidenceRunIds: new Set(),
    ...overrides,
  };
}

function buildsNoisyRun(overrides = {}) {
  const artifactPaths = Array.from({ length: 30 }, (_, index) => `evidence/runs/run-1/artifact-${index}.json`);
  return {
    runId: 'run-1',
    artifactCount: 30,
    artifactPaths,
    ...overrides,
  };
}

test('detectsNoisyEvidenceRuns flags a run with many artifacts and no compact report', () => {
  const findings = detectsNoisyEvidenceRuns([buildsNoisyRun()], buildsTieOutContext());

  assert.equal(findings.length, 1);
  assert.equal(findings[0].finding, NOISY_FINDING_CODE);
  assert.equal(findings[0].runId, 'run-1');
  assert.ok(findings[0].recommendedFixes.length > 0);
});

test('detectsNoisyEvidenceRuns does not flag a run with a compact report artifact', () => {
  const run = buildsNoisyRun({ artifactPaths: ['evidence/runs/run-1/summary.report.md'] });

  const findings = detectsNoisyEvidenceRuns([run], buildsTieOutContext());

  assert.deepEqual(findings, []);
});

test('detectsNoisyEvidenceRuns does not flag a run indexed by the feature evidence index', () => {
  const run = buildsNoisyRun();

  const findings = detectsNoisyEvidenceRuns([run], buildsTieOutContext({ featureIndexedRunIds: new Set(['run-1']) }));

  assert.deepEqual(findings, []);
});

test('detectsNoisyEvidenceRuns does not flag a run below the artifact count threshold', () => {
  const run = buildsNoisyRun({ artifactCount: 3, artifactPaths: ['a.json', 'b.json', 'c.json'] });

  const findings = detectsNoisyEvidenceRuns([run], buildsTieOutContext());

  assert.deepEqual(findings, []);
});
