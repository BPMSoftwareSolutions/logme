const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { detectsForbiddenLocalUtilityPaths } = require('../detects-domain-language-impurity/detects-forbidden-local-utility-paths');
const { detectsMethodTestimony } = require('../detects-method-testimony/detects-method-testimony');
const { detectsAnonymousLocalMethods } = require('../detects-domain-language-impurity/detects-anonymous-local-methods');
const { detectsOutOfVocabularyLocalMethods } = require('../detects-domain-language-impurity/detects-out-of-vocabulary-local-methods');
const { detectsRetiredDomainNameReintroduction } = require('../detects-retired-domain-name-reintroduction/detects-retired-domain-name-reintroduction');

function buildsUnimplementedStubFindings(methods, domainContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const isUnimplementedStubMethod = (method) => {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return method.isUnimplementedStub;
  };

  const buildsStubFinding = (method) => {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return {
      code: domainContract.findings.unimplementedStubDetected.code,
      filePath: method.filePath,
      methodName: method.name,
      reason: domainContract.findings.unimplementedStubDetected.reason,
    };
  };

  return methods
    .filter(isUnimplementedStubMethod)
    .map(buildsStubFinding);
}

function buildsDomainBodySterilityFindings(config, sourceFiles, methods) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const genericUtilityFindings = detectsForbiddenLocalUtilityPaths(sourceFiles, config);
  const silentMethodFindings = detectsMethodTestimony(methods, config.domainContract);
  const anonymousMethodFindings = detectsAnonymousLocalMethods(methods, config.domainContract);
  const vocabularyFindings = detectsOutOfVocabularyLocalMethods(methods, config);
  const unimplementedStubFindings = buildsUnimplementedStubFindings(methods, config.domainContract);
  const retiredDomainNameFindings = detectsRetiredDomainNameReintroduction(config);

  return [
    ...genericUtilityFindings,
    ...silentMethodFindings,
    ...anonymousMethodFindings,
    ...vocabularyFindings,
    ...unimplementedStubFindings,
    ...retiredDomainNameFindings,
  ];
}

module.exports = { buildsDomainBodySterilityFindings };
