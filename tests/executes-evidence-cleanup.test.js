const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { executesEvidenceCleanup } = require('../src/executes-evidence-cleanup/executes-evidence-cleanup');

function buildsApprovalRecord(overrides = {}) {
  return {
    approvedBy: 'po@example.com',
    approvedAt: '2026-07-01T00:00:00.000Z',
    cleanupPlanPath: 'evidence/cleanup/evidence-cleanup-plan.v1.json',
    cleanupPlanHash: 'hash-abc',
    approvedActions: ['archive', 'delete'],
    ...overrides,
  };
}

test('executesEvidenceCleanup remains advisory-only when approval is missing', () => {
  const plan = { entries: [{ runId: 'run-1', action: 'delete', referencesFound: [], bytesReclaimable: 10 }] };

  const result = executesEvidenceCleanup('/does-not-matter', plan, 'hash-abc', null);

  assert.equal(result.verdict, 'ADVISORY_ONLY');
  assert.ok(result.advisoryGates.includes('approval check'));
});

test('executesEvidenceCleanup remains advisory-only when the plan hash does not match', () => {
  const plan = { entries: [{ runId: 'run-1', action: 'delete', referencesFound: [], bytesReclaimable: 10 }] };

  const result = executesEvidenceCleanup('/does-not-matter', plan, 'current-hash', buildsApprovalRecord({ cleanupPlanHash: 'stale-hash' }));

  assert.equal(result.verdict, 'ADVISORY_ONLY');
});

test('executesEvidenceCleanup blocks a destructive action on a referenced run even when approved', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-execute-'));

  try {
    const plan = { entries: [{ runId: 'run-1', action: 'delete', referencesFound: ['QA evidence bundle'], bytesReclaimable: 10 }] };

    const result = executesEvidenceCleanup(tempDir, plan, 'hash-abc', buildsApprovalRecord());

    assert.equal(result.verdict, 'EXECUTED');
    assert.equal(result.executionResult.blockedActions.length, 1);
    assert.deepEqual(result.executionResult.deletedRuns, []);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('executesEvidenceCleanup archives before deleting an approved, unreferenced delete candidate', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-execute-'));

  try {
    fs.mkdirSync(path.join(tempDir, 'evidence/runs/run-1'), { recursive: true });
    fs.writeFileSync(path.join(tempDir, 'evidence/runs/run-1/notes.md'), 'content', 'utf8');

    const plan = { entries: [{ runId: 'run-1', action: 'delete', referencesFound: [], bytesReclaimable: 10 }] };

    const result = executesEvidenceCleanup(tempDir, plan, 'hash-abc', buildsApprovalRecord(), { now: new Date('2026-07-10T00:00:00.000Z') });

    assert.equal(result.verdict, 'EXECUTED');
    assert.equal(result.executionResult.archivedRuns.length, 1);
    assert.equal(result.executionResult.deletedRuns[0].archivedFirst, true);
    assert.equal(fs.existsSync(path.join(tempDir, 'evidence/archive/2026/run-1.zip')), true);
    assert.equal(fs.existsSync(path.join(tempDir, 'evidence/archive/2026/run-1.archive-manifest.v1.json')), true);
    assert.equal(fs.existsSync(path.join(tempDir, 'evidence/archive/2026/run-1/notes.md')), false);
    assert.equal(fs.existsSync(result.receiptPath), true);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('executesEvidenceCleanup keeps runs classified as keep or pin without touching the file system', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-execute-'));

  try {
    const plan = { entries: [{ runId: 'run-1', action: 'keep', referencesFound: ['latest evidence report'], bytesReclaimable: 0 }] };

    const result = executesEvidenceCleanup(tempDir, plan, 'hash-abc', buildsApprovalRecord());

    assert.deepEqual(result.executionResult.keptRuns, ['run-1']);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
