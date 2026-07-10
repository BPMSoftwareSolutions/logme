const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const MISSING_RESPONSIBILITY_FINDING = 'body-contract-missing-responsibility';

function promotesBodyContractPatch(declaredContract, bodyContractPatch) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const promotableEntries = selectsPromotableEntries(bodyContractPatch);
  const skippedEntries = selectsSkippedEntries(bodyContractPatch, declaredContract);
  const updatedContract = appliesEntriesToContract(declaredContract, promotableEntries);

  return {
    updatedContract,
    promotedPaths: promotableEntries.map(readsPath),
    skippedEntries,
  };
}

function selectsPromotableEntries(bodyContractPatch) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const promotableEntries = [];
  for (const entry of bodyContractPatch.entries || []) {
    if ((entry.findingCodes || []).includes(MISSING_RESPONSIBILITY_FINDING)) {
      continue;
    }

    promotableEntries.push(entry);
  }

  return promotableEntries;
}

function selectsSkippedEntries(bodyContractPatch, declaredContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const declaredFiles = new Set(declaredContract.requiredPaths.files || []);
  const skippedEntries = [];

  for (const entry of bodyContractPatch.entries || []) {
    if ((entry.findingCodes || []).includes(MISSING_RESPONSIBILITY_FINDING)) {
      skippedEntries.push({ path: entry.path, reason: 'unresolved: missing responsibility, not eligible for promotion' });
      continue;
    }

    if (declaredFiles.has(entry.path)) {
      skippedEntries.push({ path: entry.path, reason: 'already declared in the contract' });
    }
  }

  return skippedEntries;
}

function appliesEntriesToContract(declaredContract, promotableEntries) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const updatedContract = clonesContract(declaredContract);
  const declaredFiles = new Set(updatedContract.requiredPaths.files);
  const ownedRuntime = new Set(updatedContract.owns.runtime);
  const declaredBodies = updatedContract.declaredBodies || [];

  for (const entry of promotableEntries) {
    if (!declaredFiles.has(entry.path)) {
      updatedContract.requiredPaths.files.push(entry.path);
      declaredFiles.add(entry.path);
    }

    addsOwnedRuntimeEntry(ownedRuntime, updatedContract.owns.runtime, entry.path);
    declaredBodies.push(buildsDeclaredBodyEntry(entry));
  }

  updatedContract.requiredPaths.files.sort();
  updatedContract.owns.runtime.sort();
  updatedContract.declaredBodies = declaredBodies;

  return updatedContract;
}

function addsOwnedRuntimeEntry(ownedRuntimeSet, ownedRuntimeList, filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (ownedRuntimeSet.has(filePath)) {
    return;
  }

  ownedRuntimeSet.add(filePath);
  ownedRuntimeList.push(filePath);
}

function buildsDeclaredBodyEntry(entry) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    bodyId: entry.bodyId,
    path: entry.path,
    bodyKind: entry.bodyKind,
    actionVerb: entry.actionVerb,
    responsibility: entry.responsibility,
    featureIds: entry.featureIds || [],
    scenarioIds: entry.scenarioIds || [],
    allowedDependencies: entry.allowedDependencies || [],
    verification: entry.verification,
    decompositionStatus: entry.decompositionStatus,
  };
}

function clonesContract(declaredContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return JSON.parse(JSON.stringify(declaredContract));
}

function readsPath(entry) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return entry.path;
}

module.exports = {
  promotesBodyContractPatch,
};
