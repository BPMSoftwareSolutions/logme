const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { verifiesGeneratedHarness } = require('../src/verifies-generated-harness/verifies-generated-harness');
const { materializesApprovedHarness } = require('../src/materializes-approved-harness/materializes-approved-harness');
const { runsGeneratedHarness } = require('../src/runs-generated-harness/runs-generated-harness');

function materializesTestHarness(tempDir, overrides = {}) {
  return materializesApprovedHarness(
    {
      harnessId: 'harness-verify-test',
      proposalStatus: 'proposed',
      bodyContractDraft: { featureId: 'first-flow' },
      executionPathDraft: { steps: ['receive-input', 'execute-flow'] },
      testPlanDraft: { scenarios: [] },
      telemetryRequirementsDraft: { requiredSteps: ['receive-input', 'execute-flow'] },
      receiptCoverageDraft: { plannedReceipts: ['execution.receipt.v1.json'] },
      ...overrides,
    },
    { isValid: true, findings: [] },
    { generatedHarnessesRoot: tempDir },
  );
}

test('verifiesGeneratedHarness promotes a harness whose telemetry ties out and which wrote its declared receipt', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-harness-verify-'));

  try {
    const materializationResult = materializesTestHarness(tempDir);
    const runResult = runsGeneratedHarness(materializationResult);
    // Write the declared receipt so receipt coverage ties out.
    fs.writeFileSync(path.join(path.dirname(materializationResult.entryFilePath), 'execution.receipt.v1.json'), '{}', 'utf8');

    const decision = verifiesGeneratedHarness(materializationResult, runResult, { runId: 'run-001' });

    assert.equal(decision.decision, 'PROMOTED');
    assert.equal(decision.requiredFindingsMustBeZero.length, 0);
    assert.equal(decision.telemetryTieOut.matches, true);
    assert.equal(decision.receiptTieOut.matches, true);
    assert.equal(decision.selfPromotionAttempted, false);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('verifiesGeneratedHarness blocks when the declared receipt was never written', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-harness-verify-noreceipt-'));

  try {
    const materializationResult = materializesTestHarness(tempDir);
    const runResult = runsGeneratedHarness(materializationResult);
    // Deliberately do NOT write execution.receipt.v1.json.

    const decision = verifiesGeneratedHarness(materializationResult, runResult, { runId: 'run-001' });

    assert.equal(decision.decision, 'BLOCKED');
    assert.equal(decision.receiptTieOut.matches, false);
    assert.ok(decision.requiredFindingsMustBeZero.some((finding) => finding.code === 'llm-invented-receipt'));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('verifiesGeneratedHarness blocks when the harness exits non-zero', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-harness-verify-exit-'));

  try {
    const materializationResult = materializesTestHarness(tempDir, { receiptCoverageDraft: { plannedReceipts: [] } });
    fs.appendFileSync(materializationResult.entryFilePath, '\nprocess.exitCode = 1;\n');
    const runResult = runsGeneratedHarness(materializationResult);

    const decision = verifiesGeneratedHarness(materializationResult, runResult, { runId: 'run-001' });

    assert.equal(decision.decision, 'BLOCKED');
    assert.ok(decision.requiredFindingsMustBeZero.some((finding) => finding.code === 'generated-harness-missing-testimony'));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('verifiesGeneratedHarness blocks when the harness stdout emits a self-promotion claim', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-harness-verify-selfpromo-'));

  try {
    const materializationResult = materializesTestHarness(tempDir, { receiptCoverageDraft: { plannedReceipts: [] } });
    fs.appendFileSync(materializationResult.entryFilePath, "\nconsole.log('this harness is self-conformance-proven');\n");
    const runResult = runsGeneratedHarness(materializationResult);

    const decision = verifiesGeneratedHarness(materializationResult, runResult, { runId: 'run-001' });

    assert.equal(decision.decision, 'BLOCKED');
    assert.equal(decision.selfPromotionAttempted, true);
    assert.ok(decision.requiredFindingsMustBeZero.some((finding) => finding.code === 'llm-promoted-itself'));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('verifiesGeneratedHarness blocks when telemetry does not match the declared execution path', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-harness-verify-telemetry-'));

  try {
    const materializationResult = materializesTestHarness(tempDir, { receiptCoverageDraft: { plannedReceipts: [] } });
    // Overwrite the generated entry file so it never emits the declared telemetry.
    fs.writeFileSync(materializationResult.entryFilePath, "console.log('nothing to see here');\n", 'utf8');
    const runResult = runsGeneratedHarness(materializationResult);

    const decision = verifiesGeneratedHarness(materializationResult, runResult, { runId: 'run-001' });

    assert.equal(decision.decision, 'BLOCKED');
    assert.equal(decision.telemetryTieOut.matches, false);
    assert.ok(decision.requiredFindingsMustBeZero.some((finding) => finding.code === 'llm-claimed-verification-without-telemetry'));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('verifiesGeneratedHarness never accepts a pre-computed decision as an input', () => {
  // Signature audit: verifiesGeneratedHarness must only take
  // (materializationResult, runResult, parsedOutput) -- no decision/verdict param.
  assert.equal(verifiesGeneratedHarness.length, 3);
});
