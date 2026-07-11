const planner = require('../plans-testimony-accuracy-backlog/plans-testimony-accuracy-backlog');
const handoff = require('../prepares-compact-gemini-handoff/prepares-compact-gemini-handoff');
const classifier = require('../calls-gemini-testimony-classifier/calls-gemini-testimony-classifier');
const proposals = require('../proposes-testimony-remediation/proposes-testimony-remediation');
const sterilizationPlanner = require('../plans-testimony-sterilization/plans-testimony-sterilization');
const sterilizationGate = require('../gates-testimony-sterilization/gates-testimony-sterilization');
const sourceTruth = require('../regenerates-sterilized-source-truth/regenerates-sterilized-source-truth');
const verification = require('../verifies-testimony-accuracy/verifies-testimony-accuracy');
const classificationWorker = require('../runs-testimony-classification-worker/runs-testimony-classification-worker');
const planningArtifacts = require('../writes-testimony-planning-artifacts/writes-testimony-planning-artifacts');
const auditScope = require('../plans-testimony-audit-scope/plans-testimony-audit-scope');
const packageAudit = require('../writes-package-audit-receipt/writes-package-audit-receipt');
const scanEfficiency = require('../calculates-testimony-scan-efficiency/calculates-testimony-scan-efficiency');
const { writesTestimonyJson } = require('../../packages/logme-testimony-remediation-primitives/src/reads-writes-testimony-json');

module.exports = {
  ...planner,
  ...handoff,
  ...classifier,
  ...proposals,
  ...sterilizationPlanner,
  ...sterilizationGate,
  ...sourceTruth,
  ...verification,
  ...classificationWorker,
  ...planningArtifacts,
  ...auditScope,
  ...packageAudit,
  ...scanEfficiency,
  writesJson: writesTestimonyJson,
};
