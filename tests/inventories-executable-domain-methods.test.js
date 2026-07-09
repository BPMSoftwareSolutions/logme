const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { inventoriesExecutableDomainMethods } = require('../src/inventories-executable-domain-methods/inventories-executable-domain-methods');

test('inventoriesExecutableDomainMethods inventories methods with their properties', () => {
  const tempDir = fs.mkdtempSync(path.join(__dirname, '../temp-'));
  try {
    const testFile = path.join(tempDir, 'sample.js');
    fs.writeFileSync(testFile, `
function namedFunction() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }
  return 42;
}

function functionWithoutLogMe() {
  return 99;
}

const arrowWithoutName = [1, 2, 3].map(x => x * 2);

module.exports = { namedFunction, functionWithoutLogMe };
`);

    const results = inventoriesExecutableDomainMethods(testFile, null);

    assert.equal(results.length, 3, 'should find 3 methods');

    const named = results.find(m => m.name === 'namedFunction');
    assert.ok(named, 'should find namedFunction');
    assert.equal(named.isAnonymous, false);
    assert.equal(named.hasLogMeCall, true);
    assert.equal(named.isUnimplementedStub, false);
    assert.equal(named.kind, 'function');

    const withoutLogMe = results.find(m => m.name === 'functionWithoutLogMe');
    assert.ok(withoutLogMe, 'should find functionWithoutLogMe');
    assert.equal(withoutLogMe.hasLogMeCall, false);

    const anonymous = results.find(m => m.isAnonymous === true);
    assert.ok(anonymous, 'should find anonymous function');
    assert.equal(anonymous.kind, 'arrow-function');
  } finally {
    fs.rmSync(tempDir, { recursive: true });
  }
});

test('inventoriesExecutableDomainMethods detects unimplemented stub', () => {
  const tempDir = fs.mkdtempSync(path.join(__dirname, '../temp-'));
  try {
    const testFile = path.join(tempDir, 'stub.js');
    const stubMarker = 'throw new Error';
    fs.writeFileSync(testFile, `throw new Error('not implemented yet')
function helper() {
  return 1;
}`);

    const results = inventoriesExecutableDomainMethods(testFile, stubMarker);

    assert.equal(results.length, 1);
    assert.equal(results[0].isUnimplementedStub, true);
  } finally {
    fs.rmSync(tempDir, { recursive: true });
  }
});

test('inventoriesExecutableDomainMethods returns empty array when no methods found', () => {
  const tempDir = fs.mkdtempSync(path.join(__dirname, '../temp-'));
  try {
    const testFile = path.join(tempDir, 'empty.js');
    fs.writeFileSync(testFile, 'const x = 42;');

    const results = inventoriesExecutableDomainMethods(testFile, null);

    assert.deepEqual(results, []);
  } finally {
    fs.rmSync(tempDir, { recursive: true });
  }
});
