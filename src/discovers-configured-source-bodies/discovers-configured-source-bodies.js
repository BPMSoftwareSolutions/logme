const { walksConfiguredSourceFiles } = require('../../packages/logme-source-body-primitives/src/walks-configured-source-files');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const path = require('node:path');

function discoversConfiguredSourceBodies(config) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const scanRoots = resolvesAuditScanRoots(config);
  const files = [];
  for (const scanRoot of scanRoots) {
    files.push(...walksConfiguredSourceFiles(scanRoot, {
    excludeDirectories: config.excludeDirectories,
    excludeFiles: config.excludeFiles,
    includeExtensions: config.includeExtensions,
    }));
  }
  return files.sort();
}

function resolvesAuditScanRoots(config) {
  if (process.env.LOGME_AUDIT === '1') LogMe(resolvesAuditScanRoots);
  if (config.auditScope === 'source-domain audit') return [path.join(config.rootDir, 'src')];
  if (config.auditScope === 'package audit') {
    const packageRoots = [];
    for (const packagePath of config.packageAuditPaths || []) packageRoots.push(path.join(config.rootDir, packagePath));
    return packageRoots;
  }
  return [config.rootDir];
}

module.exports = { discoversConfiguredSourceBodies, resolvesAuditScanRoots };
