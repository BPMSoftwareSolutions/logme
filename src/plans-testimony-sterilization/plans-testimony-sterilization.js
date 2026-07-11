const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { collectsUniqueTestimonyValues } = require('../../packages/logme-testimony-remediation-primitives/src/collects-unique-testimony-values');

const STERILIZATION_PLAN_SCHEMA_VERSION = 'testimony-sterilization-plan.v1';
const STERILIZATION_ACTIONS = Object.freeze({
  'audit boundary': 'summarize existing package boundary',
  'product-domain-native': 'replace testimony with native method identity',
  'product-domain-boundary-case': 'split ambiguous boundary case for product-owner decision',
  'package-boundary-summarized': 'summarize existing package boundary',
  'pure-utility-extract': 'extract pure utility to package boundary',
  'telemetry-infrastructure-suppress': 'suppress telemetry infrastructure from product proof',
  'generated-evidence-ignore': 'suppress telemetry infrastructure from product proof',
  'product-owner-review-required': 'split ambiguous boundary case for product-owner decision',
});

function resolvesSterilizationAction(classification) {
  if (process.env.LOGME_AUDIT === '1') LogMe(resolvesSterilizationAction);
  const nextAction = STERILIZATION_ACTIONS[classification.auditBoundary];
  if (!nextAction) throw new Error(`classification has no executable sterilization action: ${classification.auditBoundary}`);
  return nextAction;
}

function buildsSterilizationPlan(runId, backlogItem, classificationProposal, acceptance = {}) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsSterilizationPlan);
  if (acceptance.adversarialReviewVerdict !== 'PASS' || acceptance.productOwnerAccepted !== true) {
    throw new Error('an accepted classification proposal is required before sterilization planning');
  }
  const actions = [];
  for (let index = 0; index < classificationProposal.classifications.length; index += 1) {
    const classification = classificationProposal.classifications[index];
    const mutationPaths = [classification.sourcePath];
    if (classification.proposedPackagePath) mutationPaths.push(classification.proposedPackagePath);
    actions.push({
      contaminationId: `${backlogItem.packetId}--contamination-${String(index + 1).padStart(3, '0')}`,
      sourcePath: classification.sourcePath, sourceLineRange: classification.sourceLineRange, currentMethodName: classification.currentMethodName,
      auditBoundaryClassification: classification.auditBoundary, nextAction: resolvesSterilizationAction(classification),
      targetPackageOrProductBody: classification.proposedPackagePath || classification.callingProductDomainBody || classification.sourcePath,
      mutationPaths: collectsUniqueTestimonyValues(mutationPaths), blockedPaths: [...backlogItem.blockedMutationPaths],
      expectedProofChange: classification.expectedProofImpact || classification.recommendedRemediationAction,
      verificationCommand: backlogItem.requiredVerificationCommands[0],
      zeroContaminationAssertion: 'all eight product-domain contamination counts equal zero after deterministic verification',
      rollbackNote: classification.rollbackNote || 'revert only this accepted action and rerun the sterilization gate',
    });
  }
  return {
    schemaVersion: STERILIZATION_PLAN_SCHEMA_VERSION, packetId: backlogItem.packetId, sourceRunId: runId, status: 'accepted',
    evidencePath: `quality/domain-remediation/${runId}/testimony-accuracy/${backlogItem.packetId}.sterilization-plan.v1.json`,
    actions, reportOnlyFindingsAllowed: false,
  };
}

function projectsTestimonyRemediationStatus(contaminationItems, acceptedSterilizationPlan) {
  if (process.env.LOGME_AUDIT === '1') LogMe(projectsTestimonyRemediationStatus);
  const hasContamination = (contaminationItems || []).length > 0;
  const hasAcceptedPlan = acceptedSterilizationPlan && acceptedSterilizationPlan.status === 'accepted' && acceptedSterilizationPlan.actions.length > 0;
  if (hasContamination && !hasAcceptedPlan) {
    return {
      status: 'needs-remediation',
      findings: [{ code: 'testimony-remediation-report-without-action', recommendedFix: 'create or accept a Gemini sterilization plan with concrete mutation paths and verification commands' }],
    };
  }
  return { status: hasContamination ? 'remediation-planned' : 'no-contamination-observed', findings: [] };
}

module.exports = { STERILIZATION_ACTIONS, STERILIZATION_PLAN_SCHEMA_VERSION, buildsSterilizationPlan, projectsTestimonyRemediationStatus, resolvesSterilizationAction };
