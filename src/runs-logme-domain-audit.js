const { LogMe } = require('../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../packages/logme-testimony-core/src/sample-method');
const { loadsWorkspaceObservabilityConfig } = require('./loads-workspace-observability-config/loads-workspace-observability-config');
const { discoversConfiguredSourceBodies } = require('./discovers-configured-source-bodies/discovers-configured-source-bodies');
const { inventoriesExecutableDomainMethods } = require('./inventories-executable-domain-methods/inventories-executable-domain-methods');
const { buildsDomainBodySterilityFindings } = require('./builds-domain-body-sterility-findings/builds-domain-body-sterility-findings');
const { calculatesDomainBodySterilitySummary } = require('./calculates-domain-body-sterility-summary/calculates-domain-body-sterility-summary');
const { writesDomainBodySterilityReceipt } = require('./writes-domain-body-sterility-receipt/writes-domain-body-sterility-receipt');

function inventoriesMethodsForFile(config) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return function inventoriesMethodsForDiscoveredFile(filePath) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return inventoriesExecutableDomainMethods(filePath, config.stubMarker);
  };
}

function runsLogMeDomainAudit() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const config = loadsWorkspaceObservabilityConfig();
  const sourceFiles = discoversConfiguredSourceBodies(config);
  const methods = sourceFiles.flatMap(inventoriesMethodsForFile(config));
  const findings = buildsDomainBodySterilityFindings(config, sourceFiles, methods);
  const summary = calculatesDomainBodySterilitySummary(config, sourceFiles, methods, findings);
  const contract = { ...summary, reportPath: config.reportPath };

  return writesDomainBodySterilityReceipt(contract);
}

module.exports = { runsLogMeDomainAudit };
