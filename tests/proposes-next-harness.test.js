const test = require('node:test');
const assert = require('node:assert/strict');

const { proposesNextHarness } = require('../src/proposes-next-harness/proposes-next-harness');

function buildsPromotedDecision(overrides = {}) {
  return {
    schemaVersion: 'harness-promotion-decision.schema.v1',
    harnessId: 'harness-abc',
    runId: 'run-001',
    decision: 'PROMOTED',
    reason: 'telemetry and receipt coverage independently tied out',
    requiredFindingsMustBeZero: [],
    ...overrides,
  };
}

test('proposesNextHarness builds a proposal-only llm-harness-request for the next generation', () => {
  const proposal = proposesNextHarness(buildsPromotedDecision(), { leasedPaths: [], writtenFiles: [] }, 'second-flow');

  assert.equal(proposal.schemaVersion, 'llm-harness-request.schema.v1');
  assert.equal(proposal.parentHarnessId, 'harness-abc');
  assert.equal(proposal.requestedCapability, 'second-flow');
  assert.equal(proposal.proposalOnly, true);
  assert.match(proposal.parentBodyContractRef, /harness-abc[\\/]body-contract\.json/);
  assert.match(proposal.parentSelfConformanceReceiptRef, /run-001[\\/]harness-execution\.receipt\.v1\.json/);
  assert.ok(proposal.allowedMutationPaths[0].startsWith('src/generated-harnesses/'));
});

test('proposesNextHarness throws when the promotion decision is BLOCKED', () => {
  const blockedDecision = buildsPromotedDecision({ decision: 'BLOCKED' });

  assert.throws(
    () => proposesNextHarness(blockedDecision, { leasedPaths: [], writtenFiles: [] }, 'second-flow'),
    /PROMOTED/,
  );
});

test('proposesNextHarness never returns a harness-promotion-decision shape', () => {
  const proposal = proposesNextHarness(buildsPromotedDecision(), { leasedPaths: [], writtenFiles: [] }, 'second-flow');

  assert.equal(proposal.schemaVersion, 'llm-harness-request.schema.v1');
  assert.notEqual(proposal.schemaVersion, 'harness-promotion-decision.schema.v1');
  assert.equal(proposal.decision, undefined);
});

test('proposesNextHarness mints a fresh runId distinct from the parent runId', () => {
  const proposal = proposesNextHarness(buildsPromotedDecision(), { leasedPaths: [], writtenFiles: [] }, 'second-flow');

  assert.notEqual(proposal.runId, 'run-001');
  assert.match(proposal.runId, /^run-[a-f0-9]{12}$/);
});
