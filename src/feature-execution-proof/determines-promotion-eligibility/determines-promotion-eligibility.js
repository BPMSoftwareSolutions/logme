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

  const uniqueBlockerCodes = [...new Set(blockerCodes)];

  return {
    status: uniqueBlockerCodes.length === 0 ? 'proven' : 'blocked',
    blockerCodes: uniqueBlockerCodes,
    recommendedFixes: uniqueBlockerCodes.map(buildsRecommendedFix),
    reason: uniqueBlockerCodes.length === 0
      ? 'all declared executable body nodes have observed telemetry and required receipts'
      : 'one or more executable body nodes failed a deterministic testimony, source-range, telemetry, receipt, or blocker-clearance gate',
  };
}

function buildsRecommendedFix(blockerCode) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsRecommendedFix);
  const fixes = {
    'product-method-name-not-observed': 'create a bounded Gemini testimony remediation packet and replace generic testimony only after accepted classification',
    'executable-body-source-range-incomplete': 'require the Gemini worker to propose an updated source range or a decomposed executable body node',
  };
  return { blockerCode, fix: fixes[blockerCode] || 'resolve the cited proof blocker and rerun deterministic verification' };
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

module.exports = { buildsPromotionDecision, buildsRecommendedFix, readsBlockerFindingCode, readsNodeBlockerCodes };
