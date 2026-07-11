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
  const handoffArtifact = buildsDomainBodyAnalysisHandoff(canonicalAnalysisContract);
  const handoffPath = path.join(config.rootDir, readsAnalysisHandoffPath(canonicalAnalysisContract));
  const handoffContent = `${JSON.stringify(handoffArtifact, null, 2)}\n`;

  fs.writeFileSync(handoffPath, handoffContent, 'utf8');

  const reportPath = path.join(config.rootDir, readsAnalysisReportPath(canonicalAnalysisContract));
  const reportContent = rendersDomainBodyAnalysisReport(canonicalAnalysisContract);

  fs.writeFileSync(reportPath, reportContent, 'utf8');

  return {
    evidencePath,
    handoffPath,
    reportPath,
    bytesWritten: Buffer.byteLength(evidenceContent, 'utf8'),
    handoffBytesWritten: Buffer.byteLength(handoffContent, 'utf8'),
    reportBytesWritten: Buffer.byteLength(reportContent, 'utf8'),
  };
}

function readsAnalysisReportPath(analysisContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return analysisContract.reportPath || analysisContract.evidencePath.replace(/\.contract\.v1\.json$/u, '.report.md');
}

function readsAnalysisHandoffPath(analysisContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return analysisContract.handoffPath || analysisContract.evidencePath.replace(/\.contract\.v1\.json$/u, '.handoff.v1.json');
}

function rendersDomainBodyAnalysisReport(analysisContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const topRisks = readsTopDomainAnalysisRisks(analysisContract.sourceFiles || [], 10);

  return [
    '# Domain Body Analysis Report',
    '',
    `Canonical JSON evidence: ${analysisContract.evidencePath}`,
    `LLM handoff JSON: ${readsAnalysisHandoffPath(analysisContract)}`,
    '',
    '## Executive Domain Analysis Summary',
    '',
    rendersDomainAnalysisSummary(analysisContract.summary),
    '',
    '## Product Owner Interpretation',
    '',
    rendersProductOwnerInterpretation(analysisContract.summary),
    '',
    '## Priority Work Queues',
    '',
    rendersPriorityWorkQueues(analysisContract.sourceFiles || []),
    '',
    '## Top Domain Body Risks',
    '',
    rendersTopDomainBodyRiskTable(topRisks),
    '',
    '## Machine Facts',
    '',
    'The full deterministic evidence remains in canonical JSON. LLM worker input is written as concise JSON so the Markdown report stays reviewable.',
    '',
    `- Canonical contract: ${analysisContract.evidencePath}`,
    `- LLM handoff: ${readsAnalysisHandoffPath(analysisContract)}`,
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

function rendersProductOwnerInterpretation(summary) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!summary || summary.totalBlockers === 0) {
    return 'No domain body analysis blockers were detected.';
  }

  return [
    'This report is a product-owner triage surface, not the full LLM payload.',
    `The current run found ${summary.totalBlockers} executable files with domain analysis blockers.`,
    'Use the priority queues below to decide which worker should run next; use the LLM handoff JSON for worker input.',
  ].join('\n');
}

function rendersPriorityWorkQueues(sourceFiles) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const queues = [
    {
      queue: 'Contract repair',
      count: countsFilesWithFinding(sourceFiles, 'file-body-contract-missing'),
      worker: 'Contract Steward Worker',
      nextAction: 'declare or waive missing body ownership',
    },
    {
      queue: 'Scenario tie-out',
      count: countsFilesWithFinding(sourceFiles, 'scenario-tieout-missing'),
      worker: 'Scenario Tie-Out Worker',
      nextAction: 'connect bodies to feature scenarios with evidence citations',
    },
    {
      queue: 'Naming review',
      count: countsFilesWithFinding(sourceFiles, 'executable-file-name-missing-action-verb'),
      worker: 'Naming And Decomposition Worker',
      nextAction: 'rename cohesive noun-labeled executable bodies',
    },
    {
      queue: 'Decomposition review',
      count: countsFilesWithFinding(sourceFiles, 'decomposition-recommended'),
      worker: 'Naming And Decomposition Worker',
      nextAction: 'split only after a bounded decomposition plan',
    },
  ];

  return [
    '| Queue | Count | Worker | Next action |',
    '| --- | ---: | --- | --- |',
    ...queues.map(rendersPriorityQueueRow),
  ].join('\n');
}

function rendersPriorityQueueRow(queue) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    '|',
    formatsMarkdownCell(queue.queue),
    queue.count,
    formatsMarkdownCell(queue.worker),
    formatsMarkdownCell(queue.nextAction),
    '|',
  ].join(' ');
}

function rendersTopDomainBodyRiskTable(sourceFiles) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (sourceFiles.length === 0) {
    return '_No domain body risks detected._';
  }

  const rows = [
    '| File | Methods | Findings | Recommended worker | Why it matters |',
    '| --- | ---: | --- | --- | --- |',
  ];

  rows.push(...sourceFiles.map(rendersTopRiskRow));

  return rows.join('\n');
}

function rendersTopRiskRow(sourceFile) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    '|',
    formatsMarkdownCell(sourceFile.filePath),
    sourceFile.executableMethodCount,
    formatsMarkdownCell(sourceFile.findingCodes.join(', ') || 'none'),
    formatsMarkdownCell(selectsRecommendedWorker(sourceFile.findingCodes)),
    formatsMarkdownCell(sourceFile.decomposition.reason),
    '|',
  ].join(' ');
}

