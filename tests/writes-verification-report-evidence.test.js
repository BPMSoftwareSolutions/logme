const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { writesVerificationReportEvidence } = require('../src/writes-verification-report-evidence/writes-verification-report-evidence');

test('writesVerificationReportEvidence writes a verification report at quality/domain-remediation/<run-id>/verification/<packet-id>.report.md', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-verification-write-'));

  try {
    const runId = 'run-verification-write-1';
    const verificationReport = {
      packetId: 'domain-remediation-scenario-tieout',
      commandsRun: [{ command: 'npm test', exitCode: 0, timedOut: false }],
      testResults: { ran: true, passed: true, summary: 'tests passed' },
      beforeMetrics: { filesMissingBodyContract: 2 },
      afterMetrics: { filesMissingBodyContract: 0 },
      changedFiles: ['src/a/a.js'],
      unresolvedRisks: [],
      promotionDecision: 'PROMOTABLE',
    };

    const receipt = writesVerificationReportEvidence({ rootDir: tempDir }, runId, verificationReport);

    const expectedPath = path.join(tempDir, 'quality', 'domain-remediation', runId, 'verification', 'domain-remediation-scenario-tieout.report.md');
    assert.equal(receipt.reportPath, expectedPath);
    assert.ok(fs.existsSync(expectedPath));

    const content = fs.readFileSync(expectedPath, 'utf8');
    assert.match(content, /# Verification Report: domain-remediation-scenario-tieout/u);
    assert.match(content, /PROMOTABLE/u);
    assert.match(content, /npm test/u);
    assert.match(content, /src\/a\/a\.js/u);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
