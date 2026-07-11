const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildsFeatureProofBody,
  computesFeatureProofBodyHash,
  findsMissingScenarios,
  rendersFeatureProofBody,
} = require('../src/promotes-feature-execution-proof/promotes-feature-execution-proof');

function buildsScenarioProof(overrides = {}) {
  return {
    scenarioId: 'write-canonical-json-execution-proof-for-a-scenario',
    scenarioName: 'Write canonical JSON execution proof for a scenario',
    runId: 'run-123',
    acceptanceSourceLineRange: { start: 33, end: 62 },
    proof: {
      generatedAt: '2026-07-09T12:00:05.000Z',
      promotionDecision: { status: 'proven', blockerCodes: [] },
    },
    artifactHashes: { 'feature-execution.contract.v1.json': 'abc123' },
    ...overrides,
  };
}

test('buildsFeatureProofBody marks the feature proven when every current scenario is proven and covered', () => {
  const body = buildsFeatureProofBody({
    featureId: 'feature-execution-proof-source-of-truth',
    featureName: 'Feature execution proof source of truth',
    sourceFeaturePath: 'docs/features/feature-execution-proof-source-of-truth.feature.md',
    sourceFeatureContent: 'Feature: Feature execution proof source of truth',
    currentScenarios: [{ scenarioId: 'write-canonical-json-execution-proof-for-a-scenario', scenarioName: 'Write canonical JSON execution proof for a scenario' }],
    scenarioProofs: [buildsScenarioProof()],
    selectedProofRunId: 'run-123',
    proofRunGeneratedAt: '2026-07-09T12:00:05.000Z',
    generatedAt: '2026-07-09T13:00:00.000Z',
  });

  assert.equal(body.promotionDecision, 'proven');
  assert.equal(body.scenarioCoverageSummary.totalScenarios, 1);
  assert.equal(body.scenarioCoverageSummary.provenScenarios, 1);
  assert.deepEqual(body.scenarioCoverageSummary.missingScenarios, []);
  assert.equal(body.scenarioSections[0].proofStatus, 'proven');
});

test('buildsFeatureProofBody keeps the feature not proven when a current scenario has no proof coverage', () => {
  const body = buildsFeatureProofBody({
    featureId: 'feature-execution-proof-source-of-truth',
    featureName: 'Feature execution proof source of truth',
    sourceFeaturePath: 'docs/features/feature-execution-proof-source-of-truth.feature.md',
    sourceFeatureContent: 'Feature: Feature execution proof source of truth',
    currentScenarios: [
      { scenarioId: 'write-canonical-json-execution-proof-for-a-scenario', scenarioName: 'Write canonical JSON execution proof for a scenario' },
      { scenarioId: 'a-scenario-with-no-run-coverage', scenarioName: 'A scenario with no run coverage' },
    ],
    scenarioProofs: [buildsScenarioProof()],
    selectedProofRunId: 'run-123',
  });

  assert.equal(body.promotionDecision, 'not proven');
  assert.deepEqual(body.scenarioCoverageSummary.missingScenarios, ['a-scenario-with-no-run-coverage']);
});

test('buildsFeatureProofBody surfaces blocker codes from blocked scenario proofs', () => {
  const body = buildsFeatureProofBody({
    featureId: 'feature-x',
    featureName: 'Feature X',
    sourceFeaturePath: 'docs/features/feature-x.feature.md',
    sourceFeatureContent: 'Feature: Feature X',
    currentScenarios: [{ scenarioId: 'scenario-a', scenarioName: 'Scenario A' }],
    scenarioProofs: [
      buildsScenarioProof({
        scenarioId: 'scenario-a',
        scenarioName: 'Scenario A',
        proof: { generatedAt: '2026-07-09T12:00:05.000Z', promotionDecision: { status: 'blocked', blockerCodes: ['method-call-receipt-missing'] } },
      }),
    ],
    selectedProofRunId: 'run-123',
  });

  assert.equal(body.promotionDecision, 'not proven');
  assert.equal(body.scenarioSections[0].proofStatus, 'not proven');
  assert.deepEqual(body.blockerSummary, ['method-call-receipt-missing']);
});

test('findsMissingScenarios reports scenarios with no matching proof', () => {
  const missing = findsMissingScenarios(
    [{ scenarioId: 'a' }, { scenarioId: 'b' }],
    [{ scenarioId: 'a' }],
  );

  assert.deepEqual(missing, ['b']);
});

test('computesFeatureProofBodyHash is stable for identical bodies and changes when a scenario section changes', () => {
  const body = buildsFeatureProofBody({
    featureId: 'feature-x',
    featureName: 'Feature X',
    sourceFeaturePath: 'docs/features/feature-x.feature.md',
    sourceFeatureContent: 'Feature: Feature X',
    currentScenarios: [{ scenarioId: 'scenario-a', scenarioName: 'Scenario A' }],
    scenarioProofs: [buildsScenarioProof({ scenarioId: 'scenario-a', scenarioName: 'Scenario A' })],
    selectedProofRunId: 'run-123',
  });

  const hashA = computesFeatureProofBodyHash(body);
  const hashB = computesFeatureProofBodyHash(JSON.parse(JSON.stringify(body)));
  assert.equal(hashA, hashB);

  const changedBody = { ...body, selectedProofRunId: 'run-456' };
  assert.notEqual(computesFeatureProofBodyHash(changedBody), hashA);
});

test('rendersFeatureProofBody includes required sections and cites the selected run id and artifact hashes', () => {
  const body = buildsFeatureProofBody({
    featureId: 'feature-x',
    featureName: 'Feature X',
    sourceFeaturePath: 'docs/features/feature-x.feature.md',
    sourceFeatureContent: 'Feature: Feature X',
    currentScenarios: [{ scenarioId: 'scenario-a', scenarioName: 'Scenario A' }],
    scenarioProofs: [buildsScenarioProof({ scenarioId: 'scenario-a', scenarioName: 'Scenario A' })],
    selectedProofRunId: 'run-123',
  });

  const rendered = rendersFeatureProofBody(body, '/repo');

  assert.match(rendered, /## Feature Identity/u);
  assert.match(rendered, /## Selected Proof Run/u);
  assert.match(rendered, /## Scenario Coverage Summary/u);
  assert.match(rendered, /## Scenario Execution Outcomes/u);
  assert.match(rendered, /## Promotion Decision/u);
  assert.match(rendered, /## Blocker Summary/u);
  assert.match(rendered, /## Proof Run Artifact Hashes/u);
  assert.match(rendered, /## Regeneration Command/u);
  assert.match(rendered, /selected proof run id: run-123/u);
  assert.match(rendered, /"feature-execution\.contract\.v1\.json": "abc123"/u);
});
