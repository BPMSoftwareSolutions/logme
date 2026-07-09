const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

function getMethodNameWords(methodName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return methodName
    .split(/[^a-zA-Z0-9]+/)
    .flatMap(splitsCamelCaseSegment)
    .map(lowercasesWord)
    .filter(Boolean);
}

function splitsCamelCaseSegment(segment) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return segment.split(/(?<=[a-z0-9])(?=[A-Z])/);
}

function lowercasesWord(word) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return word.toLowerCase();
}

function isOutsideDomainVocabulary(method, config) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (method.isAnonymous) {
    return false;
  }

  const words = getMethodNameWords(method.name);

  function matchesForbiddenMethodName(word) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return config.forbiddenMethodNames.includes(word);
  }

  return words.some(matchesForbiddenMethodName);
}

function isVocabularyViolationMethod(method, config) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return isOutsideDomainVocabulary(method, config);
}

function detectsOutOfVocabularyLocalMethods(methods, config) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const buildsVocabularyFinding = (method) => {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return {
      code: config.domainContract.findings.methodNameOutsideDomainVocabulary.code,
      filePath: method.filePath,
      methodName: method.name,
      reason: config.domainContract.findings.methodNameOutsideDomainVocabulary.reason,
    };
  };

  function filtersToVocabularyViolations(method) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return isVocabularyViolationMethod(method, config);
  }

  return methods
    .filter(filtersToVocabularyViolations)
    .map(buildsVocabularyFinding);
}

module.exports = { detectsOutOfVocabularyLocalMethods };
