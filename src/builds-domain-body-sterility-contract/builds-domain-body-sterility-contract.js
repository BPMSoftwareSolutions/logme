const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { discoversConfiguredSourceBodies } = require('../discovers-configured-source-bodies/discovers-configured-source-bodies');
const { inventoriesExecutableDomainMethods } = require('../inventories-executable-domain-methods/inventories-executable-domain-methods');
const { buildsDomainBodySterilityFindings } = require('../builds-domain-body-sterility-findings/builds-domain-body-sterility-findings');
const { calculatesDomainBodySterilitySummary } = require('../calculates-domain-body-sterility-summary/calculates-domain-body-sterility-summary');
const { buildsReportProvenance } = require('../report-provenance/report-provenance');
const { rendersDomainBodySterilityReport } = require('../renders-domain-body-sterility-report/renders-domain-body-sterility-report');

function inventoriesMethodsForFile(config, executionStepState) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return function inventoriesMethodsForDiscoveredFile(filePath) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return inventoriesExecutableDomainMethods(filePath, config.stubMarker, executionStepState);
  };
}

function buildsDomainBodySterilityContract(config) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const sourceFiles = discoversConfiguredSourceBodies(config);
  const executionStepState = [0];
  const methods = sourceFiles.flatMap(inventoriesMethodsForFile(config, executionStepState));
  const findings = buildsDomainBodySterilityFindings(config, sourceFiles, methods);
  const summary = calculatesDomainBodySterilitySummary(config, sourceFiles, methods, findings);
  const provenance = buildsReportProvenance(config, sourceFiles, methods);
  const contract = { ...summary, reportPath: config.reportPath, provenance };
  const reportContent = rendersDomainBodySterilityReport(contract);

  return {
    config,
    sourceFiles,
    methods,
    findings,
    summary,
    provenance,
    contract,
    reportContent,
  };
}

module.exports = { buildsDomainBodySterilityContract };
