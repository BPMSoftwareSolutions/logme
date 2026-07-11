const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { normalizesTestimonyPath } = require('../../packages/logme-testimony-remediation-primitives/src/normalizes-testimony-path');
const { collectsUniqueTestimonyValues } = require('../../packages/logme-testimony-remediation-primitives/src/collects-unique-testimony-values');
const { CLASSIFICATIONS, GEMINI_MODEL } = require('../calls-gemini-testimony-classifier/calls-gemini-testimony-classifier');

const CLASSIFICATION_SCHEMA_VERSION = 'testimony-classification.proposal.v1';
const PACKAGE_EXTRACTION_SCHEMA_VERSION = 'testimony-package-extraction.proposal.v1';
const PATCH_SCHEMA_VERSION = 'testimony-remediation-patch.proposal.v1';
const PROVIDER_USAGE_SCHEMA_VERSION = 'testimony-remediation-provider-usage.v1';

function validatesClassification(classification, handoff) {
  if (process.env.LOGME_AUDIT === '1') LogMe(validatesClassification);
  if (!CLASSIFICATIONS.includes(classification.auditBoundary)) throw new Error(`unsupported testimony classification: ${classification.auditBoundary}`);
  const sourcePath = normalizesTestimonyPath(classification.sourcePath);
  let sourceIsBounded = false;
  for (const slice of handoff.affectedSourceSlices) {
    if (normalizesTestimonyPath(slice.sourcePath) === sourcePath) sourceIsBounded = true;
  }
  if (!sourceIsBounded) throw new Error(`classification cites source outside bounded handoff: ${sourcePath}`);
}

function buildsClassificationProposal(handoff, workerResult) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsClassificationProposal);
  if (workerResult.callFailure) throw new Error(`Gemini testimony classification failed: ${workerResult.callFailure.type}: ${workerResult.callFailure.message}`);
  const parsed = JSON.parse(workerResult.rawResponseText);
  if (!Array.isArray(parsed.classifications)) throw new Error('Gemini testimony classification response must contain classifications[]');
  for (const classification of parsed.classifications) validatesClassification(classification, handoff);
  return {
    schemaVersion: CLASSIFICATION_SCHEMA_VERSION, packetId: handoff.packetId, featureId: handoff.featureId, scenarioId: handoff.scenarioId,
    implementationFilesMutated: false, classifications: parsed.classifications,
  };
}

function buildsProviderUsage(runId, handoff, workerResult, paths) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsProviderUsage);
  const usage = workerResult.usage || {};
  return {
    schemaVersion: PROVIDER_USAGE_SCHEMA_VERSION, provider: workerResult.provider || 'gemini', model: workerResult.model || GEMINI_MODEL,
    packetId: handoff.packetId, promptArtifactPath: paths.promptArtifactPath, responseArtifactPath: paths.responseArtifactPath,
    tokenEstimate: usage.totalTokenCount || usage.total_tokens || Math.ceil(Buffer.byteLength(JSON.stringify(handoff), 'utf8') / 4),
    retryCount: workerResult.retryCount || 0, fallbackReason: workerResult.fallbackReason || null, sourceRunId: runId,
  };
}

function buildsPackageExtractionProposal(runId, classificationProposal) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsPackageExtractionProposal);
  const extractionCandidates = [];
  for (const classification of classificationProposal.classifications) {
    if (classification.auditBoundary !== 'pure-utility-extract') continue;
    extractionCandidates.push({
      currentSourcePath: classification.sourcePath, currentMethodName: classification.inferredIntendedMethodName || classification.currentMethodName,
      proposedPackagePath: classification.proposedPackagePath || 'packages/<product-owner-selected-package>/',
      proposedPackageMethodName: classification.proposedPackageMethodName || classification.inferredIntendedMethodName,
      callingProductDomainBody: classification.callingProductDomainBody || classification.sourcePath, utilityReason: classification.reason,
      behaviorPreservingTests: classification.behaviorPreservingTests || ['npm test'],
      importMigrationPlan: classification.importMigrationPlan || 'replace the local call with an explicit package import after acceptance',
      packageLevelAuditOwner: classification.packageLevelAuditOwner || 'product owner must assign package audit ownership',
      rollbackNote: classification.rollbackNote || 'revert the accepted extraction patch and restore the original import',
    });
  }
  return { schemaVersion: PACKAGE_EXTRACTION_SCHEMA_VERSION, packetId: classificationProposal.packetId, sourceRunId: runId, extractionCandidates };
}

