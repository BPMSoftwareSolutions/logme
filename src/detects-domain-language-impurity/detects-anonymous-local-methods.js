const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

function detectsAnonymousLocalMethods(methods, domainContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const isAnonymousMethod = (method) => {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return method.isAnonymous;
  };

  const buildsAnonymousMethodFinding = (method) => {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return {
      code: domainContract.findings.anonymousExecutableMethodDetected.code,
      filePath: method.filePath,
      methodName: method.name,
      reason: domainContract.findings.anonymousExecutableMethodDetected.reason,
    };
  };

  return methods
    .filter(isAnonymousMethod)
    .map(buildsAnonymousMethodFinding);
}

module.exports = { detectsAnonymousLocalMethods };
