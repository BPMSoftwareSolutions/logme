const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { archivesEvidenceRun } = require('../src/archives-evidence-run/archives-evidence-run');

test('archivesEvidenceRun compresses run artifacts into evidence/archive/<year>/<run-id>.zip and writes a manifest', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-archive-'));

  try {
    const sourceDir = path.join(tempDir, 'evidence/runs/run-1');
    fs.mkdirSync(sourceDir, { recursive: true });
    fs.writeFileSync(path.join(sourceDir, 'notes.md'), 'archived content', 'utf8');

    const now = new Date('2026-07-10T00:00:00.000Z');
    const { archivePath, manifestPath, manifest } = archivesEvidenceRun(tempDir, 'run-1', 'approval-1', now);
    const expectedArchivePath = path.join(tempDir, 'evidence/archive/2026/run-1.zip');

    assert.equal(fs.existsSync(manifestPath), true);
    assert.equal(fs.existsSync(archivePath), true);
    assert.equal(archivePath, expectedArchivePath);
    assert.equal(fs.existsSync(sourceDir), false);
    assert.equal(fs.existsSync(path.join(tempDir, 'evidence/archive/2026/run-1/notes.md')), false);
    assert.equal(manifest.runId, 'run-1');
    assert.equal(manifest.archivePath, 'evidence/archive/2026/run-1.zip');
    assert.equal(manifest.compressionFormat, 'zip');
    assert.equal(manifest.artifactCount, 1);
    assert.equal(manifest.compressedByteSize > 0, true);
    assert.equal(manifest.compressionRatio > 0, true);
    assert.equal(manifest.cleanupApprovalId, 'approval-1');
    assert.equal(manifest.contentHashes.length, 1);
    assert.equal(manifest.contentHashes[0].archiveEntryPath, 'notes.md');
    assert.match(manifest.contentHashes[0].contentHash, /^[a-f0-9]{64}$/);
    assert.equal(fs.readFileSync(archivePath).subarray(0, 2).toString('utf8'), 'PK');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('archivesEvidenceRun records nested archive entry paths in the manifest', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-archive-'));

  try {
    const sourceDir = path.join(tempDir, 'evidence/runs/run-2');
    fs.mkdirSync(path.join(sourceDir, 'nested'), { recursive: true });
    fs.writeFileSync(path.join(sourceDir, 'nested', 'deep.json'), '{}', 'utf8');

    const { manifest } = archivesEvidenceRun(tempDir, 'run-2', 'approval-2', new Date('2026-07-10T00:00:00.000Z'));

    assert.equal(fs.existsSync(path.join(tempDir, 'evidence/archive/2026/run-2.zip')), true);
    assert.equal(fs.existsSync(path.join(tempDir, 'evidence/archive/2026/run-2/nested/deep.json')), false);
    assert.equal(manifest.artifactCount, 1);
    assert.equal(manifest.contentHashes[0].archiveEntryPath, 'nested/deep.json');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
