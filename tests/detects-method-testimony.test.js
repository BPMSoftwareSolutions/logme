const test = require('node:test');
const assert = require('node:assert/strict');

const { detectsMethodTestimony } = require('../src/detects-method-testimony/detects-method-testimony');

test('detectsMethodTestimony returns empty array when all methods have LogMe calls', () => {
  const methods = [
    { name: 'scanWorkspace', filePath: '/project/scan.js', hasLogMeCall: true },
    { name: 'loadConfig', filePath: '/project/load.js', hasLogMeCall: true },
  ];
  const domainContract = {
    findings: {
      methodWithoutTestimony: {
        code: 'local-method-without-testimony',
        reason: 'local domain executable code must testify with LogMe',
      },
    },
  };

  const findings = detectsMethodTestimony(methods, domainContract);

  assert.deepEqual(findings, []);
});

test('detectsMethodTestimony detects methods without LogMe calls', () => {
  const methods = [
    { name: 'scanWorkspace', filePath: '/project/scan.js', hasLogMeCall: true },
    { name: 'silentMethod', filePath: '/project/silent.js', hasLogMeCall: false },
    { name: 'anotherSilent', filePath: '/project/other.js', hasLogMeCall: false },
  ];
  const domainContract = {
    findings: {
      methodWithoutTestimony: {
        code: 'no-testimony',
        reason: 'must call LogMe',
      },
    },
  };

  const findings = detectsMethodTestimony(methods, domainContract);

  assert.equal(findings.length, 2);
  assert.equal(findings[0].code, 'no-testimony');
  assert.equal(findings[0].filePath, '/project/silent.js');
  assert.equal(findings[0].methodName, 'silentMethod');
  assert.equal(findings[0].reason, 'must call LogMe');
  assert.equal(findings[1].methodName, 'anotherSilent');
});

test('detectsMethodTestimony handles single silent method', () => {
  const methods = [
    { name: 'noLogMeHere', filePath: '/src/scan.js', hasLogMeCall: false },
  ];
  const domainContract = {
    findings: {
      methodWithoutTestimony: {
        code: 'silent',
        reason: 'add LogMe',
      },
    },
  };

  const findings = detectsMethodTestimony(methods, domainContract);

  assert.equal(findings.length, 1);
  assert.equal(findings[0].methodName, 'noLogMeHere');
});

test('detectsMethodTestimony preserves finding structure for all methods', () => {
  const methods = [
    { name: 'test1', filePath: '/a.js', hasLogMeCall: false },
    { name: 'test2', filePath: '/b.js', hasLogMeCall: false },
  ];
  const domainContract = {
    findings: {
      methodWithoutTestimony: {
        code: 'xyz',
        reason: 'abc',
      },
    },
  };

  const findings = detectsMethodTestimony(methods, domainContract);

  findings.forEach((f) => {
    assert.equal(typeof f.code, 'string');
    assert.equal(typeof f.filePath, 'string');
    assert.equal(typeof f.methodName, 'string');
    assert.equal(typeof f.reason, 'string');
  });
});
