const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { rendersReportFromLayoutContract } = require('../src/renders-report-from-layout-contract/renders-report-from-layout-contract');
const { parsesExecutionSketchTemplate } = require('../packages/logme-report-primitives/src/parses-execution-sketch-template');

const LAYOUT_SCHEMA = { requiredFields: ['schemaVersion', 'reportTitle', 'sectionOrder', 'sections'] };

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

const TEMPLATE_PATH = path.join(__dirname, '..', 'contracts', 'templates', 'logme', 'execution-sketch.template.txt');
const executionSketchTemplate = parsesExecutionSketchTemplate(fs.readFileSync(TEMPLATE_PATH, 'utf8'));

function buildsContract() {
  return {
    verdict: 'STERILE DOMAIN BODY',
    blockerCount: 0,
    promotionDecision: 'ALLOWED',
    silentLocalMethods: 0,
    anonymousExecutableMethods: 0,
    missingTelemetry: false,
    missingReceipt: false,
    filesScanned: 3,
    rootDir: '/test/root',
    reportPath: '/test/root/report.md',
    configPath: '/test/root/logme.config.json',
    includeExtensions: ['.js'],
    forbiddenLocalUtilityNames: ['utils'],
    includeTestFiles: false,
    excludeFiles: ['report.md'],
    localExecutableMethods: 3,
    domainBoundMethods: 3,
    methodsWithLogMeCall: 3,
    genericUtilityMethods: 0,
    methodsOutsideDomainVocabulary: 0,
    unimplementedStubMethods: 0,
    coverage: 100,
    findings: [],
    methods: [],
    executionNodes: [],
    executionSketchTemplate,
    sprawl: {
      evidencePath: 'evidence/runs/run-123/sprawl/domain-body-sprawl.contract.v1.json',
      summary: {
        totalSourceFilesScanned: 3,
        focusedFiles: 1,
        watchlistFiles: 1,
        godFileCandidates: 0,
        packageExtractionCandidates: 1,
        mixedResponsibilityFiles: 1,
        orphanArtifacts: 0,
        topSprawlHotspots: [
          {
            filePath: 'src/example.js',
            classification: 'package extraction candidate',
            lineCount: 42,
            executableMethodCount: 5,
            responsibilityClusterCount: 2,
            genericMechanicCount: 1,
            findingCodes: ['package-worthy-mechanic-inside-domain-body'],
            fixRoute: 'move generic mechanics to a package primitive',
          },
        ],
      },
    },
    domainContract: { laws: ['Law one', 'Law two'] },
    provenance: {
      runId: 'run-123',
      configPath: '/test/root/logme.config.json',
      generationTimestamp: '2026-07-09T12:00:00.000Z',
      generationCommand: 'node test.js',
      gitWorkingTreeMarker: 'commit:abc',
      configHash: 'abc123',
      sourceInventoryHash: 'def456',
      evidenceDirectory: '/test/root/evidence',
      reportSchemaVersion: 'report-provenance.v1',
      generatorName: 'LogMe domain audit',
    },
  };
}

