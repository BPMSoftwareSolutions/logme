const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { writesDomainBodySterilityReceipt } = require('../src/writes-domain-body-sterility-receipt/writes-domain-body-sterility-receipt');
const { buildsReportProvenance } = require('../src/report-provenance/report-provenance');

test('writesDomainBodySterilityReceipt orchestrates rendering and writing, returning combined receipt object', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-lab-'));

  try {
    const reportPath = path.join(tempDir, 'sterility-report.md');
    const contract = {
      reportPath,
      domainContract: {
        reportTitle: 'Test Sterility Report',
        laws: ['Methods must be named clearly', 'All logic must be testable'],
        cleanFindingsLabel: '_No findings._',
      },
      provenance: buildsReportProvenance(
        {
          configPath: '/test/root/logme.config.json',
          rootDir: '/test/root',
          reportPath,
          includeExtensions: ['.js', '.ts'],
          excludeDirectories: ['tests'],
          excludeFiles: ['report.md'],
          includeTestFiles: false,
          stubMarker: '// STUB',
          forbiddenLocalUtilityNames: ['utils', 'helpers'],
          forbiddenMethodNames: ['arrow-function'],
          domainContract: {
            reportTitle: 'Test Sterility Report',
            domainName: 'LogMe',
            domainSummary: 'Test summary',
            domainVocabulary: { nouns: ['report'], verbs: ['render'] },
            laws: ['Methods must be named clearly', 'All logic must be testable'],
            cleanFindingsLabel: '_No findings._',
            verdicts: {
              sterile: 'STERILE DOMAIN BODY',
              languageImpure: 'COVERAGE CLEAN, LANGUAGE IMPURE',
              contaminated: 'DOMAIN BODY CONTAMINATED',
            },
            findings: {},
          },
        },
        ['/test/root/src/example.js'],
        [
          {
            scanOrder: 1,
            name: 'testMethod',
            kind: 'function-declaration',
            hasLogMeCall: true,
            filePath: '/test/root/src/example.js',
            lineStart: 10,
            lineEnd: 20,
          },
        ],
        {
          generationTimestamp: '2026-07-09T12:00:00.000Z',
          generationCommand: 'node test-runner.js',
          gitWorkingTreeMarker: 'commit:abc123',
          evidenceDirectory: '/test/root/evidence',
          runId: 'run-789',
        },
      ),
      rootDir: '/test/root',
      includeExtensions: ['.js', '.ts'],
      configPath: '/test/root/logme.config.json',
      forbiddenLocalUtilityNames: ['utils', 'helpers'],
      includeTestFiles: false,
      excludeFiles: ['report.md'],
      filesScanned: 3,
      localExecutableMethods: 5,
      domainBoundMethods: 4,
      methodsWithLogMeCall: 3,
      silentLocalMethods: 1,
      genericUtilityMethods: 0,
      anonymousExecutableMethods: 0,
      methodsOutsideDomainVocabulary: 0,
      unimplementedStubMethods: 0,
      coverage: 100,
      verdict: 'STERILE DOMAIN BODY',
      blockerCount: 0,
      promotionDecision: 'ALLOWED',
      missingTelemetry: false,
      missingReceipt: false,
      domainAnalysis: {
        evidencePath: 'evidence/runs/run-789/domain-analysis/domain-body-analysis.contract.v1.json',
        reportPath: 'evidence/runs/run-789/domain-analysis/domain-body-analysis.report.md',
        summary: {
          totalExecutableFiles: 1,
          actionBearingExecutableFiles: 1,
          executableFileNamesMissingActionVerb: 0,
          filesMissingBodyContract: 0,
          filesMissingScenarioTieOut: 0,
          decompositionCandidates: 0,
          totalBlockers: 0,
        },
        sourceFiles: [],
      },
      findings: [],
      methods: [
        {
          scanOrder: 1,
          name: 'testMethod',
          kind: 'function-declaration',
          hasLogMeCall: true,
          filePath: '/test/root/src/example.js',
          lineStart: 10,
          lineEnd: 20,
        },
      ],
    };

    const receipt = writesDomainBodySterilityReceipt(contract);

    // Assert receipt object structure
    assert.equal(receipt.reportPath, reportPath, 'receipt.reportPath should match input');
    assert.equal(typeof receipt.bytesWritten, 'number', 'receipt.bytesWritten should be a number');
    assert.ok(receipt.bytesWritten > 0, 'receipt.bytesWritten should be greater than 0');
    assert.equal(typeof receipt.reportContent, 'string', 'receipt.reportContent should be a string');
    assert.ok(receipt.reportContent.length > 0, 'receipt.reportContent should not be empty');
    assert.equal(receipt.provenance.runId, 'run-789');

    // Assert file exists and has correct content
    assert.equal(fs.existsSync(reportPath), true, 'File should exist at reportPath');
    const fileContent = fs.readFileSync(reportPath, 'utf8');
    assert.equal(fileContent, receipt.reportContent, 'File content should match receipt.reportContent');

    // Assert reportContent contains expected sections from rendered report
    // Title is product-owned by the report layout contract, not the caller's contract.
    assert.match(receipt.reportContent, /^# Domain Body Contract Report/);
    assert.match(receipt.reportContent, /## Execution Flow Sketch/);
    assert.match(receipt.reportContent, /## Blocker Summary/);
    assert.match(receipt.reportContent, /## Provenance/);
    assert.match(receipt.reportContent, /## Config/);
    assert.match(receipt.reportContent, /## Sterility Summary/);
    assert.match(receipt.reportContent, /## Domain Body Analysis Summary/);
    assert.match(receipt.reportContent, /## Discovered Methods/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
