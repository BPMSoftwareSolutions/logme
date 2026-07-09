const test = require('node:test');
const assert = require('node:assert/strict');

const { validatesReportContract, resolvesDottedPath } = require('../src/validates-report-contract/validates-report-contract');

test('resolvesDottedPath resolves nested fields and returns undefined for missing ones', () => {
  const contract = { provenance: { runId: 'run-123' }, verdict: 'STERILE DOMAIN BODY' };

  assert.equal(resolvesDottedPath(contract, 'provenance.runId'), 'run-123');
  assert.equal(resolvesDottedPath(contract, 'verdict'), 'STERILE DOMAIN BODY');
  assert.equal(resolvesDottedPath(contract, 'provenance.missingField'), undefined);
  assert.equal(resolvesDottedPath(contract, 'missing.deeply.nested'), undefined);
});

test('validatesReportContract passes when every required field resolves', () => {
  const schema = { requiredFields: ['verdict', 'provenance.runId'] };
  const contract = { verdict: 'STERILE DOMAIN BODY', provenance: { runId: 'run-123' } };

  const result = validatesReportContract(schema, contract);

  assert.equal(result.isValid, true);
  assert.deepEqual(result.findings, []);
});

test('validatesReportContract fails with report-schema-empty when the schema declares no required fields', () => {
  const result = validatesReportContract({}, { verdict: 'STERILE DOMAIN BODY' });

  assert.equal(result.isValid, false);
  assert.equal(result.findings[0].code, 'report-schema-empty');
});

test('validatesReportContract fails with report-contract-not-enforced for each missing field', () => {
  const schema = { requiredFields: ['verdict', 'provenance.runId', 'blockerCount'] };
  const contract = { verdict: 'STERILE DOMAIN BODY' };

  const result = validatesReportContract(schema, contract);

  assert.equal(result.isValid, false);
  assert.equal(result.findings.length, 2);
  assert.ok(result.findings.every((finding) => finding.code === 'report-contract-not-enforced'));
});
