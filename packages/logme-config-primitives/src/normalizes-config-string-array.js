const { lowercasesStringList } = require('./lowercases-string-list');
const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

function normalizesConfigStringArray(values) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return lowercasesStringList(values);
}

module.exports = { normalizesConfigStringArray };
