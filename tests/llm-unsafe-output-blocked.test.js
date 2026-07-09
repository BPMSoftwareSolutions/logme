const test = require('node:test');
const assert = require('node:assert/strict');
const { buildsLlmHarnessAssignment } = require('../src/builds-llm-harness-assignment/builds-llm-harness-assignment');
const { callsLlmHarnessWorker } = require('../src/calls-llm-harness-worker/calls-llm-harness-worker');
const { parsesLlmHarnessOutput } = require('../src/parses-llm-harness-output/parses-llm-harness-output');

function buildsAssignment(runId) {
  return buildsLlmHarnessAssignment({
    runId,
    parentHarnessId: null,
    parentBodyContractRef: null,
    parentSelfConformanceReceiptRef: null,
    allowedMutationPaths: ['src/generated-harnesses/harness-unsafe-output/'],
    requestedCapability: 'first-flow',
  });
}

function buildsFetchResponse(rawText) {
  return {
    ok: true,
    status: 200,
    headers: { get() { return null; } },
    async json() {
      return {
        candidates: [{
          finishReason: 'STOP',
          content: { parts: [{ text: rawText }] },
        }],
        usageMetadata: { promptTokenCount: 1, candidatesTokenCount: 1 },
      };
    },
    async text() {
      return rawText;
    },
  };
}

test('llmUnsafeOutputBlocked rejects a response that is not parseable JSON before validation can run', async () => {
  const assignment = buildsAssignment('run-004');

  const workerResult = await callsLlmHarnessWorker(assignment, {
    apiKey: 'test-key',
    fetchImpl: async function fakeFetch() {
      return buildsFetchResponse('not json at all {{{');
    },
  });

  const parsedOutput = parsesLlmHarnessOutput(workerResult, assignment);

  assert.equal(parsedOutput.proposalStatus, 'rejected-unparseable');
  assert.equal(parsedOutput.bodyContractDraft, null);
  assert.match(parsedOutput.parseFailureReason, /not valid JSON/);
});
