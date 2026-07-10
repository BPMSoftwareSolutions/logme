const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { callsNamingDecompositionWorker } = require('../calls-naming-decomposition-worker/calls-naming-decomposition-worker');

const RENAME_PLAN_SCHEMA_VERSION = 'rename-plan.v1';
const ACTIONLESS_FILE_FINDING = 'executable-file-name-missing-action-verb';
const UNRESOLVED_CLASSIFICATION_FINDING = 'rename-plan-unresolved';
const VALID_CLASSIFICATIONS = new Set([
  'mechanical rename',
  'rename plus contract update',
  'decompose before rename',
  'package-contract exception',
  'product-owner review required',
]);
const RENAME_ELIGIBLE_CLASSIFICATIONS = new Set(['mechanical rename', 'rename plus contract update']);
const SEARCH_DIRECTORIES = ['src', 'tests', 'scripts', 'packages'];

async function proposesRenamePlan(config, analysisContract, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const callWorker = options.callWorker || callsNamingDecompositionWorker;
  const candidates = selectsActionlessCandidates(analysisContract);
  const entries = [];

  for (const candidate of candidates) {
    const request = buildsNamingRequest(candidate);
    const workerResult = await callWorker(request, options.callerOptions || {});
    entries.push(buildsEntryFromWorkerResult(config, candidate, workerResult));
  }

  return {
    schemaVersion: RENAME_PLAN_SCHEMA_VERSION,
    sourceRunId: analysisContract.runId,
    evidencePath: `quality/domain-remediation/${analysisContract.runId}/rename-plan.v1.json`,
    sourceArtifacts: {
      domainAnalysisContractPath: analysisContract.evidencePath,
    },
    summary: buildsRenamePlanSummary(entries),
    entries,
  };
}

function selectsActionlessCandidates(analysisContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const candidates = [];
  for (const sourceFile of analysisContract.sourceFiles || []) {
    if ((sourceFile.findingCodes || []).includes(ACTIONLESS_FILE_FINDING)) {
      candidates.push(sourceFile);
    }
  }

  return candidates;
}

function buildsNamingRequest(candidate) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    filePath: candidate.filePath,
    responsibilityClusterCount: (candidate.responsibilityClusters || []).length,
    responsibilityClusters: candidate.responsibilityClusters || [],
  };
}

function buildsEntryFromWorkerResult(config, candidate, workerResult) {
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

  const verification = verifiesProposedClassification(config, candidate, parsed);
  if (!verification.verified) {
    return buildsUnresolvedEntry(candidate.filePath, verification.reason, parsed);
  }

  const isRenameEligible = RENAME_ELIGIBLE_CLASSIFICATIONS.has(parsed.classification);
  const affectedTests = isRenameEligible ? findsAffectedTestPaths(config.rootDir, candidate.filePath) : [];
  const importSites = isRenameEligible ? findsImportSitePaths(config.rootDir, candidate.filePath) : [];

  return {
    currentPath: candidate.filePath,
    proposedPath: isRenameEligible ? parsed.proposedPath : null,
    classification: parsed.classification,
    actionVerb: isRenameEligible ? parsed.proposedActionVerb : null,
    responsibilityEvidence: parsed.responsibilityEvidence,
    importMigrationPlan: isRenameEligible ? importSites : [],
    affectedTests,
    findingCodes: [],
    reasoningNote: parsed.classificationReason,
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

function verifiesProposedClassification(config, candidate, parsed) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!VALID_CLASSIFICATIONS.has(parsed.classification)) {
    return { verified: false, reason: `worker returned unsupported classification "${parsed.classification}"` };
  }

  if (!parsed.classificationReason || parsed.classificationReason.trim().length === 0) {
    return { verified: false, reason: 'worker returned an empty classificationReason' };
  }

  const responsibilityClusterCount = (candidate.responsibilityClusters || []).length;

  if (parsed.classification === 'mechanical rename' && responsibilityClusterCount > 1) {
    return { verified: false, reason: `worker proposed mechanical rename but the file has ${responsibilityClusterCount} responsibility clusters; a mechanical rename is only allowed with exactly one` };
  }

  if (RENAME_ELIGIBLE_CLASSIFICATIONS.has(parsed.classification)) {
    if (!parsed.proposedPath || parsed.proposedPath.trim().length === 0) {
      return { verified: false, reason: 'worker proposed a rename classification but gave no proposedPath' };
    }

    if (!parsed.proposedActionVerb || parsed.proposedActionVerb.trim().length === 0) {
      return { verified: false, reason: 'worker proposed a rename classification but gave no proposedActionVerb' };
    }

    if (isNounOnlyProposedPath(config, parsed.proposedPath)) {
      return { verified: false, reason: `proposed path "${parsed.proposedPath}" is itself noun-only; a rename must not introduce another noun-only executable body` };
    }
  }

  if (!parsed.responsibilityEvidence || parsed.responsibilityEvidence.trim().length === 0) {
    return { verified: false, reason: 'worker returned an empty responsibilityEvidence' };
  }

  return { verified: true, reason: null };
}

