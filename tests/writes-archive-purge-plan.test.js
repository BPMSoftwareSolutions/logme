const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { writesArchivePurgePlan } = require('../src/writes-archive-purge-plan/writes-archive-purge-plan');

function buildsReferenceContext(overrides = {}) {
  return {
    manualPinRunIds: new Set(),
    now: new Date('2026-07-10T00:00:00.000Z'),
    ...overrides,
  };
}

test('writesArchivePurgePlan writes plan JSON and report and never deletes a file', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-archive-plan-'));

  try {
    fs.mkdirSync(path.join(tempDir, 'evidence/archive/2026'), { recursive: true });
    fs.writeFileSync(path.join(tempDir, 'evidence/archive/2026/run-1.zip'), 'PK notes', 'utf8');

    const archivedRun = { runId: 'run-1', year: '2026', archivePath: 'evidence/archive/2026/run-1.zip', archiveKind: 'zip', archivedAt: '2025-01-01T00:00:00.000Z', hasManifest: true, totalByteSize: 100, compressedByteSize: 10, artifactCount: 1 };
    const { planPath, reportPath, plan, planHash } = writesArchivePurgePlan(tempDir, [archivedRun], buildsReferenceContext());

    assert.equal(fs.existsSync(planPath), true);
    assert.equal(fs.existsSync(reportPath), true);
    assert.equal(fs.existsSync(path.join(tempDir, 'evidence/archive/2026/run-1.zip')), true);
    assert.equal(plan.entries.length, 1);
    assert.match(planHash, /^[a-f0-9]{64}$/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
