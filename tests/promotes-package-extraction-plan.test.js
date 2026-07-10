const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { promotesPackageExtractionPlan } = require('../src/promotes-package-extraction-plan/promotes-package-extraction-plan');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function buildsCellFunctionSource() {
  return [
    "function formatsMarkdownCell(value) {",
    "  if (process.env.LOGME_AUDIT === '1') {",
    "    LogMe(sampleMethod);",
    "  }",
    "",
    "  return String(value).replace(/\\|/gu, '\\\\|');",
    "}",
  ].join('\n');
}

function seedsDomainFile(tempDir, relativePath) {
  writesFile(
    path.join(tempDir, relativePath),
    [
      "const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');",
      "const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');",
      '',
      'function rendersRow(value) {',
      '  return formatsMarkdownCell(value);',
      '}',
      '',
      buildsCellFunctionSource(),
      '',
      'module.exports = { rendersRow };',
      '',
    ].join('\n'),
  );
}

test('promotesPackageExtractionPlan promotes formatsMarkdownCell across two files with identical implementations', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-promote-extraction-'));

  try {
    seedsDomainFile(tempDir, 'src/a/a.js');
    seedsDomainFile(tempDir, 'src/b/b.js');

    const packageExtractionPlan = {
      sections: [
        { filePath: 'src/a/a.js', classification: 'existing package', targetPackage: 'logme-report-primitives', extractedMethodNames: ['formatsMarkdownCell'] },
        { filePath: 'src/b/b.js', classification: 'existing package', targetPackage: 'logme-report-primitives', extractedMethodNames: ['formatsMarkdownCell'] },
      ],
    };

    const result = promotesPackageExtractionPlan({ rootDir: tempDir }, packageExtractionPlan, { methodName: 'formatsMarkdownCell' });

    assert.equal(result.promotable, true);
    assert.equal(result.targetPackage, 'logme-report-primitives');
    assert.equal(result.packageFileRelativePath, 'packages/logme-report-primitives/src/formats-markdown-cell.js');
    assert.equal(result.fileEdits.length, 3);

    const packageEdit = result.fileEdits.find((edit) => edit.kind === 'create-package-file');
    assert.match(packageEdit.newContent, /function formatsMarkdownCell\(value\)/u);
    assert.match(packageEdit.newContent, /module\.exports = \{ formatsMarkdownCell \};/u);

    const domainEdits = result.fileEdits.filter((edit) => edit.kind === 'update-domain-file');
    assert.equal(domainEdits.length, 2);
    for (const domainEdit of domainEdits) {
      assert.doesNotMatch(domainEdit.newContent, /function formatsMarkdownCell/u);
      assert.match(domainEdit.newContent, /require\('\.\.\/\.\.\/packages\/logme-report-primitives\/src\/formats-markdown-cell'\)/u);
      assert.match(domainEdit.newContent, /formatsMarkdownCell\(value\)/u);
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('promotesPackageExtractionPlan refuses promotion when implementations differ across files', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-promote-extraction-'));

  try {
    seedsDomainFile(tempDir, 'src/a/a.js');
    writesFile(
      path.join(tempDir, 'src/b/b.js'),
      [
        "const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');",
        "const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');",
        '',
        "function formatsMarkdownCell(value) {",
        "  if (process.env.LOGME_AUDIT === '1') {",
        "    LogMe(sampleMethod);",
        "  }",
        "",
        "  return String(value).toUpperCase();",
        "}",
        '',
        'module.exports = { formatsMarkdownCell };',
        '',
      ].join('\n'),
    );

    const packageExtractionPlan = {
      sections: [
        { filePath: 'src/a/a.js', classification: 'existing package', targetPackage: 'logme-report-primitives', extractedMethodNames: ['formatsMarkdownCell'] },
        { filePath: 'src/b/b.js', classification: 'existing package', targetPackage: 'logme-report-primitives', extractedMethodNames: ['formatsMarkdownCell'] },
      ],
    };

    const result = promotesPackageExtractionPlan({ rootDir: tempDir }, packageExtractionPlan, { methodName: 'formatsMarkdownCell' });

    assert.equal(result.promotable, false);
    assert.match(result.reason, /different implementations/u);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('promotesPackageExtractionPlan refuses promotion when the method has a free dependency in one file', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-promote-extraction-'));

  try {
    writesFile(
      path.join(tempDir, 'src/a/a.js'),
      [
        "const CONSTANT = 'x';",
        '',
        'function buildsThing() {',
        '  return CONSTANT;',
        '}',
        '',
        'module.exports = { buildsThing };',
      ].join('\n'),
    );

    const packageExtractionPlan = {
      sections: [
        { filePath: 'src/a/a.js', classification: 'existing package', targetPackage: 'logme-report-primitives', extractedMethodNames: ['buildsThing'] },
      ],
    };

    const result = promotesPackageExtractionPlan({ rootDir: tempDir }, packageExtractionPlan, { methodName: 'buildsThing' });

    assert.equal(result.promotable, false);
    assert.match(result.reason, /CONSTANT/u);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('promotesPackageExtractionPlan reports not promotable when no section names the method', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-promote-extraction-'));

  try {
    const packageExtractionPlan = {
      sections: [
        { filePath: 'src/a/a.js', classification: 'existing package', targetPackage: 'logme-report-primitives', extractedMethodNames: ['somethingElse'] },
      ],
    };

    const result = promotesPackageExtractionPlan({ rootDir: tempDir }, packageExtractionPlan, { methodName: 'formatsMarkdownCell' });

    assert.equal(result.promotable, false);
    assert.deepEqual(result.fileEdits, []);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
