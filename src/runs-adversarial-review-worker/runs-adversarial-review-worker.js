const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const {
  challengesScenarioTieOutProposal,
  challengesBodyContractPatch,
  challengesRenamePlan,
} = require('../challenges-worker-proposal/challenges-worker-proposal');
const { writesAdversarialReviewEvidence } = require('../writes-adversarial-review-evidence/writes-adversarial-review-evidence');

const REVIEW_ROUTES = [
  { packetId: 'domain-remediation-scenario-tieout', fileName: 'scenario-tieout.proposal.v1.json', challenges: challengesScenarioTieOutProposal },
  { packetId: 'domain-remediation-body-contract', fileName: 'body-contract-patch.proposal.v1.json', challenges: challengesBodyContractPatch },
  { packetId: 'domain-remediation-actionless-naming', fileName: 'rename-plan.v1.json', challenges: challengesRenamePlan },
];

function runsAdversarialReviewWorker(config, runId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const packetReviews = [];

  for (const route of REVIEW_ROUTES) {
    const proposalPath = path.join(config.rootDir, 'quality', 'domain-remediation', runId, route.fileName);
    if (!fs.existsSync(proposalPath)) {
      continue;
    }

    const proposal = JSON.parse(fs.readFileSync(proposalPath, 'utf8'));
    const packetReview = { ...route.challenges(proposal), packetId: route.packetId };
    const receipt = writesAdversarialReviewEvidence(config, runId, packetReview);

    packetReviews.push({ packetReview, receipt });
  }

  return { packetReviews };
}

module.exports = {
  runsAdversarialReviewWorker,
};
