const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const RETIRED_DOMAIN_NAME = 'logme2';
const EXCLUDED_DIRECTORIES = ['.git', 'node_modules', 'evidence'];
const EXEMPT_REFERENCE_PATHS = [
  'docs/features/domain-naming-convention-correction.feature.md',
  'docs/report-truth-pi-planning.md',
  'report.md',
  'logme.config.json',
  'src/detects-retired-domain-name-reintroduction/detects-retired-domain-name-reintroduction.js',
  'tests/detects-retired-domain-name-reintroduction.test.js',
];
const SCANNED_CONTENT_EXTENSIONS = ['.js', '.ts', '.json', '.md', '.txt'];
const MAX_SCANNED_FILE_BYTES = 1_000_000;

function excludesDirectory(entryName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return EXCLUDED_DIRECTORIES.includes(entryName);
}

function isExemptReference(relativePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const normalizedPath = relativePath.split(path.sep).join('/');
  return EXEMPT_REFERENCE_PATHS.includes(normalizedPath);
}

function walksRepositoryEntries(rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!fs.existsSync(rootDir)) {
    return [];
  }

  const entries = [];

  function descendsIntoDirectory(currentDir) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = path.join(currentDir, entry.name);
      entries.push(fullPath);

      if (entry.isDirectory()) {
        if (excludesDirectory(entry.name)) {
          continue;
        }

        descendsIntoDirectory(fullPath);
      }
    }
  }

  descendsIntoDirectory(rootDir);
  return entries;
}

function detectsRetiredNameInPath(entryPath, rootDir, domainContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const relativePath = path.relative(rootDir, entryPath);

  if (!relativePath.toLowerCase().includes(RETIRED_DOMAIN_NAME)) {
    return null;
  }

  return {
    code: domainContract.findings.retiredDomainNameReintroduced.code,
    filePath: relativePath.split(path.sep).join('/'),
    methodName: '',
    reason: domainContract.findings.retiredDomainNameReintroduced.reason,
  };
}

function isScannableFile(entryPath, fileSizeBytes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const extension = path.extname(entryPath).toLowerCase();
  return SCANNED_CONTENT_EXTENSIONS.includes(extension) && fileSizeBytes <= MAX_SCANNED_FILE_BYTES;
}

function detectsRetiredNameInContents(entryPath, rootDir, domainContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const relativePath = path.relative(rootDir, entryPath).split(path.sep).join('/');

  if (isExemptReference(relativePath)) {
    return null;
  }

  const contents = fs.readFileSync(entryPath, 'utf8');

  if (!contents.toLowerCase().includes(RETIRED_DOMAIN_NAME)) {
    return null;
  }

  return {
    code: domainContract.findings.retiredDomainNameReintroduced.code,
    filePath: relativePath,
    methodName: '',
    reason: domainContract.findings.retiredDomainNameReintroduced.reason,
  };
}

function detectsRetiredDomainNameReintroduction(config) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = config.rootDir;
  const entries = walksRepositoryEntries(rootDir);
  const findings = [];
  const flaggedPaths = new Set();

  function addsFinding(finding) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    if (!finding || flaggedPaths.has(finding.filePath)) {
      return;
    }

    flaggedPaths.add(finding.filePath);
    findings.push(finding);
  }

  for (const entryPath of entries) {
    addsFinding(detectsRetiredNameInPath(entryPath, rootDir, config.domainContract));

    const stats = fs.statSync(entryPath);
    if (stats.isFile() && isScannableFile(entryPath, stats.size)) {
      addsFinding(detectsRetiredNameInContents(entryPath, rootDir, config.domainContract));
    }
  }

  return findings;
}

module.exports = { detectsRetiredDomainNameReintroduction };