function isNounOnlyProposedPath(config, proposedPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const stem = path.basename(proposedPath, '.js');
  const firstToken = stem.split('-')[0];
  const thirdPersonVerbForms = buildsThirdPersonVerbForms(config);
  return !thirdPersonVerbForms.has(firstToken);
}

function buildsThirdPersonVerbForms(config) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const baseVerbs = (config.domainContract && config.domainContract.domainVocabulary && config.domainContract.domainVocabulary.verbs) || [];
  const thirdPersonForms = new Set();

  for (const baseVerb of baseVerbs) {
    thirdPersonForms.add(`${baseVerb}s`);
  }

  return thirdPersonForms;
}

function findsAffectedTestPaths(rootDir, filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const stem = path.basename(filePath, '.js');
  const candidateTestPath = `tests/${stem}.test.js`;
  return fs.existsSync(path.join(rootDir, candidateTestPath)) ? [candidateTestPath] : [];
}

function findsImportSitePaths(rootDir, filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const stem = path.basename(filePath, '.js');
  const importSites = [];

  for (const searchDirectory of SEARCH_DIRECTORIES) {
    const searchRoot = path.join(rootDir, searchDirectory);
    if (!fs.existsSync(searchRoot)) {
      continue;
    }

    scansDirectoryForImportSites(rootDir, searchRoot, filePath, stem, importSites);
  }

  return importSites.sort();
}

function scansDirectoryForImportSites(rootDir, startPath, ownFilePath, stem, importSites) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  for (const entry of fs.readdirSync(startPath, { withFileTypes: true })) {
    const entryPath = path.join(startPath, entry.name);

    if (entry.isDirectory()) {
      scansDirectoryForImportSites(rootDir, entryPath, ownFilePath, stem, importSites);
      continue;
    }

    if (!entry.name.endsWith('.js')) {
      continue;
    }

    const relativePath = path.relative(rootDir, entryPath).replace(/\\/gu, '/');
    if (relativePath === ownFilePath) {
      continue;
    }

    const content = fs.readFileSync(entryPath, 'utf8');
    if (content.includes(`/${stem}'`) || content.includes(`/${stem}")`) || content.includes(`/${stem}"`)) {
      importSites.push(relativePath);
    }
  }
}

function buildsUnresolvedEntry(filePath, reason, parsed) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    currentPath: filePath,
    proposedPath: null,
    classification: (parsed && parsed.classification) || null,
    actionVerb: null,
    responsibilityEvidence: null,
    importMigrationPlan: [],
    affectedTests: [],
    findingCodes: [UNRESOLVED_CLASSIFICATION_FINDING],
    reasoningNote: reason,
  };
}

function buildsRenamePlanSummary(entries) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let resolvedCount = 0;
  let unresolvedCount = 0;

  for (const entry of entries) {
    if (entry.findingCodes.includes(UNRESOLVED_CLASSIFICATION_FINDING)) {
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
  RENAME_PLAN_SCHEMA_VERSION,
  UNRESOLVED_CLASSIFICATION_FINDING,
  proposesRenamePlan,
};
