const test = require('node:test');
const assert = require('node:assert/strict');

const { detectsForbiddenLocalUtilityPaths } = require('../src/detects-domain-language-impurity/detects-forbidden-local-utility-paths');

test('detectsForbiddenLocalUtilityPaths returns empty array when no forbidden paths exist', () => {
  const sourceFiles = [
    '/project/src/domain/scan.js',
    '/project/src/domain/load.js',
  ];
  const config = {
    rootDir: '/project',
    forbiddenLocalUtilityNames: ['utils', 'helpers', 'common', 'shared', 'lib', 'misc'],
    domainContract: {
      findings: {
        genericUtilityDetected: {
          code: 'local-generic-utility-detected',
          reason: 'generic mechanics belong in a package, not the domain body',
        },
      },
    },
  };

  const findings = detectsForbiddenLocalUtilityPaths(sourceFiles, config);

  assert.deepEqual(findings, []);
});

test('detectsForbiddenLocalUtilityPaths detects forbidden utility paths', () => {
  const sourceFiles = [
    '/project/src/domain/scan.js',
    '/project/src/utils/helpers.js',
    '/project/src/lib/common.js',
  ];
  const config = {
    rootDir: '/project',
    forbiddenLocalUtilityNames: ['utils', 'helpers', 'common', 'shared', 'lib', 'misc'],
    domainContract: {
      findings: {
        genericUtilityDetected: {
          code: 'utility-found',
          reason: 'forbidden utility',
        },
      },
    },
  };

  const findings = detectsForbiddenLocalUtilityPaths(sourceFiles, config);

  assert.equal(findings.length, 2);
  assert.equal(findings[0].code, 'utility-found');
  assert.equal(findings[0].filePath, '/project/src/utils/helpers.js');
  assert.equal(findings[1].filePath, '/project/src/lib/common.js');
});

test('detectsForbiddenLocalUtilityPaths handles case-insensitive matching', () => {
  const sourceFiles = [
    '/project/src/Helpers/index.js',
    '/project/src/UTILS/math.js',
  ];
  const config = {
    rootDir: '/project',
    forbiddenLocalUtilityNames: ['utils', 'helpers'],
    domainContract: {
      findings: {
        genericUtilityDetected: {
          code: 'util',
          reason: 'forbidden',
        },
      },
    },
  };

  const findings = detectsForbiddenLocalUtilityPaths(sourceFiles, config);

  assert.equal(findings.length, 2);
});

test('detectsForbiddenLocalUtilityPaths ignores extensions in path analysis', () => {
  const sourceFiles = [
    '/project/src/helpers.js',
    '/project/src/domain/scan.js',
  ];
  const config = {
    rootDir: '/project',
    forbiddenLocalUtilityNames: ['helpers'],
    domainContract: {
      findings: {
        genericUtilityDetected: {
          code: 'util',
          reason: 'forbidden',
        },
      },
    },
  };

  const findings = detectsForbiddenLocalUtilityPaths(sourceFiles, config);

  assert.equal(findings.length, 1);
  assert.equal(findings[0].filePath, '/project/src/helpers.js');
});
