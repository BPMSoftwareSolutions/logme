const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const LLM_QA_ASSIGNMENT_SCHEMA_VERSION = 'llm-qa-assignment.v1';
const LLM_HANDOFF_PACKET_SCHEMA_VERSION = 'llm-handoff-packet.v1';
const LLM_SEED_DATA_PROPOSAL_SCHEMA_VERSION = 'llm-seed-data-proposal.v1';
const LLM_END_USER_SESSION_SCHEMA_VERSION = 'llm-end-user-session.v1';
const ACCEPTANCE_REVIEW_SCHEMA_VERSION = 'acceptance-criteria-review.v1';
const QA_BUNDLE_MANIFEST_SCHEMA_VERSION = 'qa-evidence-bundle.manifest.v1';
const QA_GATE_DECISION_SCHEMA_VERSION = 'qa-gate-decision.v1';
const FEATURE_SUMMARY_SCHEMA_VERSION = 'llm-feature-scenario-conveyor-summary.v1';
const QUALITY_BUNDLE_ROOT = path.join('quality', 'end-user-test-bundles');
const DEFAULT_PROVIDER_NAME = 'Gemini';
const DEFAULT_MODEL_NAME = 'gemini-default';
const GUARDRAIL_FINDING_CODE = 'llm-end-user-testing-guardrail-violation';
const NOT_OBSERVED = 'not observed';

const REQUIRED_LLM_QA_ARTIFACTS = [
  'llm-qa-assignment.v1.json',
  'llm-handoff-packet.report.md',
  'llm-handoff-packet.v1.json',
  'llm-seed-data-proposal.v1.json',
  'seed-data.receipt.v1.json',
  'llm-end-user-session.v1.json',
  'end-user-test-session.md',
  'llm-user-experience.report.md',
  'acceptance-criteria-review.v1.json',
  'acceptance-criteria-review.report.md',
  'qa-evidence-bundle.manifest.v1.json',
  'qa-evidence-bundle.report.md',
  'qa-gate-decision.v1.json',
  'machine-environment.v1.json',
  'feature-proof-links.v1.json',
  'report-artifact-index.v1.json',
  'blocker-worklist.md',
  'screenshots.index.md',
];

const REQUIRED_HUMAN_REPORT_ARTIFACTS = [
  'executable-body-contract.report.md',
  'feature-execution.contract.v1.json',
  'method-execution-timeline.table.md',
  'method-call-evidence.report.md',
];

function formatsRepoRelativePath(rootDir, filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!filePath) {
    return NOT_OBSERVED;
  }

  if (!path.isAbsolute(filePath)) {
    return String(filePath).replace(/\\/gu, '/');
  }

  return path.relative(rootDir || process.cwd(), filePath).replace(/\\/gu, '/');
}

function buildsLlmQaBundlePath(rootDir, releaseCandidateId, qaRunId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return path.join(rootDir || process.cwd(), QUALITY_BUNDLE_ROOT, releaseCandidateId, qaRunId);
}

function readsTextFile(filePath, fallback = '') {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!filePath || !fs.existsSync(filePath)) {
    return fallback;
  }

  return fs.readFileSync(filePath, 'utf8');
}

function writesJsonArtifact(artifactPath, content) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  fs.mkdirSync(path.dirname(artifactPath), { recursive: true });
  fs.writeFileSync(artifactPath, `${JSON.stringify(content, null, 2)}\n`, 'utf8');
  return artifactPath;
}

function writesMarkdownArtifact(artifactPath, content) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  fs.mkdirSync(path.dirname(artifactPath), { recursive: true });
  fs.writeFileSync(artifactPath, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
  return artifactPath;
}

function redactsSensitiveText(value) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return String(value || '')
    .replace(/(token|api[_-]?key|password|secret)\s*[:=]\s*([^&\s]+)/giu, '$1=[REDACTED]')
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/gu, 'Bearer [REDACTED]');
}

function hashesFile(filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function requiresField(record, field, recordName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!Object.prototype.hasOwnProperty.call(record, field) || record[field] === undefined || record[field] === null) {
    throw new Error(`${recordName} requires field "${field}"`);
  }
}

function buildsLlmQaAssignment(options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  for (const field of ['releaseCandidateId', 'qaRunId', 'featureId', 'scenarioId', 'scenarioName', 'acceptanceSourcePath', 'acceptanceSourceLineRange']) {
    requiresField(options, field, 'buildsLlmQaAssignment');
  }

  const rootDir = options.rootDir || process.cwd();

  return {
    schemaVersion: LLM_QA_ASSIGNMENT_SCHEMA_VERSION,
    releaseCandidateId: options.releaseCandidateId,
    qaRunId: options.qaRunId,
    featureId: options.featureId,
    scenarioId: options.scenarioId,
    scenarioName: options.scenarioName,
    acceptanceSourcePath: formatsRepoRelativePath(rootDir, options.acceptanceSourcePath),
    acceptanceSourceLineRange: options.acceptanceSourceLineRange,
    requestedEndUserPersona: options.requestedEndUserPersona || 'adversarial product owner',
    allowedTestSurfaces: options.allowedTestSurfaces || ['CLI command', 'Markdown report review', 'HTML preview review'],
    allowedSeedDataPaths: options.allowedSeedDataPaths || [formatsRepoRelativePath(rootDir, path.join(buildsLlmQaBundlePath(rootDir, options.releaseCandidateId, options.qaRunId), 'seed-data'))],
    allowedEvidencePaths: options.allowedEvidencePaths || [formatsRepoRelativePath(rootDir, buildsLlmQaBundlePath(rootDir, options.releaseCandidateId, options.qaRunId))],
    forbiddenMutationPaths: options.forbiddenMutationPaths || ['src/', 'packages/', 'contracts/', 'docs/features/'],
    requiredHumanReportArtifacts: options.requiredHumanReportArtifacts || REQUIRED_HUMAN_REPORT_ARTIFACTS,
    providerName: options.providerName || DEFAULT_PROVIDER_NAME,
    modelName: options.modelName || DEFAULT_MODEL_NAME,
    allowsFixtureSeedData: options.allowsFixtureSeedData === true,
    assembledAt: options.assembledAt || new Date().toISOString(),
  };
}

function writesLlmQaAssignment(assignment, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const bundlePath = options.bundlePath || buildsLlmQaBundlePath(rootDir, assignment.releaseCandidateId, assignment.qaRunId);
  return writesJsonArtifact(path.join(bundlePath, 'llm-qa-assignment.v1.json'), assignment);
}

