const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

function lowercasesSingleValue(value) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return value.toLowerCase();
}

function lowercasesStringList(values) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return values.map(lowercasesSingleValue);
}

module.exports = { lowercasesStringList };
