const test = require('node:test');
const assert = require('node:assert/strict');

const { parsesLlmHarnessOutput, mintsHarnessId } = require('../src/parses-llm-harness-output/parses-llm-harness-output');

function buildsAssignment(overrides = {}) {
  return {
    runId: 'run-001',
    allowedMutationPaths: ['src/generated-harnesses/harness-abc/'],
    requestedCapability: 'first-flow',
    ...overrides,
  };
}

function buildsSuccessfulWorkerResult(rawOutputObject) {
  return {
    runId: 'run-001',
    rawResponseText: JSON.stringify(rawOutputObject),
    callFailure: null,
  };
}

function buildsValidRawOutput(overrides = {}) {
  return {
    harnessId: 'llm-suggested-id-should-be-ignored',
    proposalStatus: 'proposed',
    bodyContractDraft: JSON.stringify({ featureId: 'first-flow' }),
    executionPathDraft: JSON.stringify({ steps: ['receive-input', 'execute-flow'] }),
    testPlanDraft: JSON.stringify({ scenarios: [] }),
    telemetryRequirementsDraft: JSON.stringify({ requiredSteps: ['receive-input', 'execute-flow'] }),
    receiptCoverageDraft: JSON.stringify({ plannedReceipts: ['execution.receipt.v1.json'] }),
    ...overrides,
  };
}

test('mintsHarnessId is deterministic for the same assignment', () => {
  const assignment = buildsAssignment();

  assert.equal(mintsHarnessId(assignment), mintsHarnessId(assignment));
  assert.match(mintsHarnessId(assignment), /^harness-[a-f0-9]{12}$/);
});

test('mintsHarnessId differs for different run ids', () => {
  const idOne = mintsHarnessId(buildsAssignment({ runId: 'run-001' }));
  const idTwo = mintsHarnessId(buildsAssignment({ runId: 'run-002' }));

  assert.notEqual(idOne, idTwo);
});

test('parsesLlmHarnessOutput mints its own harnessId, ignoring any id the LLM suggested', () => {
  const assignment = buildsAssignment();
  const workerResult = buildsSuccessfulWorkerResult(buildsValidRawOutput());

  const parsed = parsesLlmHarnessOutput(workerResult, assignment);

  assert.equal(parsed.proposalStatus, 'proposed');
  assert.equal(parsed.harnessId, mintsHarnessId(assignment));
  assert.notEqual(parsed.harnessId, 'llm-suggested-id-should-be-ignored');
});

test('parsesLlmHarnessOutput parses JSON-encoded draft fields into objects', () => {
  const assignment = buildsAssignment();
  const workerResult = buildsSuccessfulWorkerResult(buildsValidRawOutput());

  const parsed = parsesLlmHarnessOutput(workerResult, assignment);

  assert.deepEqual(parsed.bodyContractDraft, { featureId: 'first-flow' });
  assert.deepEqual(parsed.executionPathDraft, { steps: ['receive-input', 'execute-flow'] });
  assert.equal(parsed.parseFailureReason, null);
});

test('parsesLlmHarnessOutput rejects as unparseable when the worker call failed', () => {
  const assignment = buildsAssignment();
  const workerResult = { runId: 'run-001', rawResponseText: null, callFailure: { type: 'rate-limit-error', message: 'too many requests' } };

  const parsed = parsesLlmHarnessOutput(workerResult, assignment);

  assert.equal(parsed.proposalStatus, 'rejected-unparseable');
  assert.equal(parsed.bodyContractDraft, null);
  assert.match(parsed.parseFailureReason, /rate-limit-error/);
});

test('parsesLlmHarnessOutput rejects as unparseable when the response text is not valid JSON', () => {
  const assignment = buildsAssignment();
  const workerResult = { runId: 'run-001', rawResponseText: 'not json at all {{{', callFailure: null };

  const parsed = parsesLlmHarnessOutput(workerResult, assignment);

  assert.equal(parsed.proposalStatus, 'rejected-unparseable');
  assert.match(parsed.parseFailureReason, /not valid JSON/);
});

test('parsesLlmHarnessOutput rejects as unparseable when a required draft field is missing', () => {
  const assignment = buildsAssignment();
  const rawOutput = buildsValidRawOutput();
  delete rawOutput.telemetryRequirementsDraft;
  const workerResult = buildsSuccessfulWorkerResult(rawOutput);

  const parsed = parsesLlmHarnessOutput(workerResult, assignment);

  assert.equal(parsed.proposalStatus, 'rejected-unparseable');
  assert.match(parsed.parseFailureReason, /telemetryRequirementsDraft/);
});

test('parsesLlmHarnessOutput never returns proposalStatus "proposed" for a partially-parsed object', () => {
  const assignment = buildsAssignment();
  const workerResult = { runId: 'run-001', rawResponseText: '{"bodyContractDraft": "{}"}', callFailure: null };

  const parsed = parsesLlmHarnessOutput(workerResult, assignment);

  assert.equal(parsed.proposalStatus, 'rejected-unparseable');
});
