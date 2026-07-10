const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

function formatsMarkdownCell(value) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return String(value).replace(/\|/gu, '\\|').replace(/\r?\n/gu, ' ');
}

module.exports = { formatsMarkdownCell };