function readsAcceptanceSourceSlice(rootDir, assignment) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const acceptancePath = path.isAbsolute(assignment.acceptanceSourcePath)
    ? assignment.acceptanceSourcePath
    : path.join(rootDir, assignment.acceptanceSourcePath);
  const sourceLines = readsTextFile(acceptancePath).replace(/\r\n/g, '\n').split('\n');
  const start = Math.max(1, assignment.acceptanceSourceLineRange.start || 1);
  const end = Math.min(sourceLines.length, assignment.acceptanceSourceLineRange.end || sourceLines.length);
  return sourceLines.slice(start - 1, end).join('\n');
}

function readsBoundedReportContent(rootDir, reportPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const resolvedPath = path.isAbsolute(reportPath) ? reportPath : path.join(rootDir, reportPath);
  return {
    path: formatsRepoRelativePath(rootDir, resolvedPath),
    content: redactsSensitiveText(readsTextFile(resolvedPath, NOT_OBSERVED)),
  };
}

function readsUserFacingMarkdownReportPaths(rootDir, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (options.reviewedMarkdownReportPaths) {
    return options.reviewedMarkdownReportPaths;
  }

  const reportPath = path.join(rootDir, 'report.md');
  return fs.existsSync(reportPath) ? [reportPath] : [];
}

function readsReviewedMarkdownReports(rootDir, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const reports = [];

  for (const reportPath of readsUserFacingMarkdownReportPaths(rootDir, options)) {
    reports.push(readsBoundedReportContent(rootDir, reportPath));
  }

  return reports;
}

function readsReviewedHtmlPreviewRecords(rootDir, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const previews = [];

  for (const preview of options.reviewedHtmlPreviews || []) {
    const previewPath = preview.path || preview.generatedHtmlPathOrArtifactUrl || preview;
    previews.push({
      path: formatsRepoRelativePath(rootDir, previewPath),
      screenshotPath: preview.screenshotPath || NOT_OBSERVED,
      viewport: preview.viewport || NOT_OBSERVED,
      status: preview.status || preview.visualQaStatus || 'reviewed',
      blockerCode: preview.blockerCode || NOT_OBSERVED,
    });
  }

  return previews;
}

function buildsLlmHandoffPacket(assignment, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const proofReports = [];
  const domainAnalysisReports = [];

  for (const reportPath of options.currentProofReportPaths || []) {
    proofReports.push(readsBoundedReportContent(rootDir, reportPath));
  }

  for (const reportPath of options.currentDomainAnalysisReportPaths || []) {
    domainAnalysisReports.push(readsBoundedReportContent(rootDir, reportPath));
  }

  const packet = {
    schemaVersion: LLM_HANDOFF_PACKET_SCHEMA_VERSION,
    releaseCandidateId: assignment.releaseCandidateId,
    qaRunId: assignment.qaRunId,
    featureId: assignment.featureId,
    scenarioId: assignment.scenarioId,
    scenarioName: assignment.scenarioName,
    providerName: assignment.providerName,
    modelName: assignment.modelName,
    boundedContext: {
      featureGherkin: redactsSensitiveText(readsAcceptanceSourceSlice(rootDir, assignment)),
      acceptanceCriteria: options.acceptanceCriteria || [],
      currentProofReports: proofReports,
      currentDomainAnalysisReports: domainAnalysisReports,
      reviewedMarkdownReports: readsReviewedMarkdownReports(rootDir, options),
      reviewedHtmlPreviews: readsReviewedHtmlPreviewRecords(rootDir, options),
      targetUserSurfaceInstructions: options.targetUserSurfaceInstructions || assignment.allowedTestSurfaces,
      seedDataRules: [
        'seed data must be synthetic unless fixture data is explicitly allowed',
        'seed data writes must stay inside allowed seed data paths',
      ],
      evidenceBundleRequirements: REQUIRED_LLM_QA_ARTIFACTS,
      forbiddenActions: [
        'mutate outside allowed paths',
        'use secrets or personal data in seed data',
        'claim acceptance without evidence',
        'mark this LLM run as QA passed',
        'send external notifications',
      ],
      passFailReportingExpectations: 'report user-visible observations and link every pass or fail claim to evidence',
    },
    assembledAt: options.assembledAt || new Date().toISOString(),
  };

  return packet;
}

function rendersLlmHandoffPacketReport(packet) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    `# LLM QA Handoff Packet: ${packet.releaseCandidateId}`,
    '',
    `- Release candidate id: ${packet.releaseCandidateId}`,
    `- QA run id: ${packet.qaRunId}`,
    `- Feature id: ${packet.featureId}`,
    `- Scenario id: ${packet.scenarioId}`,
    `- Scenario name: ${packet.scenarioName}`,
    `- Provider: ${packet.providerName}`,
    `- Model: ${packet.modelName}`,
    '',
    '## Feature Gherkin',
    '',
    '```gherkin',
    packet.boundedContext.featureGherkin,
    '```',
    '',
    '## Acceptance Criteria',
    '',
  ];

  for (const criterion of packet.boundedContext.acceptanceCriteria) {
    lines.push(`- ${criterion}`);
  }

  if (packet.boundedContext.acceptanceCriteria.length === 0) {
    lines.push('- not declared');
  }

  lines.push('', '## Current Proof Reports', '');

  for (const report of packet.boundedContext.currentProofReports) {
    lines.push(`### ${report.path}`, '', report.content, '');
  }

  lines.push('', '## Current Domain Body Analysis', '');

  if (packet.boundedContext.currentDomainAnalysisReports.length === 0) {
    lines.push('- not attached');
  }

  for (const report of packet.boundedContext.currentDomainAnalysisReports) {
    lines.push(`### ${report.path}`, '', report.content, '');
  }

  lines.push('', '## Reviewed Markdown Report Surfaces', '');

  if (packet.boundedContext.reviewedMarkdownReports.length === 0) {
    lines.push('- not attached');
  }

  for (const report of packet.boundedContext.reviewedMarkdownReports) {
    lines.push(`### ${report.path}`, '', report.content, '');
  }

  lines.push('', '## Reviewed HTML Preview Surfaces', '');

  if (packet.boundedContext.reviewedHtmlPreviews.length === 0) {
    lines.push('- no HTML preview attached');
  }

  for (const preview of packet.boundedContext.reviewedHtmlPreviews) {
    lines.push(`- ${preview.path} (${preview.status}; screenshot: ${preview.screenshotPath}; viewport: ${preview.viewport})`);
  }

  lines.push('## Target User Surface Instructions', '');
  rendersBulletLinesInto(lines, packet.boundedContext.targetUserSurfaceInstructions);
  lines.push('', '## Seed Data Rules', '');
  rendersBulletLinesInto(lines, packet.boundedContext.seedDataRules);
  lines.push('', '## Forbidden Actions', '');
  rendersBulletLinesInto(lines, packet.boundedContext.forbiddenActions);
  lines.push(
    '',
    '## Pass And Fail Reporting',
    '',
    packet.boundedContext.passFailReportingExpectations,
    '',
  );

  return lines.join('\n');
}

