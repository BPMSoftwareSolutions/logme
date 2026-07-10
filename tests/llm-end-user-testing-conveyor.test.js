const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  DEFAULT_PROVIDER_NAME,
  GUARDRAIL_FINDING_CODE,
  REQUIRED_LLM_QA_ARTIFACTS,
  buildsLlmQaAssignment,
  checksLlmTestingAction,
  summarizesFeatureScenarioConveyorRuns,
  validatesSeedProposal,
  writesLlmEndUserTestingConveyorRun,
} = require('../src/llm-end-user-testing-conveyor/llm-end-user-testing-conveyor');

function writesFeatureFile(rootDir) {
  const featuresRoot = path.join(rootDir, 'docs', 'features');
  const featurePath = path.join(featuresRoot, 'llm-end-user-testing-conveyor.feature.md');
  fs.mkdirSync(featuresRoot, { recursive: true });
  fs.writeFileSync(featurePath, [
    '```gherkin',
    'Feature: LLM end-user testing conveyor',
    '',
    '  Scenario: Assign a feature scenario to the LLM testing conveyor',
    '    Given a committed feature scenario exists under `docs/features/`',
    '    When the LLM end-user testing conveyor starts',
    '    Then it should create an LLM QA assignment',
    '```',
    '',
  ].join('\n'), 'utf8');
  return featurePath;
}

function writesProofReports(rootDir) {
  const proofRoot = path.join(rootDir, 'evidence', 'runs', 'proof-run-1', 'features', 'llm-end-user-testing-conveyor', 'scenarios', 'assign-a-feature-scenario-to-the-llm-testing-conveyor');
  fs.mkdirSync(proofRoot, { recursive: true });
  fs.writeFileSync(path.join(proofRoot, 'executable-body-contract.report.md'), '# Proof\n\nNo token=secret-value should leak.\n', 'utf8');
  fs.writeFileSync(path.join(proofRoot, 'feature-execution.contract.v1.json'), '{"status":"proven"}\n', 'utf8');
  fs.writeFileSync(path.join(proofRoot, 'method-execution-timeline.table.md'), '| method |\n| --- |\n', 'utf8');
  fs.writeFileSync(path.join(proofRoot, 'method-call-evidence.report.md'), '# Method evidence\n', 'utf8');
  return [
    path.join(proofRoot, 'executable-body-contract.report.md'),
    path.join(proofRoot, 'feature-execution.contract.v1.json'),
    path.join(proofRoot, 'method-execution-timeline.table.md'),
    path.join(proofRoot, 'method-call-evidence.report.md'),
  ];
}

function writesDomainAnalysisReport(rootDir) {
  const analysisRoot = path.join(rootDir, 'evidence', 'runs', 'proof-run-1', 'domain-analysis');
  fs.mkdirSync(analysisRoot, { recursive: true });
  fs.writeFileSync(path.join(analysisRoot, 'domain-body-analysis.report.md'), [
    '# Domain Body Analysis Report',
    '',
    '- Executable file names missing action verb: 0',
    '- Files missing body contract: 0',
    '- Files missing scenario tie-out: 0',
    '',
  ].join('\n'), 'utf8');
  return path.join(analysisRoot, 'domain-body-analysis.report.md');
}

