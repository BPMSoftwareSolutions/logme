const fs = require('node:fs');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { loadsWorkspaceObservabilityConfig } = require('../loads-workspace-observability-config/loads-workspace-observability-config');
const { discoversConfiguredSourceBodies } = require('../discovers-configured-source-bodies/discovers-configured-source-bodies');
const { inventoriesExecutableDomainMethods } = require('../inventories-executable-domain-methods/inventories-executable-domain-methods');
const { checksReportTruthGate, computesSourceInventoryHash } = require('../report-provenance/report-provenance');

function runsReportTruthGate() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const config = loadsWorkspaceObservabilityConfig();
  const reportContent = fs.existsSync(config.reportPath)
    ? fs.readFileSync(config.reportPath, 'utf8')
    : '';
  const sourceFiles = discoversConfiguredSourceBodies(config);
  const executionStepState = [0];
  const methods = sourceFiles.flatMap((filePath) => inventoriesExecutableDomainMethods(filePath, config.stubMarker, executionStepState));
  const currentSourceInventoryHash = computesSourceInventoryHash(sourceFiles, methods);

  return checksReportTruthGate(reportContent, currentSourceInventoryHash);
}

module.exports = { runsReportTruthGate };