function rendersBulletLinesInto(lines, values) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  for (const value of values || []) {
    lines.push(`- ${value}`);
  }
}

function writesLlmHandoffPacket(packet, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const bundlePath = options.bundlePath || buildsLlmQaBundlePath(rootDir, packet.releaseCandidateId, packet.qaRunId);
  writesJsonArtifact(path.join(bundlePath, 'llm-handoff-packet.v1.json'), packet);
  writesMarkdownArtifact(path.join(bundlePath, 'llm-handoff-packet.report.md'), rendersLlmHandoffPacketReport(packet));
  return bundlePath;
}

function buildsSeedProposal(assignment, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    schemaVersion: LLM_SEED_DATA_PROPOSAL_SCHEMA_VERSION,
    releaseCandidateId: assignment.releaseCandidateId,
    qaRunId: assignment.qaRunId,
    featureId: assignment.featureId,
    scenarioId: assignment.scenarioId,
    seedDataId: options.seedDataId || `${assignment.qaRunId}-seed-data`,
    purpose: options.purpose || 'No seed data required for this LLM QA run.',
    scenarioCoverage: options.scenarioCoverage || [assignment.scenarioId],
    recordsToCreate: options.recordsToCreate || [],
    filesToCreate: options.filesToCreate || [],
    expectedUserVisibleState: options.expectedUserVisibleState || 'No additional user-visible seed state required.',
    cleanupInstructions: options.cleanupInstructions || 'Remove the QA bundle seed-data directory after review if cleanup is requested.',
    allowedPaths: options.allowedPaths || assignment.allowedSeedDataPaths,
    privacyClassification: options.privacyClassification || 'synthetic',
    syntheticDataDeclaration: options.syntheticDataDeclaration || 'All proposed seed data is synthetic.',
  };
}

function detectsSensitiveSeedText(seedProposal) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return /(api[_-]?key|password|secret|bearer\s+[a-z0-9._~+/=-]+|ssn|social security)/iu.test(JSON.stringify(seedProposal));
}

function normalizesPathForComparison(value) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return String(value || '').replace(/\\/gu, '/').replace(/\/+$/u, '');
}

function isPathInsideAllowedPath(candidatePath, allowedPaths) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const normalizedCandidate = normalizesPathForComparison(candidatePath);

  for (const allowedPath of allowedPaths || []) {
    const normalizedAllowed = normalizesPathForComparison(allowedPath);

    if (normalizedCandidate === normalizedAllowed || normalizedCandidate.startsWith(`${normalizedAllowed}/`)) {
      return true;
    }
  }

  return false;
}

function validatesSeedProposal(seedProposal, assignment) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const blockerCodes = [];

  if (seedProposal.featureId !== assignment.featureId || seedProposal.scenarioId !== assignment.scenarioId) {
    blockerCodes.push('seed-data-not-tied-to-assigned-scenario');
  }

  if (seedProposal.privacyClassification !== 'synthetic' && assignment.allowsFixtureSeedData !== true) {
    blockerCodes.push('seed-data-not-synthetic');
  }

  if (!seedProposal.cleanupInstructions) {
    blockerCodes.push('seed-data-cleanup-missing');
  }

  if (!seedProposal.expectedUserVisibleState) {
    blockerCodes.push('seed-data-expected-state-missing');
  }

  if (detectsSensitiveSeedText(seedProposal)) {
    blockerCodes.push('seed-data-sensitive-content-detected');
  }

  for (const file of seedProposal.filesToCreate || []) {
    const filePath = file.path || file.filePath || file;

    if (!isPathInsideAllowedPath(filePath, assignment.allowedSeedDataPaths)) {
      blockerCodes.push('seed-data-write-outside-allowed-paths');
      break;
    }
  }

  return {
    approved: blockerCodes.length === 0,
    blockerCodes,
  };
}

function materializesSeedProposal(seedProposal, assignment, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const bundlePath = options.bundlePath || buildsLlmQaBundlePath(rootDir, assignment.releaseCandidateId, assignment.qaRunId);
  const seedDataPath = path.join(bundlePath, 'seed-data');
  const validation = validatesSeedProposal(seedProposal, assignment);
  const materializedFiles = [];

  writesJsonArtifact(path.join(bundlePath, 'llm-seed-data-proposal.v1.json'), seedProposal);

  if (validation.approved) {
    fs.mkdirSync(seedDataPath, { recursive: true });

    for (const file of seedProposal.filesToCreate || []) {
      const relativePath = file.path || file.filePath;
      const filePath = path.isAbsolute(relativePath) ? relativePath : path.join(rootDir, relativePath);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, file.content || '', 'utf8');
      materializedFiles.push(formatsRepoRelativePath(rootDir, filePath));
    }
  }

  const receipt = {
    schemaVersion: 'seed-data.receipt.v1',
    releaseCandidateId: assignment.releaseCandidateId,
    qaRunId: assignment.qaRunId,
    featureId: assignment.featureId,
    scenarioId: assignment.scenarioId,
    seedDataId: seedProposal.seedDataId,
    approved: validation.approved,
    blockerCodes: validation.blockerCodes,
    materializedSeedDataPath: formatsRepoRelativePath(rootDir, seedDataPath),
    materializedFiles,
    writtenAt: options.writtenAt || new Date().toISOString(),
  };

  writesJsonArtifact(path.join(bundlePath, 'seed-data.receipt.v1.json'), receipt);
  return receipt;
}

function checksLlmTestingAction(action, assignment) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const findings = [];
  const actionType = action.actionType || action.action || '';

  if (action.mutationPath && !isPathInsideAllowedPath(action.mutationPath, assignment.allowedSeedDataPaths.concat(assignment.allowedEvidencePaths))) {
    findings.push({ code: GUARDRAIL_FINDING_CODE, reason: 'mutation outside allowed paths' });
  }

  if (action.claimsQaPassed === true || /mark.*qa passed|promote/iu.test(actionType)) {
    findings.push({ code: GUARDRAIL_FINDING_CODE, reason: 'LLM attempted to promote its own run' });
  }

  if (action.sendsExternalNotification === true) {
    findings.push({ code: GUARDRAIL_FINDING_CODE, reason: 'external notification attempted before notification capability is approved' });
  }

  if (action.claimsAcceptanceWithoutEvidence === true) {
    findings.push({ code: GUARDRAIL_FINDING_CODE, reason: 'acceptance claim without evidence' });
  }

  return findings;
}

