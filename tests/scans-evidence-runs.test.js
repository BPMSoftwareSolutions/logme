const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { scansEvidenceRuns } = require('../src/scans-evidence-runs/scans-evidence-runs');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

test('scansEvidenceRuns returns an empty array when there is no evidence/runs directory', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-scan-'));

  try {
    assert.deepEqual(scansEvidenceRuns(tempDir), []);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('scansEvidenceRuns inventories run metadata without deleting any artifact', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-scan-'));

  try {
    writesFile(path.join(tempDir, 'evidence/runs/run-1/report-truth.v1.json'), JSON.stringify({ reportVerdict: 'tests pass, report truth gate passes' }));
    writesFile(path.join(tempDir, 'evidence/runs/run-1/notes.md'), '# notes\n');

    const runs = scansEvidenceRuns(tempDir);

    assert.equal(runs.length, 1);
    assert.equal(runs[0].runId, 'run-1');
    assert.equal(runs[0].artifactCount, 2);
    assert.equal(runs[0].reportTruthStatus, 'tests pass, report truth gate passes');
    assert.equal(fs.existsSync(path.join(tempDir, 'evidence/runs/run-1/notes.md')), true);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('scansEvidenceRuns sorts run ids alphabetically', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-scan-'));

  try {
    writesFile(path.join(tempDir, 'evidence/runs/run-b/a.json'), '{}');
    writesFile(path.join(tempDir, 'evidence/runs/run-a/a.json'), '{}');

    const runs = scansEvidenceRuns(tempDir);

    assert.deepEqual(runs.map((run) => run.runId), ['run-a', 'run-b']);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
