const test = require('node:test');
const assert = require('node:assert/strict');

const { rendersDomainBodySterilityReport } = require('../src/renders-domain-body-sterility-report/renders-domain-body-sterility-report');
const { buildsReportProvenance } = require('../src/report-provenance/report-provenance');

test('rendersDomainBodySterilityReport builds report with title, config, laws, sterility summary, findings, and methods table', () => {
  const contract = {
    domainContract: {
      reportTitle: 'Test Domain Report',
      laws: ['Methods must be named clearly', 'All logic must be testable'],
      cleanFindingsLabel: '_No findings._',
    },
    rootDir: '/test/root',
    reportPath: '/test/root/report.md',
    includeExtensions: ['.js', '.ts'],
    configPath: '/test/root/logme.config.json',
    forbiddenLocalUtilityNames: ['utils', 'helpers'],
    includeTestFiles: false,
    excludeFiles: ['report.md'],
    filesScanned: 5,
    localExecutableMethods: 12,
    domainBoundMethods: 10,
    methodsWithLogMeCall: 8,
    silentLocalMethods: 2,
    genericUtilityMethods: 0,
    anonymousExecutableMethods: 0,
    methodsOutsideDomainVocabulary: 0,
    unimplementedStubMethods: 0,
    coverage: 100,
    verdict: 'STERILE DOMAIN BODY',
    provenance: buildsReportProvenance(
      {
        configPath: '/test/root/logme.config.json',
        rootDir: '/test/root',
        reportPath: '/test/root/report.md',
        includeExtensions: ['.js', '.ts'],
        excludeDirectories: ['tests'],
        excludeFiles: ['report.md'],
        includeTestFiles: false,
        stubMarker: '// STUB',
        forbiddenLocalUtilityNames: ['utils', 'helpers'],
        forbiddenMethodNames: ['arrow-function'],
        domainContract: {
          reportTitle: 'Test Domain Report',
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
      ['/test/root/src/example.js', '/test/root/src/another.js'],
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
        {
          scanOrder: 2,
          name: 'anotherMethod',
          kind: 'class-method',
          hasLogMeCall: false,
          filePath: '/test/root/src/another.js',
          lineStart: 30,
          lineEnd: 40,
        },
      ],
      {
        generationTimestamp: '2026-07-09T12:00:00.000Z',
        generationCommand: 'node test-runner.js',
        gitWorkingTreeMarker: 'commit:abc123',
        evidenceDirectory: '/test/root/evidence',
        runId: 'run-123',
      },
    ),
    findings: [
      {
        code: 'test-finding-1',
        filePath: '/test/root/src/example.js',
        methodName: 'exampleMethod',
        reason: 'This is a test finding',
      },
    ],
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
      {
        scanOrder: 2,
        name: 'anotherMethod',
        kind: 'class-method',
        hasLogMeCall: false,
        filePath: '/test/root/src/another.js',
        lineStart: 30,
        lineEnd: 40,
      },
    ],
  };

  const report = rendersDomainBodySterilityReport(contract);

  // Check title
  assert.match(report, /^# Test Domain Report/);

  // Check execution sketch and blocker summary are front-loaded
  assert.match(report, /## Execution Flow Sketch/);
  assert.match(report, /```text/);
  assert.match(report, /REPORT TRUTH/);
  assert.match(report, /Promotion\s+: BLOCKED/);
  assert.match(report, /## Blocker Summary/);
  assert.match(report, /finding code: test-finding-1/);
  assert.match(report, /Receipt evidence\s+: report\.md/);

  // Check Provenance section
  assert.match(report, /## Provenance/);
  assert.match(report, /- Report schema version: report-provenance\.v1/);
  assert.match(report, /- Generator name: LogMe domain audit/);
  assert.match(report, /- Generation timestamp: 2026-07-09T12:00:00\.000Z/);
  assert.match(report, /- Generation command: node test-runner\.js/);
  assert.match(report, /- Git commit or working tree marker: commit:abc123/);
  assert.match(report, /- Config path: \/test\/root\/logme\.config\.json/);
  assert.match(report, /- Config hash: [a-f0-9]{64}/);
  assert.match(report, /- Source inventory hash: [a-f0-9]{64}/);
  assert.match(report, /- Run id: run-123/);
  assert.match(report, /- Evidence directory: \/test\/root\/evidence/);

  // Check Config section
  assert.match(report, /## Config/);
  assert.match(report, /- Root: \/test\/root/);
  assert.match(report, /- Extensions: \.js, \.ts/);
  assert.match(report, /- Config: \/test\/root\/logme\.config\.json/);
  assert.match(report, /- Forbidden local utility names: utils, helpers/);
  assert.match(report, /- Include test files: no/);
  assert.match(report, /- Excluded files: report\.md/);

  // Check Hard Laws section
  assert.match(report, /## Hard Laws/);
  assert.match(report, /- Methods must be named clearly/);
  assert.match(report, /- All logic must be testable/);

  // Check Sterility Summary section
  assert.match(report, /## Sterility Summary/);
  assert.match(report, /- Files scanned: 5/);
  assert.match(report, /- Local executable methods: 12/);
  assert.match(report, /- Domain-bound methods: 10/);
  assert.match(report, /- Methods with LogMe call: 8/);
  assert.match(report, /- Silent local methods: 2/);
  assert.match(report, /- Generic utility methods in repo: 0/);
  assert.match(report, /- Anonymous executable methods: 0/);
  assert.match(report, /- Methods outside domain vocabulary: 0/);
  assert.match(report, /- Unimplemented stub methods: 0/);
  assert.match(report, /- Coverage: 100%/);
  assert.match(report, /- Verdict: STERILE DOMAIN BODY/);

  // Check Findings section
  assert.match(report, /## Findings/);
  assert.match(report, /- test-finding-1/);
  assert.match(report, /method: exampleMethod/);

  // Check Discovered Methods section
  assert.match(report, /## Discovered Methods/);
  assert.match(report, /\| Scan Order \| Method \| Kind \| LogMe \| Location \|/);
  assert.match(report, /\| 1 \| testMethod \| function-declaration \| yes \|/);
  assert.match(report, /\| 2 \| anotherMethod \| class-method \| no \|/);
});

test('rendersDomainBodySterilityReport shows stub findings in the report body', () => {
  const contract = {
    domainContract: {
      reportTitle: 'Test Domain Report',
      laws: ['Methods must be named clearly'],
      cleanFindingsLabel: '_No findings._',
    },
    rootDir: '/test/root',
    includeExtensions: ['.js'],
    configPath: '/test/root/logme.config.json',
    forbiddenLocalUtilityNames: ['utils'],
    includeTestFiles: false,
    excludeFiles: ['report.md'],
    filesScanned: 1,
    localExecutableMethods: 1,
    domainBoundMethods: 1,
    methodsWithLogMeCall: 1,
    silentLocalMethods: 0,
    genericUtilityMethods: 0,
    anonymousExecutableMethods: 0,
    methodsOutsideDomainVocabulary: 0,
    unimplementedStubMethods: 1,
    coverage: 100,
    verdict: 'DOMAIN BODY CONTAMINATED',
    provenance: buildsReportProvenance(
      {
        configPath: '/test/root/logme.config.json',
        rootDir: '/test/root',
        reportPath: '/test/root/report.md',
        includeExtensions: ['.js'],
        excludeDirectories: ['tests'],
        excludeFiles: ['report.md'],
        includeTestFiles: false,
        stubMarker: '// STUB',
        forbiddenLocalUtilityNames: ['utils'],
        forbiddenMethodNames: ['arrow-function'],
        domainContract: {
          reportTitle: 'Test Domain Report',
          domainName: 'LogMe',
          domainSummary: 'Test summary',
          domainVocabulary: { nouns: ['report'], verbs: ['render'] },
          laws: ['Methods must be named clearly'],
          cleanFindingsLabel: '_No findings._',
          verdicts: {
            sterile: 'STERILE DOMAIN BODY',
            languageImpure: 'COVERAGE CLEAN, LANGUAGE IMPURE',
            contaminated: 'DOMAIN BODY CONTAMINATED',
          },
          findings: {},
        },
      },
      ['/test/root/src/stub.js'],
      [
        {
          scanOrder: 1,
          name: 'stubMethod',
          kind: 'function',
          hasLogMeCall: true,
          filePath: '/test/root/src/stub.js',
          lineStart: 1,
          lineEnd: 3,
        },
      ],
      {
        generationTimestamp: '2026-07-09T12:00:00.000Z',
        generationCommand: 'node test-runner.js',
        gitWorkingTreeMarker: 'commit:abc123',
        evidenceDirectory: '/test/root/evidence',
        runId: 'run-456',
      },
    ),
    findings: [
      {
        code: 'unimplemented-stub-detected',
        filePath: '/test/root/src/stub.js',
        methodName: 'stubMethod',
        reason: 'scaffolded stub not implemented',
      },
    ],
    methods: [
      {
        scanOrder: 1,
        name: 'stubMethod',
        kind: 'function',
        hasLogMeCall: true,
        filePath: '/test/root/src/stub.js',
        lineStart: 1,
        lineEnd: 3,
      },
    ],
  };

  const report = rendersDomainBodySterilityReport(contract);

  assert.match(report, /- Unimplemented stub methods: 1/);
  assert.match(report, /unimplemented-stub-detected/);
  assert.match(report, /method: stubMethod/);
  assert.match(report, /scaffolded stub not implemented/);
  assert.match(report, /## Execution Flow Sketch/);
  assert.match(report, /Promotion\s+: BLOCKED/);
  assert.match(report, /## Blocker Summary/);
  assert.match(report, /finding code: unimplemented-stub-detected/);
  assert.match(report, /telemetry status: observed/);
});