function buildsLlmEndUserSession(assignment, steps = [], options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    schemaVersion: LLM_END_USER_SESSION_SCHEMA_VERSION,
    releaseCandidateId: assignment.releaseCandidateId,
    qaRunId: assignment.qaRunId,
    featureId: assignment.featureId,
    scenarioId: assignment.scenarioId,
    scenarioName: assignment.scenarioName,
    steps: buildsLlmEndUserSessionSteps(steps, options),
  };
}

function buildsLlmEndUserSessionSteps(steps, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const sessionSteps = [];

  for (let index = 0; index < steps.length; index += 1) {
    const step = steps[index];
    sessionSteps.push({
      stepIndex: step.stepIndex || index + 1,
      action: step.action || NOT_OBSERVED,
      targetSurface: step.targetSurface || NOT_OBSERVED,
      inputUsed: redactsSensitiveText(step.inputUsed || NOT_OBSERVED),
      expectedResult: step.expectedResult || NOT_OBSERVED,
      observedResult: step.observedResult || NOT_OBSERVED,
      timestamp: step.timestamp || options.timestamp || new Date().toISOString(),
      screenshotOrOutputPath: step.screenshotOrOutputPath || NOT_OBSERVED,
      status: step.status || 'observed',
      evidencePaths: step.evidencePaths || [],
    });
  }

  return sessionSteps;
}

function rendersEndUserSessionNarrative(session) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    `# End User Test Session: ${session.releaseCandidateId}`,
    '',
    `- Release candidate id: ${session.releaseCandidateId}`,
    `- QA run id: ${session.qaRunId}`,
    `- Feature id: ${session.featureId}`,
    `- Scenario id: ${session.scenarioId}`,
    '',
    '| step | surface | action | expected | observed | status | evidence |',
    '| ---: | --- | --- | --- | --- | --- | --- |',
  ];

  for (const step of session.steps) {
    lines.push(`| ${step.stepIndex} | ${step.targetSurface} | ${step.action} | ${step.expectedResult} | ${step.observedResult} | ${step.status} | ${(step.evidencePaths || []).join(', ') || step.screenshotOrOutputPath} |`);
  }

  lines.push('');
  return lines.join('\n');
}

function writesLlmEndUserSession(session, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const bundlePath = options.bundlePath || buildsLlmQaBundlePath(rootDir, session.releaseCandidateId, session.qaRunId);
  writesJsonArtifact(path.join(bundlePath, 'llm-end-user-session.v1.json'), session);
  writesMarkdownArtifact(path.join(bundlePath, 'end-user-test-session.md'), rendersEndUserSessionNarrative(session));
  return bundlePath;
}

function buildsAcceptanceCriteriaReview(assignment, criteria = [], observations = [], options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const reviews = [];

  for (let index = 0; index < criteria.length; index += 1) {
    const criterion = criteria[index];
    const observation = observations[index] || {};
    const evidencePaths = observation.evidencePaths || [];
    const requestedStatus = observation.status || 'blocked';
    const status = requestedStatus === 'met' && evidencePaths.length === 0 ? 'blocked' : requestedStatus;

    reviews.push({
      criterionText: criterion,
      status,
      llmObservationSummary: observation.llmObservationSummary || observation.summary || 'No LLM observation recorded.',
      evidencePaths,
      blockerCode: status === 'met' ? NOT_OBSERVED : (observation.blockerCode || 'acceptance-criterion-not-evidence-backed'),
      recommendedFixRoute: status === 'met' ? 'none' : (observation.recommendedFixRoute || 'add executable evidence or adjust the implementation'),
    });
  }

  return {
    schemaVersion: ACCEPTANCE_REVIEW_SCHEMA_VERSION,
    releaseCandidateId: assignment.releaseCandidateId,
    qaRunId: assignment.qaRunId,
    featureId: assignment.featureId,
    scenarioId: assignment.scenarioId,
    criteria: reviews,
    reviewedAt: options.reviewedAt || new Date().toISOString(),
  };
}

function rendersAcceptanceCriteriaReview(review) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    `# Acceptance Criteria Review: ${review.releaseCandidateId}`,
    '',
    `- Release candidate id: ${review.releaseCandidateId}`,
    `- QA run id: ${review.qaRunId}`,
    `- Feature id: ${review.featureId}`,
    `- Scenario id: ${review.scenarioId}`,
    '',
    '| criterion | status | observation | evidence paths | blocker code | recommended fix route |',
    '| --- | --- | --- | --- | --- | --- |',
  ];

  for (const criterion of review.criteria) {
    lines.push(`| ${criterion.criterionText} | ${criterion.status} | ${criterion.llmObservationSummary} | ${criterion.evidencePaths.join(', ') || NOT_OBSERVED} | ${criterion.blockerCode} | ${criterion.recommendedFixRoute} |`);
  }

  lines.push('');
  return lines.join('\n');
}

function writesAcceptanceCriteriaReview(review, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const bundlePath = options.bundlePath || buildsLlmQaBundlePath(rootDir, review.releaseCandidateId, review.qaRunId);
  writesJsonArtifact(path.join(bundlePath, 'acceptance-criteria-review.v1.json'), review);
  writesMarkdownArtifact(path.join(bundlePath, 'acceptance-criteria-review.report.md'), rendersAcceptanceCriteriaReview(review));
  return bundlePath;
}

