const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { isStringStep } = require('../../packages/logme-method-inventory-primitives/src/is-string-step');

const JSON_ARTIFACT_FILE_NAMES = {
  bodyContractDraft: 'body-contract.json',
  executionPathDraft: 'execution-path.json',
  testPlanDraft: 'test-plan.json',
  telemetryRequirementsDraft: 'telemetry-requirements.json',
  receiptCoverageDraft: 'receipt-coverage.json',
};

function writesJsonArtifact(harnessDir, fileName, content) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const filePath = path.join(harnessDir, fileName);
  fs.writeFileSync(filePath, `${JSON.stringify(content, null, 2)}\n`, 'utf8');
  return fileName;
}

function extractsDeclaredSteps(executionPathDraft) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (executionPathDraft && Array.isArray(executionPathDraft.steps)) {
    return executionPathDraft.steps.filter(isStringStep);
  }

  return [];
}

function rendersGeneratedEntryFileContent(declaredSteps, testimonyCoreImportPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const stepStatements = [];

  function appendsStepStatement(stepName) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    const stepLiteral = JSON.stringify(stepName);
    stepStatements.push(
      `if (process.env.LOGME_AUDIT === '1') { LogMe(sampleMethod); }\nconsole.log('TELEMETRY-STEP: ' + ${stepLiteral});`,
    );
  }

  declaredSteps.forEach(appendsStepStatement);

  const logMeImportLiteral = JSON.stringify(`${testimonyCoreImportPath}/LogMe`);
  const sampleMethodImportLiteral = JSON.stringify(`${testimonyCoreImportPath}/sample-method`);

  return [
    "const fs = require('node:fs');",
    "const path = require('node:path');",
    `const { LogMe } = require(${logMeImportLiteral});`,
    `const { sampleMethod } = require(${sampleMethodImportLiteral});`,
    '',
    'function runsExecutionPath() {',
    stepStatements.join('\n'),
    '}',
    '',
    'runsExecutionPath();',
    '',
    "fs.writeFileSync(path.join(__dirname, 'conformance-marker.json'), JSON.stringify({ completedAt: new Date().toISOString() }, null, 2) + '\\n', 'utf8');",
    '',
  ].join('\n');
}

function resolvesTestimonyCoreImportPath(harnessDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const testimonyCoreDir = path.resolve(__dirname, '..', '..', 'packages', 'logme-testimony-core', 'src');
  const relativePath = path.relative(harnessDir, testimonyCoreDir).split(path.sep).join('/');
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

function writesGeneratedEntryFile(harnessDir, executionPathDraft) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const declaredSteps = extractsDeclaredSteps(executionPathDraft);
  const testimonyCoreImportPath = resolvesTestimonyCoreImportPath(harnessDir);
  const entryFileContent = rendersGeneratedEntryFileContent(declaredSteps, testimonyCoreImportPath);
  fs.writeFileSync(path.join(harnessDir, 'index.js'), entryFileContent, 'utf8');
  return 'index.js';
}

function materializesApprovedHarness(parsedOutput, validationResult, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!validationResult.isValid || parsedOutput.proposalStatus !== 'proposed') {
    throw new Error('materializesApprovedHarness requires a validated, proposed harness');
  }

  const generatedHarnessesRoot = options.generatedHarnessesRoot
    || path.resolve(__dirname, '..', '..', 'src', 'generated-harnesses');
  const resolvedRoot = path.resolve(generatedHarnessesRoot);
  const harnessDir = path.join(resolvedRoot, parsedOutput.harnessId);
  const resolvedHarnessDir = path.resolve(harnessDir);

  if (resolvedHarnessDir !== resolvedRoot && !resolvedHarnessDir.startsWith(resolvedRoot + path.sep)) {
    throw new Error('materializesApprovedHarness refused to write outside the generated-harnesses lease');
  }

  fs.mkdirSync(resolvedHarnessDir, { recursive: true });

  const writtenFiles = [
    writesJsonArtifact(resolvedHarnessDir, JSON_ARTIFACT_FILE_NAMES.bodyContractDraft, parsedOutput.bodyContractDraft),
    writesJsonArtifact(resolvedHarnessDir, JSON_ARTIFACT_FILE_NAMES.executionPathDraft, parsedOutput.executionPathDraft),
    writesJsonArtifact(resolvedHarnessDir, JSON_ARTIFACT_FILE_NAMES.testPlanDraft, parsedOutput.testPlanDraft),
    writesJsonArtifact(resolvedHarnessDir, JSON_ARTIFACT_FILE_NAMES.telemetryRequirementsDraft, parsedOutput.telemetryRequirementsDraft),
    writesJsonArtifact(resolvedHarnessDir, JSON_ARTIFACT_FILE_NAMES.receiptCoverageDraft, parsedOutput.receiptCoverageDraft),
    writesGeneratedEntryFile(resolvedHarnessDir, parsedOutput.executionPathDraft),
  ];

  return {
    harnessId: parsedOutput.harnessId,
    materializationStatus: 'materialized',
    leasedPaths: [resolvedHarnessDir],
    writtenFiles,
    entryFilePath: path.join(resolvedHarnessDir, 'index.js'),
  };
}

module.exports = { materializesApprovedHarness };
