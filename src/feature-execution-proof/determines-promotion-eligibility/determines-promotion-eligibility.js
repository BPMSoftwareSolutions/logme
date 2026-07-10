const { LogMe } = require('../../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../../packages/logme-testimony-core/src/sample-method');

function buildsPromotionDecision(nodes, blockerFindings) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const blockerCodes = [];

  for (const finding of blockerFindings) {
    blockerCodes.push(readsBlockerFindingCode(finding));
  }

  for (const node of nodes) {
    const nodeBlockerCodes = readsNodeBlockerCodes(node);

    for (const blockerCode of nodeBlockerCodes) {
      blockerCodes.push(blockerCode);
    }
  }

  return {
    status: blockerCodes.length === 0 ? 'proven' : 'blocked',
    blockerCodes,
    reason: blockerCodes.length === 0
      ? 'all declared executable body nodes have observed telemetry and required receipts'
      : 'one or more executable body nodes lack observed telemetry, required receipts, or explicit blocker clearance',
  };
}

function readsBlockerFindingCode(finding) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return finding.code;
}

function readsNodeBlockerCodes(node) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return node.blockerCodes;
}

module.exports = { buildsPromotionDecision, readsBlockerFindingCode, readsNodeBlockerCodes };
