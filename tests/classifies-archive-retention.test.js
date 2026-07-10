const test = require('node:test');
const assert = require('node:assert/strict');

const { classifiesArchiveRetention, ARCHIVE_RETENTION_CLASSIFICATIONS } = require('../src/classifies-archive-retention/classifies-archive-retention');

function buildsReferenceContext(overrides = {}) {
  return {
    manualPinRunIds: new Set(),
    now: new Date('2026-07-10T00:00:00.000Z'),
    ...overrides,
  };
}

function buildsArchivedRun(overrides = {}) {
  return {
    runId: 'run-1',
    year: '2026',
    archivedAt: '2026-07-01T00:00:00.000Z',
    hasManifest: true,
    totalByteSize: 1000,
    artifactCount: 3,
    ...overrides,
  };
}

test('classifiesArchiveRetention protects a pinned archived run', () => {
  const run = buildsArchivedRun();
  const referenceContext = buildsReferenceContext({ manualPinRunIds: new Set(['run-1']) });

  const result = classifiesArchiveRetention(run, referenceContext);

  assert.equal(result.classification, ARCHIVE_RETENTION_CLASSIFICATIONS.PROTECTED_PINNED);
  assert.equal(result.isProtected, true);
});

test('classifiesArchiveRetention marks an archived run without a manifest as unsafe-to-purge', () => {
  const run = buildsArchivedRun({ hasManifest: false, archivedAt: null });

  const result = classifiesArchiveRetention(run, buildsReferenceContext());

  assert.equal(result.classification, ARCHIVE_RETENTION_CLASSIFICATIONS.UNSAFE_TO_PURGE);
});

test('classifiesArchiveRetention keeps a recently archived run within the default 90-day window', () => {
  const run = buildsArchivedRun({ archivedAt: '2026-06-01T00:00:00.000Z' });

  const result = classifiesArchiveRetention(run, buildsReferenceContext());

  assert.equal(result.classification, ARCHIVE_RETENTION_CLASSIFICATIONS.WITHIN_RETENTION_WINDOW);
});

test('classifiesArchiveRetention marks an archived run older than the default window as expired-purge-candidate', () => {
  const run = buildsArchivedRun({ archivedAt: '2025-01-01T00:00:00.000Z' });

  const result = classifiesArchiveRetention(run, buildsReferenceContext());

  assert.equal(result.classification, ARCHIVE_RETENTION_CLASSIFICATIONS.EXPIRED_PURGE_CANDIDATE);
});

test('classifiesArchiveRetention respects a custom archive retention window override', () => {
  const run = buildsArchivedRun({ archivedAt: '2026-07-09T00:00:00.000Z' });
  const referenceContext = buildsReferenceContext({ archiveRetentionWindowMilliseconds: 0 });

  const result = classifiesArchiveRetention(run, referenceContext);

  assert.equal(result.classification, ARCHIVE_RETENTION_CLASSIFICATIONS.EXPIRED_PURGE_CANDIDATE);
});
