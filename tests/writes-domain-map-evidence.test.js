const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { writesDomainMapEvidence } = require('../src/writes-domain-map-evidence/writes-domain-map-evidence');

test('writesDomainMapEvidence writes the JSON proposal and product-owner markdown report', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-domain-map-'));

  try {
    const runId = 'run-map-write-1';
    const domainMap = {
      schemaVersion: 'domain-map.proposal.v1',
      sourceRunId: runId,
      evidencePath: `quality/domain-remediation/${runId}/domain-map.proposal.v1.json`,
      reportPath: `quality/domain-remediation/${runId}/domain-map.report.md`,
      sourceArtifacts: {
        domainAnalysisContractPath: `evidence/runs/${runId}/domain-analysis/domain-body-analysis.contract.v1.json`,
        domainSprawlContractPath: `evidence/runs/${runId}/sprawl/domain-body-sprawl.contract.v1.json`,
      },
      summary: {
        totalFilesMapped: 2,
        classificationCounts: { 'product-domain body': 1, ambiguous: 1 },
        ambiguousFileCount: 1,
        ambiguousFilePaths: ['src/mixed-body/mixed-body.js'],
      },
      fileEntries: [
        {
          filePath: 'src/renders-report/renders-report.js',
          classification: 'product-domain body',
          primaryBodyResponsibility: 'render-report',
          hasScenarioTieOut: false,
          waiverClassCandidate: false,
          classificationReason: 'file has one responsibility cluster and is declared in a file-system body contract',
          findingCodes: ['scenario-tieout-missing'],
        },
        {
          filePath: 'src/mixed-body/mixed-body.js',
          classification: 'ambiguous',
          primaryBodyResponsibility: 'validate-thing',
          hasScenarioTieOut: false,
          waiverClassCandidate: true,
          classificationReason: 'file has 2 responsibility clusters and cannot be assigned one primary body responsibility without product-owner review',
          findingCodes: ['scenario-tieout-missing'],
        },
      ],
    };

    const receipt = writesDomainMapEvidence({ rootDir: tempDir }, domainMap);

    const expectedEvidencePath = path.join(tempDir, 'quality', 'domain-remediation', runId, 'domain-map.proposal.v1.json');
    const expectedReportPath = path.join(tempDir, 'quality', 'domain-remediation', runId, 'domain-map.report.md');
    assert.equal(receipt.evidencePath, expectedEvidencePath);
    assert.equal(receipt.reportPath, expectedReportPath);
    assert.ok(fs.existsSync(expectedEvidencePath));
    assert.ok(fs.existsSync(expectedReportPath));

    const written = JSON.parse(fs.readFileSync(expectedEvidencePath, 'utf8'));
    assert.equal(written.summary.totalFilesMapped, 2);

    const reportContent = fs.readFileSync(expectedReportPath, 'utf8');
    assert.match(reportContent, /# Domain Map Report/u);
    assert.match(reportContent, /src\/mixed-body\/mixed-body\.js/u);
    assert.match(reportContent, /product-owner review/u);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
