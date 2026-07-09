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

function calculatesDomainBodySterilitySummary(config, sourceFiles, methods, findings) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const orderedMethods = methods.map(addsMethodScanOrder);

  function addsMethodScanOrder(method, index) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return {
      ...method,
      scanOrder: index + 1,
    };
  }

  const methodsWithLogMeCall = orderedMethods.filter(countsMethodsWithTestimony).length;

  function countsMethodsWithTestimony(method) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return method.hasLogMeCall;
  }

  const methodsWithoutLogMeCall = orderedMethods.length - methodsWithLogMeCall;

  const genericUtilityMethods = orderedMethods.filter(countsGenericUtilityMethods).length;

  function countsGenericUtilityMethods(method) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return isGenericUtilityPath(method.filePath, config);
  }

  const silentLocalMethods = methodsWithoutLogMeCall;

  const anonymousExecutableMethods = orderedMethods.filter(countsAnonymousMethods).length;

  function countsAnonymousMethods(method) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return method.isAnonymous;
  }

  const methodsOutsideDomainVocabulary = orderedMethods.filter(countsOutOfVocabularyMethods).length;

  function countsOutOfVocabularyMethods(method) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return isOutsideDomainVocabulary(method, config);
  }

  const unimplementedStubMethods = orderedMethods.filter(countsUnimplementedStubMethods).length;

  function countsUnimplementedStubMethods(method) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return method.isUnimplementedStub;
  }

  const languageFindingCodes = [
    config.domainContract.findings.anonymousExecutableMethodDetected.code,
    config.domainContract.findings.methodNameOutsideDomainVocabulary.code,
  ];

  const nonLanguageFindings = findings.filter(filtersNonLanguageFinding);

  function filtersNonLanguageFinding(finding) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return !languageFindingCodes.includes(finding.code);
  }

  const isCoverageClean = nonLanguageFindings.length === 0;
  const isLanguagePure = anonymousExecutableMethods === 0 && methodsOutsideDomainVocabulary === 0;
  const isSterileDomainBody = isCoverageClean && isLanguagePure;

  let verdict = config.domainContract.verdicts.contaminated;
  if (isSterileDomainBody) {
    verdict = config.domainContract.verdicts.sterile;
  } else if (isCoverageClean) {
    verdict = config.domainContract.verdicts.languageImpure;
  }

  return {
    generatedBy: 'LogMe()',
    configPath: config.configPath,
    rootDir: config.rootDir,
    includeExtensions: config.includeExtensions,
    forbiddenLocalUtilityNames: config.forbiddenLocalUtilityNames,
    excludeFiles: config.excludeFiles,
    includeTestFiles: config.includeTestFiles,
    filesScanned: sourceFiles.length,
    methodsFound: orderedMethods.length,
    localExecutableMethods: orderedMethods.length,
    domainBoundMethods: orderedMethods.length,
    methodsWithLogMeCall,
    methodsWithoutLogMeCall,
    silentLocalMethods,
    genericUtilityMethods,
    anonymousExecutableMethods,
    methodsOutsideDomainVocabulary,
    unimplementedStubMethods,
    coverage: orderedMethods.length === 0 ? 100 : Math.round((methodsWithLogMeCall / orderedMethods.length) * 1000) / 10,
    isSterileDomainBody,
    verdict,
    findings,
    methods: orderedMethods,
    domainContract: config.domainContract,
  };
}

module.exports = { calculatesDomainBodySterilitySummary };
