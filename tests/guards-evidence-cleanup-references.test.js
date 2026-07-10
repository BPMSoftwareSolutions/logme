const test = require('node:test');
const assert = require('node:assert/strict');

const { guardsEvidenceCleanupReferences, PROTECTED_REFERENCE_FINDING } = require('../src/guards-evidence-cleanup-references/guards-evidence-cleanup-references');

test('guardsEvidenceCleanupReferences blocks a delete action when the run has a protecting reference', () => {
  const plan = {
    entries: [
      { runId: 'run-1', action: 'delete', referencesFound: ['QA evidence bundle'] },
    ],
  };

  const result = guardsEvidenceCleanupReferences(plan);

  assert.equal(result.verdict, 'BLOCKED');
  assert.equal(result.blockedEntries.length, 1);
  assert.equal(result.blockedEntries[0].findingCode, PROTECTED_REFERENCE_FINDING);
  assert.match(result.blockedEntries[0].recommendedFix, /QA evidence bundle/);
});

test('guardsEvidenceCleanupReferences allows a delete action when there is no protecting reference', () => {
  const plan = {
    entries: [
      { runId: 'run-1', action: 'delete', referencesFound: [] },
    ],
  };

  const result = guardsEvidenceCleanupReferences(plan);

  assert.equal(result.verdict, 'PASS');
  assert.deepEqual(result.allowedEntries, ['run-1']);
});

test('guardsEvidenceCleanupReferences does not block keep or pin actions even when referenced', () => {
  const plan = {
    entries: [
      { runId: 'run-1', action: 'keep', referencesFound: ['latest evidence report'] },
      { runId: 'run-2', action: 'pin', referencesFound: ['manual pin'] },
    ],
  };

  const result = guardsEvidenceCleanupReferences(plan);

  assert.equal(result.verdict, 'PASS');
  assert.deepEqual(result.allowedEntries.sort(), ['run-1', 'run-2']);
});
