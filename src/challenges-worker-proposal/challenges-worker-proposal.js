const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const ADVERSARIAL_REVIEW_SCHEMA_VERSION = 'adversarial-review.v1';
const GENERIC_UTILITY_NAMES = new Set(['utils', 'helpers', 'common', 'shared', 'lib', 'misc']);
const SCENARIO_TIEOUT_UNSUPPORTED_FINDING = 'scenario-tieout-unsupported';
const HIGH_RISK = 'high';
const LOW_RISK = 'low';

function challengesScenarioTieOutProposal(tieOutProposal) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const objections = [];
  for (const mapping of tieOutProposal.mappings || []) {
    if ((mapping.findingCodes || []).includes(SCENARIO_TIEOUT_UNSUPPORTED_FINDING) || !mapping.evidenceCitation) {
      objections.push(buildsObjection('scenario mapping without evidence', mapping.filePath, HIGH_RISK, 'the mapping has no verified evidence citation and must not be promoted as-is'));
    }
  }

  return buildsPacketReview('scenario-tieout-worker', objections);
}

function challengesBodyContractPatch(bodyContractPatch) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const objections = [];
  for (const entry of bodyContractPatch.entries || []) {
    if (!entry.responsibility || !entry.verification) {
      objections.push(buildsObjection('contract patch that only lists paths', entry.path, HIGH_RISK, 'the entry is missing responsibility or verification and only declares a path'));
      continue;
    }

    if (entry.bodyKind === 'waiver') {
      objections.push(...challengesWaiverEntry(entry));
    }
  }

  return buildsPacketReview('contract-steward-worker', objections);
}

function challengesWaiverEntry(entry) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const missingFields = [];
  if (!entry.owner) missingFields.push('owner');
  if (!entry.reasoningNote && !entry.responsibility) missingFields.push('reason');
  if (!entry.expiry) missingFields.push('expiry');

  if (missingFields.length === 0) {
    return [];
  }

  return [buildsObjection('waiver without owner, reason, and expiry', entry.path, HIGH_RISK, `the waiver is missing: ${missingFields.join(', ')}`)];
}

function challengesRenamePlan(renamePlan) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const objections = [];
  const renameEligibleClassifications = new Set(['mechanical rename', 'rename plus contract update']);

  for (const entry of renamePlan.entries || []) {
    if (!renameEligibleClassifications.has(entry.classification) || !entry.proposedPath) {
      continue;
    }

    if (isGenericProposedName(entry.proposedPath)) {
      objections.push(buildsObjection('decomposition that creates generic names', entry.currentPath, HIGH_RISK, `proposed path "${entry.proposedPath}" uses a forbidden generic utility name`));
    }

    if ((entry.affectedTests || []).length === 0) {
      objections.push(buildsObjection('behavior change without test coverage', entry.currentPath, HIGH_RISK, 'the rename changes the file path with no affected test on record'));
    }
  }

  return buildsPacketReview('naming-and-decomposition-worker', objections);
}

function isGenericProposedName(proposedPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!proposedPath) {
    return false;
  }

  const tokens = proposedPath.toLowerCase().split(/[^a-z0-9]+/u);
  for (const token of tokens) {
    if (GENERIC_UTILITY_NAMES.has(token)) {
      return true;
    }
  }

  return false;
}

function challengesPackageExtractionPlan(packageExtractionPlan) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const objections = [];
  const extractionClassifications = new Set(['existing package', 'new package']);

  for (const section of packageExtractionPlan.sections || []) {
    if (!extractionClassifications.has(section.classification)) {
      continue;
    }

    if (!section.domainCallSiteGuidance || section.domainCallSiteGuidance.trim().length === 0) {
      objections.push(buildsObjection('package extraction that hides domain meaning', section.filePath, HIGH_RISK, 'the extraction has no domain call-site guidance, so call sites may lose domain language'));
    }
  }

  return buildsPacketReview('package-extraction-worker', objections);
}

function buildsObjection(risk, affectedPath, severity, reasoning) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return { risk, affectedPath, severity, reasoning };
}

function buildsPacketReview(packetId, objections) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const highRiskCount = countsSeverity(objections, HIGH_RISK);

  return {
    schemaVersion: ADVERSARIAL_REVIEW_SCHEMA_VERSION,
    packetId,
    objections,
    highRiskObjectionCount: highRiskCount,
    promotionVerdict: highRiskCount === 0 ? 'PROMOTABLE' : 'BLOCKED',
  };
}

function countsSeverity(objections, severity) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let count = 0;
  for (const objection of objections) {
    if (objection.severity === severity) {
      count += 1;
    }
  }

  return count;
}

module.exports = {
  ADVERSARIAL_REVIEW_SCHEMA_VERSION,
  HIGH_RISK,
  LOW_RISK,
  challengesScenarioTieOutProposal,
  challengesBodyContractPatch,
  challengesRenamePlan,
  challengesPackageExtractionPlan,
};
