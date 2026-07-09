const path = require('node:path');
const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

function filtersSourceFilesByExtension(fileName, includeExtensions) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const extension = path.extname(fileName).toLowerCase();
  return includeExtensions.includes(extension);
}

module.exports = { filtersSourceFilesByExtension };
