const { walksConfiguredSourceFiles } = require('../../packages/logme-source-body-primitives/src/walks-configured-source-files');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

function discoversConfiguredSourceBodies(config) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return walksConfiguredSourceFiles(config.rootDir, {
    excludeDirectories: config.excludeDirectories,
    excludeFiles: config.excludeFiles,
    includeExtensions: config.includeExtensions,
  });
}

module.exports = { discoversConfiguredSourceBodies };
