const fs = require('node:fs');
const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

function readsJsonConfigFile(configPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rawConfig = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(rawConfig);
}

module.exports = { readsJsonConfigFile };