function buildsDomainBodyAnalysisHandoff(analysisContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const sourceFiles = analysisContract.sourceFiles || [];

  return {
    schemaVersion: 'domain-body-analysis-handoff.v1',
    runId: analysisContract.runId,
    sourceContractPath: analysisContract.evidencePath,
    sourceReportPath: readsAnalysisReportPath(analysisContract),
    purpose: 'bounded LLM worker input for domain body remediation',
    summary: analysisContract.summary,
    findingCounts: countsFindingCodes(sourceFiles),
    workQueues: {
      contractRepair: buildsWorkQueue(sourceFiles, 'file-body-contract-missing'),
      scenarioTieOut: buildsWorkQueue(sourceFiles, 'scenario-tieout-missing'),
      namingReview: buildsWorkQueue(sourceFiles, 'executable-file-name-missing-action-verb'),
      decompositionReview: buildsWorkQueue(sourceFiles, 'decomposition-recommended'),
    },
    topRisks: readsTopDomainAnalysisRisks(sourceFiles, 25).map(buildsHandoffWorkItem),
    workerRules: [
      'do not infer scenario proof without evidence citation',
      'do not apply decomposition without a bounded plan',
      'do not use Markdown report text as the machine source of truth',
      'read canonical contract for exhaustive details when a worker packet is approved',
    ],
  };
}

function buildsWorkQueue(sourceFiles, findingCode) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const workQueue = [];
  for (const sourceFile of sourceFiles) {
    if (sourceFile.findingCodes.includes(findingCode)) workQueue.push(buildsHandoffWorkItem(sourceFile));
  }
  return workQueue;
}

function buildsHandoffWorkItem(sourceFile) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    filePath: sourceFile.filePath,
    executableMethodCount: sourceFile.executableMethodCount,
    grammar: sourceFile.fileNameGrammar.classification,
    actionVerb: sourceFile.fileNameGrammar.actionVerb || 'missing',
    bodyContractIds: readsBodyContractIds(sourceFile),
    tieOutStatus: sourceFile.featureScenarioTieOut.status,
    featureIds: sourceFile.featureScenarioTieOut.featureIds,
    scenarioIds: sourceFile.featureScenarioTieOut.scenarioIds,
    findings: sourceFile.findingCodes,
    recommendedWorker: selectsRecommendedWorker(sourceFile.findingCodes),
    recommendedAction: selectsRecommendedAction(sourceFile.findingCodes),
    decompositionStatus: sourceFile.decomposition.status,
    reason: sourceFile.decomposition.reason,
    proposedBoundaryCount: (sourceFile.decomposition.proposedFiles || []).length,
  };
}

function readsTopDomainAnalysisRisks(sourceFiles, limit) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const risks = [];
  for (const sourceFile of sourceFiles) {
    if (sourceFile.findingCodes.length > 0) risks.push(sourceFile);
  }
  risks.sort(comparesDomainRiskDescending);
  return risks.slice(0, limit);
}

function comparesDomainRiskDescending(left, right) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return calculatesRiskScore(right) - calculatesRiskScore(left) || left.filePath.localeCompare(right.filePath);
}

function calculatesRiskScore(sourceFile) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const findingWeights = {
    'file-body-contract-missing': 1000,
    'executable-file-name-missing-action-verb': 500,
    'decomposition-recommended': 250,
    'scenario-tieout-missing': 100,
  };

  let score = sourceFile.executableMethodCount || 0;
  for (const findingCode of sourceFile.findingCodes || []) {
    score += findingWeights[findingCode] || 0;
  }

  return score;
}

function countsFilesWithFinding(sourceFiles, findingCode) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let count = 0;
  for (const sourceFile of sourceFiles) {
    if (sourceFile.findingCodes.includes(findingCode)) count += 1;
  }
  return count;
}

function countsFindingCodes(sourceFiles) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const counts = {};
  for (const sourceFile of sourceFiles) {
    for (const findingCode of sourceFile.findingCodes || []) {
      counts[findingCode] = (counts[findingCode] || 0) + 1;
    }
  }

  return counts;
}

function selectsRecommendedWorker(findingCodes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (findingCodes.includes('file-body-contract-missing')) {
    return 'Contract Steward Worker';
  }
  if (findingCodes.includes('executable-file-name-missing-action-verb') || findingCodes.includes('decomposition-recommended')) {
    return 'Naming And Decomposition Worker';
  }
  if (findingCodes.includes('scenario-tieout-missing')) {
    return 'Scenario Tie-Out Worker';
  }

  return 'Domain Cartographer Worker';
}

function selectsRecommendedAction(findingCodes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (findingCodes.includes('file-body-contract-missing')) {
    return 'declare body ownership or create an explicit waiver';
  }
  if (findingCodes.includes('executable-file-name-missing-action-verb')) {
    return 'rename or decompose the executable body behind an approved plan';
  }
  if (findingCodes.includes('decomposition-recommended')) {
    return 'draft a bounded decomposition plan before moving code';
  }
  if (findingCodes.includes('scenario-tieout-missing')) {
    return 'cite feature scenario evidence or mark as explicitly unowned';
  }

  return 'review deterministic facts and assign a bounded worker packet';
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
  buildsDomainBodyAnalysisHandoff,
  rendersDomainBodyAnalysisReport,
  writesDomainBodyAnalysisEvidence,
};
