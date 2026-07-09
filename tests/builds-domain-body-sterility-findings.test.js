const test = require('node:test');
const assert = require('node:assert/strict');

const { buildsDomainBodySterilityFindings } = require('../src/builds-domain-body-sterility-findings/builds-domain-body-sterility-findings');

test('buildsDomainBodySterilityFindings returns concatenated findings in correct order', () => {
  const config = {
    rootDir: 'C:\\repo',
    forbiddenLocalUtilityNames: ['utils', 'helpers'],
    forbiddenMethodNames: ['walk', 'handler'],
    domainContract: {
      findings: {
        genericUtilityDetected: {
          code: 'local-generic-utility-detected',
          reason: 'generic mechanics belong in a package',
        },
        methodWithoutTestimony: {
          code: 'local-method-without-testimony',
          reason: 'local code must testify with LogMe',
        },
        anonymousExecutableMethodDetected: {
          code: 'anonymous-executable-method-detected',
          reason: 'method without domain name',
        },
        methodNameOutsideDomainVocabulary: {
          code: 'local-method-name-outside-domain-vocabulary',
          reason: 'method named with generic language',
        },
        unimplementedStubDetected: {
          code: 'unimplemented-stub-detected',
          reason: 'scaffolded stub not implemented',
        },
      },
    },
  };

  const sourceFiles = [
    'C:\\repo\\src\\app.js',
    'C:\\repo\\src\\utils\\helper.js',
  ];

  const methods = [
    // Silent method (no LogMe call)
    {
      name: 'silentMethod',
      filePath: 'C:\\repo\\src\\app.js',
      hasLogMeCall: false,
      isAnonymous: false,
      isUnimplementedStub: false,
    },
    // Anonymous method
    {
      name: '(anonymous)',
      filePath: 'C:\\repo\\src\\app.js',
      hasLogMeCall: true,
      isAnonymous: true,
      isUnimplementedStub: false,
    },
    // Method with forbidden name (walk)
    {
      name: 'walkTheTree',
      filePath: 'C:\\repo\\src\\app.js',
      hasLogMeCall: true,
      isAnonymous: false,
      isUnimplementedStub: false,
    },
    // Unimplemented stub
    {
      name: 'stubMethod',
      filePath: 'C:\\repo\\src\\stub.js',
      hasLogMeCall: false,
      isAnonymous: false,
      isUnimplementedStub: true,
    },
    // Clean method
    {
      name: 'scanMethods',
      filePath: 'C:\\repo\\src\\app.js',
      hasLogMeCall: true,
      isAnonymous: false,
      isUnimplementedStub: false,
    },
  ];

  const findings = buildsDomainBodySterilityFindings(config, sourceFiles, methods);

  // Should have: 1 utility + 1 silent + 1 stub (testimony) + 1 anonymous + 1 vocabulary + 1 stub (unimplemented) = 6
  // The stub method triggers both testimony and unimplemented checks independently
  assert.equal(findings.length, 6, 'should return 6 findings total');

  // Check order and codes match reference implementation order:
  // 1. genericUtilityFindings
  // 2. silentMethodFindings
  // 3. anonymousMethodFindings
  // 4. vocabularyFindings
  // 5. unimplementedStubFindings
  assert.equal(findings[0].code, 'local-generic-utility-detected', 'first should be utility finding');
  assert.equal(findings[1].code, 'local-method-without-testimony', 'second should be silent method (silentMethod)');
  assert.equal(findings[2].code, 'local-method-without-testimony', 'third should be silent method (stubMethod)');
  assert.equal(findings[3].code, 'anonymous-executable-method-detected', 'fourth should be anonymous finding');
  assert.equal(findings[4].code, 'local-method-name-outside-domain-vocabulary', 'fifth should be vocabulary finding');
  assert.equal(findings[5].code, 'unimplemented-stub-detected', 'sixth should be stub finding');
});
