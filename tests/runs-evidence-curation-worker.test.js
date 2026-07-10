const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { runsEvidenceCurationWorker } = require('../src/runs-evidence-curation-worker/runs-evidence-curation-worker');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

test('runsEvidenceCurationWorker writes the catalog, latest evidence report, feature index, and cleanup plan end-to-end', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-curation-worker-'));

  try {
    writesFile(
      path.join(tempDir, 'evidence/runs/run-1/report-truth.v1.json'),
      JSON.stringify({ reportVerdict: 'tests pass, report truth gate passes' }),
    );
    writesFile(path.join(tempDir, 'evidence/runs/run-1/summary.report.md'), '# summary\n');

    const result = runsEvidenceCurationWorker(tempDir);

    assert.equal(result.catalog.runCount, 1);
    assert.equal(fs.existsSync(path.join(tempDir, result.latestEvidenceReportPath.replace(`${tempDir}${path.sep}`, ''))), true);
    assert.equal(fs.existsSync(result.featureIndexPath), true);
    assert.equal(fs.existsSync(result.planPath), true);
    assert.ok(result.sprawlGateResult.verdict);
    assert.equal(fs.existsSync(path.join(tempDir, 'evidence/runs/run-1/summary.report.md')), true);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('runsEvidenceCurationWorker does not flag a run with a compact report as noisy', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-curation-worker-'));

  try {
    writesFile(path.join(tempDir, 'evidence/runs/run-1/summary.report.md'), '# summary\n');

    const result = runsEvidenceCurationWorker(tempDir);

    assert.deepEqual(result.noisyFindings, []);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