function rendersLlmUserExperienceReport(assignment, session, acceptanceReview, seedReceipt, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const passedCriteria = readsAcceptanceCriteriaByStatus(acceptanceReview.criteria, 'met');
  const failedCriteria = readsAcceptanceCriteriaOutsideStatus(acceptanceReview.criteria, 'met');

  return [
    `# LLM User Experience Report: ${assignment.releaseCandidateId}`,
    '',
    `- Release candidate id: ${assignment.releaseCandidateId}`,
    `- QA run id: ${assignment.qaRunId}`,
    `- Feature id: ${assignment.featureId}`,
    `- Scenario id: ${assignment.scenarioId}`,
    '',
    '## Executive User Experience Summary',
    '',
    options.executiveSummary || (failedCriteria.length === 0 ? 'The assigned scenario was testable from the allowed end-user surfaces.' : 'The assigned scenario has unresolved user-visible or evidence-backed blockers.'),
    '',
    '## Persona And Test Intent',
    '',
    `${assignment.requestedEndUserPersona} tested ${assignment.scenarioName}.`,
    '',
    '## Seed Data Used',
    '',
    `- Seed data status: ${seedReceipt.approved ? 'approved' : 'blocked'}`,
    `- Seed data path: ${seedReceipt.materializedSeedDataPath}`,
    '',
    '## User Journey Steps',
    '',
    rendersSessionStepList(session),
    '',
    '## Acceptance Criteria Review',
    '',
    `- Criteria met: ${passedCriteria.length}`,
    `- Criteria not met or blocked: ${failedCriteria.length}`,
    '',
    '## What Passed',
    '',
    passedCriteria.length === 0 ? '_None._' : rendersPassedAcceptanceCriteria(passedCriteria),
    '',
    '## What Failed',
    '',
    failedCriteria.length === 0 ? '_None._' : rendersFailedAcceptanceCriteria(failedCriteria),
    '',
    '## Confusing Or Risky Experience Points',
    '',
    options.riskyExperiencePoints || '_None recorded._',
    '',
    '## Evidence Links',
    '',
    rendersEvidenceLinks(acceptanceReview, session),
    '',
    '## Screenshots Or Output Links',
    '',
    rendersSessionOutputs(session),
    '',
    '## Accessibility Or Readability Observations',
    '',
    options.accessibilityObservations || '_No accessibility or readability blockers recorded._',
    '',
    '## Recommended Product Follow-Ups',
    '',
    options.recommendedFollowUps || '_No follow-ups recorded._',
    '',
  ].join('\n');
}

function readsAcceptanceCriteriaByStatus(criteria, status) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const matchingCriteria = [];

  for (const criterion of criteria || []) {
    if (criterion.status === status) {
      matchingCriteria.push(criterion);
    }
  }

  return matchingCriteria;
}

function readsAcceptanceCriteriaOutsideStatus(criteria, status) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const matchingCriteria = [];

  for (const criterion of criteria || []) {
    if (criterion.status !== status) {
      matchingCriteria.push(criterion);
    }
  }

  return matchingCriteria;
}

function rendersPassedAcceptanceCriteria(criteria) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [];

  for (const criterion of criteria) {
    lines.push(`- ${criterion.criterionText} (${criterion.evidencePaths.join(', ')})`);
  }

  return lines.join('\n');
}

function rendersFailedAcceptanceCriteria(criteria) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [];

  for (const criterion of criteria) {
    lines.push(`- ${criterion.criterionText} (${criterion.blockerCode})`);
  }

  return lines.join('\n');
}

function rendersSessionStepList(session) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!session.steps || session.steps.length === 0) {
    return '_No user journey steps recorded._';
  }

  const lines = [];

  for (const step of session.steps) {
    lines.push(`- Step ${step.stepIndex}: ${step.action} on ${step.targetSurface} observed ${step.observedResult}`);
  }

  return lines.join('\n');
}

function rendersEvidenceLinks(acceptanceReview, session) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const links = [];

  for (const criterion of acceptanceReview.criteria) {
    links.push(...criterion.evidencePaths);
  }

  for (const step of session.steps || []) {
    links.push(...(step.evidencePaths || []));
  }

  const uniqueLinks = [...new Set(links)];
  return uniqueLinks.length === 0 ? '_No evidence links recorded._' : rendersLinkLines(uniqueLinks);
}

function rendersSessionOutputs(session) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const outputs = [];

  for (const step of session.steps || []) {
    if (step.screenshotOrOutputPath && step.screenshotOrOutputPath !== NOT_OBSERVED) {
      outputs.push(step.screenshotOrOutputPath);
    }
  }

  return outputs.length === 0 ? '_No screenshots or outputs recorded._' : rendersLinkLines(outputs);
}

function rendersLinkLines(links) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [];

  for (const link of links) {
    lines.push(`- ${link}`);
  }

  return lines.join('\n');
}

function writesLlmUserExperienceReport(assignment, session, acceptanceReview, seedReceipt, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const bundlePath = options.bundlePath || buildsLlmQaBundlePath(rootDir, assignment.releaseCandidateId, assignment.qaRunId);
  return writesMarkdownArtifact(
    path.join(bundlePath, 'llm-user-experience.report.md'),
    rendersLlmUserExperienceReport(assignment, session, acceptanceReview, seedReceipt, options),
  );
}

function readsRequiredReportPaths(rootDir, assignment, options) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (options.requiredHumanReportPaths) {
    return options.requiredHumanReportPaths;
  }

  return [];
}

function checksRequiredHumanReports(rootDir, assignment, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const missing = [];

  for (const reportPath of readsRequiredReportPaths(rootDir, assignment, options)) {
    const resolvedPath = path.isAbsolute(reportPath) ? reportPath : path.join(rootDir, reportPath);

    if (!fs.existsSync(resolvedPath)) {
      missing.push(formatsRepoRelativePath(rootDir, resolvedPath));
    }
  }

  return missing;
}

function buildsLlmQaGateDecision(assignment, seedReceipt, acceptanceReview, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const blockerCodes = [];
  const missingHumanReports = checksRequiredHumanReports(rootDir, assignment, options);

  if (!seedReceipt.approved) {
    blockerCodes.push('llm-seed-data-not-approved');
  }

  if (missingHumanReports.length > 0) {
    blockerCodes.push('llm-qa-missing-human-proof-report');
  }

  for (const criterion of acceptanceReview.criteria || []) {
    if (criterion.status !== 'met' || criterion.evidencePaths.length === 0) {
      blockerCodes.push('llm-acceptance-criterion-not-evidence-backed');
      break;
    }
  }

  for (const blockerCode of options.blockerCodes || []) {
    blockerCodes.push(blockerCode);
  }

  const uniqueBlockerCodes = [...new Set(blockerCodes)];

  return {
    schemaVersion: QA_GATE_DECISION_SCHEMA_VERSION,
    releaseCandidateId: assignment.releaseCandidateId,
    qaRunId: assignment.qaRunId,
    featureId: assignment.featureId,
    scenarioId: assignment.scenarioId,
    qualityGateDecision: uniqueBlockerCodes.length === 0 ? 'QA passed' : 'BLOCKED',
    promotable: false,
    llmPromotionAllowed: false,
    blockerCount: uniqueBlockerCodes.length,
    blockerCodes: uniqueBlockerCodes,
    missingHumanReports,
    decidedAt: options.decidedAt || new Date().toISOString(),
  };
}

