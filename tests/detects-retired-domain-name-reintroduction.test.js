const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { detectsRetiredDomainNameReintroduction } = require('../src/detects-retired-domain-name-reintroduction/detects-retired-domain-name-reintroduction');

function buildsDomainContract() {
  return {
    findings: {
      retiredDomainNameReintroduced: {
        code: 'retired-domain-name-reintroduced',
        reason: 'the retired experimental domain name logme2 was reintroduced; the correct domain name is logme',
      },
    },
  };
}

test('detectsRetiredDomainNameReintroduction returns empty array when logme2 is absent', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'retired-name-lab-'));

  try {
    fs.writeFileSync(path.join(tempDir, 'index.js'), "const name = 'logme';\n");

    const config = { rootDir: tempDir, domainContract: buildsDomainContract() };
    const findings = detectsRetiredDomainNameReintroduction(config);

    assert.deepEqual(findings, []);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('detectsRetiredDomainNameReintroduction flags a file or directory named with the retired domain name', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'retired-name-lab-'));

  try {
    const retiredDir = path.join(tempDir, 'contracts', 'domains', 'logme2');
    fs.mkdirSync(retiredDir, { recursive: true });
    fs.writeFileSync(path.join(retiredDir, 'schema.json'), '{}');

    const config = { rootDir: tempDir, domainContract: buildsDomainContract() };
    const findings = detectsRetiredDomainNameReintroduction(config);

    const codes = findings.map((finding) => finding.code);
    assert.ok(codes.includes('retired-domain-name-reintroduced'));
    assert.ok(findings.some((finding) => finding.filePath.includes('logme2')));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('detectsRetiredDomainNameReintroduction flags a file whose contents reference the retired domain name', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'retired-name-lab-'));

  try {
    fs.writeFileSync(path.join(tempDir, 'notes.md'), 'See contracts/domains/logme2/schema.json for details.\n');

    const config = { rootDir: tempDir, domainContract: buildsDomainContract() };
    const findings = detectsRetiredDomainNameReintroduction(config);

    assert.equal(findings.length, 1);
    assert.equal(findings[0].code, 'retired-domain-name-reintroduced');
    assert.equal(findings[0].filePath, 'notes.md');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('detectsRetiredDomainNameReintroduction does not flag the narrative documents that describe the retired name historically', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'retired-name-lab-'));

  try {
    const featuresDir = path.join(tempDir, 'docs', 'features');
    fs.mkdirSync(featuresDir, { recursive: true });
    fs.writeFileSync(
      path.join(featuresDir, 'domain-naming-convention-correction.feature.md'),
      'The retired name was logme2.\n',
    );
    fs.writeFileSync(
      path.join(tempDir, 'docs', 'report-truth-pi-planning.md'),
      'The retired name was logme2.\n',
    );

    const config = { rootDir: tempDir, domainContract: buildsDomainContract() };
    const findings = detectsRetiredDomainNameReintroduction(config);

    assert.deepEqual(findings, []);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('detectsRetiredDomainNameReintroduction excludes .git, node_modules, and evidence directories', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'retired-name-lab-'));

  try {
    for (const excludedDir of ['.git', 'node_modules', 'evidence']) {
      const dir = path.join(tempDir, excludedDir, 'logme2');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'file.js'), 'logme2');
    }

    const config = { rootDir: tempDir, domainContract: buildsDomainContract() };
    const findings = detectsRetiredDomainNameReintroduction(config);

    assert.deepEqual(findings, []);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('detectsRetiredDomainNameReintroduction reports a single finding per path even if both name and contents match', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'retired-name-lab-'));

  try {
    fs.writeFileSync(path.join(tempDir, 'logme2-notes.md'), 'about logme2\n');

    const config = { rootDir: tempDir, domainContract: buildsDomainContract() };
    const findings = detectsRetiredDomainNameReintroduction(config);

    assert.equal(findings.length, 1);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
