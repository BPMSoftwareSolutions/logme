const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { materializesApprovedHarness } = require('../src/materializes-approved-harness/materializes-approved-harness');

function buildsProposedOutput(overrides = {}) {
  return {
    harnessId: 'harness-abc123',
    proposalStatus: 'proposed',
    bodyContractDraft: { featureId: 'first-flow' },
    executionPathDraft: { steps: ['receive-input', 'execute-flow'] },
    testPlanDraft: { scenarios: [] },
    telemetryRequirementsDraft: { requiredSteps: ['receive-input', 'execute-flow'] },
    receiptCoverageDraft: { plannedReceipts: [] },
    ...overrides,
  };
}

test('materializesApprovedHarness writes every JSON artifact and a generated index.js under the leased directory', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-harness-materialize-'));

  try {
    const result = materializesApprovedHarness(
      buildsProposedOutput(),
      { isValid: true, findings: [] },
      { generatedHarnessesRoot: tempDir },
    );

    assert.equal(result.harnessId, 'harness-abc123');
    assert.equal(result.materializationStatus, 'materialized');
    assert.equal(result.leasedPaths.length, 1);
    assert.equal(result.leasedPaths[0], path.join(path.resolve(tempDir), 'harness-abc123'));
    assert.ok(result.writtenFiles.includes('body-contract.json'));
    assert.ok(result.writtenFiles.includes('index.js'));
    assert.equal(fs.existsSync(result.entryFilePath), true);

    const executionPathContent = JSON.parse(fs.readFileSync(path.join(path.dirname(result.entryFilePath), 'execution-path.json'), 'utf8'));
    assert.deepEqual(executionPathContent.steps, ['receive-input', 'execute-flow']);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('materializesApprovedHarness generates an index.js that prints a telemetry line per declared step', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-harness-materialize-'));

  try {
    const result = materializesApprovedHarness(
      buildsProposedOutput(),
      { isValid: true, findings: [] },
      { generatedHarnessesRoot: tempDir },
    );

    const entryFileContent = fs.readFileSync(result.entryFilePath, 'utf8');

    assert.match(entryFileContent, /TELEMETRY-STEP: ' \+ "receive-input"/);
    assert.match(entryFileContent, /TELEMETRY-STEP: ' \+ "execute-flow"/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('materializesApprovedHarness neutralizes injection-shaped step names as inert string literals', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-harness-materialize-'));

  try {
    const maliciousStepName = "');process.exit(1);console.log('";
    const result = materializesApprovedHarness(
      buildsProposedOutput({ executionPathDraft: { steps: [maliciousStepName] } }),
      { isValid: true, findings: [] },
      { generatedHarnessesRoot: tempDir },
    );

    const entryFileContent = fs.readFileSync(result.entryFilePath, 'utf8');

    // The malicious text must appear only inside a JSON.stringify'd string literal,
    // never as a bare statement boundary in the generated source.
    assert.match(entryFileContent, /console\.log\('TELEMETRY-STEP: ' \+ "[^\n]*process\.exit/);
    assert.doesNotMatch(entryFileContent, /^\);process\.exit\(1\);/m);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('materializesApprovedHarness throws when the validation result is not valid', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-harness-materialize-'));

  try {
    assert.throws(() => materializesApprovedHarness(
      buildsProposedOutput(),
      { isValid: false, findings: [{ code: 'llm-promoted-itself' }] },
      { generatedHarnessesRoot: tempDir },
    ));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('materializesApprovedHarness throws when proposalStatus is not "proposed"', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-harness-materialize-'));

  try {
    assert.throws(() => materializesApprovedHarness(
      buildsProposedOutput({ proposalStatus: 'rejected-unparseable' }),
      { isValid: true, findings: [] },
      { generatedHarnessesRoot: tempDir },
    ));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('materializesApprovedHarness refuses to write outside the generated-harnesses lease', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-harness-materialize-'));

  try {
    assert.throws(() => materializesApprovedHarness(
      buildsProposedOutput({ harnessId: '../escaped-harness' }),
      { isValid: true, findings: [] },
      { generatedHarnessesRoot: tempDir },
    ), /lease/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