function buildsRunOptions(rootDir, overrides = {}) {
  const featurePath = writesFeatureFile(rootDir);
  const proofReports = writesProofReports(rootDir);
  const domainAnalysisReport = writesDomainAnalysisReport(rootDir);

  return {
    rootDir,
    releaseCandidateId: 'rc-llm-1',
    qaRunId: 'qa-run-1',
    featureId: 'llm-end-user-testing-conveyor',
    scenarioId: 'assign-a-feature-scenario-to-the-llm-testing-conveyor',
    scenarioName: 'Assign a feature scenario to the LLM testing conveyor',
    acceptanceSourcePath: featurePath,
    acceptanceSourceLineRange: { start: 2, end: 7 },
    acceptanceCriteria: [
      'assignment contains release candidate, run, feature, scenario, provider, model, surfaces, and paths',
    ],
    currentProofReportPaths: proofReports,
    currentDomainAnalysisReportPaths: [domainAnalysisReport],
    requiredHumanReportPaths: proofReports,
    steps: [{
      action: 'open generated assignment',
      targetSurface: 'Markdown report review',
      inputUsed: 'cat llm-qa-assignment.v1.json',
      expectedResult: 'assignment fields are present',
      observedResult: 'assignment fields are present',
      timestamp: '2026-07-09T12:00:00.000Z',
      screenshotOrOutputPath: 'quality/end-user-test-bundles/rc-llm-1/qa-run-1/llm-qa-assignment.v1.json',
      status: 'passed',
      evidencePaths: ['quality/end-user-test-bundles/rc-llm-1/qa-run-1/llm-qa-assignment.v1.json'],
    }],
    observations: [{
      status: 'met',
      llmObservationSummary: 'The assignment artifact includes the required user-facing fields.',
      evidencePaths: ['quality/end-user-test-bundles/rc-llm-1/qa-run-1/llm-qa-assignment.v1.json'],
    }],
    seedData: {
      purpose: 'No seed records are needed to inspect the assignment.',
    },
    startedAt: '2026-07-09T12:00:00.000Z',
    decidedAt: '2026-07-09T12:00:02.000Z',
    ...overrides,
  };
}

function readsJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readsText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

