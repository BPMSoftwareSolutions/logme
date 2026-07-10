const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { callsPackageExtractionWorker } = require('../calls-package-extraction-worker/calls-package-extraction-worker');

const PACKAGE_EXTRACTION_PLAN_SCHEMA_VERSION = 'package-extraction-plan.report.v1';
const PACKAGE_EXTRACTION_CANDIDATE_CLASSIFICATION = 'package extraction candidate';
const UNGROUNDED_EXTRACTION_FINDING = 'package-extraction-ungrounded';
const VALID_CLASSIFICATIONS = new Set([
  'existing package',
  'new package',
  'retained domain body',
  'rejected extraction',
  'product-owner review required',
]);
const PACKAGE_TARGET_REQUIRED_CLASSIFICATIONS = new Set(['existing package', 'new package']);

async function proposesPackageExtractionPlan(config, sprawlContract, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const callWorker = options.callWorker || callsPackageExtractionWorker;
  const existingPackages = listsExistingPackageNames(config.rootDir);
  const candidates = selectsPackageExtractionCandidates(sprawlContract);
  const sections = [];

  for (const candidate of candidates) {
    const groundedMechanics = selectsGroundedMechanics(candidate);

    if (groundedMechanics.length === 0) {
      sections.push(buildsUngroundedSection(candidate.filePath));
      continue;
    }

    const request = buildsPackageExtractionRequest(candidate, existingPackages, groundedMechanics);
    const workerResult = await callWorker(request, options.callerOptions || {});
    sections.push(buildsSectionFromWorkerResult(candidate.filePath, existingPackages, workerResult));
  }

  return {
    schemaVersion: PACKAGE_EXTRACTION_PLAN_SCHEMA_VERSION,
    sourceRunId: sprawlContract.runId,
    evidencePath: `quality/domain-remediation/${sprawlContract.runId}/package-extraction-plan.v1.json`,
    reportPath: `quality/domain-remediation/${sprawlContract.runId}/package-extraction-plan.report.md`,
    sourceArtifacts: {
      domainSprawlContractPath: sprawlContract.evidencePath,
    },
    summary: buildsPlanSummary(sections),
    sections,
  };
}

function listsExistingPackageNames(rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const packagesDir = path.join(rootDir, 'packages');
  if (!fs.existsSync(packagesDir)) {
    return [];
  }

  const packageNames = [];
  for (const entry of fs.readdirSync(packagesDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      packageNames.push(entry.name);
    }
  }

  return packageNames.sort();
}

function selectsPackageExtractionCandidates(sprawlContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const candidates = [];
  for (const sourceFile of sprawlContract.sourceFiles || []) {
    if (sourceFile.classification === PACKAGE_EXTRACTION_CANDIDATE_CLASSIFICATION) {
      candidates.push(sourceFile);
    }
  }

  return candidates;
}

function selectsGroundedMechanics(candidate) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const groundedMechanics = [];
  for (const mechanic of candidate.genericMechanicCandidates || []) {
    if ((mechanic.methodNames || []).length > 0) {
      groundedMechanics.push(mechanic);
    }
  }

  return groundedMechanics;
}

function buildsPackageExtractionRequest(candidate, existingPackages, groundedMechanics) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    filePath: candidate.filePath,
    existingPackages,
    groundedMechanics,
  };
}

function buildsSectionFromWorkerResult(filePath, existingPackages, workerResult) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (workerResult.callFailure) {
    return buildsUnresolvedSection(filePath, `worker call failed: ${workerResult.callFailure.type} - ${workerResult.callFailure.message}`);
  }

  const parsed = parsesWorkerResponseText(workerResult.rawResponseText);
  if (!parsed) {
    const truncationNote = workerResult.finishReason === 'MAX_TOKENS' ? ' (response was truncated at the token limit)' : '';
    return buildsUnresolvedSection(filePath, `worker response was not valid JSON${truncationNote}`);
  }

  const verification = verifiesProposedClassification(existingPackages, parsed);
  if (!verification.verified) {
    return buildsUnresolvedSection(filePath, verification.reason, parsed);
  }

  return {
    filePath,
    classification: parsed.classification,
    targetPackage: PACKAGE_TARGET_REQUIRED_CLASSIFICATIONS.has(parsed.classification) ? parsed.targetPackage : null,
    extractedMethodNames: parsed.extractedMethodNames,
    domainCallSiteGuidance: parsed.domainCallSiteGuidance,
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

function verifiesProposedClassification(existingPackages, parsed) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!VALID_CLASSIFICATIONS.has(parsed.classification)) {
    return { verified: false, reason: `worker returned unsupported classification "${parsed.classification}"` };
  }

  if (!parsed.classificationReason || parsed.classificationReason.trim().length === 0) {
    return { verified: false, reason: 'worker returned an empty classificationReason' };
  }

  if (!parsed.domainCallSiteGuidance || parsed.domainCallSiteGuidance.trim().length === 0) {
    return { verified: false, reason: 'worker returned an empty domainCallSiteGuidance' };
  }

  if (!Array.isArray(parsed.extractedMethodNames) || parsed.extractedMethodNames.length === 0) {
    if (parsed.classification === 'existing package' || parsed.classification === 'new package') {
      return { verified: false, reason: 'worker proposed an extraction but named no extractedMethodNames' };
    }
  }

  if (parsed.classification === 'existing package') {
    if (!existingPackages.includes(parsed.targetPackage)) {
      return { verified: false, reason: `worker proposed existing package "${parsed.targetPackage}" but no such package exists under packages/` };
    }
  }

  if (parsed.classification === 'new package' && (!parsed.targetPackage || parsed.targetPackage.trim().length === 0)) {
    return { verified: false, reason: 'worker proposed a new package but gave no targetPackage name' };
  }

  return { verified: true, reason: null };
}

function buildsUngroundedSection(filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    filePath,
    classification: 'rejected extraction',
    targetPackage: null,
    extractedMethodNames: [],
    domainCallSiteGuidance: null,
    findingCodes: [UNGROUNDED_EXTRACTION_FINDING],
    reasoningNote: 'no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction',
  };
}

function buildsUnresolvedSection(filePath, reason, parsed) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    filePath,
    classification: (parsed && parsed.classification) || null,
    targetPackage: null,
    extractedMethodNames: [],
    domainCallSiteGuidance: null,
    findingCodes: [UNGROUNDED_EXTRACTION_FINDING],
    reasoningNote: reason,
  };
}

function buildsPlanSummary(sections) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let resolvedCount = 0;
  let unresolvedCount = 0;

  for (const section of sections) {
    if (section.findingCodes.includes(UNGROUNDED_EXTRACTION_FINDING)) {
      unresolvedCount += 1;
    } else {
      resolvedCount += 1;
    }
  }

  return {
    totalCandidates: sections.length,
    resolvedSections: resolvedCount,
    unresolvedSections: unresolvedCount,
  };
}

module.exports = {
  PACKAGE_EXTRACTION_PLAN_SCHEMA_VERSION,
  UNGROUNDED_EXTRACTION_FINDING,
  proposesPackageExtractionPlan,
};
