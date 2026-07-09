const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { runsGeneratedHarness } = require('../src/runs-generated-harness/runs-generated-harness');
const { materializesApprovedHarness } = require('../src/materializes-approved-harness/materializes-approved-harness');

function materializesTestHarness(tempDir, overrides = {}) {
  return materializesApprovedHarness(
    {
      harnessId: 'harness-run-test',
      proposalStatus: 'proposed',
      bodyContractDraft: { featureId: 'first-flow' },
      executionPathDraft: { steps: ['receive-input', 'execute-flow'] },
      testPlanDraft: { scenarios: [] },
      telemetryRequirementsDraft: { requiredSteps: ['receive-input', 'execute-flow'] },
      receiptCoverageDraft: { plannedReceipts: [] },
      ...overrides,
    },
    { isValid: true, findings: [] },
    { generatedHarnessesRoot: tempDir },
  );
}

test('runsGeneratedHarness executes the materialized harness and captures its telemetry stdout', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-harness-run-'));

  try {
    const materializationResult = materializesTestHarness(tempDir);
    const runResult = runsGeneratedHarness(materializationResult);

    assert.equal(runResult.exitCode, 0);
    assert.equal(runResult.timedOut, false);
    assert.match(runResult.stdout, /TELEMETRY-STEP: receive-input/);
    assert.match(runResult.stdout, /TELEMETRY-STEP: execute-flow/);
    assert.equal(runResult.harnessId, 'harness-run-test');
    assert.equal(fs.existsSync(path.join(path.dirname(runResult.entryFilePath), 'conformance-marker.json')), true);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('runsGeneratedHarness returns a non-zero exit code as data, never throwing', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-harness-run-fail-'));

  try {
    const materializationResult = materializesTestHarness(tempDir);
    fs.appendFileSync(materializationResult.entryFilePath, "\nprocess.exitCode = 7;\n");

    const runResult = runsGeneratedHarness(materializationResult);

    assert.equal(runResult.exitCode, 7);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('runsGeneratedHarness reports timedOut for a harness that exceeds the timeout', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-harness-run-timeout-'));

  try {
    const materializationResult = materializesTestHarness(tempDir);
    fs.appendFileSync(materializationResult.entryFilePath, "\nconst deadline = Date.now() + 5000; while (Date.now() < deadline) { /* busy wait */ }\n");

    const runResult = runsGeneratedHarness(materializationResult, { timeoutMs: 200 });

    assert.equal(runResult.timedOut, true);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
