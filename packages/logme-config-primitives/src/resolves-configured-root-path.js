const path = require('node:path');
const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

function resolvesConfiguredRootPath(baseDir, configuredPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return path.resolve(baseDir, configuredPath);
}

module.exports = { resolvesConfiguredRootPath };
