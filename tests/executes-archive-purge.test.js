const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { executesArchivePurge } = require('../src/executes-archive-purge/executes-archive-purge');

function buildsApprovalRecord(overrides = {}) {
  return {
    approvedBy: 'po@example.com',
    approvedAt: '2026-07-01T00:00:00.000Z',
    cleanupPlanPath: 'evidence/cleanup/archive-purge-plan.v1.json',
    cleanupPlanHash: 'hash-abc',
    approvedActions: ['purge'],
    ...overrides,
  };
}

test('executesArchivePurge remains advisory-only when approval is missing', () => {
  const plan = { entries: [{ runId: 'run-1', year: '2026', action: 'purge', referencesFound: [], bytesReclaimable: 10 }] };

  const result = executesArchivePurge('/does-not-matter', plan, 'hash-abc', null);

  assert.equal(result.verdict, 'ADVISORY_ONLY');
});

test('executesArchivePurge blocks a purge on a pinned archived run even when approved', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-archive-execute-'));

  try {
    const plan = { entries: [{ runId: 'run-1', year: '2026', action: 'purge', referencesFound: ['manual pin'], bytesReclaimable: 10 }] };

    const result = executesArchivePurge(tempDir, plan, 'hash-abc', buildsApprovalRecord());

    assert.equal(result.verdict, 'EXECUTED');
    assert.equal(result.executionResult.blockedActions.length, 1);
    assert.deepEqual(result.executionResult.purgedRuns, []);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('executesArchivePurge deletes an approved, unreferenced expired compressed archived run', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-archive-execute-'));

  try {
    fs.mkdirSync(path.join(tempDir, 'evidence/archive/2026'), { recursive: true });
    fs.writeFileSync(path.join(tempDir, 'evidence/archive/2026/run-1.zip'), 'PK content', 'utf8');
    fs.writeFileSync(path.join(tempDir, 'evidence/archive/2026/run-1.archive-manifest.v1.json'), '{}', 'utf8');

    const plan = { entries: [{ runId: 'run-1', year: '2026', action: 'purge', referencesFound: [], bytesReclaimable: 10 }] };

    const result = executesArchivePurge(tempDir, plan, 'hash-abc', buildsApprovalRecord());

    assert.equal(result.verdict, 'EXECUTED');
    assert.equal(result.executionResult.purgedRuns.length, 1);
    assert.equal(fs.existsSync(path.join(tempDir, 'evidence/archive/2026/run-1.zip')), false);
    assert.equal(fs.existsSync(path.join(tempDir, 'evidence/archive/2026/run-1.archive-manifest.v1.json')), false);
    assert.equal(fs.existsSync(result.receiptPath), true);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('executesArchivePurge keeps runs classified as keep without touching the file system', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-archive-execute-'));

  try {
    const plan = { entries: [{ runId: 'run-1', year: '2026', action: 'keep', referencesFound: [], bytesReclaimable: 0 }] };

    const result = executesArchivePurge(tempDir, plan, 'hash-abc', buildsApprovalRecord());

    assert.deepEqual(result.executionResult.keptRuns, ['run-1']);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
