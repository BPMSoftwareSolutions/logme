const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const {
  buildsReportTruthHookMessage,
  formatsReportTruthSummary,
  runsReportTruthCommand,
} = require('../src/report-truth/report-truth');

test('runsReportTruthCommand fails locally when the current report is contaminated', () => {
  const result = runsReportTruthCommand({ writeEvidence: false });

  assert.equal(result.exitCode, 1);
  assert.equal(result.status, 'tests pass, report truth gate fails');
  assert.equal(result.reportVerdict, 'DOMAIN BODY CONTAMINATED');
  assert.equal(typeof result.coverage, 'number');
  assert.equal(typeof result.silentLocalMethods, 'number');
  assert.equal(typeof result.anonymousExecutableMethods, 'number');
  assert.equal(Array.isArray(result.topFindingCodes), true);
  assert.equal(Array.isArray(result.topFindingPaths), true);
  assert.ok(result.topFindingCodes.length > 0);
  assert.ok(result.topFindingPaths.length > 0);
  assert.ok(result.blockers.length > 0);
});

test('formatsReportTruthSummary stays bounded and omits clean or promotion-ready claims', () => {
  const result = runsReportTruthCommand({ writeEvidence: false });
  const summary = formatsReportTruthSummary(result);

  assert.match(summary, /tests pass, report truth gate fails/);
  assert.match(summary, /report verdict: DOMAIN BODY CONTAMINATED/);
  assert.match(summary, /coverage: \d+(\.\d+)?%/);
  assert.match(summary, /silent local methods: \d+/);
  assert.match(summary, /anonymous executable methods: \d+/);
  assert.match(summary, /top finding codes:/);
  assert.match(summary, /top finding paths:/);
  assert.doesNotMatch(summary.toLowerCase(), /promotion-ready/);
  assert.doesNotMatch(summary.toLowerCase(), /\bclean claim\b/);
});

test('buildsReportTruthHookMessage points developers to the command and first finding path', () => {
  const result = runsReportTruthCommand({ writeEvidence: false });
  const message = buildsReportTruthHookMessage(result, 'npm run report:truth');

  assert.match(message, /Run npm run report:truth/);
  assert.match(message, /First actionable finding path:/);
});

test('report truth CLI is quiet enough to use in fast mode', () => {
  const scriptPath = path.join(process.cwd(), 'scripts', 'report-truth.js');
  const cli = spawnSync(process.execPath, [scriptPath, '--fast'], {
    encoding: 'utf8',
  });

  assert.equal(cli.status, 1);
  assert.match(cli.stdout, /tests pass, report truth gate fails/);
  assert.match(cli.stdout, /report verdict: DOMAIN BODY CONTAMINATED/);
  assert.doesNotMatch(cli.stdout.toLowerCase(), /promotion-ready/);
  assert.doesNotMatch(cli.stdout.toLowerCase(), /\bclean claim\b/);
  assert.equal(cli.stderr, '');
});
