const path = require('node:path');
const { readsJsonConfigFile } = require('../../packages/logme-config-primitives/src/reads-json-config-file');
const { resolvesConfiguredRootPath } = require('../../packages/logme-config-primitives/src/resolves-configured-root-path');
const { normalizesConfigStringArray } = require('../../packages/logme-config-primitives/src/normalizes-config-string-array');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const PACKAGE_ROOT = path.resolve(__dirname, '..', '..');

function loadsWorkspaceObservabilityConfig() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const configPath = path.join(PACKAGE_ROOT, 'logme.config.json');
  const config = readsJsonConfigFile(configPath);

  return {
    configPath,
    rootDir: resolvesConfiguredRootPath(PACKAGE_ROOT, config.rootDir),
    includeExtensions: normalizesConfigStringArray(config.includeExtensions),
    excludeDirectories: normalizesConfigStringArray(config.excludeDirectories),
    forbiddenLocalUtilityNames: normalizesConfigStringArray(config.forbiddenLocalUtilityNames),
    excludeFiles: normalizesConfigStringArray(config.excludeFiles),
    includeTestFiles: config.includeTestFiles,
    stubMarker: config.stubMarker,
    forbiddenMethodNames: normalizesConfigStringArray(config.domainContract.domainVocabulary.forbiddenMethodNames),
    reportPath: resolvesConfiguredRootPath(PACKAGE_ROOT, config.reportPath),
    domainContract: config.domainContract,
  };
}

module.exports = { loadsWorkspaceObservabilityConfig };
