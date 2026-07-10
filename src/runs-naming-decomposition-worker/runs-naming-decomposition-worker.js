const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { proposesRenamePlan } = require('../proposes-rename-plan/proposes-rename-plan');
const { writesRenamePlanEvidence } = require('../writes-rename-plan-evidence/writes-rename-plan-evidence');
const { proposesDecompositionPlan } = require('../proposes-decomposition-plan/proposes-decomposition-plan');
const { writesDecompositionPlanEvidence } = require('../writes-decomposition-plan-evidence/writes-decomposition-plan-evidence');

async function runsNamingDecompositionWorker(config, runId, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const analysisContract = readsFrozenAnalysisContract(config, runId);
  const renamePlan = await proposesRenamePlan(config, analysisContract, options);
  const renamePlanReceipt = writesRenamePlanEvidence(config, renamePlan);
  const decompositionPlan = proposesDecompositionPlan(analysisContract, renamePlan);
  const decompositionPlanReceipt = writesDecompositionPlanEvidence(config, decompositionPlan);

  return { renamePlan, renamePlanReceipt, decompositionPlan, decompositionPlanReceipt };
}

function readsFrozenAnalysisContract(config, runId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const evidencePath = path.join(config.rootDir, 'evidence', 'runs', runId, 'domain-analysis', 'domain-body-analysis.contract.v1.json');
  return JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
}

module.exports = {
  runsNamingDecompositionWorker,
};
