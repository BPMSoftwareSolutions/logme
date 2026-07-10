const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { callsContractStewardWorker } = require('../calls-contract-steward-worker/calls-contract-steward-worker');

const BODY_CONTRACT_PATCH_SCHEMA_VERSION = 'body-contract-patch.proposal.v1';
const MISSING_RESPONSIBILITY_FINDING = 'body-contract-missing-responsibility';
const MISSING_BODY_CONTRACT_FINDING = 'file-body-contract-missing';
const VALID_BODY_KINDS = new Set(['product-domain body', 'package primitive', 'generated evidence', 'test body', 'scaffold or entrypoint', 'waiver']);
const VALID_DECOMPOSITION_STATUSES = new Set(['single-responsibility', 'decomposition-recommended', 'decomposition-not-needed']);
const RETRYABLE_FAILURE_TYPES = new Set(['provider-overloaded', 'rate-limit-error']);
const MAX_WORKER_CALL_ATTEMPTS = 3;
const RETRY_BACKOFF_MILLISECONDS = 1000;

async function proposesBodyContractPatch(config, analysisContract, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const callWorker = options.callWorker || callsContractStewardWorker;
  const sleepImpl = options.sleepImpl || sleepsForBackoff;
  const candidates = selectsMissingContractCandidates(analysisContract);
  const entries = [];

  for (const candidate of candidates) {
    const request = buildsContractRequest(candidate);
    const workerResult = await callsWorkerWithRetry(callWorker, request, options.callerOptions || {}, sleepImpl);
    entries.push(buildsEntryFromWorkerResult(candidate, workerResult));
  }

  return {
    schemaVersion: BODY_CONTRACT_PATCH_SCHEMA_VERSION,
    sourceRunId: analysisContract.runId,
    evidencePath: `quality/domain-remediation/${analysisContract.runId}/body-contract-patch.proposal.v1.json`,
    sourceArtifacts: {
      domainAnalysisContractPath: analysisContract.evidencePath,
    },
    summary: buildsPatchSummary(entries),
    entries,
  };
}

async function callsWorkerWithRetry(callWorker, request, callerOptions, sleepImpl) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let lastResult = null;

  for (let attempt = 1; attempt <= MAX_WORKER_CALL_ATTEMPTS; attempt += 1) {
    lastResult = await callWorker(request, callerOptions);

    if (!lastResult.callFailure || !RETRYABLE_FAILURE_TYPES.has(lastResult.callFailure.type)) {
      return lastResult;
    }

    if (attempt < MAX_WORKER_CALL_ATTEMPTS) {
      await sleepImpl(RETRY_BACKOFF_MILLISECONDS * attempt);
    }
  }

  return lastResult;
}

function sleepsForBackoff(milliseconds) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return new Promise(resolvesAfterDelay);

  function resolvesAfterDelay(resolve) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    setTimeout(resolve, milliseconds);
  }
}

function selectsMissingContractCandidates(analysisContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const candidates = [];
  for (const sourceFile of analysisContract.sourceFiles || []) {
    if ((sourceFile.findingCodes || []).includes(MISSING_BODY_CONTRACT_FINDING)) {
      candidates.push(sourceFile);
    }
  }

  return candidates;
}

function buildsContractRequest(candidate) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    filePath: candidate.filePath,
    executableMethodCount: candidate.executableMethodCount,
    responsibilityClusters: candidate.responsibilityClusters || [],
  };
}

