const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { validatesGeneratedHarness } = require('../src/validates-generated-harness/validates-generated-harness');

function buildsAssignment(overrides = {}) {
  return {
    runId: 'run-001',
    allowedMutationPaths: ['src/generated-harnesses/harness-abc/'],
    requestedCapability: 'first-flow',
    parentSelfConformanceReceiptRef: null,
    ...overrides,
  };
}

function buildsProposedOutput(overrides = {}) {
  return {
    proposalStatus: 'proposed',
    bodyContractDraft: { featureId: 'first-flow' },
    executionPathDraft: { steps: ['receive-input', 'execute-flow'] },
    testPlanDraft: { scenarios: ['first flow happy path'] },
    telemetryRequirementsDraft: { requiredSteps: ['receive-input', 'execute-flow'] },
    receiptCoverageDraft: { plannedReceipts: ['src/generated-harnesses/harness-abc/execution.receipt.v1.json'] },
    ...overrides,
  };
}

test('validatesGeneratedHarness passes a well-formed, in-lease proposal', () => {
  const result = validatesGeneratedHarness(buildsProposedOutput(), buildsAssignment());

  assert.equal(result.isValid, true);
  assert.deepEqual(result.findings, []);
});

test('validatesGeneratedHarness fails immediately when proposalStatus is not "proposed"', () => {
  const result = validatesGeneratedHarness(buildsProposedOutput({ proposalStatus: 'rejected-unparseable' }), buildsAssignment());

  assert.equal(result.isValid, false);
  assert.equal(result.findings[0].code, 'generated-harness-missing-body-contract');
});

test('validatesGeneratedHarness flags a missing required draft field', () => {
  const output = buildsProposedOutput({ telemetryRequirementsDraft: null });

  const result = validatesGeneratedHarness(output, buildsAssignment());

  assert.equal(result.isValid, false);
  assert.ok(result.findings.some((finding) => finding.code === 'generated-harness-missing-testimony'));
});

test('validatesGeneratedHarness flags a mutation path outside allowedMutationPaths', () => {
  const output = buildsProposedOutput({
    executionPathDraft: { steps: ['receive-input'], targetFile: 'src/some-other-module/index.js' },
  });

  const result = validatesGeneratedHarness(output, buildsAssignment());

  assert.equal(result.isValid, false);
  assert.ok(result.findings.some((finding) => finding.code === 'llm-proposed-forbidden-mutation'));
});

test('validatesGeneratedHarness flags verification claims made without telemetry requirements', () => {
  const output = buildsProposedOutput({
    receiptCoverageDraft: { plan: 'the harness has already verified and observed its own steps' },
    telemetryRequirementsDraft: {},
  });

  const result = validatesGeneratedHarness(output, buildsAssignment());

  assert.equal(result.isValid, false);
  assert.ok(result.findings.some((finding) => finding.code === 'llm-claimed-verification-without-telemetry'));
});

test('validatesGeneratedHarness flags a receipt claim that already exists on disk before materialization', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-harness-validate-'));

  try {
    const preExistingReceiptPath = path.join(tempDir, 'src/generated-harnesses/harness-abc/execution.receipt.v1.json');
    fs.mkdirSync(path.dirname(preExistingReceiptPath), { recursive: true });
    fs.writeFileSync(preExistingReceiptPath, '{}', 'utf8');

    const output = buildsProposedOutput({
      receiptCoverageDraft: { plannedReceipts: ['src/generated-harnesses/harness-abc/execution.receipt.v1.json'] },
    });
    const assignment = buildsAssignment({ rootDir: tempDir });

    const result = validatesGeneratedHarness(output, assignment);

    assert.equal(result.isValid, false);
    assert.ok(result.findings.some((finding) => finding.code === 'llm-invented-receipt'));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('validatesGeneratedHarness flags a self-promotion claim in the proposal text', () => {
  const output = buildsProposedOutput({
    bodyContractDraft: { note: 'this harness is self-conformance-proven and should be promoted' },
  });

  const result = validatesGeneratedHarness(output, buildsAssignment());

  assert.equal(result.isValid, false);
  assert.ok(result.findings.some((finding) => finding.code === 'llm-promoted-itself'));
});

test('validatesGeneratedHarness flags an allowedMutationPaths entry declared outside src/generated-harnesses/', () => {
  const assignment = buildsAssignment({ allowedMutationPaths: ['src/report-truth/'] });

  const result = validatesGeneratedHarness(buildsProposedOutput(), assignment);

  assert.equal(result.isValid, false);
  assert.ok(result.findings.some((finding) => finding.code === 'generated-harness-executed-outside-lease'));
});

test('validatesGeneratedHarness flags a next-harness proposal whose parent receipt is missing', () => {
  const assignment = buildsAssignment({ parentSelfConformanceReceiptRef: 'evidence/runs/fractal-llm-harness/does-not-exist/harness-execution.receipt.v1.json' });

  const result = validatesGeneratedHarness(buildsProposedOutput(), assignment);

  assert.equal(result.isValid, false);
  assert.ok(result.findings.some((finding) => finding.code === 'next-harness-proposal-without-parent-proof'));
});

test('validatesGeneratedHarness flags a next-harness proposal whose parent receipt was not PROMOTED', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-harness-validate-parent-'));

  try {
    const receiptPath = path.join(tempDir, 'parent-receipt.json');
    fs.writeFileSync(receiptPath, JSON.stringify({ promotionDecision: { decision: 'BLOCKED' } }), 'utf8');

    const assignment = buildsAssignment({ rootDir: tempDir, parentSelfConformanceReceiptRef: 'parent-receipt.json' });

    const result = validatesGeneratedHarness(buildsProposedOutput(), assignment);

    assert.equal(result.isValid, false);
    assert.ok(result.findings.some((finding) => finding.code === 'next-harness-proposal-without-parent-proof'));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('validatesGeneratedHarness passes a next-harness proposal whose parent receipt shows PROMOTED', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-harness-validate-parent-ok-'));

  try {
    const receiptPath = path.join(tempDir, 'parent-receipt.json');
    fs.writeFileSync(receiptPath, JSON.stringify({ promotionDecision: { decision: 'PROMOTED' } }), 'utf8');

    const assignment = buildsAssignment({ rootDir: tempDir, parentSelfConformanceReceiptRef: 'parent-receipt.json' });

    const result = validatesGeneratedHarness(buildsProposedOutput(), assignment);

    assert.equal(result.isValid, true);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