function writesMachineEnvironment(assignment, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const bundlePath = options.bundlePath || buildsLlmQaBundlePath(rootDir, assignment.releaseCandidateId, assignment.qaRunId);
  const environment = {
    schemaVersion: 'machine-environment.v1',
    releaseCandidateId: assignment.releaseCandidateId,
    qaRunId: assignment.qaRunId,
    featureId: assignment.featureId,
    scenarioId: assignment.scenarioId,
    nodeVersion: process.version,
    platform: process.platform,
    commandExecuted: redactsSensitiveText(options.commandExecuted || process.argv.join(' ')),
    capturedAt: options.capturedAt || new Date().toISOString(),
  };

  writesJsonArtifact(path.join(bundlePath, 'machine-environment.v1.json'), environment);
  return environment;
}

function writesLlmQaSupportArtifacts(assignment, gateDecision, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const bundlePath = options.bundlePath || buildsLlmQaBundlePath(rootDir, assignment.releaseCandidateId, assignment.qaRunId);
  const humanReportPaths = readsFormattedRequiredReportPaths(rootDir, assignment, options);
  const reviewedMarkdownReports = readsReportArtifactIndexMarkdownPaths(rootDir, humanReportPaths, options);
  const reviewedHtmlPreviews = readsReviewedHtmlPreviewRecords(rootDir, options);
  const screenshotRecords = readsScreenshotIndexRecords(options.session || options.steps || [], reviewedHtmlPreviews);
  const stakeholderNotificationDraftPath = readsStakeholderNotificationDraftPath(rootDir, bundlePath, assignment, gateDecision, options);

  writesJsonArtifact(path.join(bundlePath, 'qa-gate-decision.v1.json'), gateDecision);
  writesJsonArtifact(path.join(bundlePath, 'feature-proof-links.v1.json'), {
    schemaVersion: 'feature-proof-links.v1',
    releaseCandidateId: assignment.releaseCandidateId,
    qaRunId: assignment.qaRunId,
    featureId: assignment.featureId,
    scenarioId: assignment.scenarioId,
    proofReportPaths: humanReportPaths,
    reviewedMarkdownReports,
    reviewedHtmlPreviews: readsReviewedHtmlPreviewPaths(reviewedHtmlPreviews),
    missingReports: gateDecision.missingHumanReports,
  });
  writesJsonArtifact(path.join(bundlePath, 'report-artifact-index.v1.json'), {
    schemaVersion: 'report-artifact-index.v1',
    releaseCandidateId: assignment.releaseCandidateId,
    qaRunId: assignment.qaRunId,
    featureId: assignment.featureId,
    scenarioId: assignment.scenarioId,
    reviewedMarkdownReports,
    reviewedHtmlPreviews,
    screenshotIndexPath: 'screenshots.index.md',
    stakeholderNotificationDraftPath,
    externalNotificationSent: false,
  });
  writesMarkdownArtifact(path.join(bundlePath, 'blocker-worklist.md'), rendersLlmBlockerWorklist(assignment, gateDecision));
  writesMarkdownArtifact(path.join(bundlePath, 'screenshots.index.md'), rendersScreenshotsIndex(assignment, screenshotRecords));
  writesMarkdownArtifact(path.join(bundlePath, 'qa-evidence-bundle.report.md'), rendersLlmQaEvidenceBundleReport(assignment, gateDecision, {
    reviewedMarkdownReports,
    reviewedHtmlPreviews,
    screenshotRecords,
    stakeholderNotificationDraftPath,
    commandOrSurface: options.commandExecuted || readsSessionSurfaceSummary(options.session || options.steps || []),
  }));
}

function readsFormattedRequiredReportPaths(rootDir, assignment, options) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const formattedPaths = [];

  for (const reportPath of readsRequiredReportPaths(rootDir, assignment, options)) {
    formattedPaths.push(formatsRepoRelativePath(rootDir, path.isAbsolute(reportPath) ? reportPath : path.join(rootDir, reportPath)));
  }

  return formattedPaths;
}

function readsReportArtifactIndexMarkdownPaths(rootDir, humanReportPaths, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const markdownPaths = [...humanReportPaths];

  for (const report of readsReviewedMarkdownReports(rootDir, options)) {
    markdownPaths.push(report.path);
  }

  return [...new Set(markdownPaths)];
}

function readsReviewedHtmlPreviewPaths(reviewedHtmlPreviews) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const previewPaths = [];

  for (const preview of reviewedHtmlPreviews || []) {
    previewPaths.push(preview.path);
  }

  return previewPaths;
}

function readsScreenshotIndexRecords(sessionOrSteps, reviewedHtmlPreviews = []) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const steps = Array.isArray(sessionOrSteps) ? sessionOrSteps : (sessionOrSteps.steps || []);
  const screenshots = [];

  for (const step of steps) {
    if (step.screenshotOrOutputPath && step.screenshotOrOutputPath !== NOT_OBSERVED) {
      screenshots.push({
        path: step.screenshotOrOutputPath,
        viewport: NOT_OBSERVED,
        status: step.status || 'reviewed',
        blockerCode: step.blockerCode || NOT_OBSERVED,
      });
    }
  }

  for (const preview of reviewedHtmlPreviews) {
    if (preview.screenshotPath && preview.screenshotPath !== NOT_OBSERVED) {
      screenshots.push({
        path: preview.screenshotPath,
        viewport: preview.viewport,
        status: preview.status,
        blockerCode: preview.blockerCode,
      });
    }
  }

  return screenshots;
}

function rendersScreenshotsIndex(assignment, screenshots) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    `# Screenshots And Output Index: ${assignment.releaseCandidateId}`,
    '',
    `- Release candidate id: ${assignment.releaseCandidateId}`,
    `- QA run id: ${assignment.qaRunId}`,
    `- Feature id: ${assignment.featureId}`,
    `- Scenario id: ${assignment.scenarioId}`,
    '',
    '| screenshot or output path | viewport | status | blocker code |',
    '| --- | --- | --- | --- |',
  ];

  if (screenshots.length === 0) {
    lines.push(`| ${NOT_OBSERVED} | ${NOT_OBSERVED} | not inspected | ${NOT_OBSERVED} |`);
  }

  for (const screenshot of screenshots) {
    lines.push(`| ${screenshot.path} | ${screenshot.viewport || NOT_OBSERVED} | ${screenshot.status || 'reviewed'} | ${screenshot.blockerCode || NOT_OBSERVED} |`);
  }

  lines.push('');
  return lines.join('\n');
}

