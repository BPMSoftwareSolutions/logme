const { LogMe } = require('../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../packages/logme-testimony-core/src/sample-method');
const { loadsWorkspaceObservabilityConfig } = require('./loads-workspace-observability-config/loads-workspace-observability-config');
const { writesDomainBodySterilityReceipt } = require('./writes-domain-body-sterility-receipt/writes-domain-body-sterility-receipt');
const { buildsDomainBodySterilityContract } = require('./builds-domain-body-sterility-contract/builds-domain-body-sterility-contract');

function runsLogMeDomainAudit() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const config = loadsWorkspaceObservabilityConfig();
  const contract = buildsDomainBodySterilityContract(config).contract;

  return writesDomainBodySterilityReceipt(contract);
}

module.exports = { runsLogMeDomainAudit };
