const fs = require('node:fs');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { loadsWorkspaceObservabilityConfig } = require('../loads-workspace-observability-config/loads-workspace-observability-config');
const { buildsDomainBodySterilityContract } = require('../builds-domain-body-sterility-contract/builds-domain-body-sterility-contract');
const { checksReportTruthGate } = require('../report-provenance/report-provenance');

function readsCurrentReportContent(reportPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!fs.existsSync(reportPath)) {
    return '';
  }

  return fs.readFileSync(reportPath, 'utf8');
}

function runsReportTruthGate() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const config = loadsWorkspaceObservabilityConfig();
  const built = buildsDomainBodySterilityContract(config);
  const reportContent = readsCurrentReportContent(config.reportPath);

  return checksReportTruthGate(reportContent, built.provenance.sourceInventoryHash);
}

module.exports = { runsReportTruthGate };
