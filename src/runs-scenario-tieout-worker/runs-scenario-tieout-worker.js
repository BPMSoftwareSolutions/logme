const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { proposesScenarioTieOut } = require('../proposes-scenario-tieout/proposes-scenario-tieout');
const { writesScenarioTieOutEvidence } = require('../writes-scenario-tieout-evidence/writes-scenario-tieout-evidence');
const { blocksUnsupportedScenarioTieOuts } = require('../blocks-unsupported-scenario-tieouts/blocks-unsupported-scenario-tieouts');

async function runsScenarioTieOutWorker(config, runId, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const domainMap = readsDomainMapProposal(config, runId);
  const tieOutProposal = await proposesScenarioTieOut(config, domainMap, options);
  const receipt = writesScenarioTieOutEvidence(config, tieOutProposal);
  const gateResult = blocksUnsupportedScenarioTieOuts(tieOutProposal);

  return { tieOutProposal, receipt, gateResult };
}

function readsDomainMapProposal(config, runId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const domainMapPath = path.join(config.rootDir, 'quality', 'domain-remediation', runId, 'domain-map.proposal.v1.json');
  return JSON.parse(fs.readFileSync(domainMapPath, 'utf8'));
}

module.exports = {
  runsScenarioTieOutWorker,
};
