const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const MISSING_RESPONSIBILITY_FINDING = 'body-contract-missing-responsibility';
const RECOMMENDED_FIX = 'require ownership, intent, scenario tie-out, and verification fields';
const REQUIRED_NON_EMPTY_FIELDS = ['bodyId', 'bodyKind', 'responsibility', 'verification', 'decompositionStatus'];

function blocksPathOnlyBodyContracts(bodyContractPatch) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const blockedEntries = [];
  const promotableEntries = [];

  for (const entry of bodyContractPatch.entries) {
    if (isPathOnlyEntry(entry)) {
      blockedEntries.push(buildsBlockedEntryResult(entry));
    } else {
      promotableEntries.push(entry.path);
    }
  }

  return {
    verdict: blockedEntries.length === 0 ? 'PASS' : 'BLOCKED',
    blockedEntries,
    promotableEntries,
  };
}

function isPathOnlyEntry(entry) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if ((entry.findingCodes || []).includes(MISSING_RESPONSIBILITY_FINDING)) {
    return true;
  }

  for (const field of REQUIRED_NON_EMPTY_FIELDS) {
    if (!entry[field] || String(entry[field]).trim().length === 0) {
      return true;
    }
  }

  return false;
}

function buildsBlockedEntryResult(entry) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    path: entry.path,
    findingCode: MISSING_RESPONSIBILITY_FINDING,
    recommendedFix: RECOMMENDED_FIX,
    reasoning: entry.reasoningNote,
  };
}

module.exports = {
  MISSING_RESPONSIBILITY_FINDING,
  blocksPathOnlyBodyContracts,
};
