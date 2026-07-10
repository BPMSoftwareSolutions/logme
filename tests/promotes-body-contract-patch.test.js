const test = require('node:test');
const assert = require('node:assert/strict');

const { promotesBodyContractPatch } = require('../src/promotes-body-contract-patch/promotes-body-contract-patch');

function buildsDeclaredContract() {
  return {
    schemaVersion: 'file-system-body.contract.v1',
    requiredPaths: {
      files: ['README.md', 'src/existing-body/existing-body.js'],
      directories: [],
    },
    owns: {
      runtime: ['src/existing-body/'],
    },
  };
}

test('promotesBodyContractPatch adds a resolved entry to requiredPaths.files, owns.runtime, and declaredBodies', () => {
  const declaredContract = buildsDeclaredContract();
  const bodyContractPatch = {
    entries: [
      {
        bodyId: 'logme.example',
        path: 'src/example/example.js',
        bodyKind: 'product-domain body',
        actionVerb: 'build',
        responsibility: 'builds the example thing',
        featureIds: [],
        scenarioIds: [],
        allowedDependencies: [],
        verification: 'declared by contract steward worker',
        decompositionStatus: 'single-responsibility',
        findingCodes: [],
      },
    ],
  };

  const result = promotesBodyContractPatch(declaredContract, bodyContractPatch);

  assert.deepEqual(result.promotedPaths, ['src/example/example.js']);
  assert.ok(result.updatedContract.requiredPaths.files.includes('src/example/example.js'));
  assert.ok(result.updatedContract.owns.runtime.includes('src/example/example.js'));
  assert.equal(result.updatedContract.declaredBodies.length, 1);
  assert.equal(result.updatedContract.declaredBodies[0].bodyId, 'logme.example');
  assert.equal(result.updatedContract.declaredBodies[0].responsibility, 'builds the example thing');
});

test('promotesBodyContractPatch does not mutate the original declared contract', () => {
  const declaredContract = buildsDeclaredContract();
  const frozen = JSON.stringify(declaredContract);
  const bodyContractPatch = {
    entries: [
      { bodyId: 'logme.example', path: 'src/example/example.js', bodyKind: 'product-domain body', actionVerb: 'build', responsibility: 'builds it', verification: 'declared', decompositionStatus: 'single-responsibility', findingCodes: [] },
    ],
  };

  promotesBodyContractPatch(declaredContract, bodyContractPatch);

  assert.equal(JSON.stringify(declaredContract), frozen);
});

test('promotesBodyContractPatch skips an entry with the missing-responsibility finding code', () => {
  const declaredContract = buildsDeclaredContract();
  const bodyContractPatch = {
    entries: [
      { bodyId: null, path: 'src/unresolved/unresolved.js', bodyKind: null, findingCodes: ['body-contract-missing-responsibility'] },
    ],
  };

  const result = promotesBodyContractPatch(declaredContract, bodyContractPatch);

  assert.deepEqual(result.promotedPaths, []);
  assert.equal(result.skippedEntries.length, 1);
  assert.equal(result.skippedEntries[0].path, 'src/unresolved/unresolved.js');
  assert.match(result.skippedEntries[0].reason, /unresolved/u);
  assert.ok(!result.updatedContract.requiredPaths.files.includes('src/unresolved/unresolved.js'));
});

test('promotesBodyContractPatch skips a path that is already declared and does not duplicate it', () => {
  const declaredContract = buildsDeclaredContract();
  const bodyContractPatch = {
    entries: [
      { bodyId: 'logme.existing', path: 'src/existing-body/existing-body.js', bodyKind: 'product-domain body', actionVerb: 'build', responsibility: 'already declared', verification: 'declared', decompositionStatus: 'single-responsibility', findingCodes: [] },
    ],
  };

  const result = promotesBodyContractPatch(declaredContract, bodyContractPatch);

  const occurrences = result.updatedContract.requiredPaths.files.filter((filePath) => filePath === 'src/existing-body/existing-body.js');
  assert.equal(occurrences.length, 1);
  assert.equal(result.skippedEntries.length, 1);
  assert.match(result.skippedEntries[0].reason, /already declared/u);
});

test('promotesBodyContractPatch keeps requiredPaths.files and owns.runtime sorted', () => {
  const declaredContract = buildsDeclaredContract();
  const bodyContractPatch = {
    entries: [
      { bodyId: 'logme.aaa', path: 'src/aaa-body/aaa-body.js', bodyKind: 'product-domain body', actionVerb: 'build', responsibility: 'aaa', verification: 'declared', decompositionStatus: 'single-responsibility', findingCodes: [] },
    ],
  };

  const result = promotesBodyContractPatch(declaredContract, bodyContractPatch);

  const sortedFiles = [...result.updatedContract.requiredPaths.files].sort();
  assert.deepEqual(result.updatedContract.requiredPaths.files, sortedFiles);
});
