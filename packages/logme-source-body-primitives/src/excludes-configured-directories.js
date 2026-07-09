const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

function excludesConfiguredDirectories(directoryName, excludeDirectories) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return excludeDirectories.includes(directoryName.toLowerCase());
}

module.exports = { excludesConfiguredDirectories };
