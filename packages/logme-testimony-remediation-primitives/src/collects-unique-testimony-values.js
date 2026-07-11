const { LogMe } = require('../../logme-testimony-core/src/LogMe');

function collectsUniqueTestimonyValues(values) {
  if (process.env.LOGME_AUDIT === '1') LogMe(collectsUniqueTestimonyValues);
  const uniqueValues = new Set();
  for (const value of values) {
    if (value) uniqueValues.add(value);
  }
  return [...uniqueValues].sort();
}

module.exports = { collectsUniqueTestimonyValues };
