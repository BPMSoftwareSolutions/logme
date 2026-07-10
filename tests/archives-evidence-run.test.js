const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { archivesEvidenceRun } = require('../src/archives-evidence-run/archives-evidence-run');

test('archivesEvidenceRun moves run artifacts into evidence/archive/<year>/<run-id>/ and writes a manifest', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-archive-'));

  try {
    const sourceDir = path.join(tempDir, 'evidence/runs/run-1');
    fs.mkdirSync(sourceDir, { recursive: true });
    fs.writeFileSync(path.join(sourceDir, 'notes.md'), 'archived content', 'utf8');

    const now = new Date('2026-07-10T00:00:00.000Z');
    const { manifestPath, manifest } = archivesEvidenceRun(tempDir, 'run-1', 'approval-1', now);

    assert.equal(fs.existsSync(manifestPath), true);
    assert.equal(fs.existsSync(sourceDir), false);
    assert.equal(fs.existsSync(path.join(tempDir, 'evidence/archive/2026/run-1/notes.md')), true);
    assert.equal(manifest.runId, 'run-1');
    assert.equal(manifest.artifactCount, 1);
    assert.equal(manifest.cleanupApprovalId, 'approval-1');
    assert.equal(manifest.contentHashes.length, 1);
    assert.match(manifest.contentHashes[0].contentHash, /^[a-f0-9]{64}$/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('archivesEvidenceRun preserves nested directory structure', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-archive-'));

  try {
    const sourceDir = path.join(tempDir, 'evidence/runs/run-2');
    fs.mkdirSync(path.join(sourceDir, 'nested'), { recursive: true });
    fs.writeFileSync(path.join(sourceDir, 'nested', 'deep.json'), '{}', 'utf8');

    const { manifest } = archivesEvidenceRun(tempDir, 'run-2', 'approval-2', new Date('2026-07-10T00:00:00.000Z'));

    assert.equal(fs.existsSync(path.join(tempDir, 'evidence/archive/2026/run-2/nested/deep.json')), true);
    assert.equal(manifest.artifactCount, 1);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
