const test = require('node:test');
const assert = require('node:assert/strict');

const { extractsTemplateVariables, validatesReportLayoutContract } = require('../src/validates-report-layout-contract/validates-report-layout-contract');

const LAYOUT_SCHEMA = {
  requiredFields: ['schemaVersion', 'reportTitle', 'sectionOrder', 'sections'],
};

const REPORT_SCHEMA = {
  requiredFields: [
    'verdict',
    'blockerCount',
    'promotionDecision',
    'silentLocalMethods',
    'anonymousExecutableMethods',
    'missingTelemetry',
    'missingReceipt',
    'provenance.sourceInventoryHash',
    'filesScanned',
  ],
};

function buildsValidLayoutContract(overrides = {}) {
  return {
    schemaVersion: 'report-layout.contract.v1',
    reportTitle: 'Domain Body Contract Report',
    sectionOrder: ['sterilitySummary'],
    sections: {
      sterilitySummary: {
        title: 'Sterility Summary',
        template: ['Files scanned: {{filesScanned}}', 'Verdict: {{verdict}}'],
      },
    },
    requiredDataFields: [
      'verdict',
      'blockerCount',
      'silentLocalMethods',
      'anonymousExecutableMethods',
      'missingTelemetry',
      'missingReceipt',
      'promotionDecision',
      'provenance.sourceInventoryHash',
    ],
    ...overrides,
  };
}

test('extractsTemplateVariables finds every {{variable}} across template lines', () => {
  const variables = extractsTemplateVariables(['Verdict: {{verdict}}', 'Run: {{provenance.runId}}']);

  assert.deepEqual(variables, ['verdict', 'provenance.runId']);
});

test('validatesReportLayoutContract passes for a well-formed layout contract', () => {
  const result = validatesReportLayoutContract(LAYOUT_SCHEMA, buildsValidLayoutContract(), REPORT_SCHEMA);

  assert.equal(result.isValid, true);
  assert.deepEqual(result.findings, []);
});

test('validatesReportLayoutContract fails validation before rendering when required layout fields are missing', () => {
  const incompleteContract = { schemaVersion: 'report-layout.contract.v1' };

  const result = validatesReportLayoutContract(LAYOUT_SCHEMA, incompleteContract, REPORT_SCHEMA);

  assert.equal(result.isValid, false);
  assert.ok(result.findings.some((finding) => finding.code === 'report-layout-contract-incomplete'));
});

test('validatesReportLayoutContract blocks a template variable with no data source', () => {
  const layoutContract = buildsValidLayoutContract({
    sections: {
      sterilitySummary: {
        title: 'Sterility Summary',
        template: ['Made up field: {{notARealField}}'],
      },
    },
  });

  const result = validatesReportLayoutContract(LAYOUT_SCHEMA, layoutContract, REPORT_SCHEMA);

  assert.equal(result.isValid, false);
  assert.ok(result.findings.some((finding) => finding.code === 'report-template-variable-unbound'));
});

test('validatesReportLayoutContract blocks a layout that omits a required truth field', () => {
  const layoutContract = buildsValidLayoutContract({
    requiredDataFields: ['verdict'],
  });

  const result = validatesReportLayoutContract(LAYOUT_SCHEMA, layoutContract, REPORT_SCHEMA);

  assert.equal(result.isValid, false);
  const truthFindings = result.findings.filter((finding) => finding.code === 'report-layout-truth-field-omitted');
  assert.ok(truthFindings.length > 0);
  assert.ok(truthFindings.some((finding) => finding.reason.includes('blockerCount')));
});
