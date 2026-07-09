const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { buildsLlmHarnessAssignment } = require('../src/builds-llm-harness-assignment/builds-llm-harness-assignment');
const { callsLlmHarnessWorker } = require('../src/calls-llm-harness-worker/calls-llm-harness-worker');
const { parsesLlmHarnessOutput } = require('../src/parses-llm-harness-output/parses-llm-harness-output');
const { validatesGeneratedHarness } = require('../src/validates-generated-harness/validates-generated-harness');

function buildsAssignment(runId) {
  return buildsLlmHarnessAssignment({
    runId,
    parentHarnessId: null,
    parentBodyContractRef: null,
    parentSelfConformanceReceiptRef: null,
    allowedMutationPaths: ['src/generated-harnesses/harness-conformance/'],
    requestedCapability: 'first-flow',
  });
}

function buildsFetchResponse(rawOutput) {
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

test('generatedHarnessConformance blocks a harness that exits non-zero at the runtime truth gate', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-generated-harness-conformance-'));
  const generatedHarnessesRoot = path.join(tempDir, 'src', 'generated-harnesses');

  try {
    const assignment = buildsAssignment('run-002');
    const rawOutput = {
      runId: assignment.runId,
      harnessId: 'ignored-by-parser',
      proposalStatus: 'proposed',
      bodyContractDraft: JSON.stringify({ featureId: 'fractal-llm-harness' }),
      executionPathDraft: JSON.stringify({ steps: ['receive-input', 'execute-flow'] }),
      testPlanDraft: JSON.stringify({ scenarios: ['runtime truth gate'] }),
      telemetryRequirementsDraft: JSON.stringify({ requiredSteps: ['receive-input', 'execute-flow'] }),
      receiptCoverageDraft: JSON.stringify({ plannedReceipts: ['execution.receipt.v1.json'] }),
    };

    const workerResult = await callsLlmHarnessWorker(assignment, {
      apiKey: 'test-key',
      fetchImpl: async function fakeFetch() {
        return buildsFetchResponse(rawOutput);
      },
    });

    const parsedOutput = parsesLlmHarnessOutput(workerResult, assignment);
    const validationResult = validatesGeneratedHarness(parsedOutput, assignment);

    assert.equal(validationResult.isValid, true);

    const { materializesApprovedHarness } = require('../src/materializes-approved-harness/materializes-approved-harness');
    const { runsGeneratedHarness } = require('../src/runs-generated-harness/runs-generated-harness');
    const { verifiesGeneratedHarness } = require('../src/verifies-generated-harness/verifies-generated-harness');

    const materializationResult = materializesApprovedHarness(parsedOutput, validationResult, {
      generatedHarnessesRoot,
    });

    fs.appendFileSync(materializationResult.entryFilePath, '\nprocess.exitCode = 7;\n', 'utf8');

    const runResult = runsGeneratedHarness(materializationResult);
    fs.writeFileSync(path.join(path.dirname(materializationResult.entryFilePath), 'execution.receipt.v1.json'), '{}\n', 'utf8');

    const promotionDecision = verifiesGeneratedHarness(materializationResult, runResult, parsedOutput);

    assert.equal(promotionDecision.decision, 'BLOCKED');
    assert.equal(promotionDecision.requiredFindingsMustBeZero.some(function hasExitFinding(finding) {
      return finding.code === 'generated-harness-missing-testimony';
    }), true);
    assert.equal(promotionDecision.selfPromotionAttempted, false);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
