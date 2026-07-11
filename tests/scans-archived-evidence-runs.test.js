const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { scansArchivedEvidenceRuns } = require('../src/scans-archived-evidence-runs/scans-archived-evidence-runs');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

test('scansArchivedEvidenceRuns returns an empty array when there is no evidence/archive directory', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-archive-scan-'));

  try {
    assert.deepEqual(scansArchivedEvidenceRuns(tempDir), []);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('scansArchivedEvidenceRuns reads manifest fields for a compressed archived run', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-archive-scan-'));

  try {
    writesFile(
      path.join(tempDir, 'evidence/archive/2026/run-1.archive-manifest.v1.json'),
      JSON.stringify({ archivedAt: '2026-01-01T00:00:00.000Z', byteSize: 500, compressedByteSize: 50, compressionRatio: 0.1, artifactCount: 2, cleanupApprovalId: 'po@example.com' }),
    );
    writesFile(path.join(tempDir, 'evidence/archive/2026/run-1.zip'), 'PK zipped content');

    const runs = scansArchivedEvidenceRuns(tempDir);

    assert.equal(runs.length, 1);
    assert.equal(runs[0].runId, 'run-1');
    assert.equal(runs[0].year, '2026');
    assert.equal(runs[0].archiveKind, 'zip');
    assert.equal(runs[0].archivePath, 'evidence/archive/2026/run-1.zip');
    assert.equal(runs[0].archivedAt, '2026-01-01T00:00:00.000Z');
    assert.equal(runs[0].totalByteSize, 500);
    assert.equal(runs[0].compressedByteSize, 50);
    assert.equal(runs[0].compressionRatio, 0.1);
    assert.equal(runs[0].artifactCount, 2);
    assert.equal(runs[0].cleanupApprovalId, 'po@example.com');
    assert.equal(runs[0].hasManifest, true);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('scansArchivedEvidenceRuns marks a compressed archive with no manifest as hasManifest false', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-archive-scan-'));

  try {
    writesFile(path.join(tempDir, 'evidence/archive/2026/run-1.zip'), 'PK zipped content');

    const runs = scansArchivedEvidenceRuns(tempDir);

    assert.equal(runs[0].hasManifest, false);
    assert.equal(runs[0].archivedAt, null);
    assert.equal(runs[0].archiveKind, 'zip');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('scansArchivedEvidenceRuns scans across multiple year directories', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-archive-scan-'));

  try {
    writesFile(path.join(tempDir, 'evidence/archive/2025/run-old.zip'), 'PK old');
    writesFile(path.join(tempDir, 'evidence/archive/2026/run-new.zip'), 'PK new');

    const runs = scansArchivedEvidenceRuns(tempDir);

    assert.deepEqual(runs.map((run) => run.runId).sort(), ['run-new', 'run-old']);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('scansArchivedEvidenceRuns still reads legacy folder archives', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-archive-scan-'));

  try {
    writesFile(path.join(tempDir, 'evidence/archive/2026/run-legacy/notes.md'), 'notes');

    const runs = scansArchivedEvidenceRuns(tempDir);

    assert.equal(runs[0].runId, 'run-legacy');
    assert.equal(runs[0].archiveKind, 'folder');
    assert.equal(runs[0].runDir, 'evidence/archive/2026/run-legacy');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
