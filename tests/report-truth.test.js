const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const {
  buildsFailureBlockers,
  buildsReportTruthHookMessage,
  formatsReportTruthSummary,
  readsMarkdownMethodTable,
  runsReportTruthCommand,
} = require('../src/report-truth/report-truth');

test('runsReportTruthCommand passes locally when the report is sterile', () => {
  const result = runsReportTruthCommand({ writeEvidence: false });

  assert.equal(result.exitCode, 0);
  assert.equal(result.status, 'tests pass, report truth gate passes');
  assert.equal(result.reportVerdict, 'STERILE DOMAIN BODY');
  assert.equal(typeof result.coverage, 'number');
  assert.equal(typeof result.silentLocalMethods, 'number');
  assert.equal(typeof result.anonymousExecutableMethods, 'number');
  assert.equal(Array.isArray(result.topFindingCodes), true);
  assert.equal(Array.isArray(result.topFindingPaths), true);
  assert.equal(result.topFindingCodes.length, 0);
  assert.equal(result.topFindingPaths.length, 0);
  assert.equal(result.blockers.length, 0);
});

test('formatsReportTruthSummary stays bounded and omits clean or promotion-ready claims', () => {
  const result = runsReportTruthCommand({ writeEvidence: false });
  const summary = formatsReportTruthSummary(result);

  assert.match(summary, /tests pass, report truth gate passes/);
  assert.match(summary, /report verdict: STERILE DOMAIN BODY/);
  assert.match(summary, /coverage: \d+(\.\d+)?%/);
  assert.match(summary, /silent local methods: \d+/);
  assert.match(summary, /anonymous executable methods: \d+/);
  assert.match(summary, /top finding codes:/);
  assert.match(summary, /top finding paths:/);
  assert.doesNotMatch(summary.toLowerCase(), /promotion-ready/);
  assert.doesNotMatch(summary.toLowerCase(), /\bclean claim\b/);
});

test('buildsReportTruthHookMessage points developers to the command and first finding path', () => {
  const message = buildsReportTruthHookMessage({
    topFindingPaths: ['C:/example/problem.js'],
    snapshot: { config: { reportPath: 'C:/example/report.md' } },
  }, 'npm run report:truth');

  assert.match(message, /Run npm run report:truth/);
  assert.match(message, /First actionable finding path:/);
});

test('buildsFailureBlockers surfaces a single blocker and stops early when report layout validation fails', () => {
  const failureSnapshot = {
    config: { reportPath: '/test/root/report.md' },
    layoutFailureReason: 'report layout validation failed, report.md was not rendered: report-layout-truth-field-omitted (...)',
  };

  const blockers = buildsFailureBlockers(failureSnapshot);

  assert.equal(blockers.length, 1);
  assert.equal(blockers[0].code, 'report-layout-validation-failed');
  assert.match(blockers[0].reason, /report-layout-truth-field-omitted/);
});

test('readsMarkdownMethodTable stops before later report sections', () => {
  const rows = readsMarkdownMethodTable([
    '## Discovered Methods',
    '',
    '| Scan Order | Execution Step | Method | Kind | Has LogMe | Source |',
    '| --- | --- | --- | --- | --- | --- |',
    '| 1 | 1 | runsReportTruthCommand | function | yes | src/report-truth/report-truth.js:1-2 |',
    '',
    '## QA Readiness',
    '',
    '| release candidate id | latest QA run id |',
    '| --- | --- |',
    '| rc-001 | qa-001 |',
  ].join('\n'));

  assert.equal(rows.length, 1);
  assert.equal(rows[0][2], 'runsReportTruthCommand');
});

test('report truth CLI is quiet enough to use in fast mode', () => {
  const scriptPath = path.join(process.cwd(), 'scripts', 'report-truth.js');
  const cli = spawnSync(process.execPath, [scriptPath, '--fast'], {
    encoding: 'utf8',
  });

  assert.equal(cli.status, 0);
  assert.match(cli.stdout, /tests pass, report truth gate passes/);
  assert.match(cli.stdout, /report verdict: STERILE DOMAIN BODY/);
  assert.doesNotMatch(cli.stdout.toLowerCase(), /promotion-ready/);
  assert.doesNotMatch(cli.stdout.toLowerCase(), /\bclean claim\b/);
  assert.equal(cli.stderr, '');
});
