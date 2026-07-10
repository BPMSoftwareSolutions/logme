const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { promotesBodyContractPatch } = require('../promotes-body-contract-patch/promotes-body-contract-patch');

const DECLARED_CONTRACT_PATH = 'contracts/file-system-bodies/02_declared/logme.file-system-body.contract.v1.json';

function runsBodyContractPromotion(config, runId, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const declaredContractPath = path.join(config.rootDir, DECLARED_CONTRACT_PATH);
  const declaredContract = JSON.parse(fs.readFileSync(declaredContractPath, 'utf8'));
  const bodyContractPatchPath = path.join(config.rootDir, 'quality', 'domain-remediation', runId, 'body-contract-patch.proposal.v1.json');
  const bodyContractPatch = JSON.parse(fs.readFileSync(bodyContractPatchPath, 'utf8'));

  const result = promotesBodyContractPatch(declaredContract, bodyContractPatch);

  if (options.write) {
    const contractContent = `${JSON.stringify(result.updatedContract, null, 2)}\n`;
    fs.writeFileSync(declaredContractPath, contractContent, 'utf8');
  }

  return {
    declaredContractPath,
    bodyContractPatchPath,
    promotedPaths: result.promotedPaths,
    skippedEntries: result.skippedEntries,
    written: Boolean(options.write),
  };
}

module.exports = {
  DECLARED_CONTRACT_PATH,
  runsBodyContractPromotion,
};
