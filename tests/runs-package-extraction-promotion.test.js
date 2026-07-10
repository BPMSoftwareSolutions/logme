const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { runsPackageExtractionPromotion } = require('../src/runs-package-extraction-promotion/runs-package-extraction-promotion');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function seedsDomainFile(tempDir, relativePath) {
  writesFile(
    path.join(tempDir, relativePath),
    [
      "const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');",
      "const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');",
      '',
      "function formatsMarkdownCell(value) {",
      "  if (process.env.LOGME_AUDIT === '1') {",
      "    LogMe(sampleMethod);",
      "  }",
      "",
      "  return String(value);",
      "}",
      '',
      'module.exports = { formatsMarkdownCell };',
      '',
    ].join('\n'),
  );
}

test('runsPackageExtractionPromotion performs a dry run by default and does not write any files', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-run-promote-extraction-'));

  try {
    const runId = 'run-extraction-promote-1';
    seedsDomainFile(tempDir, 'src/a/a.js');
    writesFile(
      path.join(tempDir, 'quality/domain-remediation', runId, 'package-extraction-plan.v1.json'),
      JSON.stringify({
        sections: [
          { filePath: 'src/a/a.js', classification: 'existing package', targetPackage: 'logme-report-primitives', extractedMethodNames: ['formatsMarkdownCell'] },
        ],
      }),
    );

    const result = runsPackageExtractionPromotion({ rootDir: tempDir }, runId, 'formatsMarkdownCell');

    assert.equal(result.written, false);
    assert.equal(result.promotable, true);
    assert.ok(!fs.existsSync(path.join(tempDir, 'packages/logme-report-primitives/src/formats-markdown-cell.js')));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('runsPackageExtractionPromotion writes the new package file and updates the domain file when write is true', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-run-promote-extraction-'));

  try {
    const runId = 'run-extraction-promote-2';
    seedsDomainFile(tempDir, 'src/a/a.js');
    writesFile(
      path.join(tempDir, 'quality/domain-remediation', runId, 'package-extraction-plan.v1.json'),
      JSON.stringify({
        sections: [
          { filePath: 'src/a/a.js', classification: 'existing package', targetPackage: 'logme-report-primitives', extractedMethodNames: ['formatsMarkdownCell'] },
        ],
      }),
    );

    const result = runsPackageExtractionPromotion({ rootDir: tempDir }, runId, 'formatsMarkdownCell', { write: true });

    assert.equal(result.written, true);
    const packageFilePath = path.join(tempDir, 'packages/logme-report-primitives/src/formats-markdown-cell.js');
    assert.ok(fs.existsSync(packageFilePath));
    assert.match(fs.readFileSync(packageFilePath, 'utf8'), /module\.exports = \{ formatsMarkdownCell \};/u);

    const domainFileContent = fs.readFileSync(path.join(tempDir, 'src/a/a.js'), 'utf8');
    assert.doesNotMatch(domainFileContent, /function formatsMarkdownCell/u);
    assert.match(domainFileContent, /require\('\.\.\/\.\.\/packages\/logme-report-primitives\/src\/formats-markdown-cell'\)/u);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