function buildsEntryFromWorkerResult(candidate, workerResult) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (workerResult.callFailure) {
    return buildsUnresolvedEntry(candidate.filePath, `worker call failed: ${workerResult.callFailure.type} - ${workerResult.callFailure.message}`);
  }

  const parsed = parsesWorkerResponseText(workerResult.rawResponseText);
  if (!parsed) {
    const truncationNote = workerResult.finishReason === 'MAX_TOKENS' ? ' (response was truncated at the token limit)' : '';
    return buildsUnresolvedEntry(candidate.filePath, `worker response was not valid JSON${truncationNote}`);
  }

  const verification = verifiesProposedEntry(candidate, parsed);
  if (!verification.verified) {
    return buildsUnresolvedEntry(candidate.filePath, verification.reason, parsed);
  }

  return {
    bodyId: parsed.bodyId,
    path: candidate.filePath,
    bodyKind: parsed.bodyKind,
    actionVerb: parsed.actionVerb || null,
    responsibility: parsed.responsibility,
    featureIds: [],
    scenarioIds: [],
    allowedDependencies: parsed.allowedDependencies || [],
    verification: 'declared by contract steward worker; requires product-owner review before promotion into contracts/file-system-bodies/02_declared/logme.file-system-body.contract.v1.json',
    decompositionStatus: parsed.decompositionStatus,
    findingCodes: [],
    reasoningNote: parsed.bodyKind === 'waiver' ? parsed.waiverReason : parsed.responsibility,
  };
}

function parsesWorkerResponseText(rawResponseText) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!rawResponseText) {
    return null;
  }

  try {
    return JSON.parse(rawResponseText);
  } catch {
    return null;
  }
}

function verifiesProposedEntry(candidate, parsed) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!VALID_BODY_KINDS.has(parsed.bodyKind)) {
    return { verified: false, reason: `worker returned unsupported bodyKind "${parsed.bodyKind}"` };
  }

  if (!parsed.bodyId) {
    return { verified: false, reason: 'worker returned an empty bodyId' };
  }

  if (!parsed.responsibility || parsed.responsibility.trim().length === 0) {
    return { verified: false, reason: 'worker returned an empty responsibility' };
  }

  if (parsed.bodyKind === 'waiver' && (!parsed.waiverReason || parsed.waiverReason.trim().length === 0)) {
    return { verified: false, reason: 'worker declared bodyKind waiver but gave no waiverReason' };
  }

  if (parsed.bodyKind === 'product-domain body' && (!parsed.actionVerb || parsed.actionVerb.trim().length === 0)) {
    return { verified: false, reason: 'worker declared bodyKind product-domain body but gave no actionVerb' };
  }

  if (!VALID_DECOMPOSITION_STATUSES.has(parsed.decompositionStatus)) {
    return { verified: false, reason: `worker returned unsupported decompositionStatus "${parsed.decompositionStatus}"` };
  }

  const claimedMethodNames = collectsClaimedMethodNames(candidate);
  if (parsed.bodyKind === 'product-domain body' && claimedMethodNames.size === 0) {
    return { verified: false, reason: 'candidate has no known executable methods to ground a product-domain body claim' };
  }

  return { verified: true, reason: null };
}

function collectsClaimedMethodNames(candidate) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const methodNames = new Set();
  for (const cluster of candidate.responsibilityClusters || []) {
    for (const methodName of cluster.methodNames || []) {
      methodNames.add(methodName);
    }
  }

  return methodNames;
}

function buildsUnresolvedEntry(filePath, reason, parsed) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    bodyId: (parsed && parsed.bodyId) || null,
    path: filePath,
    bodyKind: null,
    actionVerb: null,
    responsibility: null,
    featureIds: [],
    scenarioIds: [],
    allowedDependencies: [],
    verification: null,
    decompositionStatus: null,
    findingCodes: [MISSING_RESPONSIBILITY_FINDING],
    reasoningNote: reason,
  };
}

function buildsPatchSummary(entries) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let resolvedCount = 0;
  let unresolvedCount = 0;

  for (const entry of entries) {
    if (entry.findingCodes.includes(MISSING_RESPONSIBILITY_FINDING)) {
      unresolvedCount += 1;
    } else {
      resolvedCount += 1;
    }
  }

  return {
    totalCandidates: entries.length,
    resolvedEntries: resolvedCount,
    unresolvedEntries: unresolvedCount,
  };
}

module.exports = {
  BODY_CONTRACT_PATCH_SCHEMA_VERSION,
  MISSING_RESPONSIBILITY_FINDING,
  proposesBodyContractPatch,
};