function buildsLayoutContract(overrides = {}) {
  return {
    schemaVersion: 'report-layout.contract.v1',
    reportTitle: 'Domain Body Contract Report',
    sectionOrder: ['sterilitySummary', 'hardLaws'],
    sections: {
      sterilitySummary: {
        title: 'Sterility Summary',
        template: ['Files scanned: {{filesScanned}}', 'Verdict: {{verdict}}'],
      },
      hardLaws: {
        title: 'Hard Laws',
        template: 'kind:hard-laws',
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

test('rendersReportFromLayoutContract renders sections in the order declared by the layout contract', () => {
  const layoutContract = buildsLayoutContract();
  const result = rendersReportFromLayoutContract(LAYOUT_SCHEMA, layoutContract, REPORT_SCHEMA, buildsContract());

  assert.equal(result.isValid, true);
  const sterilityIndex = result.reportContent.indexOf('## Sterility Summary');
  const lawsIndex = result.reportContent.indexOf('## Hard Laws');
  assert.ok(sterilityIndex > -1 && lawsIndex > -1);
  assert.ok(sterilityIndex < lawsIndex);
});

test('rendersReportFromLayoutContract re-renders in the new order when sectionOrder changes, with no source change', () => {
  const layoutContract = buildsLayoutContract({ sectionOrder: ['hardLaws', 'sterilitySummary'] });
  const result = rendersReportFromLayoutContract(LAYOUT_SCHEMA, layoutContract, REPORT_SCHEMA, buildsContract());

  const sterilityIndex = result.reportContent.indexOf('## Sterility Summary');
  const lawsIndex = result.reportContent.indexOf('## Hard Laws');
  assert.ok(lawsIndex < sterilityIndex);
});

test('rendersReportFromLayoutContract renders updated labels declared in the layout contract', () => {
  const layoutContract = buildsLayoutContract({
    sections: {
      sterilitySummary: {
        title: 'Renamed Section Title',
        template: ['Files examined (renamed label): {{filesScanned}}'],
      },
      hardLaws: { title: 'Hard Laws', template: 'kind:hard-laws' },
    },
  });
  const result = rendersReportFromLayoutContract(LAYOUT_SCHEMA, layoutContract, REPORT_SCHEMA, buildsContract());

  assert.match(result.reportContent, /## Renamed Section Title/);
  assert.match(result.reportContent, /Files examined \(renamed label\): 3/);
});

test('rendersReportFromLayoutContract fails generation and does not render when a template variable has no data source', () => {
  const layoutContract = buildsLayoutContract({
    sections: {
      sterilitySummary: { title: 'Sterility Summary', template: ['Made up: {{notARealField}}'] },
      hardLaws: { title: 'Hard Laws', template: 'kind:hard-laws' },
    },
  });
  const result = rendersReportFromLayoutContract(LAYOUT_SCHEMA, layoutContract, REPORT_SCHEMA, buildsContract());

  assert.equal(result.isValid, false);
  assert.equal(result.reportContent, null);
  assert.ok(result.findings.some((finding) => finding.code === 'report-template-variable-unbound'));
});

test('rendersReportFromLayoutContract fails generation when the layout omits a required truth field', () => {
  const layoutContract = buildsLayoutContract({ requiredDataFields: ['verdict'] });
  const result = rendersReportFromLayoutContract(LAYOUT_SCHEMA, layoutContract, REPORT_SCHEMA, buildsContract());

  assert.equal(result.isValid, false);
  assert.equal(result.reportContent, null);
  assert.ok(result.findings.some((finding) => finding.code === 'report-layout-truth-field-omitted'));
});

test('rendersReportFromLayoutContract renders the ASCII execution sketch section using the template engine', () => {
  const layoutContract = buildsLayoutContract({
    sectionOrder: ['executionFlowSketch'],
    sections: {
      executionFlowSketch: { title: 'Execution Flow Sketch', template: 'kind:ascii-execution-sketch' },
    },
  });
  const result = rendersReportFromLayoutContract(LAYOUT_SCHEMA, layoutContract, REPORT_SCHEMA, buildsContract());

  assert.equal(result.isValid, true);
  assert.match(result.reportContent, /REPORT TRUTH/);
  assert.match(result.reportContent, /Verdict\s+: STERILE DOMAIN BODY/);
});

test('rendersReportFromLayoutContract renders compact sprawl summary from the sprawl contract', () => {
  const layoutContract = buildsLayoutContract({
    sectionOrder: ['sprawlSummary'],
    sections: {
      sprawlSummary: { title: 'Domain Body Sprawl Summary', template: 'kind:sprawl-summary' },
    },
  });
  const result = rendersReportFromLayoutContract(LAYOUT_SCHEMA, layoutContract, REPORT_SCHEMA, buildsContract());

  assert.equal(result.isValid, true);
  assert.match(result.reportContent, /## Domain Body Sprawl Summary/);
  assert.match(result.reportContent, /Evidence artifact: evidence\/runs\/run-123\/sprawl\/domain-body-sprawl\.contract\.v1\.json/);
  assert.match(result.reportContent, /Package extraction candidates: 1/);
  assert.match(result.reportContent, /package-worthy-mechanic-inside-domain-body/);
  assert.match(result.reportContent, /move generic mechanics to a package primitive/);
});
