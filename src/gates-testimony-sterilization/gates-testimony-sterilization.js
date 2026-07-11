const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { normalizesTestimonyPath } = require('../../packages/logme-testimony-remediation-primitives/src/normalizes-testimony-path');
const { writesTestimonyJson } = require('../../packages/logme-testimony-remediation-primitives/src/reads-writes-testimony-json');

const STERILIZATION_RECEIPT_SCHEMA_VERSION = 'testimony-sterilization-receipt.v1';
const NOT_OBSERVED = 'not observed';

function readsProofMethodCalls(proofs) {
  if (process.env.LOGME_AUDIT === '1') LogMe(readsProofMethodCalls);
  const methodCalls = [];
  for (const proof of proofs || []) {
    for (const node of proof.observedExecutionTimeline || []) {
      for (const methodCall of node.methodCalls || []) methodCalls.push({ methodCall, node });
    }
  }
  return methodCalls;
}

function readsWorkspaceFindingCode(finding) {
  if (process.env.LOGME_AUDIT === '1') LogMe(readsWorkspaceFindingCode);
  return finding.code || finding.findingCode || NOT_OBSERVED;
}

function isProductDomainFinding(finding, auditScope = 'source-domain audit') {
  if (process.env.LOGME_AUDIT === '1') LogMe(isProductDomainFinding);
  const findingPath = normalizesTestimonyPath(finding.filePath || finding.sourcePath || '');
  const isSourceBody = findingPath.startsWith('src/') || findingPath.includes('/src/');
  const isCompleteWorkspaceBody = isSourceBody || findingPath.startsWith('scripts/') || findingPath.includes('/scripts/');
  const isInSelectedScope = auditScope === 'complete workspace audit' ? isCompleteWorkspaceBody : isSourceBody;
  return finding.auditBoundary !== 'package-boundary-summarized' && isInSelectedScope && !findingPath.includes('/packages/') && !findingPath.startsWith('packages/');
}

function hasNumericRange(lineRange) {
  if (process.env.LOGME_AUDIT === '1') LogMe(hasNumericRange);
  return lineRange && Number.isFinite(Number(lineRange.start)) && Number.isFinite(Number(lineRange.end));
}

function calculatesSterilizationContamination(proofs, workspaceFindings = [], options = {}) {
  if (process.env.LOGME_AUDIT === '1') LogMe(calculatesSterilizationContamination);
  const counts = {
    unnamedProductDomainNativeMethodCalls: 0, productDomainNativeCallsWithMethodKindNotObserved: 0,
    unclassifiedSilentMethodsInProductDomainBodies: 0, pureUtilityMethodsRemainingInsideProductDomainBodies: 0,
    packageUtilitiesExpandedAsProductMethodRows: 0, telemetryInfrastructureCallsShownAsProductMethodRows: 0,
    incompleteExecutableBodySourceRanges: 0, statusOrProofClaimsCitingMissingEvidence: 0,
  };
  for (const entry of readsProofMethodCalls(proofs)) {
    const methodCall = entry.methodCall;
    const boundary = methodCall.auditBoundary || 'product-domain-native';
    if (boundary === 'product-domain-native' && methodCall.methodName === NOT_OBSERVED) counts.unnamedProductDomainNativeMethodCalls += 1;
    if (boundary === 'product-domain-native' && methodCall.methodKind === NOT_OBSERVED) counts.productDomainNativeCallsWithMethodKindNotObserved += 1;
    const runtimePath = normalizesTestimonyPath(methodCall.runtimePath || '');
    if (boundary === 'package-boundary-summarized' || runtimePath.startsWith('packages/') || runtimePath.includes('/packages/')) counts.packageUtilitiesExpandedAsProductMethodRows += 1;
    if (boundary === 'telemetry-infrastructure-suppress' || methodCall.methodName === 'sampleMethod') counts.telemetryInfrastructureCallsShownAsProductMethodRows += 1;
    if (hasNumericRange(entry.node.sourceLineRange) && hasNumericRange(methodCall.sourceLineRange)
      && (Number(methodCall.sourceLineRange.start) < Number(entry.node.sourceLineRange.start) || Number(methodCall.sourceLineRange.end) > Number(entry.node.sourceLineRange.end))) {
      counts.incompleteExecutableBodySourceRanges += 1;
    }
  }
  for (const proof of proofs || []) {
    const blockerCodes = (proof.promotionDecision && proof.promotionDecision.blockerCodes) || [];
    for (const blockerCode of blockerCodes) {
      if (blockerCode === 'executable-body-source-range-incomplete') counts.incompleteExecutableBodySourceRanges += 1;
      if (/missing|without-json-proof|without-source-controlled-proof/u.test(blockerCode)) counts.statusOrProofClaimsCitingMissingEvidence += 1;
    }
  }
  for (const finding of workspaceFindings) {
    if (!isProductDomainFinding(finding, options.auditScope)) continue;
    const code = readsWorkspaceFindingCode(finding);
    if (code === 'local-method-without-testimony') counts.unclassifiedSilentMethodsInProductDomainBodies += 1;
    else if (code === 'anonymous-executable-method-detected') counts.unnamedProductDomainNativeMethodCalls += 1;
    else if (code === 'local-generic-utility-detected' || code === 'package-worthy-mechanic-inside-domain-body' || code === 'local-method-name-outside-domain-vocabulary') counts.pureUtilityMethodsRemainingInsideProductDomainBodies += 1;
    else if (code === 'unimplemented-stub-detected' || /missing-evidence|fact-without-json-proof|status-without-source-controlled-proof/u.test(code)) counts.statusOrProofClaimsCitingMissingEvidence += 1;
  }
  return counts;
}

