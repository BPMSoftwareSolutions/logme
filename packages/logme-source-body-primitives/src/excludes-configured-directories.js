const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

function excludesConfiguredDirectories(directoryName, excludeDirectories) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const normalizedDirectoryName = directoryName.toLowerCase();

  return excludeDirectories.includes(normalizedDirectoryName) || normalizedDirectoryName.startsWith('temp-');
}

module.exports = { excludesConfiguredDirectories };
