const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const { loadsWorkspaceObservabilityConfig } = require('../src/loads-workspace-observability-config/loads-workspace-observability-config');

test('loadsWorkspaceObservabilityConfig reads logme.config.json and resolves absolute paths', () => {
  const config = loadsWorkspaceObservabilityConfig();

  assert.equal(path.isAbsolute(config.rootDir), true);
  assert.equal(path.isAbsolute(config.reportPath), true);
  assert.equal(path.isAbsolute(config.configPath), true);
});

test('loadsWorkspaceObservabilityConfig lowercases every normalized string list', () => {
  const config = loadsWorkspaceObservabilityConfig();

  assert.deepEqual(config.includeExtensions, ['.js', '.ts']);
  assert.deepEqual(config.excludeDirectories, ['.git', 'node_modules', 'evidence', 'tests', 'generated-harnesses']);
  assert.deepEqual(config.forbiddenLocalUtilityNames, ['utils', 'helpers', 'common', 'shared', 'lib', 'misc']);
  assert.deepEqual(config.excludeFiles, ['report.md']);
  assert.equal(config.includeTestFiles, false);
  assert.equal(
    config.stubMarker,
    '// STUB: not yet implemented. Scaffolded from the declared file-system body contract.',
  );
  assert.deepEqual(
    config.forbiddenMethodNames,
    ['arrow-function', 'function-expression', 'walk', 'visit', 'handler', 'callback', 'temp', 'data', 'misc', 'process', 'dostuff', 'helper'],
  );
  assert.equal(config.sprawlThresholds.maxLinesBeforeWatchlist, 220);
  assert.equal(config.sprawlThresholds.maxExecutableMethodsBeforeWatchlist, 16);
  assert.deepEqual(
    config.sprawlThresholds.authorizedDenseOrchestratorPaths,
    ['src/builds-domain-body-sterility-contract/builds-domain-body-sterility-contract.js'],
  );
});

test('loadsWorkspaceObservabilityConfig passes through the domain contract untouched', () => {
  const config = loadsWorkspaceObservabilityConfig();

  assert.equal(config.domainContract.domainName, 'LogMe');
  assert.equal(config.domainContract.verdicts.sterile, 'STERILE DOMAIN BODY');
  assert.equal(
    config.domainContract.findings.methodNameOutsideDomainVocabulary.code,
    'local-method-name-outside-domain-vocabulary',
  );
});
