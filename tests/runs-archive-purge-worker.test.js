const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { runsArchivePurgeWorker } = require('../src/runs-archive-purge-worker/runs-archive-purge-worker');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

test('runsArchivePurgeWorker scans archived runs and writes a dry-run purge plan', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-archive-worker-'));

  try {
    writesFile(
      path.join(tempDir, 'evidence/archive/2025/run-1/archive-manifest.v1.json'),
      JSON.stringify({ archivedAt: '2025-01-01T00:00:00.000Z', byteSize: 200, artifactCount: 1, cleanupApprovalId: 'po' }),
    );

    const result = runsArchivePurgeWorker(tempDir, { now: new Date('2026-07-10T00:00:00.000Z') });

    assert.equal(result.archivedRuns.length, 1);
    assert.equal(fs.existsSync(result.planPath), true);
    assert.equal(fs.existsSync(result.reportPath), true);
    assert.equal(result.plan.entries[0].action, 'purge');
    assert.equal(fs.existsSync(path.join(tempDir, 'evidence/archive/2025/run-1/archive-manifest.v1.json')), true);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
