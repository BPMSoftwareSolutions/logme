const test = require('node:test');
const assert = require('node:assert/strict');

const { guardsArchivePurgeReferences, ARCHIVE_PURGE_PROTECTED_REFERENCE_FINDING } = require('../src/guards-archive-purge-references/guards-archive-purge-references');

test('guardsArchivePurgeReferences blocks a purge action when the archived run has a protecting reference', () => {
  const plan = { entries: [{ runId: 'run-1', action: 'purge', referencesFound: ['manual pin'] }] };

  const result = guardsArchivePurgeReferences(plan);

  assert.equal(result.verdict, 'BLOCKED');
  assert.equal(result.blockedEntries[0].findingCode, ARCHIVE_PURGE_PROTECTED_REFERENCE_FINDING);
  assert.match(result.blockedEntries[0].recommendedFix, /manual pin/);
});

test('guardsArchivePurgeReferences allows a purge action when there is no protecting reference', () => {
  const plan = { entries: [{ runId: 'run-1', action: 'purge', referencesFound: [] }] };

  const result = guardsArchivePurgeReferences(plan);

  assert.equal(result.verdict, 'PASS');
  assert.deepEqual(result.allowedEntries, ['run-1']);
});

test('guardsArchivePurgeReferences does not block a keep action even when referenced', () => {
  const plan = { entries: [{ runId: 'run-1', action: 'keep', referencesFound: ['manual pin'] }] };

  const result = guardsArchivePurgeReferences(plan);

  assert.equal(result.verdict, 'PASS');
});