function readsStakeholderNotificationDraftPath(rootDir, bundlePath, assignment, gateDecision, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (shouldWriteStakeholderNotificationDraft(assignment, options)) {
    return formatsRepoRelativePath(rootDir, path.join(bundlePath, 'stakeholder-notification-draft.report.md'));
  }

  return NOT_OBSERVED;
}

function shouldWriteStakeholderNotificationDraft(assignment, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return options.prepareStakeholderNotificationDraft === true
    || assignment.scenarioId === 'prepare-future-notification-without-sending-it';
}

function readsSessionSurfaceSummary(sessionOrSteps) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const steps = Array.isArray(sessionOrSteps) ? sessionOrSteps : (sessionOrSteps.steps || []);
  const surfaces = [];

  for (const step of steps) {
    if (step.targetSurface && !surfaces.includes(step.targetSurface)) {
      surfaces.push(step.targetSurface);
    }
  }

  return surfaces.length === 0 ? NOT_OBSERVED : surfaces.join(', ');
}

function rendersLlmBlockerWorklist(assignment, gateDecision) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    `# Blocker Worklist: ${assignment.releaseCandidateId}`,
    '',
    `- Release candidate id: ${assignment.releaseCandidateId}`,
    `- QA run id: ${assignment.qaRunId}`,
    `- Feature id: ${assignment.featureId}`,
    `- Scenario id: ${assignment.scenarioId}`,
    '',
  ];

  if (gateDecision.blockerCodes.length === 0) {
    lines.push('_No blockers._', '');
    return lines.join('\n');
  }

  for (const blockerCode of gateDecision.blockerCodes) {
    lines.push(`- finding code: ${blockerCode}`);
  }

  lines.push('');
  return lines.join('\n');
}

function rendersLlmQaEvidenceBundleReport(assignment, gateDecision, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    `# LLM QA Evidence Bundle: ${assignment.releaseCandidateId}`,
    '',
    `- Release candidate id: ${assignment.releaseCandidateId}`,
    `- QA run id: ${assignment.qaRunId}`,
    `- Feature id: ${assignment.featureId}`,
    `- Scenario id: ${assignment.scenarioId}`,
    `- Quality gate decision: ${gateDecision.qualityGateDecision}`,
    `- LLM promotion allowed: ${gateDecision.llmPromotionAllowed}`,
    `- Blocker count: ${gateDecision.blockerCount}`,
    `- Command or surface used: ${options.commandOrSurface || NOT_OBSERVED}`,
    `- External notification sent: false`,
    '',
    '## Deterministic Gate Result',
    '',
    gateDecision.qualityGateDecision === 'QA passed'
      ? 'The deterministic evidence gate found no blockers. Promotion still remains outside the LLM.'
      : 'The deterministic evidence gate blocked this QA run.',
    '',
    '## Replay Sources',
    '',
    '- llm-qa-assignment.v1.json',
    '- llm-handoff-packet.report.md',
    '- seed-data.receipt.v1.json',
    '- llm-end-user-session.v1.json',
    '- end-user-test-session.md',
    '- llm-user-experience.report.md',
    '- acceptance-criteria-review.report.md',
    '- qa-gate-decision.v1.json',
    '- report-artifact-index.v1.json',
    '- screenshots.index.md',
    '',
    '## LLM Observations Versus Deterministic Gate',
    '',
    '- LLM observations live in llm-user-experience.report.md, llm-end-user-session.v1.json, and acceptance-criteria-review.v1.json.',
    '- Deterministic gate results live in qa-gate-decision.v1.json and are summarized above.',
    '- The LLM is not allowed to promote its own run.',
    '',
    '## Reviewed Markdown Reports',
    '',
  ];

  rendersBulletLinesInto(lines, options.reviewedMarkdownReports && options.reviewedMarkdownReports.length > 0
    ? options.reviewedMarkdownReports
    : [NOT_OBSERVED]);

  lines.push('', '## Reviewed HTML Previews', '');

  if (!options.reviewedHtmlPreviews || options.reviewedHtmlPreviews.length === 0) {
    lines.push('- no HTML preview attached');
  } else {
    for (const preview of options.reviewedHtmlPreviews) {
      lines.push(`- ${preview.path} (${preview.status}; screenshot: ${preview.screenshotPath}; viewport: ${preview.viewport})`);
    }
  }

  lines.push('', '## Screenshot Or Output Index', '');
  lines.push('- screenshots.index.md');

  if (options.screenshotRecords && options.screenshotRecords.length > 0) {
    for (const screenshot of options.screenshotRecords) {
      lines.push(`- ${screenshot.path}`);
    }
  }

  lines.push('', '## Stakeholder Notification Draft', '');

  if (options.stakeholderNotificationDraftPath && options.stakeholderNotificationDraftPath !== NOT_OBSERVED) {
    lines.push(`- Draft path: ${options.stakeholderNotificationDraftPath}`);
    lines.push('- Draft status: written for review only');
    lines.push('- External send status: no email or external notification was sent');
  } else {
    lines.push('- not requested for this scenario');
  }

  lines.push('');
  return lines.join('\n');
}

function buildsArtifactHashes(bundlePath, artifacts) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const hashes = {};

  for (const artifact of artifacts) {
    const artifactPath = path.join(bundlePath, artifact);

    if (fs.existsSync(artifactPath)) {
      hashes[artifact] = hashesFile(artifactPath);
    }
  }

  return hashes;
}

function writesLlmQaBundleManifest(assignment, gateDecision, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const bundlePath = options.bundlePath || buildsLlmQaBundlePath(rootDir, assignment.releaseCandidateId, assignment.qaRunId);
  const artifactsBeforeManifest = readsArtifactsBeforeManifest();
  const manifestPath = path.join(bundlePath, 'qa-evidence-bundle.manifest.v1.json');
  const partialManifest = {
    schemaVersion: QA_BUNDLE_MANIFEST_SCHEMA_VERSION,
    releaseCandidateId: assignment.releaseCandidateId,
    qaRunId: assignment.qaRunId,
    featureId: assignment.featureId,
    scenarioId: assignment.scenarioId,
    scenarioName: assignment.scenarioName,
    qaStatus: gateDecision.qualityGateDecision,
    qualityGateDecision: gateDecision.qualityGateDecision,
    blockerCodes: gateDecision.blockerCodes,
    artifacts: REQUIRED_LLM_QA_ARTIFACTS,
    contentHashes: buildsArtifactHashes(bundlePath, artifactsBeforeManifest),
    createdAt: options.createdAt || new Date().toISOString(),
  };

  writesJsonArtifact(manifestPath, partialManifest);
  const manifest = {
    ...partialManifest,
    contentHashes: {
      ...partialManifest.contentHashes,
      'qa-evidence-bundle.manifest.v1.json': hashesFile(manifestPath),
    },
  };
  writesJsonArtifact(manifestPath, manifest);
  return manifest;
}

