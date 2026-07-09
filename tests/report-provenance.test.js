const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildsReportProvenance,
  checksReportTruthGate,
  computesConfigHash,
  computesSourceInventoryHash,
} = require('../src/report-provenance/report-provenance');

test('buildsReportProvenance derives hash fields from the rendered inputs', () => {
  const baseConfig = {
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
      reportTitle: 'Test Report',
      domainName: 'LogMe',
      domainSummary: 'Test summary',
      domainVocabulary: { nouns: ['report'], verbs: ['render'] },
      laws: ['Keep proof visible'],
      cleanFindingsLabel: '_No findings._',
      verdicts: {
        sterile: 'STERILE DOMAIN BODY',
        languageImpure: 'COVERAGE CLEAN, LANGUAGE IMPURE',
        contaminated: 'DOMAIN BODY CONTAMINATED',
      },
      findings: {},
    },
  };

  const methods = [
    {
      scanOrder: 1,
      executionStep: 1,
      name: 'firstMethod',
      kind: 'function',
      hasLogMeCall: true,
      isAnonymous: false,
      isUnimplementedStub: false,
      filePath: '/test/root/src/a.js',
      lineStart: 1,
      lineEnd: 5,
    },
  ];

  const provenance = buildsReportProvenance(baseConfig, ['/test/root/src/a.js'], methods, {
    generationTimestamp: '2026-07-09T12:00:00.000Z',
    generationCommand: 'node generate.js',
    gitWorkingTreeMarker: 'commit:abc123',
    evidenceDirectory: '/test/root/evidence',
    runId: 'run-123',
  });

  assert.equal(provenance.configHash, computesConfigHash(baseConfig));
  assert.equal(provenance.sourceInventoryHash, computesSourceInventoryHash(['/test/root/src/a.js'], methods));

  const changedConfigHash = computesConfigHash({
    ...baseConfig,
    rootDir: '/test/other-root',
  });
  const changedSourceHash = computesSourceInventoryHash(['/test/root/src/a.js'], [
    {
      ...methods[0],
      name: 'secondMethod',
    },
  ]);

  assert.notEqual(provenance.configHash, changedConfigHash);
  assert.notEqual(provenance.sourceInventoryHash, changedSourceHash);
});

test('checksReportTruthGate blocks a stale report projection when source hashes drift', () => {
  const reportContent = [
    '# Test Report',
    '',
    '## Provenance',
    '',
    '- Report schema version: report-provenance.v1',
    '- Generator name: LogMe domain audit',
    '- Generation timestamp: 2026-07-09T12:00:00.000Z',
    '- Generation command: node generate.js',
    '- Git commit or working tree marker: commit:abc123',
    '- Config path: /test/root/logme.config.json',
    '- Config hash: 1111111111111111111111111111111111111111111111111111111111111111',
    '- Source inventory hash: 2222222222222222222222222222222222222222222222222222222222222222',
    '- Run id: run-123',
    '- Evidence directory: /test/root/evidence',
    '',
    '## Config',
    '',
    '- Root: /test/root',
  ].join('\n');

  const verdict = checksReportTruthGate(reportContent, '3333333333333333333333333333333333333333333333333333333333333333');

  assert.equal(verdict.verdict, 'BLOCKED');
  assert.deepEqual(verdict.findings.map((finding) => finding.code), [
    'stale-report-projection',
    'report-source-hash-mismatch',
  ]);
  assert.equal(verdict.provenance.sourceInventoryHash, '2222222222222222222222222222222222222222222222222222222222222222');
});
