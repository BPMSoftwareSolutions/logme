const test = require('node:test');
const assert = require('node:assert/strict');

const { detectsAnonymousLocalMethods } = require('../src/detects-domain-language-impurity/detects-anonymous-local-methods');

test('detectsAnonymousLocalMethods returns empty array when no anonymous methods exist', () => {
  const methods = [
    { name: 'namedFunction', filePath: '/project/file.js', isAnonymous: false },
    { name: 'anotherFunction', filePath: '/project/file.js', isAnonymous: false },
  ];
  const domainContract = {
    findings: {
      anonymousExecutableMethodDetected: {
        code: 'anonymous-executable-method-detected',
        reason: 'a local executable method was discovered without a domain-bearing name',
      },
    },
  };

  const findings = detectsAnonymousLocalMethods(methods, domainContract);

  assert.deepEqual(findings, []);
});

test('detectsAnonymousLocalMethods detects anonymous methods and builds findings', () => {
  const methods = [
    { name: 'namedFunction', filePath: '/project/file.js', isAnonymous: false },
    { name: '(anonymous)', filePath: '/project/file.js', isAnonymous: true },
    { name: '(anonymous)', filePath: '/project/other.js', isAnonymous: true },
  ];
  const domainContract = {
    findings: {
      anonymousExecutableMethodDetected: {
        code: 'anonymous-executable-method-detected',
        reason: 'a local executable method was discovered without a domain-bearing name',
      },
    },
  };

  const findings = detectsAnonymousLocalMethods(methods, domainContract);

  assert.equal(findings.length, 2);
  assert.equal(findings[0].code, 'anonymous-executable-method-detected');
  assert.equal(findings[0].filePath, '/project/file.js');
  assert.equal(findings[0].methodName, '(anonymous)');
  assert.equal(findings[0].reason, 'a local executable method was discovered without a domain-bearing name');
  assert.equal(findings[1].filePath, '/project/other.js');
});

test('detectsAnonymousLocalMethods handles single anonymous method', () => {
  const methods = [
    { name: '(anonymous)', filePath: '/src/utils.js', isAnonymous: true },
  ];
  const domainContract = {
    findings: {
      anonymousExecutableMethodDetected: {
        code: 'anon-method',
        reason: 'no names',
      },
    },
  };

  const findings = detectsAnonymousLocalMethods(methods, domainContract);

  assert.equal(findings.length, 1);
  assert.equal(findings[0].code, 'anon-method');
});
