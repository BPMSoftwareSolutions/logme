const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const PROTECTED_REFERENCE_FINDING = 'evidence-cleanup-protected-reference';
const DESTRUCTIVE_ACTIONS = new Set(['archive', 'delete']);

function guardsEvidenceCleanupReferences(plan) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const blockedEntries = [];
  const allowedEntries = [];

  for (const entry of plan.entries) {
    if (isBlockedByReference(entry)) {
      blockedEntries.push(buildsBlockedEntryResult(entry));
    } else {
      allowedEntries.push(entry.runId);
    }
  }

  return {
    verdict: blockedEntries.length === 0 ? 'PASS' : 'BLOCKED',
    blockedEntries,
    allowedEntries,
  };
}

function isBlockedByReference(entry) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return DESTRUCTIVE_ACTIONS.has(entry.action) && entry.referencesFound.length > 0;
}

function buildsBlockedEntryResult(entry) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    runId: entry.runId,
    action: entry.action,
    findingCode: PROTECTED_REFERENCE_FINDING,
    recommendedFix: `this run is protected by: ${entry.referencesFound.join(', ')}; remove the reference or choose keep/pin instead of ${entry.action}`,
  };
}

module.exports = {
  PROTECTED_REFERENCE_FINDING,
  DESTRUCTIVE_ACTIONS,
  guardsEvidenceCleanupReferences,
};
