const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const ARCHIVE_PURGE_PROTECTED_REFERENCE_FINDING = 'archive-purge-protected-reference';

function guardsArchivePurgeReferences(plan) {
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

  return entry.action === 'purge' && entry.referencesFound.length > 0;
}

function buildsBlockedEntryResult(entry) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    runId: entry.runId,
    action: entry.action,
    findingCode: ARCHIVE_PURGE_PROTECTED_REFERENCE_FINDING,
    recommendedFix: `this archived run is protected by: ${entry.referencesFound.join(', ')}; remove the pin before purging`,
  };
}

module.exports = {
  ARCHIVE_PURGE_PROTECTED_REFERENCE_FINDING,
  guardsArchivePurgeReferences,
};
