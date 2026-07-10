const test = require('node:test');
const assert = require('node:assert/strict');

const { classifiesEvidenceRetention, RETENTION_CLASSIFICATIONS } = require('../src/classifies-evidence-retention/classifies-evidence-retention');

function buildsReferenceContext(overrides = {}) {
  return {
    latestEvidenceReportRunIds: new Set(),
    featureStatusContractRunIds: new Set(),
    qaEvidenceBundleRunIds: new Set(),
    promotionDecisionRunIds: new Set(),
    piEvidenceDigestRunIds: new Set(),
    reportTruthReceiptRunIds: new Set(),
    manualPinRunIds: new Set(),
    now: new Date('2026-07-10T00:00:00.000Z'),
    ...overrides,
  };
}

function buildsRun(overrides = {}) {
  return {
    runId: 'run-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    lastModifiedAt: '2026-01-01T00:00:00.000Z',
    artifactCount: 3,
    reportVerdict: 'STERILE DOMAIN BODY',
    reportTruthStatus: 'tests pass, report truth gate passes',
    ...overrides,
  };
}

test('classifiesEvidenceRetention marks a run referenced by a manual pin as protected-pinned', () => {
  const run = buildsRun();
  const referenceContext = buildsReferenceContext({ manualPinRunIds: new Set(['run-1']) });

  const result = classifiesEvidenceRetention(run, referenceContext);

  assert.equal(result.classification, RETENTION_CLASSIFICATIONS.PROTECTED_PINNED);
  assert.deepEqual(result.references, ['manual pin']);
  assert.equal(result.isProtected, true);
});

test('classifiesEvidenceRetention marks a run referenced by the latest evidence report as protected-current', () => {
  const run = buildsRun();
  const referenceContext = buildsReferenceContext({ latestEvidenceReportRunIds: new Set(['run-1']) });

  const result = classifiesEvidenceRetention(run, referenceContext);

  assert.equal(result.classification, RETENTION_CLASSIFICATIONS.PROTECTED_CURRENT);
});

test('classifiesEvidenceRetention marks a recently modified unreferenced run as keep-recent', () => {
  const run = buildsRun({ lastModifiedAt: '2026-07-05T00:00:00.000Z' });
  const referenceContext = buildsReferenceContext();

  const result = classifiesEvidenceRetention(run, referenceContext);

  assert.equal(result.classification, RETENTION_CLASSIFICATIONS.KEEP_RECENT);
});

test('classifiesEvidenceRetention marks an old unreferenced run as archive-candidate, never solely because it looks old or verbose without a reason', () => {
  const run = buildsRun({ lastModifiedAt: '2025-01-01T00:00:00.000Z' });
  const referenceContext = buildsReferenceContext();

  const result = classifiesEvidenceRetention(run, referenceContext);

  assert.equal(result.classification, RETENTION_CLASSIFICATIONS.ARCHIVE_CANDIDATE);
  assert.match(result.reason, /unreferenced/);
});

test('classifiesEvidenceRetention marks an old unreferenced empty run as delete-candidate', () => {
  const run = buildsRun({ lastModifiedAt: '2025-01-01T00:00:00.000Z', artifactCount: 0 });
  const referenceContext = buildsReferenceContext();

  const result = classifiesEvidenceRetention(run, referenceContext);

  assert.equal(result.classification, RETENTION_CLASSIFICATIONS.DELETE_CANDIDATE);
});

test('classifiesEvidenceRetention marks a run with no report verdict or report truth status as unsafe-to-delete', () => {
  const run = buildsRun({ reportVerdict: null, reportTruthStatus: null });
  const referenceContext = buildsReferenceContext();

  const result = classifiesEvidenceRetention(run, referenceContext);

  assert.equal(result.classification, RETENTION_CLASSIFICATIONS.UNSAFE_TO_DELETE);
});

test('classifiesEvidenceRetention respects a custom keep-recent window override', () => {
  const run = buildsRun({ lastModifiedAt: '2026-07-09T00:00:00.000Z' });
  const referenceContext = buildsReferenceContext({ keepRecentWindowMilliseconds: 0 });

  const result = classifiesEvidenceRetention(run, referenceContext);

  assert.equal(result.classification, RETENTION_CLASSIFICATIONS.ARCHIVE_CANDIDATE);
});

test('classifiesEvidenceRetention prioritizes pinned over other protecting references', () => {
  const run = buildsRun();
  const referenceContext = buildsReferenceContext({
    manualPinRunIds: new Set(['run-1']),
    latestEvidenceReportRunIds: new Set(['run-1']),
  });

  const result = classifiesEvidenceRetention(run, referenceContext);

  assert.equal(result.classification, RETENTION_CLASSIFICATIONS.PROTECTED_PINNED);
});
