const test = require('node:test');
const assert = require('node:assert/strict');

const { blocksPathOnlyBodyContracts, MISSING_RESPONSIBILITY_FINDING } = require('../src/blocks-path-only-body-contracts/blocks-path-only-body-contracts');

test('blocksPathOnlyBodyContracts blocks an entry that only lists a path with no responsibility', () => {
  const bodyContractPatch = {
    entries: [
      {
        path: 'src/a/a.js',
        bodyId: null,
        bodyKind: null,
        responsibility: null,
        verification: null,
        decompositionStatus: null,
        findingCodes: [MISSING_RESPONSIBILITY_FINDING],
        reasoningNote: 'worker returned an empty responsibility',
      },
    ],
  };

  const result = blocksPathOnlyBodyContracts(bodyContractPatch);

  assert.equal(result.verdict, 'BLOCKED');
  assert.equal(result.blockedEntries.length, 1);
  assert.equal(result.blockedEntries[0].path, 'src/a/a.js');
  assert.equal(result.blockedEntries[0].findingCode, MISSING_RESPONSIBILITY_FINDING);
  assert.match(result.blockedEntries[0].recommendedFix, /ownership, intent, scenario tie-out, and verification/u);
  assert.deepEqual(result.promotableEntries, []);
});

test('blocksPathOnlyBodyContracts passes when every entry declares ownership and intent', () => {
  const bodyContractPatch = {
    entries: [
      {
        path: 'src/a/a.js',
        bodyId: 'logme.a',
        bodyKind: 'product-domain body',
        responsibility: 'builds the a thing',
        verification: 'declared by contract steward worker',
        decompositionStatus: 'single-responsibility',
        findingCodes: [],
      },
    ],
  };

  const result = blocksPathOnlyBodyContracts(bodyContractPatch);

  assert.equal(result.verdict, 'PASS');
  assert.deepEqual(result.blockedEntries, []);
  assert.deepEqual(result.promotableEntries, ['src/a/a.js']);
});
