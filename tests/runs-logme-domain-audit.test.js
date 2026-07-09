const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const { runsLogMeDomainAudit } = require('../src/runs-logme-domain-audit');
const { loadsWorkspaceObservabilityConfig } = require('../src/loads-workspace-observability-config/loads-workspace-observability-config');

test('runsLogMeDomainAudit scans the package, builds a full sterility contract, and writes the report to disk', () => {
  const receipt = runsLogMeDomainAudit();

  assert.equal(typeof receipt.reportPath, 'string');
  assert.equal(typeof receipt.bytesWritten, 'number');
  assert.equal(receipt.bytesWritten > 0, true);
  assert.equal(typeof receipt.reportContent, 'string');
  assert.match(receipt.reportContent, /^# Domain Body Contract Report/);
  assert.match(receipt.reportContent, /## Sterility Summary/);
  assert.match(receipt.reportContent, /- Verdict: /);

  const config = loadsWorkspaceObservabilityConfig();
  assert.equal(receipt.reportPath, config.reportPath);

  const writtenContent = fs.readFileSync(receipt.reportPath, 'utf8');
  assert.equal(writtenContent, receipt.reportContent);
});

test('runsLogMeDomainAudit finds a nonzero number of methods in the package source tree', () => {
  const receipt = runsLogMeDomainAudit();

  assert.match(receipt.reportContent, /- Local executable methods: [1-9]\d*/);
  assert.match(receipt.reportContent, /- Files scanned: [1-9]\d*/);
});
