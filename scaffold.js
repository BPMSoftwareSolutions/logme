const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('./packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('./packages/logme-testimony-core/src/sample-method');

const LAB_ROOT = __dirname;
const CONTRACT_PATH = path.join(
  LAB_ROOT,
  'contracts',
  'file-system-bodies',
  '02_declared',
  'logme.file-system-body.contract.v1.json',
);

function readContract() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const raw = fs.readFileSync(CONTRACT_PATH, 'utf8');
  return JSON.parse(raw);
}

function stubContentFor(relativeFile) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (relativeFile.endsWith('.json')) {
    return '{}\n';
  }

  if (relativeFile.endsWith('.test.js')) {
    return [
      "const test = require('node:test');",
      '',
      "test.todo('" + path.basename(relativeFile, '.test.js') + " is not implemented yet');",
      '',
    ].join('\n');
  }

  if (relativeFile === 'README.md') {
    return '# LogMe\n\nScaffolded lab body. See contracts/file-system-bodies/02_declared/ for the declared shape.\n';
  }

  if (relativeFile.endsWith('.js')) {
    return jsStubContentFor(relativeFile);
  }

  return '';
}

const TESTIMONY_CORE_FILES = new Set([
  'packages/logme-testimony-core/src/LogMe.js',
  'packages/logme-testimony-core/src/sample-method.js',
]);

function capitalizesKebabSegment(_, char) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return char.toUpperCase();
}

function jsStubContentFor(relativeFile) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const exportName = path
    .basename(relativeFile, '.js')
    .replace(/-([a-z0-9])/g, capitalizesKebabSegment);

  const body = [
    "// STUB: not yet implemented. Scaffolded from the declared file-system body contract.",
  ];

  if (TESTIMONY_CORE_FILES.has(relativeFile)) {
    body.push(
      `function ${exportName}() {`,
      `  throw new Error('${exportName} is not implemented yet');`,
      '}',
      '',
      `module.exports = { ${exportName} };`,
      '',
    );
    return body.join('\n');
  }

  const fileDir = path.dirname(path.join(LAB_ROOT, relativeFile));
  const logMeDir = path.join(LAB_ROOT, 'packages', 'logme-testimony-core', 'src');
  const relativeToLogMeDir = path.relative(fileDir, logMeDir).split(path.sep).join('/');
  const importPrefix = relativeToLogMeDir === '' ? '.' : relativeToLogMeDir;
  const logMeImportPath = `${importPrefix}/LogMe`;
  const sampleMethodImportPath = `${importPrefix}/sample-method`;

  body.push(
    `const { LogMe } = require('${logMeImportPath}');`,
    `const { sampleMethod } = require('${sampleMethodImportPath}');`,
    '',
    `function ${exportName}() {`,
    "  if (process.env.LOGME_AUDIT === '1') {",
    '    LogMe(sampleMethod);',
    '  }',
    '',
    `  throw new Error('${exportName} is not implemented yet');`,
    '}',
    '',
    `module.exports = { ${exportName} };`,
    '',
  );

  return body.join('\n');
}

const STUB_MARKER = '// STUB: not yet implemented. Scaffolded from the declared file-system body contract.';

function isUnimplementedStub(fullPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const contents = fs.readFileSync(fullPath, 'utf8');
  return contents.includes(STUB_MARKER);
}

function scaffold({ refreshStubs = false } = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const contract = readContract();
  let created = 0;
  let refreshed = 0;

  for (const relativeDir of contract.requiredPaths.directories) {
    const fullDir = path.join(LAB_ROOT, relativeDir);
    fs.mkdirSync(fullDir, { recursive: true });
  }

  for (const relativeFile of contract.requiredPaths.files) {
    const fullPath = path.join(LAB_ROOT, relativeFile);
    const exists = fs.existsSync(fullPath);

    if (exists && !(refreshStubs && relativeFile.endsWith('.js') && isUnimplementedStub(fullPath))) {
      continue;
    }

    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, stubContentFor(relativeFile), 'utf8');

    if (exists) {
      refreshed += 1;
    } else {
      created += 1;
    }
  }

  console.log(`Scaffolded ${contract.requiredPaths.directories.length} directories. Created ${created} files, refreshed ${refreshed} unimplemented stubs.`);
}

const refreshStubs = process.argv.includes('--refresh-stubs');
scaffold({ refreshStubs });
