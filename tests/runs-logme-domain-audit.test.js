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
  assert.match(receipt.reportContent, /## Execution Flow Sketch/);
  assert.match(receipt.reportContent, /EXECUTABLE BODY CONTRACT - FILE-SYSTEM EXECUTION TREE/);
  assert.match(receipt.reportContent, /\[00\] ACCEPTANCE SOURCE/);
  assert.match(receipt.reportContent, /\|-- gherkin/);
  assert.match(receipt.reportContent, /\|   `-- docs\/report-truth-pi-planning\.md/);
  assert.match(receipt.reportContent, /\|-- telemetry/);
  assert.match(receipt.reportContent, /\|   \|-- status        : observed/);
  assert.match(receipt.reportContent, /\|   `-- duration ms   : not observed/);
  assert.match(receipt.reportContent, /\|-- receipt/);
  assert.match(receipt.reportContent, /`-- ok/);
  assert.match(receipt.reportContent, /## Blocker Summary/);
  assert.match(receipt.reportContent, /## Provenance/);
  assert.match(receipt.reportContent, /## Sterility Summary/);
  assert.match(receipt.reportContent, /## Domain Body Analysis Summary/);
  assert.match(receipt.reportContent, /Analysis report: evidence\/runs\/[a-f0-9]+\/domain-analysis\/domain-body-analysis\.report\.md/);
  assert.match(receipt.reportContent, /- Verdict: /);
  assert.equal(typeof receipt.provenance, 'object');
  assert.equal(typeof receipt.provenance.sourceInventoryHash, 'string');

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

test('runsLogMeDomainAudit shows execution steps in the report when runtime telemetry is enabled', () => {
  const previousAudit = process.env.LOGME_AUDIT;
  process.env.LOGME_AUDIT = '1';

  try {
    const receipt = runsLogMeDomainAudit();
    const lines = receipt.reportContent.split('\n');
    const tableStart = lines.findIndex((line) => line === '| Scan Order | Execution Step | Method | Kind | LogMe | Location |');
    const tableRows = lines.slice(tableStart + 2).filter((line) => line.startsWith('| ') && !line.startsWith('| ---'));
    const executionSteps = tableRows
      .map((line) => line.split(' | ')[1])
      .filter((value) => value !== '');

    assert.match(receipt.reportContent, /\| Scan Order \| Execution Step \| Method \| Kind \| LogMe \| Location \|/);
    assert.equal(new Set(executionSteps).size, executionSteps.length);
    assert.equal(executionSteps[0], '1');
  } finally {
    if (previousAudit === undefined) {
      delete process.env.LOGME_AUDIT;
    } else {
      process.env.LOGME_AUDIT = previousAudit;
    }
  }
});
