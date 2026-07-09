const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const { calculatesDomainBodySterilitySummary } = require('../src/calculates-domain-body-sterility-summary/calculates-domain-body-sterility-summary');

test('calculatesDomainBodySterilitySummary returns sterile verdict with zero findings', () => {
  const config = {
    rootDir: '/workspace',
    includeExtensions: ['.js'],
    forbiddenLocalUtilityNames: ['utils', 'helpers'],
    forbiddenMethodNames: ['walk', 'visit'],
    excludeFiles: [],
    includeTestFiles: false,
    configPath: '/workspace/logme.config.json',
    domainContract: {
      verdicts: {
        sterile: 'STERILE DOMAIN BODY',
        languageImpure: 'COVERAGE CLEAN, LANGUAGE IMPURE',
        contaminated: 'DOMAIN BODY CONTAMINATED',
      },
      findings: {
        genericUtilityDetected: { code: 'local-generic-utility-detected' },
        methodWithoutTestimony: { code: 'local-method-without-testimony' },
        anonymousExecutableMethodDetected: { code: 'anonymous-executable-method-detected' },
        methodNameOutsideDomainVocabulary: { code: 'local-method-name-outside-domain-vocabulary' },
      },
    },
  };

  const sourceFiles = [
    '/workspace/src/module.js',
  ];

  const methods = [
    {
      name: 'inventoryMethods',
      filePath: '/workspace/src/module.js',
      hasLogMeCall: true,
      isAnonymous: false,
      isUnimplementedStub: false,
      lineNumber: 10,
    },
  ];

  const findings = [];

  const summary = calculatesDomainBodySterilitySummary(config, sourceFiles, methods, findings);

  assert.equal(summary.verdict, 'STERILE DOMAIN BODY');
  assert.equal(summary.isSterileDomainBody, true);
  assert.equal(summary.filesScanned, 1);
  assert.equal(summary.methodsFound, 1);
  assert.equal(summary.methodsWithLogMeCall, 1);
  assert.equal(summary.methodsWithoutLogMeCall, 0);
  assert.equal(summary.coverage, 100);
  assert.equal(summary.findings.length, 0);
});

test('calculatesDomainBodySterilitySummary counts silent methods and returns contaminated verdict', () => {
  const config = {
    rootDir: '/workspace',
    includeExtensions: ['.js'],
    forbiddenLocalUtilityNames: ['utils', 'helpers'],
    forbiddenMethodNames: ['walk', 'visit'],
    excludeFiles: [],
    includeTestFiles: false,
    configPath: '/workspace/logme.config.json',
    domainContract: {
      verdicts: {
        sterile: 'STERILE DOMAIN BODY',
        languageImpure: 'COVERAGE CLEAN, LANGUAGE IMPURE',
        contaminated: 'DOMAIN BODY CONTAMINATED',
      },
      findings: {
        genericUtilityDetected: { code: 'local-generic-utility-detected' },
        methodWithoutTestimony: { code: 'local-method-without-testimony' },
        anonymousExecutableMethodDetected: { code: 'anonymous-executable-method-detected' },
        methodNameOutsideDomainVocabulary: { code: 'local-method-name-outside-domain-vocabulary' },
      },
    },
  };

  const sourceFiles = [
    '/workspace/src/module.js',
    '/workspace/src/other.js',
  ];

  const methods = [
    {
      name: 'inventoryMethods',
      filePath: '/workspace/src/module.js',
      hasLogMeCall: true,
      isAnonymous: false,
      isUnimplementedStub: false,
      lineNumber: 10,
    },
    {
      name: 'silentMethod',
      filePath: '/workspace/src/other.js',
      hasLogMeCall: false,
      isAnonymous: false,
      isUnimplementedStub: false,
      lineNumber: 20,
    },
  ];

  const findings = [
    {
      code: 'local-method-without-testimony',
      filePath: '/workspace/src/other.js',
      methodName: 'silentMethod',
    },
  ];

  const summary = calculatesDomainBodySterilitySummary(config, sourceFiles, methods, findings);

  assert.equal(summary.verdict, 'DOMAIN BODY CONTAMINATED');
  assert.equal(summary.isSterileDomainBody, false);
  assert.equal(summary.filesScanned, 2);
  assert.equal(summary.methodsFound, 2);
  assert.equal(summary.methodsWithLogMeCall, 1);
  assert.equal(summary.methodsWithoutLogMeCall, 1);
  assert.equal(summary.silentLocalMethods, 1);
  assert.equal(Math.round(summary.coverage * 10) / 10, 50);
});

