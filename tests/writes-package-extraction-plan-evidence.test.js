const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { writesPackageExtractionPlanEvidence } = require('../src/writes-package-extraction-plan-evidence/writes-package-extraction-plan-evidence');

test('writesPackageExtractionPlanEvidence writes a JSON evidence artifact and a markdown report under quality/domain-remediation/<run-id>/', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-package-extraction-write-'));

  try {
    const runId = 'run-extraction-write-1';
    const packageExtractionPlan = {
      sourceRunId: runId,
      evidencePath: `quality/domain-remediation/${runId}/package-extraction-plan.v1.json`,
      reportPath: `quality/domain-remediation/${runId}/package-extraction-plan.report.md`,
      sourceArtifacts: {
        domainSprawlContractPath: `evidence/runs/${runId}/sprawl/domain-body-sprawl.contract.v1.json`,
      },
      summary: { totalCandidates: 1, resolvedSections: 1, unresolvedSections: 0 },
      sections: [
        {
          filePath: 'src/a/a.js',
          classification: 'existing package',
          targetPackage: 'logme-config-primitives',
          extractedMethodNames: ['formatsPath'],
          domainCallSiteGuidance: 'call formatsPath from the package',
          findingCodes: [],
          reasoningNote: 'grounded generic mechanic',
        },
      ],
    };

    const receipt = writesPackageExtractionPlanEvidence({ rootDir: tempDir }, packageExtractionPlan);

    const expectedEvidencePath = path.join(tempDir, 'quality', 'domain-remediation', runId, 'package-extraction-plan.v1.json');
    const expectedReportPath = path.join(tempDir, 'quality', 'domain-remediation', runId, 'package-extraction-plan.report.md');
    assert.equal(receipt.evidencePath, expectedEvidencePath);
    assert.equal(receipt.reportPath, expectedReportPath);
    assert.equal(receipt.sectionCount, 1);
    assert.ok(fs.existsSync(expectedEvidencePath));
    assert.ok(fs.existsSync(expectedReportPath));

    const written = JSON.parse(fs.readFileSync(expectedEvidencePath, 'utf8'));
    assert.equal(written.sections.length, 1);

    const content = fs.readFileSync(expectedReportPath, 'utf8');
    assert.match(content, /# Package Extraction Plan Report/u);
    assert.match(content, /src\/a\/a\.js/u);
    assert.match(content, /logme-config-primitives/u);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
