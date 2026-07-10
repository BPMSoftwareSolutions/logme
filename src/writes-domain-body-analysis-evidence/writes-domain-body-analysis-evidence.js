const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

function writesDomainBodyAnalysisEvidence(config, analysisContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const evidencePath = path.join(config.rootDir, analysisContract.evidencePath);
  const evidenceContent = `${JSON.stringify(analysisContract, null, 2)}\n`;

  fs.mkdirSync(path.dirname(evidencePath), { recursive: true });
  fs.writeFileSync(evidencePath, evidenceContent, 'utf8');

  const canonicalAnalysisContract = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
  const reportPath = path.join(config.rootDir, readsAnalysisReportPath(canonicalAnalysisContract));
  const reportContent = rendersDomainBodyAnalysisReport(canonicalAnalysisContract);

  fs.writeFileSync(reportPath, reportContent, 'utf8');

  return {
    evidencePath,
    reportPath,
    bytesWritten: Buffer.byteLength(evidenceContent, 'utf8'),
    reportBytesWritten: Buffer.byteLength(reportContent, 'utf8'),
  };
}

function readsAnalysisReportPath(analysisContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return analysisContract.reportPath || analysisContract.evidencePath.replace(/\.contract\.v1\.json$/u, '.report.md');
}

function rendersDomainBodyAnalysisReport(analysisContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    '# Domain Body Analysis Report',
    '',
    `Canonical JSON evidence: ${analysisContract.evidencePath}`,
    '',
    '## Executive Domain Analysis Summary',
    '',
    rendersDomainAnalysisSummary(analysisContract.summary),
    '',
    '## Product Owner Review Stance',
    '',
    'Domain-analysis findings are deterministic review findings. They are LLM-ready input, but they do not change the sterility verdict until a promotion gate adopts them.',
    '',
    '## Actionless Executable Files',
    '',
    rendersFindingFileList(analysisContract.sourceFiles, 'executable-file-name-missing-action-verb'),
    '',
    '## Missing File-Body Contracts',
    '',
    rendersFindingFileList(analysisContract.sourceFiles, 'file-body-contract-missing'),
    '',
    '## Missing Scenario Tie-Out',
    '',
    rendersFindingFileList(analysisContract.sourceFiles, 'scenario-tieout-missing'),
    '',
    '## Decomposition Recommendations',
    '',
    rendersDecompositionRecommendations(analysisContract.sourceFiles),
    '',
    '## LLM Handoff Facts',
    '',
    rendersLlmHandoffFactTable(analysisContract.sourceFiles),
    '',
  ].join('\n');
}

function rendersDomainAnalysisSummary(summary) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    `- Total executable files: ${summary.totalExecutableFiles}`,
    `- Action-bearing executable files: ${summary.actionBearingExecutableFiles}`,
    `- Executable file names missing action verb: ${summary.executableFileNamesMissingActionVerb}`,
    `- Files missing body contract: ${summary.filesMissingBodyContract}`,
    `- Files missing scenario tie-out: ${summary.filesMissingScenarioTieOut}`,
    `- Decomposition candidates: ${summary.decompositionCandidates}`,
    `- Analysis blocker candidates: ${summary.totalBlockers}`,
  ].join('\n');
}

function rendersFindingFileList(sourceFiles, findingCode) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [];
  for (const sourceFile of sourceFiles || []) {
    if (sourceFile.findingCodes.includes(findingCode)) {
      lines.push(`- ${sourceFile.filePath}: ${sourceFile.fileNameGrammar.classification}; ${sourceFile.decomposition.reason}`);
    }
  }

  return lines.length === 0 ? '_None._' : lines.join('\n');
}

function rendersDecompositionRecommendations(sourceFiles) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [];
  for (const sourceFile of sourceFiles || []) {
    if (sourceFile.decomposition.status !== 'decomposition recommended') {
      continue;
    }

    lines.push(`- ${sourceFile.filePath}: ${sourceFile.decomposition.reason}`);
    for (const proposedFile of sourceFile.decomposition.proposedFiles || []) {
      lines.push(`  - ${proposedFile.proposedFilePath}: ${proposedFile.contractActionRequired}`);
    }
  }

  return lines.length === 0 ? '_None._' : lines.join('\n');
}

function rendersLlmHandoffFactTable(sourceFiles) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rows = [
    '| File | Methods | Grammar | Body Contracts | Feature IDs | Scenario IDs | Findings |',
    '| --- | ---: | --- | --- | --- | --- | --- |',
  ];

  for (const sourceFile of sourceFiles || []) {
    rows.push([
      '|',
      formatsMarkdownCell(sourceFile.filePath),
      sourceFile.executableMethodCount,
      formatsMarkdownCell(sourceFile.fileNameGrammar.classification),
      formatsMarkdownCell(readsBodyContractIds(sourceFile).join(', ') || 'missing'),
      formatsMarkdownCell(sourceFile.featureScenarioTieOut.featureIds.join(', ') || 'missing'),
      formatsMarkdownCell(sourceFile.featureScenarioTieOut.scenarioIds.join(', ') || 'missing'),
      formatsMarkdownCell(sourceFile.findingCodes.join(', ') || 'none'),
      '|',
    ].join(' '));
  }

  return rows.join('\n');
}

function readsBodyContractIds(sourceFile) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const bodyIds = [];
  for (const bodyContract of sourceFile.owningBodyContracts || []) {
    bodyIds.push(bodyContract.bodyId);
  }

  return bodyIds;
}

function formatsMarkdownCell(value) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return String(value).replace(/\|/gu, '\\|').replace(/\r?\n/gu, ' ');
}

module.exports = {
  rendersDomainBodyAnalysisReport,
  writesDomainBodyAnalysisEvidence,
};
