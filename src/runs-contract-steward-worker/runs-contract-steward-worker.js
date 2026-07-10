const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { proposesBodyContractPatch } = require('../proposes-body-contract-patch/proposes-body-contract-patch');
const { writesBodyContractPatchEvidence } = require('../writes-body-contract-patch-evidence/writes-body-contract-patch-evidence');
const { blocksPathOnlyBodyContracts } = require('../blocks-path-only-body-contracts/blocks-path-only-body-contracts');

async function runsContractStewardWorker(config, runId, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const analysisContract = readsFrozenAnalysisContract(config, runId);
  const bodyContractPatch = await proposesBodyContractPatch(config, analysisContract, options);
  const receipt = writesBodyContractPatchEvidence(config, bodyContractPatch);
  const gateResult = blocksPathOnlyBodyContracts(bodyContractPatch);

  return { bodyContractPatch, receipt, gateResult };
}

function readsFrozenAnalysisContract(config, runId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const evidencePath = path.join(config.rootDir, 'evidence', 'runs', runId, 'domain-analysis', 'domain-body-analysis.contract.v1.json');
  return JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
}

module.exports = {
  runsContractStewardWorker,
};
