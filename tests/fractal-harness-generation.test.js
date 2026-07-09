const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { buildsLlmHarnessAssignment } = require('../src/builds-llm-harness-assignment/builds-llm-harness-assignment');
const { callsLlmHarnessWorker } = require('../src/calls-llm-harness-worker/calls-llm-harness-worker');
const { parsesLlmHarnessOutput } = require('../src/parses-llm-harness-output/parses-llm-harness-output');
const { validatesGeneratedHarness } = require('../src/validates-generated-harness/validates-generated-harness');
const { materializesApprovedHarness } = require('../src/materializes-approved-harness/materializes-approved-harness');
const { runsGeneratedHarness } = require('../src/runs-generated-harness/runs-generated-harness');
const { verifiesGeneratedHarness } = require('../src/verifies-generated-harness/verifies-generated-harness');
const { writesHarnessReceipt } = require('../src/writes-harness-receipt/writes-harness-receipt');
const { proposesNextHarness } = require('../src/proposes-next-harness/proposes-next-harness');

function buildsAssignmentRequest(runId) {
  return buildsLlmHarnessAssignment({
    runId,
    parentHarnessId: null,
    parentBodyContractRef: null,
    parentSelfConformanceReceiptRef: null,
    allowedMutationPaths: ['src/generated-harnesses/harness-generation/'],
    requestedCapability: 'first-flow',
  });
}

function buildsSuccessfulFetchResponse(rawOutput) {
  return {
    ok: true,
    status: 200,
    headers: { get() { return null; } },
    async json() {
      return {
        candidates: [{
          finishReason: 'STOP',
          content: { parts: [{ text: JSON.stringify(rawOutput) }] },
        }],
        usageMetadata: { promptTokenCount: 2, candidatesTokenCount: 3 },
      };
    },
    async text() { return JSON.stringify(rawOutput); },
  };
}

function buildsSuccessfulRawOutput(assignment) {
  return {
    runId: assignment.runId,
    harnessId: 'llm-suggested-id-is-ignored',
    proposalStatus: 'proposed',
    bodyContractDraft: JSON.stringify({
      featureId: 'fractal-llm-harness',
      summary: 'The child harness proposes a bounded first flow.',
    }),
    executionPathDraft: JSON.stringify({
      steps: ['receive-input', 'execute-flow'],
    }),
    testPlanDraft: JSON.stringify({
      scenarios: ['happy path promotion'],
    }),
    telemetryRequirementsDraft: JSON.stringify({
      requiredSteps: ['receive-input', 'execute-flow'],
    }),
    receiptCoverageDraft: JSON.stringify({
      plannedReceipts: ['execution.receipt.v1.json'],
    }),
  };
}

test('fractalHarnessGeneration promotes a valid child harness and seeds the next request', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-fractal-harness-generation-'));
  const generatedHarnessesRoot = path.join(tempDir, 'src', 'generated-harnesses');

  try {
    const assignment = buildsAssignmentRequest('run-001');
    const fakeFetch = async function fakeFetch() {
      return buildsSuccessfulFetchResponse(buildsSuccessfulRawOutput(assignment));
    };

    const workerResult = await callsLlmHarnessWorker(assignment, { apiKey: 'test-key', fetchImpl: fakeFetch });
    const parsedOutput = parsesLlmHarnessOutput(workerResult, assignment);
    const validationResult = validatesGeneratedHarness(parsedOutput, assignment);

    assert.equal(validationResult.isValid, true);
    assert.deepEqual(validationResult.findings, []);

    const materializationResult = materializesApprovedHarness(parsedOutput, validationResult, {
      generatedHarnessesRoot,
    });

    assert.equal(fs.existsSync(materializationResult.entryFilePath), true);

    const runResult = runsGeneratedHarness(materializationResult);
    const harnessReceiptPath = path.join(path.dirname(materializationResult.entryFilePath), 'execution.receipt.v1.json');
    fs.writeFileSync(harnessReceiptPath, '{}\n', 'utf8');

    const promotionDecision = verifiesGeneratedHarness(materializationResult, runResult, parsedOutput);
    assert.equal(promotionDecision.decision, 'PROMOTED');
    assert.equal(promotionDecision.telemetryTieOut.matches, true);
    assert.equal(promotionDecision.receiptTieOut.matches, true);
    assert.equal(promotionDecision.selfPromotionAttempted, false);

    const receiptResult = writesHarnessReceipt(promotionDecision, materializationResult, runResult, {
      evidenceRoot: tempDir,
      geminiAttestation: workerResult,
    });

    assert.equal(receiptResult.receiptContent.promotionDecision.decision, 'PROMOTED');
    assert.equal(fs.existsSync(receiptResult.receiptPath), true);
    assert.equal(receiptResult.receiptContent.signing.provider, 'gemini');
    assert.equal(receiptResult.receiptContent.signing.model, 'gemini-2.5-flash');

    const nextRequest = proposesNextHarness(promotionDecision, materializationResult, 'second-flow');
    assert.equal(nextRequest.schemaVersion, 'llm-harness-request.schema.v1');
    assert.equal(nextRequest.proposalOnly, true);
    assert.equal(nextRequest.parentHarnessId, promotionDecision.harnessId);
    assert.ok(nextRequest.allowedMutationPaths[0].startsWith('src/generated-harnesses/'));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
