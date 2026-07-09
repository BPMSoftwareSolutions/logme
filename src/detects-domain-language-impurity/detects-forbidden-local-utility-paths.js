const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

function getRelativePathParts(filePath, rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const relativePath = path.relative(rootDir, filePath);
  const pathParts = relativePath.split(path.sep).filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1];

  if (!lastPart) {
    return pathParts;
  }

  return [
    ...pathParts.slice(0, -1),
    path.basename(lastPart, path.extname(lastPart)),
  ].map(lowercasesPathPart);
}

function lowercasesPathPart(part) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return part.toLowerCase();
}

function isGenericUtilityPath(filePath, config) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const pathParts = getRelativePathParts(filePath, config.rootDir);

  function matchesForbiddenUtilityName(part) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return config.forbiddenLocalUtilityNames.includes(part);
  }

  return pathParts.some(matchesForbiddenUtilityName);
}

function isUtilityPathFile(filePath, config) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return isGenericUtilityPath(filePath, config);
}

function detectsForbiddenLocalUtilityPaths(sourceFiles, config) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const buildsUtilityFinding = (filePath) => {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return {
      code: config.domainContract.findings.genericUtilityDetected.code,
      filePath,
      reason: config.domainContract.findings.genericUtilityDetected.reason,
    };
  };

  function filtersToUtilityPaths(filePath) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return isUtilityPathFile(filePath, config);
  }

  return sourceFiles
    .filter(filtersToUtilityPaths)
    .map(buildsUtilityFinding);
}

module.exports = { detectsForbiddenLocalUtilityPaths };