function buildsProductOwnerReview(classificationProposal) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsProductOwnerReview);
  const reviewRows = [];
  for (const classification of classificationProposal.classifications) {
    if (!['product-domain-boundary-case', 'product-owner-review-required'].includes(classification.auditBoundary)) continue;
    reviewRows.push({
      candidateMethod: classification.inferredIntendedMethodName || classification.currentMethodName,
      competingClassifications: classification.competingClassifications || ['product-domain-native', 'pure-utility-extract'],
      productMeaningArgument: classification.productMeaningArgument || classification.reason,
      utilityExtractionArgument: classification.utilityExtractionArgument || 'requires product-owner judgment',
      expectedProofImpact: classification.expectedProofImpact || 'changes whether the call is expanded in product method drill-down', reviewerDecisionNeeded: true,
    });
  }
  return reviewRows;
}

function checksChangedPaths(backlogItem, classificationProposal) {
  if (process.env.LOGME_AUDIT === '1') LogMe(checksChangedPaths);
  const proposedPaths = [];
  for (const classification of classificationProposal.classifications) proposedPaths.push(classification.sourcePath);
  const changedPaths = collectsUniqueTestimonyValues(proposedPaths);
  for (const changedPath of changedPaths) {
    let allowed = false;
    for (const allowedPath of backlogItem.allowedMutationPaths) {
      if (normalizesTestimonyPath(changedPath).startsWith(normalizesTestimonyPath(allowedPath))) allowed = true;
    }
    if (!allowed) throw new Error(`classification proposes a changed path outside the packet allowlist: ${changedPath}`);
    for (const blockedPath of backlogItem.blockedMutationPaths) {
      if (normalizesTestimonyPath(changedPath).startsWith(normalizesTestimonyPath(blockedPath))) throw new Error(`classification proposes a changed path under a blocked path: ${changedPath}`);
    }
  }
  return changedPaths;
}

function buildsPatchProposal(runId, backlogItem, classificationProposal, review) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsPatchProposal);
  if (!review || review.adversarialReviewVerdict !== 'PASS' || review.productOwnerAccepted !== true) {
    throw new Error('classification must pass adversarial review and product-owner acceptance before patch proposal generation');
  }
  if (buildsProductOwnerReview(classificationProposal).length > 0 && !review.boundaryCaseDecisions) {
    throw new Error('boundary cases require explicit product-owner decisions before patch proposal generation');
  }
  const changedPaths = checksChangedPaths(backlogItem, classificationProposal);
  const testimonyReplacements = [];
  for (const classification of classificationProposal.classifications) {
    if (classification.auditBoundary !== 'product-domain-native') continue;
    testimonyReplacements.push({
      sourcePath: classification.sourcePath, sourceLineRange: classification.sourceLineRange,
      from: `LogMe(${classification.currentMethodName})`, to: `LogMe(${classification.inferredIntendedMethodName})`, preservesProductDomainName: true,
    });
  }
  return {
    schemaVersion: PATCH_SCHEMA_VERSION, packetId: backlogItem.packetId, sourceRunId: runId, changedPaths, testimonyReplacements,
    packageExtractionChanges: buildsPackageExtractionProposal(runId, classificationProposal).extractionCandidates,
    importUpdates: [], bodyContractUpdates: [], featureAndScenarioTieOutUpdates: [],
    expectedBeforeMetrics: { unnamedProductMethodCalls: backlogItem.unnamedMethodCallCount, sampleMethodTelemetryEvents: backlogItem.repeatedSampleMethodEventCount },
    expectedAfterMetrics: { unnamedProductMethodCalls: 0, sampleMethodTelemetryEvents: 0 },
    verificationCommands: backlogItem.requiredVerificationCommands, blockedPaths: backlogItem.blockedMutationPaths, historicalEvidenceMutationAllowed: false,
  };
}

module.exports = {
  CLASSIFICATION_SCHEMA_VERSION, PACKAGE_EXTRACTION_SCHEMA_VERSION, PATCH_SCHEMA_VERSION, PROVIDER_USAGE_SCHEMA_VERSION,
  buildsClassificationProposal, buildsPackageExtractionProposal, buildsPatchProposal, buildsProductOwnerReview, buildsProviderUsage,
};
