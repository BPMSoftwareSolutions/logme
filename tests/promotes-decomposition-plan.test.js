const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { promotesDecompositionPlan } = require('../src/promotes-decomposition-plan/promotes-decomposition-plan');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function buildsDomainFileContent() {
  return [
    "const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');",
    "const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');",
    '',
    'function indexesById(items) {',
    "  if (process.env.LOGME_AUDIT === '1') {",
    '    LogMe(sampleMethod);',
    '  }',
    '',
    '  const byId = new Map();',
    '  for (const item of items) {',
    '    byId.set(item.id, item);',
    '  }',
    '',
    '  return byId;',
    '}',
    '',
    'function checksSupported(items, ids) {',
    "  if (process.env.LOGME_AUDIT === '1') {",
    '    LogMe(sampleMethod);',
    '  }',
    '',
    '  const byId = indexesById(items);',
    '  for (const id of ids) {',
    '    if (!byId.has(id)) {',
    '      return false;',
    '    }',
    '  }',
    '',
    '  return true;',
    '}',
    '',
    'function unrelatedMethod() {',
    "  if (process.env.LOGME_AUDIT === '1') {",
    '    LogMe(sampleMethod);',
    '  }',
    '',
    "  return 'unrelated';",
    '}',
    '',
    'module.exports = { checksSupported, unrelatedMethod };',
    '',
  ].join('\n');
}

test('promotesDecompositionPlan splits a self-contained cluster into a new file and rewrites the domain file', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-promote-decomposition-'));

  try {
    writesFile(path.join(tempDir, 'src/a/a.js'), buildsDomainFileContent());

    const result = promotesDecompositionPlan(
      { rootDir: tempDir },
      'src/a/a.js',
      { entryMethodName: 'checksSupported', newBodyName: 'checks-supported' },
    );

    assert.equal(result.promotable, true);
    assert.deepEqual(result.movedMethodNames.sort(), ['checksSupported', 'indexesById']);
    assert.equal(result.newFileRelativePath, 'src/a/checks-supported/checks-supported.js');
    assert.equal(result.fileEdits.length, 2);

    const newFileEdit = result.fileEdits.find((edit) => edit.kind === 'create-decomposed-file');
    assert.match(newFileEdit.newContent, /function indexesById/u);
    assert.match(newFileEdit.newContent, /function checksSupported/u);
    assert.match(newFileEdit.newContent, /module\.exports = \{ checksSupported \};/u);

    const domainEdit = result.fileEdits.find((edit) => edit.kind === 'update-decomposed-domain-file');
    assert.doesNotMatch(domainEdit.newContent, /function indexesById/u);
    assert.doesNotMatch(domainEdit.newContent, /function checksSupported/u);
    assert.match(domainEdit.newContent, /function unrelatedMethod/u);
    assert.match(domainEdit.newContent, /require\('\.\/checks-supported\/checks-supported'\)/u);
    assert.match(domainEdit.newContent, /module\.exports = \{ checksSupported, unrelatedMethod \};/u);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('promotesDecompositionPlan does not add a duplicate export entry when the entry method is already exported', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-promote-decomposition-'));

  try {
    writesFile(path.join(tempDir, 'src/a/a.js'), buildsDomainFileContent());

    const result = promotesDecompositionPlan(
      { rootDir: tempDir },
      'src/a/a.js',
      { entryMethodName: 'checksSupported', newBodyName: 'checks-supported' },
    );

    const domainEdit = result.fileEdits.find((edit) => edit.kind === 'update-decomposed-domain-file');
    const occurrences = domainEdit.newContent.match(/checksSupported/gu).length;
    assert.equal(occurrences, 2);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('promotesDecompositionPlan refuses a cluster with module-level free identifiers', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-promote-decomposition-'));

  try {
    writesFile(
      path.join(tempDir, 'src/a/a.js'),
      [
        "const SHARED_CONSTANT = 'x';",
        'function usesShared() { return SHARED_CONSTANT; }',
        'module.exports = { usesShared };',
      ].join('\n'),
    );

    const result = promotesDecompositionPlan(
      { rootDir: tempDir },
      'src/a/a.js',
      { entryMethodName: 'usesShared', newBodyName: 'uses-shared' },
    );

    assert.equal(result.promotable, false);
    assert.match(result.reason, /SHARED_CONSTANT/u);
    assert.deepEqual(result.fileEdits, []);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('promotesDecompositionPlan reports not promotable when the entry method does not exist', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-promote-decomposition-'));

  try {
    writesFile(path.join(tempDir, 'src/a/a.js'), buildsDomainFileContent());

    const result = promotesDecompositionPlan(
      { rootDir: tempDir },
      'src/a/a.js',
      { entryMethodName: 'doesNotExist', newBodyName: 'does-not-exist' },
    );

    assert.equal(result.promotable, false);
    assert.match(result.reason, /no call-graph cluster/u);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
