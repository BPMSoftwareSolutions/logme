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
    allowedMutationPaths: ['src/generated-harnesses/harness-boundary/'],
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

test('recursiveHarnessBoundary blocks an LLM proposal that tries to mutate outside the generated-harness lease', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-recursive-harness-boundary-'));

  try {
    const assignment = buildsAssignment('run-003');
    const rawOutput = {
      runId: assignment.runId,
      harnessId: 'ignored-by-parser',
      proposalStatus: 'proposed',
      bodyContractDraft: JSON.stringify({
        featureId: 'fractal-llm-harness',
        targetFile: 'src/some-other-module/index.js',
      }),
      executionPathDraft: JSON.stringify({ steps: ['receive-input', 'execute-flow'] }),
      testPlanDraft: JSON.stringify({ scenarios: ['boundary check'] }),
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

    assert.equal(validationResult.isValid, false);
    assert.ok(validationResult.findings.some(function hasForbiddenMutationFinding(finding) {
      return finding.code === 'llm-proposed-forbidden-mutation';
    }));
    assert.equal(fs.existsSync(path.join(tempDir, 'src')), false);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
