const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const DRAFT_FIELD_NAMES = [
  'bodyContractDraft',
  'executionPathDraft',
  'testPlanDraft',
  'telemetryRequirementsDraft',
  'receiptCoverageDraft',
];

const DRAFT_FIELD_FINDING_CODES = {
  bodyContractDraft: 'generated-harness-missing-body-contract',
  executionPathDraft: 'generated-harness-missing-body-contract',
  testPlanDraft: 'generated-harness-missing-testimony',
  telemetryRequirementsDraft: 'generated-harness-missing-testimony',
  receiptCoverageDraft: 'generated-harness-missing-receipt-coverage',
};

const VERIFICATION_LANGUAGE_PATTERN = /verified|observed|proven/iu;
const SELF_PROMOTION_PATTERN = /\bpromoted\b|self-conformance-proven|\bapproved\b|promotion\s*:\s*true/iu;
const PATH_LIKE_PATTERN = /(?:^|[\s"'])((?:src|contracts|evidence|docs|tests)\/[\w./-]+)/gu;

function collectsStringValues(value, collected) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (typeof value === 'string') {
    collected.push(value);
    return collected;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectsStringValues(item, collected);
    }
    return collected;
  }

  if (value !== null && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      collectsStringValues(value[key], collected);
    }
  }

  return collected;
}

function collectsAllDraftStrings(parsedOutput) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const collected = [];

  for (const fieldName of DRAFT_FIELD_NAMES) {
    collectsStringValues(parsedOutput[fieldName], collected);
  }

  return collected;
}

function buildsFinding(code, filePath, reason) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return { code, filePath, methodName: '', reason };
}

function findsMissingRequiredDraftFields(parsedOutput) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  function isDraftFieldMissing(fieldName) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    const value = parsedOutput[fieldName];
    return value === null || value === undefined;
  }

  function buildsMissingDraftFieldFinding(fieldName) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return buildsFinding(
      DRAFT_FIELD_FINDING_CODES[fieldName],
      '',
      `required draft field "${fieldName}" is missing from the generated harness output`,
    );
  }

  return DRAFT_FIELD_NAMES.filter(isDraftFieldMissing).map(buildsMissingDraftFieldFinding);
}

function findsForbiddenMutationPaths(parsedOutput, assignment) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const allowedMutationPaths = assignment.allowedMutationPaths || [];
  const candidatePaths = new Set();

  for (const draftString of collectsAllDraftStrings(parsedOutput)) {
    let match = PATH_LIKE_PATTERN.exec(draftString);
    while (match !== null) {
      candidatePaths.add(match[1]);
      match = PATH_LIKE_PATTERN.exec(draftString);
    }
  }

  function isPathAllowed(candidatePath) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    function isWithinAllowedPath(allowedPath) {
      if (process.env.LOGME_AUDIT === '1') {
        LogMe(sampleMethod);
      }

      return candidatePath.startsWith(allowedPath);
    }

    return allowedMutationPaths.some(isWithinAllowedPath);
  }

  function buildsForbiddenMutationFinding(candidatePath) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return buildsFinding(
      'llm-proposed-forbidden-mutation',
      candidatePath,
      `the proposal references path "${candidatePath}", which is outside the declared allowedMutationPaths`,
    );
  }

  function isPathForbidden(candidatePath) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return !isPathAllowed(candidatePath);
  }

  return Array.from(candidatePaths).filter(isPathForbidden).map(buildsForbiddenMutationFinding);
}

function findsVerificationClaimedWithoutTelemetry(parsedOutput) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const nonTelemetryStrings = [];
  collectsStringValues(parsedOutput.bodyContractDraft, nonTelemetryStrings);
  collectsStringValues(parsedOutput.executionPathDraft, nonTelemetryStrings);
  collectsStringValues(parsedOutput.testPlanDraft, nonTelemetryStrings);
  collectsStringValues(parsedOutput.receiptCoverageDraft, nonTelemetryStrings);

  function claimsVerificationLanguage(text) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return VERIFICATION_LANGUAGE_PATTERN.test(text);
  }

  const hasVerificationLanguage = nonTelemetryStrings.some(claimsVerificationLanguage);
  const telemetryRequirementsDraft = parsedOutput.telemetryRequirementsDraft;
  const hasTelemetryRequirements = telemetryRequirementsDraft !== null
    && telemetryRequirementsDraft !== undefined
    && Object.keys(telemetryRequirementsDraft).length > 0;

  if (hasVerificationLanguage && !hasTelemetryRequirements) {
    return [buildsFinding(
      'llm-claimed-verification-without-telemetry',
      '',
      'the proposal claims verification, observation, or proof without declaring telemetry requirements',
    )];
  }

  return [];
}