function countsTotalContamination(contaminationCounts) {
  if (process.env.LOGME_AUDIT === '1') LogMe(countsTotalContamination);
  let total = 0;
  for (const count of Object.values(contaminationCounts)) total += count;
  return total;
}

function buildsNextSterilizationPacket(runId, packetId, contaminationCounts, iteration = 1) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsNextSterilizationPacket);
  const contaminationItems = [];
  for (const [contaminationType, count] of Object.entries(contaminationCounts)) {
    if (count > 0) contaminationItems.push({ contaminationType, count });
  }
  if (contaminationItems.length === 0) return null;
  return {
    packetId: `${packetId}--sterilization-${String(iteration).padStart(3, '0')}`, sourceRunId: runId, executor: 'gemini-worker-packet',
    reason: 'deterministic sterilization gate found residual product-domain contamination', contaminationItems,
    requiredOutcome: 'all contamination counts equal zero', status: 'needs-remediation',
  };
}

function buildsSterilizationReceipt(runId, packetId, proofs, workspaceFindings, options = {}) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsSterilizationReceipt);
  const contaminationCounts = calculatesSterilizationContamination(proofs, workspaceFindings, options);
  const totalContamination = countsTotalContamination(contaminationCounts);
  const requirements = {
    productDomainNativeCallsHaveAccurateMethodNames: contaminationCounts.unnamedProductDomainNativeMethodCalls === 0,
    productDomainNativeCallsHaveAccurateMethodKinds: contaminationCounts.productDomainNativeCallsWithMethodKindNotObserved === 0,
    pureUtilityCallsAreExtractedOrMapped: contaminationCounts.pureUtilityMethodsRemainingInsideProductDomainBodies === 0,
    packageBoundaryCallsAreSummarized: contaminationCounts.packageUtilitiesExpandedAsProductMethodRows === 0,
    telemetryInfrastructureIsSuppressed: contaminationCounts.telemetryInfrastructureCallsShownAsProductMethodRows === 0,
    executableBodySourceRangesCoverObservedWork: contaminationCounts.incompleteExecutableBodySourceRanges === 0,
    bodyContractEntriesMatchOwnershipBoundary: options.bodyContractMatches === true,
    affectedFeatureScenariosHaveRegeneratedProof: options.affectedFeatureScenariosRegenerated === true,
    noSilentProductDomainMethods: contaminationCounts.unclassifiedSilentMethodsInProductDomainBodies === 0,
    noProofClaimsCiteMissingEvidence: contaminationCounts.statusOrProofClaimsCitingMissingEvidence === 0,
  };
  let requirementsPass = true;
  for (const requirementPasses of Object.values(requirements)) {
    if (!requirementPasses) requirementsPass = false;
  }
  const sterilized = totalContamination === 0 && requirementsPass;
  const receiptPath = `quality/domain-remediation/${runId}/testimony-accuracy/${packetId}.sterilization-receipt.v1.json`;
  return {
    schemaVersion: STERILIZATION_RECEIPT_SCHEMA_VERSION, sourceRunId: runId, packetId, sterilizationReceiptPath: receiptPath,
    evaluatedAt: options.evaluatedAt || new Date().toISOString(), requirements, contaminationCounts, totalContamination,
    promotionDecision: sterilized ? 'PROMOTABLE' : 'BLOCKED', packetStatus: sterilized ? 'sterilized' : 'needs-remediation',
    scenarioStatus: sterilized ? 'sterilized' : 'needs-remediation', featureStatus: sterilized ? 'sterilized' : 'needs-remediation',
    nextRemediationPacket: sterilized ? null : buildsNextSterilizationPacket(runId, packetId, contaminationCounts, options.iteration || 1),
  };
}

function runsSterilizationGate(config, runId, packetId, proofs, workspaceFindings, options = {}) {
  if (process.env.LOGME_AUDIT === '1') LogMe(runsSterilizationGate);
  const receipt = buildsSterilizationReceipt(runId, packetId, proofs, workspaceFindings, options);
  const receiptPath = writesTestimonyJson(config.rootDir, receipt.sterilizationReceiptPath, receipt);
  return { receipt, receiptPath };
}

module.exports = { STERILIZATION_RECEIPT_SCHEMA_VERSION, buildsNextSterilizationPacket, buildsSterilizationReceipt, calculatesSterilizationContamination, countsTotalContamination, runsSterilizationGate };