test('buildsLlmQaAssignment defaults provider to Gemini and preserves bounded assignment fields', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-llm-conveyor-'));

  try {
    const featurePath = writesFeatureFile(tempDir);
    const assignment = buildsLlmQaAssignment({
      rootDir: tempDir,
      releaseCandidateId: 'rc-1',
      qaRunId: 'qa-1',
      featureId: 'llm-end-user-testing-conveyor',
      scenarioId: 'assign-a-feature-scenario-to-the-llm-testing-conveyor',
      scenarioName: 'Assign a feature scenario to the LLM testing conveyor',
      acceptanceSourcePath: featurePath,
      acceptanceSourceLineRange: { start: 2, end: 7 },
    });

    assert.equal(assignment.providerName, DEFAULT_PROVIDER_NAME);
    assert.equal(assignment.modelName, 'gemini-default');
    assert.equal(assignment.acceptanceSourcePath, 'docs/features/llm-end-user-testing-conveyor.feature.md');
    assert.deepEqual(assignment.allowedTestSurfaces, ['CLI command', 'Markdown report review', 'HTML preview review']);
    assert.ok(assignment.allowedSeedDataPaths[0].includes('quality/end-user-test-bundles/rc-1/qa-1/seed-data'));
    assert.ok(assignment.forbiddenMutationPaths.includes('src/'));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('writes an LLM QA bundle with redacted handoff context, deterministic decision, and hashes', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-llm-conveyor-'));

  try {
    const result = writesLlmEndUserTestingConveyorRun(buildsRunOptions(tempDir, {
      prepareStakeholderNotificationDraft: true,
    }));

    for (const artifact of REQUIRED_LLM_QA_ARTIFACTS) {
      const artifactPath = path.join(result.bundlePath, artifact);
      assert.equal(fs.existsSync(artifactPath), true, artifact);
      assert.match(readsText(artifactPath), /rc-llm-1/);
      assert.match(readsText(artifactPath), /qa-run-1/);
      assert.match(readsText(artifactPath), /llm-end-user-testing-conveyor/);
      assert.match(readsText(artifactPath), /assign-a-feature-scenario-to-the-llm-testing-conveyor/);
    }

    const assignment = readsJson(path.join(result.bundlePath, 'llm-qa-assignment.v1.json'));
    const handoffReport = readsText(path.join(result.bundlePath, 'llm-handoff-packet.report.md'));
    const manifest = readsJson(path.join(result.bundlePath, 'qa-evidence-bundle.manifest.v1.json'));
    const gateDecision = readsJson(path.join(result.bundlePath, 'qa-gate-decision.v1.json'));

    assert.equal(assignment.providerName, 'Gemini');
    assert.doesNotMatch(handoffReport, /secret-value/);
    assert.match(handoffReport, /token=\[REDACTED\]/);
    assert.match(handoffReport, /## Current Domain Body Analysis/);
    assert.match(handoffReport, /Domain Body Analysis Report/);
    assert.match(handoffReport, /Executable file names missing action verb: 0/);
    assert.equal(gateDecision.qualityGateDecision, 'QA passed');
    assert.equal(gateDecision.promotable, false);
    assert.equal(gateDecision.llmPromotionAllowed, false);
    assert.deepEqual(Object.keys(manifest.contentHashes).sort(), REQUIRED_LLM_QA_ARTIFACTS.sort());
    assert.ok(Object.values(manifest.contentHashes).every((hash) => hash.length === 64));
    assert.equal(fs.existsSync(path.join(result.bundlePath, 'stakeholder-notification-draft.report.md')), true);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('seed data gate rejects non-synthetic or out-of-bounds proposals before materialization', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-llm-conveyor-'));

  try {
    const featurePath = writesFeatureFile(tempDir);
    const assignment = buildsLlmQaAssignment({
      rootDir: tempDir,
      releaseCandidateId: 'rc-1',
      qaRunId: 'qa-1',
      featureId: 'llm-end-user-testing-conveyor',
      scenarioId: 'assign-a-feature-scenario-to-the-llm-testing-conveyor',
      scenarioName: 'Assign a feature scenario to the LLM testing conveyor',
      acceptanceSourcePath: featurePath,
      acceptanceSourceLineRange: { start: 2, end: 7 },
    });
    const validation = validatesSeedProposal({
      featureId: assignment.featureId,
      scenarioId: assignment.scenarioId,
      seedDataId: 'bad-seed',
      privacyClassification: 'production',
      expectedUserVisibleState: '',
      cleanupInstructions: '',
      syntheticDataDeclaration: '',
      filesToCreate: [{ path: 'src/not-allowed.json', content: '{"password":"real"}' }],
    }, assignment);

    assert.equal(validation.approved, false);
    assert.ok(validation.blockerCodes.includes('seed-data-not-synthetic'));
    assert.ok(validation.blockerCodes.includes('seed-data-write-outside-allowed-paths'));
    assert.ok(validation.blockerCodes.includes('seed-data-sensitive-content-detected'));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('blocks LLM guardrail violations and acceptance claims without evidence', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-llm-conveyor-'));

  try {
    const featurePath = writesFeatureFile(tempDir);
    const assignment = buildsLlmQaAssignment({
      rootDir: tempDir,
      releaseCandidateId: 'rc-1',
      qaRunId: 'qa-1',
      featureId: 'llm-end-user-testing-conveyor',
      scenarioId: 'assign-a-feature-scenario-to-the-llm-testing-conveyor',
      scenarioName: 'Assign a feature scenario to the LLM testing conveyor',
      acceptanceSourcePath: featurePath,
      acceptanceSourceLineRange: { start: 2, end: 7 },
    });
    const findings = checksLlmTestingAction({
      mutationPath: 'contracts/promoted.json',
      claimsQaPassed: true,
      claimsAcceptanceWithoutEvidence: true,
      sendsExternalNotification: true,
    }, assignment);

    assert.equal(findings.length, 4);
    assert.ok(findings.every((finding) => finding.code === GUARDRAIL_FINDING_CODE));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('feature-wide summary keeps scenario runs independent', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-llm-conveyor-'));

  try {
    const passed = writesLlmEndUserTestingConveyorRun(buildsRunOptions(tempDir));
    const blocked = writesLlmEndUserTestingConveyorRun(buildsRunOptions(tempDir, {
      qaRunId: 'qa-run-2',
      scenarioId: 'build-the-llm-handoff-packet',
      scenarioName: 'Build the LLM handoff packet',
      observations: [{
        status: 'met',
        llmObservationSummary: 'The LLM claimed the handoff passed without evidence.',
        evidencePaths: [],
      }],
    }));
    const summary = summarizesFeatureScenarioConveyorRuns([passed, blocked], {
      releaseCandidateId: 'rc-llm-1',
      featureId: 'llm-end-user-testing-conveyor',
    });

    assert.equal(summary.totalScenarios, 2);
    assert.equal(summary.scenariosPassed, 1);
    assert.equal(summary.scenariosFailed, 1);
    assert.equal(summary.overallQualityGateDecision, 'BLOCKED');
    assert.equal(summary.bundlePaths.length, 2);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