function findsInventedReceiptClaims(parsedOutput, assignment) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const receiptStrings = [];
  collectsStringValues(parsedOutput.receiptCoverageDraft, receiptStrings);
  const rootDir = assignment.rootDir || process.cwd();

  function findsExistingReceiptPath(receiptPathCandidate) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    if (!receiptPathCandidate.endsWith('.json') && !receiptPathCandidate.endsWith('.jsonl')) {
      return null;
    }

    const resolvedPath = path.resolve(rootDir, receiptPathCandidate);

    if (fs.existsSync(resolvedPath)) {
      return buildsFinding(
        'llm-invented-receipt',
        receiptPathCandidate,
        `the proposal claims receipt coverage at "${receiptPathCandidate}", which already exists before the harness has run`,
      );
    }

    return null;
  }

  const findings = [];
  for (const receiptString of receiptStrings) {
    const finding = findsExistingReceiptPath(receiptString);
    if (finding) {
      findings.push(finding);
    }
  }

  return findings;
}

function findsSelfPromotionClaims(parsedOutput) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  function claimsSelfPromotion(text) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return SELF_PROMOTION_PATTERN.test(text);
  }

  const hasSelfPromotionClaim = collectsAllDraftStrings(parsedOutput).some(claimsSelfPromotion);

  if (hasSelfPromotionClaim) {
    return [buildsFinding(
      'llm-promoted-itself',
      '',
      'the proposal contains a self-promotion or self-conformance-proven claim; only the verifier may promote a harness',
    )];
  }

  return [];
}

function findsLeaseDeclaredOutsideGeneratedHarnesses(assignment) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const allowedMutationPaths = assignment.allowedMutationPaths || [];

  function isOutsideGeneratedHarnesses(allowedPath) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return !allowedPath.startsWith('src/generated-harnesses/');
  }

  function buildsLeaseOutsideFinding(allowedPath) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return buildsFinding(
      'generated-harness-executed-outside-lease',
      allowedPath,
      `the assignment declared an allowed mutation path outside src/generated-harnesses/: "${allowedPath}"`,
    );
  }

  return allowedMutationPaths.filter(isOutsideGeneratedHarnesses).map(buildsLeaseOutsideFinding);
}

function findsNextProposalWithoutParentProof(assignment) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!assignment.parentSelfConformanceReceiptRef) {
    return [];
  }

  const rootDir = assignment.rootDir || process.cwd();
  const receiptPath = path.resolve(rootDir, assignment.parentSelfConformanceReceiptRef);

  if (!fs.existsSync(receiptPath)) {
    return [buildsFinding(
      'next-harness-proposal-without-parent-proof',
      assignment.parentSelfConformanceReceiptRef,
      'the assignment references a parent self-conformance receipt that does not exist on disk',
    )];
  }

  let receiptContent;

  try {
    receiptContent = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
  } catch {
    return [buildsFinding(
      'next-harness-proposal-without-parent-proof',
      assignment.parentSelfConformanceReceiptRef,
      'the referenced parent self-conformance receipt is not valid JSON',
    )];
  }

  const decision = receiptContent.promotionDecision && receiptContent.promotionDecision.decision;

  if (decision !== 'PROMOTED') {
    return [buildsFinding(
      'next-harness-proposal-without-parent-proof',
      assignment.parentSelfConformanceReceiptRef,
      `the referenced parent self-conformance receipt does not show a PROMOTED decision (found: ${decision})`,
    )];
  }

  return [];
}

function validatesGeneratedHarness(parsedOutput, assignment) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (parsedOutput.proposalStatus !== 'proposed') {
    return {
      isValid: false,
      findings: [buildsFinding(
        'generated-harness-missing-body-contract',
        '',
        'the LLM output was rejected as unparseable before validation could run',
      )],
    };
  }

  const findings = [
    ...findsMissingRequiredDraftFields(parsedOutput),
    ...findsForbiddenMutationPaths(parsedOutput, assignment),
    ...findsVerificationClaimedWithoutTelemetry(parsedOutput),
    ...findsInventedReceiptClaims(parsedOutput, assignment),
    ...findsSelfPromotionClaims(parsedOutput),
    ...findsLeaseDeclaredOutsideGeneratedHarnesses(assignment),
    ...findsNextProposalWithoutParentProof(assignment),
  ];

  return { isValid: findings.length === 0, findings };
}

module.exports = { validatesGeneratedHarness };
