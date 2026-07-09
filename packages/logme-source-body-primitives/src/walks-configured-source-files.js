const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

function walksConfiguredSourceFiles(rootDir, options) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const { excludeDirectories, excludeFiles, includeExtensions } = options;
  const files = [];

  function descendsIntoDirectory(currentDir) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = path.join(currentDir, entry.name);
      const lowerName = entry.name.toLowerCase();

      if (entry.isDirectory()) {
        if (excludeDirectories.includes(lowerName)) {
          continue;
        }

        descendsIntoDirectory(fullPath);
        continue;
      }

      if (excludeFiles.includes(lowerName)) {
        continue;
      }

      const extension = path.extname(entry.name).toLowerCase();
      if (includeExtensions.includes(extension)) {
        files.push(fullPath);
      }
    }
  }

  descendsIntoDirectory(rootDir);
  return files.sort(comparesFilePathsAlphabetically);
}

function comparesFilePathsAlphabetically(left, right) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return left.localeCompare(right);
}

module.exports = { walksConfiguredSourceFiles };
