const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../logme-testimony-core/src/LogMe');

function readsTestimonyJson(filePath) {
  if (process.env.LOGME_AUDIT === '1') LogMe(readsTestimonyJson);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writesTestimonyJson(rootDir, relativePath, value) {
  if (process.env.LOGME_AUDIT === '1') LogMe(writesTestimonyJson);
  const absolutePath = path.join(rootDir, relativePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  return absolutePath;
}

module.exports = { readsTestimonyJson, writesTestimonyJson };