function readsArtifactsBeforeManifest() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const artifacts = [];

  for (const artifact of REQUIRED_LLM_QA_ARTIFACTS) {
    if (artifact !== 'qa-evidence-bundle.manifest.v1.json') {
      artifacts.push(artifact);
    }
  }

  return artifacts;
}

function writesStakeholderNotificationDraft(assignment, gateDecision, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const bundlePath = options.bundlePath || buildsLlmQaBundlePath(rootDir, assignment.releaseCandidateId, assignment.qaRunId);
  return writesMarkdownArtifact(path.join(bundlePath, 'stakeholder-notification-draft.report.md'), [
    `# Stakeholder Notification Draft: ${assignment.releaseCandidateId}`,
    '',
    `- Release candidate id: ${assignment.releaseCandidateId}`,
    `- QA run id: ${assignment.qaRunId}`,
    `- Feature id: ${assignment.featureId}`,
    `- Scenario id: ${assignment.scenarioId}`,
    `- QA result: ${gateDecision.qualityGateDecision}`,
    `- Bundle path: ${formatsRepoRelativePath(rootDir, bundlePath)}`,
    `- Report path: ${formatsRepoRelativePath(rootDir, path.join(bundlePath, 'llm-user-experience.report.md'))}`,
    `- Blockers: ${gateDecision.blockerCodes.join(', ') || 'none'}`,
    `- Recommended next step: ${gateDecision.qualityGateDecision === 'QA passed' ? 'human reviewer may consider promotion' : 'resolve blockers before promotion'}`,
    '',
    '_Draft only. No external notification has been sent._',
    '',
  ].join('\n'));
}

function writesLlmEndUserTestingConveyorRun(options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const assignment = buildsLlmQaAssignment({ ...options, rootDir });
  const bundlePath = options.bundlePath || buildsLlmQaBundlePath(rootDir, assignment.releaseCandidateId, assignment.qaRunId);
  const handoffPacket = buildsLlmHandoffPacket(assignment, { ...options, rootDir });
  const seedProposal = options.seedProposal || buildsSeedProposal(assignment, options.seedData || {});
  const seedReceipt = materializesSeedProposal(seedProposal, assignment, { ...options, rootDir, bundlePath });
  const session = buildsLlmEndUserSession(assignment, options.steps || [], options);
  const acceptanceReview = buildsAcceptanceCriteriaReview(assignment, options.acceptanceCriteria || [], options.observations || [], options);
  const gateDecision = buildsLlmQaGateDecision(assignment, seedReceipt, acceptanceReview, { ...options, rootDir });

  writesLlmQaAssignment(assignment, { rootDir, bundlePath });
  writesLlmHandoffPacket(handoffPacket, { rootDir, bundlePath });
  writesLlmEndUserSession(session, { rootDir, bundlePath });
  writesAcceptanceCriteriaReview(acceptanceReview, { rootDir, bundlePath });
  writesLlmUserExperienceReport(assignment, session, acceptanceReview, seedReceipt, { ...options, rootDir, bundlePath });
  writesMachineEnvironment(assignment, { ...options, rootDir, bundlePath });
  writesLlmQaSupportArtifacts(assignment, gateDecision, { ...options, rootDir, bundlePath, session });

  if (shouldWriteStakeholderNotificationDraft(assignment, options)) {
    writesStakeholderNotificationDraft(assignment, gateDecision, { rootDir, bundlePath });
    writesLlmQaSupportArtifacts(assignment, gateDecision, { ...options, rootDir, bundlePath, session });
  }

  const manifest = writesLlmQaBundleManifest(assignment, gateDecision, { ...options, rootDir, bundlePath });

  return {
    bundlePath,
    assignment,
    handoffPacket,
    seedReceipt,
    session,
    acceptanceReview,
    gateDecision,
    manifest,
  };
}

function summarizesFeatureScenarioConveyorRuns(runs, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const summary = {
    schemaVersion: FEATURE_SUMMARY_SCHEMA_VERSION,
    releaseCandidateId: options.releaseCandidateId || (runs[0] && runs[0].assignment.releaseCandidateId),
    featureId: options.featureId || (runs[0] && runs[0].assignment.featureId),
    totalScenarios: runs.length,
    scenariosPassed: 0,
    scenariosFailed: 0,
    scenariosBlocked: 0,
    scenariosNotTestable: 0,
    seedDataSetsUsed: [],
    overallQualityGateDecision: 'QA passed',
    bundlePaths: [],
  };

  for (const run of runs) {
    if (run.gateDecision.qualityGateDecision === 'QA passed') {
      summary.scenariosPassed += 1;
    } else if (run.gateDecision.blockerCodes.includes('llm-acceptance-criterion-not-evidence-backed')) {
      summary.scenariosFailed += 1;
    } else {
      summary.scenariosBlocked += 1;
    }

    if (run.seedReceipt && run.seedReceipt.seedDataId) {
      summary.seedDataSetsUsed.push(run.seedReceipt.seedDataId);
    }

    summary.bundlePaths.push(run.bundlePath);
  }

  if (summary.scenariosFailed > 0 || summary.scenariosBlocked > 0 || summary.scenariosNotTestable > 0) {
    summary.overallQualityGateDecision = 'BLOCKED';
  }

  return summary;
}

module.exports = {
  DEFAULT_PROVIDER_NAME,
  GUARDRAIL_FINDING_CODE,
  REQUIRED_LLM_QA_ARTIFACTS,
  buildsAcceptanceCriteriaReview,
  buildsSeedProposal,
  buildsLlmEndUserSession,
  buildsLlmHandoffPacket,
  buildsLlmQaAssignment,
  buildsLlmQaBundlePath,
  buildsLlmQaGateDecision,
  checksLlmTestingAction,
  materializesSeedProposal,
  redactsSensitiveText,
  rendersAcceptanceCriteriaReview,
  rendersEndUserSessionNarrative,
  rendersLlmHandoffPacketReport,
  rendersLlmUserExperienceReport,
  summarizesFeatureScenarioConveyorRuns,
  validatesSeedProposal,
  writesAcceptanceCriteriaReview,
  writesLlmEndUserSession,
  writesLlmEndUserTestingConveyorRun,
  writesLlmHandoffPacket,
  writesLlmQaAssignment,
  writesLlmQaBundleManifest,
  writesLlmUserExperienceReport,
  writesStakeholderNotificationDraft,
};
