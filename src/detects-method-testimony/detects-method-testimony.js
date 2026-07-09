const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

function detectsMethodTestimony(methods, domainContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const isSilentMethod = (method) => {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return !method.hasLogMeCall;
  };

  const buildsSilentMethodFinding = (method) => {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return {
      code: domainContract.findings.methodWithoutTestimony.code,
      filePath: method.filePath,
      methodName: method.name,
      reason: domainContract.findings.methodWithoutTestimony.reason,
    };
  };

  return methods
    .filter(isSilentMethod)
    .map(buildsSilentMethodFinding);
}

module.exports = { detectsMethodTestimony };
