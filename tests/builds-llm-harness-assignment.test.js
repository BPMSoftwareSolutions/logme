const test = require('node:test');
const assert = require('node:assert/strict');

const { buildsLlmHarnessAssignment } = require('../src/builds-llm-harness-assignment/builds-llm-harness-assignment');

function buildsValidRequest(overrides = {}) {
  return {
    runId: 'run-001',
    parentHarnessId: null,
    parentBodyContractRef: null,
    parentSelfConformanceReceiptRef: null,
    allowedMutationPaths: ['src/generated-harnesses/harness-001/'],
    requestedCapability: 'first-flow',
    ...overrides,
  };
}

test('buildsLlmHarnessAssignment builds an assignment with a schema version and assembly timestamp', () => {
  const assignment = buildsLlmHarnessAssignment(buildsValidRequest());

  assert.equal(assignment.schemaVersion, 'llm-harness-request.schema.v1');
  assert.equal(assignment.runId, 'run-001');
  assert.equal(assignment.parentHarnessId, null);
  assert.deepEqual(assignment.allowedMutationPaths, ['src/generated-harnesses/harness-001/']);
  assert.equal(assignment.requestedCapability, 'first-flow');
  assert.equal(typeof assignment.assembledAt, 'string');
  assert.doesNotThrow(() => new Date(assignment.assembledAt).toISOString());
});

test('buildsLlmHarnessAssignment allows null parent fields for a seed harness', () => {
  const assignment = buildsLlmHarnessAssignment(buildsValidRequest({
    parentHarnessId: null,
    parentSelfConformanceReceiptRef: null,
  }));

  assert.equal(assignment.parentHarnessId, null);
  assert.equal(assignment.parentSelfConformanceReceiptRef, null);
});

test('buildsLlmHarnessAssignment throws when a required field is missing', () => {
  const request = buildsValidRequest();
  delete request.allowedMutationPaths;

  assert.throws(
    () => buildsLlmHarnessAssignment(request),
    /allowedMutationPaths/,
  );
});

test('buildsLlmHarnessAssignment throws when requestedCapability is missing', () => {
  const request = buildsValidRequest();
  delete request.requestedCapability;

  assert.throws(
    () => buildsLlmHarnessAssignment(request),
    /requestedCapability/,
  );
});
