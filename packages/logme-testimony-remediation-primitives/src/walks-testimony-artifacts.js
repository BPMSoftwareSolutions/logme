const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../logme-testimony-core/src/LogMe');

function walksTestimonyArtifacts(directoryPath, fileName, results = []) {
  if (process.env.LOGME_AUDIT === '1') LogMe(walksTestimonyArtifacts);
  if (!fs.existsSync(directoryPath)) return results;
  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) walksTestimonyArtifacts(entryPath, fileName, results);
    else if (entry.name === fileName) results.push(entryPath);
  }
  return results;
}

module.exports = { walksTestimonyArtifacts };
