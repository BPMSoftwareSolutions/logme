const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { runsDecompositionPromotion } = require('../src/runs-decomposition-promotion/runs-decomposition-promotion');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function seedsDomainFile(tempDir) {
  writesFile(
    path.join(tempDir, 'src/a/a.js'),
    [
      "const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');",
      "const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');",
      '',
      'function readsThing() {',
      "  if (process.env.LOGME_AUDIT === '1') {",
      '    LogMe(sampleMethod);',
      '  }',
      '',
      "  return 'thing';",
      '}',
      '',
      'module.exports = { readsThing };',
      '',
    ].join('\n'),
  );
}

test('runsDecompositionPromotion performs a dry run by default and does not write any files', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-run-promote-decomposition-'));

  try {
    seedsDomainFile(tempDir);

    const result = runsDecompositionPromotion({ rootDir: tempDir }, 'src/a/a.js', 'readsThing', 'reads-thing');

    assert.equal(result.written, false);
    assert.equal(result.promotable, true);
    assert.ok(!fs.existsSync(path.join(tempDir, 'src/a/reads-thing/reads-thing.js')));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('runsDecompositionPromotion writes the new file and the rewritten domain file when write is true', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-run-promote-decomposition-'));

  try {
    seedsDomainFile(tempDir);

    const result = runsDecompositionPromotion({ rootDir: tempDir }, 'src/a/a.js', 'readsThing', 'reads-thing', { write: true });

    assert.equal(result.written, true);
    const newFilePath = path.join(tempDir, 'src/a/reads-thing/reads-thing.js');
    assert.ok(fs.existsSync(newFilePath));
    assert.match(fs.readFileSync(newFilePath, 'utf8'), /module\.exports = \{ readsThing \};/u);

    const domainFileContent = fs.readFileSync(path.join(tempDir, 'src/a/a.js'), 'utf8');
    assert.doesNotMatch(domainFileContent, /function readsThing/u);
    assert.match(domainFileContent, /require\('\.\/reads-thing\/reads-thing'\)/u);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
