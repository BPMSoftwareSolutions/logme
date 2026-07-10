const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { proposesPackageExtractionPlan } = require('../proposes-package-extraction-plan/proposes-package-extraction-plan');
const { writesPackageExtractionPlanEvidence } = require('../writes-package-extraction-plan-evidence/writes-package-extraction-plan-evidence');

async function runsPackageExtractionWorker(config, runId, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const sprawlContract = readsFrozenSprawlContract(config, runId);
  const packageExtractionPlan = await proposesPackageExtractionPlan(config, sprawlContract, options);
  const receipt = writesPackageExtractionPlanEvidence(config, packageExtractionPlan);

  return { packageExtractionPlan, receipt };
}

function readsFrozenSprawlContract(config, runId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const evidencePath = path.join(config.rootDir, 'evidence', 'runs', runId, 'sprawl', 'domain-body-sprawl.contract.v1.json');
  return JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
}

module.exports = {
  runsPackageExtractionWorker,
};
