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

test('scansEvidenceRuns derives a report verdict from a domain analysis contract when no sterility receipt exists', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-scan-'));

  try {
    writesFile(
      path.join(tempDir, 'evidence/runs/run-1/domain-analysis/domain-body-analysis.contract.v1.json'),
      JSON.stringify({ summary: { totalBlockers: 3 } }),
    );

    const runs = scansEvidenceRuns(tempDir);

    assert.equal(runs[0].reportVerdict, 'domain analysis has 3 blocker(s)');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('scansEvidenceRuns reports a clean domain analysis verdict when there are no blockers', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-scan-'));

  try {
    writesFile(
      path.join(tempDir, 'evidence/runs/run-1/domain-analysis/domain-body-analysis.contract.v1.json'),
      JSON.stringify({ summary: { totalBlockers: 0 } }),
    );

    const runs = scansEvidenceRuns(tempDir);

    assert.equal(runs[0].reportVerdict, 'domain analysis clean');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('scansEvidenceRuns prefers the sterility receipt verdict over the domain analysis verdict when both exist', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-scan-'));

  try {
    writesFile(
      path.join(tempDir, 'evidence/runs/run-1/domain-analysis/domain-body-analysis.contract.v1.json'),
      JSON.stringify({ summary: { totalBlockers: 3 } }),
    );
    writesFile(
      path.join(tempDir, 'evidence/runs/run-1/domain-body-sterility.receipt.v1.json'),
      JSON.stringify({ verdict: 'STERILE DOMAIN BODY' }),
    );

    const runs = scansEvidenceRuns(tempDir);

    assert.equal(runs[0].reportVerdict, 'STERILE DOMAIN BODY');
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
