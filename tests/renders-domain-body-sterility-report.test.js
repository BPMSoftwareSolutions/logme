const test = require('node:test');
const assert = require('node:assert/strict');

const { rendersDomainBodySterilityReport } = require('../src/renders-domain-body-sterility-report/renders-domain-body-sterility-report');

test('rendersDomainBodySterilityReport builds report with title, config, laws, sterility summary, findings, and methods table', () => {
  const contract = {
    domainContract: {
      reportTitle: 'Test Domain Report',
      laws: ['Methods must be named clearly', 'All logic must be testable'],
      cleanFindingsLabel: '_No findings._',
    },
    rootDir: '/test/root',
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
