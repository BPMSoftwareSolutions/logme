const test = require('node:test');
const assert = require('node:assert/strict');

const { detectsOutOfVocabularyLocalMethods } = require('../src/detects-domain-language-impurity/detects-out-of-vocabulary-local-methods');

test('detectsOutOfVocabularyLocalMethods returns empty array when all methods use domain vocabulary', () => {
  const methods = [
    { name: 'scanWorkspace', filePath: '/project/scan.js', isAnonymous: false },
    { name: 'loadConfig', filePath: '/project/load.js', isAnonymous: false },
  ];
  const config = {
    forbiddenMethodNames: ['walk', 'visit', 'handler', 'callback', 'temp', 'data', 'misc', 'process', 'helper'],
    domainContract: {
      findings: {
        methodNameOutsideDomainVocabulary: {
          code: 'method-name-outside-vocabulary',
          reason: 'method names must use domain vocabulary',
        },
      },
    },
  };

  const findings = detectsOutOfVocabularyLocalMethods(methods, config);

  assert.deepEqual(findings, []);
});

test('detectsOutOfVocabularyLocalMethods detects methods with forbidden words in camelCase', () => {
  const methods = [
    { name: 'scanWorkspace', filePath: '/project/scan.js', isAnonymous: false },
    { name: 'tempBuffer', filePath: '/project/buffer.js', isAnonymous: false },
    { name: 'helperFunction', filePath: '/project/helper.js', isAnonymous: false },
  ];
  const config = {
    forbiddenMethodNames: ['walk', 'visit', 'handler', 'callback', 'temp', 'data', 'misc', 'process', 'helper'],
    domainContract: {
      findings: {
        methodNameOutsideDomainVocabulary: {
          code: 'vocab-violation',
          reason: 'forbidden words detected',
        },
      },
    },
  };

  const findings = detectsOutOfVocabularyLocalMethods(methods, config);

  assert.equal(findings.length, 2);
  assert.deepEqual(
    findings.map((f) => f.methodName),
    ['tempBuffer', 'helperFunction'],
  );
});

test('detectsOutOfVocabularyLocalMethods skips anonymous methods', () => {
  const methods = [
    { name: '(anonymous)', filePath: '/project/file.js', isAnonymous: true },
    { name: 'processData', filePath: '/project/file.js', isAnonymous: false },
  ];
  const config = {
    forbiddenMethodNames: ['process', 'data'],
    domainContract: {
      findings: {
        methodNameOutsideDomainVocabulary: {
          code: 'vocab',
          reason: 'forbidden',
        },
      },
    },
  };

  const findings = detectsOutOfVocabularyLocalMethods(methods, config);

  assert.equal(findings.length, 1);
  assert.equal(findings[0].methodName, 'processData');
});

test('detectsOutOfVocabularyLocalMethods handles snake_case and mixed separators', () => {
  const methods = [
    { name: 'walk_the_tree', filePath: '/project/file.js', isAnonymous: false },
  ];
  const config = {
    forbiddenMethodNames: ['walk', 'tree'],
    domainContract: {
      findings: {
        methodNameOutsideDomainVocabulary: {
          code: 'vocab',
          reason: 'forbidden',
        },
      },
    },
  };

  const findings = detectsOutOfVocabularyLocalMethods(methods, config);

  assert.equal(findings.length, 1);
});