test('calculatesDomainBodySterilitySummary counts anonymous and out-of-vocabulary methods', () => {
  const config = {
    rootDir: '/workspace',
    includeExtensions: ['.js'],
    forbiddenLocalUtilityNames: ['utils', 'helpers'],
    forbiddenMethodNames: ['walk', 'visit'],
    excludeFiles: [],
    includeTestFiles: false,
    configPath: '/workspace/logme.config.json',
    domainContract: {
      verdicts: {
        sterile: 'STERILE DOMAIN BODY',
        languageImpure: 'COVERAGE CLEAN, LANGUAGE IMPURE',
        contaminated: 'DOMAIN BODY CONTAMINATED',
      },
      findings: {
        genericUtilityDetected: { code: 'local-generic-utility-detected' },
        methodWithoutTestimony: { code: 'local-method-without-testimony' },
        anonymousExecutableMethodDetected: { code: 'anonymous-executable-method-detected' },
        methodNameOutsideDomainVocabulary: { code: 'local-method-name-outside-domain-vocabulary' },
      },
    },
  };

  const sourceFiles = [
    '/workspace/src/module.js',
    '/workspace/src/utils.js',
  ];

  const methods = [
    {
      name: 'inventoryMethods',
      filePath: '/workspace/src/module.js',
      hasLogMeCall: true,
      isAnonymous: false,
      isUnimplementedStub: false,
      lineNumber: 10,
    },
    {
      name: '<anonymous>',
      filePath: '/workspace/src/module.js',
      hasLogMeCall: true,
      isAnonymous: true,
      isUnimplementedStub: false,
      lineNumber: 20,
    },
    {
      name: 'walkTheTree',
      filePath: '/workspace/src/module.js',
      hasLogMeCall: true,
      isAnonymous: false,
      isUnimplementedStub: false,
      lineNumber: 30,
    },
  ];

  const findings = [
    {
      code: 'anonymous-executable-method-detected',
      filePath: '/workspace/src/module.js',
    },
    {
      code: 'local-method-name-outside-domain-vocabulary',
      filePath: '/workspace/src/module.js',
      methodName: 'walkTheTree',
    },
  ];

  const summary = calculatesDomainBodySterilitySummary(config, sourceFiles, methods, findings);

  assert.equal(summary.anonymousExecutableMethods, 1);
  assert.equal(summary.methodsOutsideDomainVocabulary, 1);
  assert.equal(summary.verdict, 'COVERAGE CLEAN, LANGUAGE IMPURE');
  assert.equal(summary.isSterileDomainBody, false);
});

test('calculatesDomainBodySterilitySummary counts generic utility and unimplemented stub methods', () => {
  const config = {
    rootDir: '/workspace',
    includeExtensions: ['.js'],
    forbiddenLocalUtilityNames: ['utils', 'helpers'],
    forbiddenMethodNames: ['walk', 'visit'],
    excludeFiles: [],
    includeTestFiles: false,
    configPath: '/workspace/logme.config.json',
    domainContract: {
      verdicts: {
        sterile: 'STERILE DOMAIN BODY',
        languageImpure: 'COVERAGE CLEAN, LANGUAGE IMPURE',
        contaminated: 'DOMAIN BODY CONTAMINATED',
      },
      findings: {
        genericUtilityDetected: { code: 'local-generic-utility-detected' },
        methodWithoutTestimony: { code: 'local-method-without-testimony' },
        anonymousExecutableMethodDetected: { code: 'anonymous-executable-method-detected' },
        methodNameOutsideDomainVocabulary: { code: 'local-method-name-outside-domain-vocabulary' },
      },
    },
  };

  const sourceFiles = [
    '/workspace/src/module.js',
    '/workspace/src/utils.js',
  ];

  const methods = [
    {
      name: 'inventoryMethods',
      filePath: '/workspace/src/module.js',
      hasLogMeCall: true,
      isAnonymous: false,
      isUnimplementedStub: false,
      lineNumber: 10,
    },
    {
      name: 'helperFunction',
      filePath: '/workspace/src/utils.js',
      hasLogMeCall: true,
      isAnonymous: false,
      isUnimplementedStub: false,
      lineNumber: 20,
    },
    {
      name: 'stubMethod',
      filePath: '/workspace/src/module.js',
      hasLogMeCall: true,
      isAnonymous: false,
      isUnimplementedStub: true,
      lineNumber: 30,
    },
  ];

  const findings = [
    {
      code: 'local-generic-utility-detected',
      filePath: '/workspace/src/utils.js',
    },
  ];

  const summary = calculatesDomainBodySterilitySummary(config, sourceFiles, methods, findings);

  assert.equal(summary.genericUtilityMethods, 1);
  assert.equal(summary.unimplementedStubMethods, 1);
  assert.equal(summary.filesScanned, 2);
  assert.equal(summary.methodsFound, 3);
});

test('calculatesDomainBodySterilitySummary returns orderedMethods with scanOrder', () => {
  const config = {
    rootDir: '/workspace',
    includeExtensions: ['.js'],
    forbiddenLocalUtilityNames: ['utils', 'helpers'],
    forbiddenMethodNames: ['walk', 'visit'],
    excludeFiles: [],
    includeTestFiles: false,
    configPath: '/workspace/logme.config.json',
    domainContract: {
      verdicts: {
        sterile: 'STERILE DOMAIN BODY',
        languageImpure: 'COVERAGE CLEAN, LANGUAGE IMPURE',
        contaminated: 'DOMAIN BODY CONTAMINATED',
      },
      findings: {
        genericUtilityDetected: { code: 'local-generic-utility-detected' },
        methodWithoutTestimony: { code: 'local-method-without-testimony' },
        anonymousExecutableMethodDetected: { code: 'anonymous-executable-method-detected' },
        methodNameOutsideDomainVocabulary: { code: 'local-method-name-outside-domain-vocabulary' },
      },
    },
  };

  const sourceFiles = [
    '/workspace/src/module.js',
  ];

  const methods = [
    {
      name: 'firstMethod',
      filePath: '/workspace/src/module.js',
      hasLogMeCall: true,
      isAnonymous: false,
      isUnimplementedStub: false,
      lineNumber: 10,
    },
    {
      name: 'secondMethod',
      filePath: '/workspace/src/module.js',
      hasLogMeCall: true,
      isAnonymous: false,
      isUnimplementedStub: false,
      lineNumber: 20,
    },
  ];

  const findings = [];

  const summary = calculatesDomainBodySterilitySummary(config, sourceFiles, methods, findings);

  assert.equal(summary.methods[0].scanOrder, 1);
  assert.equal(summary.methods[1].scanOrder, 2);
  assert.equal(summary.domainContract, config.domainContract);
  assert.equal(summary.generatedBy, 'LogMe()');
});
