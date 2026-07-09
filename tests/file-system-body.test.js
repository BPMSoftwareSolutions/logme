const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const LAB_ROOT = path.resolve(__dirname, '..');
const CONTRACT_PATH = path.join(
  LAB_ROOT,
  'contracts',
  'file-system-bodies',
  '02_declared',
  'logme2.file-system-body.contract.v1.json',
);

function loadContract() {
  const raw = fs.readFileSync(CONTRACT_PATH, 'utf8');
  return JSON.parse(raw);
}

test('the declared file-system body contract exists and is valid JSON', () => {
  assert.equal(fs.existsSync(CONTRACT_PATH), true);
  assert.doesNotThrow(() => loadContract());
});

test('every directory declared in the contract exists in the lab body', () => {
  const contract = loadContract();
  const missing = contract.requiredPaths.directories.filter((relativeDir) => {
    return !fs.existsSync(path.join(LAB_ROOT, relativeDir));
  });

  assert.deepEqual(missing, [], `Missing declared directories:\n  ${missing.join('\n  ')}`);
});

test('every file declared in the contract exists in the lab body', () => {
  const contract = loadContract();
  const missing = contract.requiredPaths.files.filter((relativeFile) => {
    return !fs.existsSync(path.join(LAB_ROOT, relativeFile));
  });

  assert.deepEqual(missing, [], `Missing declared files:\n  ${missing.join('\n  ')}`);
});

test('every declared source-body file under src/ and packages/ exports something (is not an empty stub)', () => {
  const contract = loadContract();
  const runtimeFiles = contract.requiredPaths.files.filter((relativeFile) => {
    return relativeFile.startsWith('src/') || relativeFile.startsWith('packages/');
  });

  const emptyStubs = runtimeFiles.filter((relativeFile) => {
    const fullPath = path.join(LAB_ROOT, relativeFile);
    if (!fs.existsSync(fullPath)) {
      return false;
    }
    const contents = fs.readFileSync(fullPath, 'utf8').trim();
    return contents.length === 0 || !contents.includes('module.exports');
  });

  assert.deepEqual(
    emptyStubs,
    [],
    `Files exist but are not implemented yet (no module.exports found):\n  ${emptyStubs.join('\n  ')}`,
  );
});
