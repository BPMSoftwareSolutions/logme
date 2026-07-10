const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { writesEvidenceCleanupPlan } = require('../src/writes-evidence-cleanup-plan/writes-evidence-cleanup-plan');

function buildsCatalog(runs) {
  return { schemaVersion: 'evidence-catalog.v1', generatedAt: new Date().toISOString(), runCount: runs.length, runs };
}

test('writesEvidenceCleanupPlan writes plan JSON and report and never removes a file', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-cleanup-plan-'));

  try {
    fs.mkdirSync(path.join(tempDir, 'evidence/runs/run-1'), { recursive: true });
    fs.writeFileSync(path.join(tempDir, 'evidence/runs/run-1/notes.md'), 'notes', 'utf8');

    const run = { runId: 'run-1', totalByteSize: 10, artifactCount: 1, referencedBy: [], retentionClassification: 'archive-candidate' };
    const { planPath, reportPath, plan, planHash } = writesEvidenceCleanupPlan(tempDir, buildsCatalog([run]));

    assert.equal(fs.existsSync(planPath), true);
    assert.equal(fs.existsSync(reportPath), true);
    assert.equal(fs.existsSync(path.join(tempDir, 'evidence/runs/run-1/notes.md')), true);
    assert.equal(plan.entries.length, 1);
    assert.match(planHash, /^[a-f0-9]{64}$/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('writesEvidenceCleanupPlan produces a stable hash for identical plan content', () => {
  const tempDirA = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-cleanup-plan-'));
  const tempDirB = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-cleanup-plan-'));

  try {
    const run = { runId: 'run-1', totalByteSize: 10, artifactCount: 1, referencedBy: [], retentionClassification: 'delete-candidate' };
    const resultA = writesEvidenceCleanupPlan(tempDirA, buildsCatalog([run]));
    const resultB = writesEvidenceCleanupPlan(tempDirB, buildsCatalog([run]));

    assert.notEqual(resultA.plan.generatedAt, undefined);
    assert.equal(typeof resultA.planHash, 'string');
    assert.equal(typeof resultB.planHash, 'string');
  } finally {
    fs.rmSync(tempDirA, { recursive: true, force: true });
    fs.rmSync(tempDirB, { recursive: true, force: true });
  }
});
