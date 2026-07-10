const test = require('node:test');
const assert = require('node:assert/strict');

const { gatesEvidenceSprawlBudget } = require('../src/gates-evidence-sprawl-budget/gates-evidence-sprawl-budget');

function buildsCatalog(runCount, byteSizeEach) {
  const runs = Array.from({ length: runCount }, (_, index) => ({ runId: `run-${index}`, totalByteSize: byteSizeEach }));
  return { runs };
}

test('gatesEvidenceSprawlBudget passes when storage is within budget', () => {
  const result = gatesEvidenceSprawlBudget(buildsCatalog(5, 100), { latestReportTruthRun: 'run-0' }, { entries: [] }, false, { maxRunCount: 200 });

  assert.equal(result.verdict, 'PASS');
});

test('gatesEvidenceSprawlBudget warns when budget is exceeded but cleanup candidates and latest evidence exist', () => {
  const catalog = buildsCatalog(3, 100);
  const cleanupPlan = { entries: [{ action: 'archive' }, { action: 'keep' }] };

  const result = gatesEvidenceSprawlBudget(catalog, { latestReportTruthRun: 'run-0' }, cleanupPlan, false, { maxRunCount: 2 });

  assert.equal(result.verdict, 'WARN');
  assert.equal(result.warnings.length, 1);
});

test('gatesEvidenceSprawlBudget fails when latest evidence cannot be identified', () => {
  const catalog = buildsCatalog(3, 100);

  const result = gatesEvidenceSprawlBudget(catalog, { latestReportTruthRun: null }, { entries: [] }, false, { maxRunCount: 2 });

  assert.equal(result.verdict, 'FAIL');
  assert.ok(result.failures.some((failure) => failure.includes('latest evidence')));
});

test('gatesEvidenceSprawlBudget does not delete fresh delivery evidence merely to satisfy the byte budget', () => {
  const catalog = buildsCatalog(3, 100);
  const cleanupPlan = { entries: [] };

  const result = gatesEvidenceSprawlBudget(catalog, { latestReportTruthRun: 'run-0' }, cleanupPlan, false, { maxRunCount: 2 });

  assert.notEqual(result.verdict, 'FAIL');
});
