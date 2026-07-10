const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const UNSUPPORTED_FINDING = 'scenario-tieout-unsupported';
const RECOMMENDED_FIX = 'require a feature document, test, report section, or receipt artifact citation';

function blocksUnsupportedScenarioTieOuts(tieOutProposal) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const blockedMappings = [];
  const promotableMappings = [];

  for (const mapping of tieOutProposal.mappings) {
    if (isUnsupportedMapping(mapping)) {
      blockedMappings.push(buildsBlockedMappingResult(mapping));
    } else {
      promotableMappings.push(mapping.filePath);
    }
  }

  return {
    verdict: blockedMappings.length === 0 ? 'PASS' : 'BLOCKED',
    blockedMappings,
    promotableMappings,
  };
}

function isUnsupportedMapping(mapping) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return !mapping.evidenceCitation
    || !mapping.evidenceCitation.source
    || !mapping.evidenceCitation.reference
    || (mapping.findingCodes || []).includes(UNSUPPORTED_FINDING);
}

function buildsBlockedMappingResult(mapping) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    filePath: mapping.filePath,
    findingCode: UNSUPPORTED_FINDING,
    recommendedFix: RECOMMENDED_FIX,
    reasoning: mapping.reasoning,
  };
}

module.exports = {
  UNSUPPORTED_FINDING,
  blocksUnsupportedScenarioTieOuts,
};
