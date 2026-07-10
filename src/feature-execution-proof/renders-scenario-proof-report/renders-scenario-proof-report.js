const { LogMe } = require('../../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../../packages/logme-testimony-core/src/sample-method');
const path = require('node:path');
const { NOT_OBSERVED } = require('../feature-execution-proof-shared-constants/feature-execution-proof-shared-constants');
const { formatsProofPathForReport, formatsRepoRelativePath, formatsValue } = require('../formats-and-serializes-data/formats-and-serializes-data');
const { buildsScenarioProofReportPath } = require('../manages-report-file-paths/manages-report-file-paths');
const { rendersScenarioTimingTable } = require('../renders-supplementary-reports-and-tables/renders-supplementary-reports-and-tables');

function rendersScenarioProofReport(proof, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const evidenceRoot = options.evidenceRoot || path.join(rootDir, 'evidence');
  const reportPath = options.reportPath || buildsScenarioProofReportPath(evidenceRoot, proof.runId, proof.featureId, proof.scenarioId);

  return [
    `# ${proof.scenarioName}`,
    '',
    rendersScenarioProofExecutiveSummary(proof, reportPath, rootDir),
    rendersScenarioProofIdentity(proof),
    rendersScenarioProofPromotionDecision(proof),
    rendersScenarioProofAsciiSketch(proof, rootDir),
    rendersScenarioProofOrderedTimeline(proof, rootDir),
    rendersScenarioTimingMetrics(proof),
    rendersServiceLevelIndicatorSummary(proof),
    rendersServiceLevelObjectiveEvaluation(proof),
    rendersSlaSupportEvidence(proof),
    rendersBlockerWorklist(proof),
    rendersSourceEvidenceLinks(proof, rootDir),
    rendersDenseTelemetryAppendix(proof),
  ].join('\n');
}

function rendersScenarioProofExecutiveSummary(proof, reportPath, rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    '## Executive Proof Summary',
    '',
    `- Generated report path: ${formatsRepoRelativePath(rootDir, reportPath)}`,
    `- Generated at: ${proof.generatedAt}`,
    `- Canonical JSON proof: ${formatsProofPathForReport(proof, rootDir)}`,
    `- Promotion decision: ${proof.promotionDecision.status}`,
    `- Blockers: ${formatsValue(proof.promotionDecision.blockerCodes)}`,
    '',
  ].join('\n');
}

function rendersScenarioProofIdentity(proof) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    '## Feature And Scenario Identity',
    '',
    `- Run id: ${proof.runId}`,
    `- Feature id: ${proof.featureId}`,
    `- Scenario id: ${proof.scenarioId}`,
    `- Scenario name: ${proof.scenarioName}`,
    `- Acceptance source: ${proof.acceptanceSource ? proof.acceptanceSource.path : NOT_OBSERVED}`,
    '',
  ].join('\n');
}

function rendersScenarioProofPromotionDecision(proof) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    '## Promotion Decision',
    '',
    `- Status: ${proof.promotionDecision.status}`,
    `- Reason: ${proof.promotionDecision.reason}`,
    `- Blocker codes: ${formatsValue(proof.promotionDecision.blockerCodes)}`,
    '',
  ].join('\n');
}

function rendersScenarioProofAsciiSketch(proof, rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    '## ASCII Executable Body Sketch',
    '',
    '```text',
  ];

  for (const node of proof.observedExecutionTimeline || []) {
    lines.push(`[${node.nodeId}] ${node.nodeLabel}`);
    lines.push(`|-- runtime path              : ${formatsRepoRelativePath(rootDir, node.runtimePath)}`);
    lines.push(`|-- observed runtime step     : ${formatsValue(node.telemetryEventIds)}`);
    lines.push(`|-- first seen at             : ${node.firstSeenAt}`);
    lines.push(`|-- last seen at              : ${node.lastSeenAt}`);
    lines.push(`|-- duration ms               : ${node.durationMs}`);
    lines.push(`|-- elapsed since previous ms : ${node.elapsedSincePreviousNodeMs}`);
    lines.push(`|-- call count                : ${node.callCount}`);
    lines.push(`|-- receipt status            : ${node.receiptStatus}`);
    lines.push(`\`-- blocker status           : ${formatsValue(node.blockerCodes)}`);
  }

  lines.push('```');
  lines.push('');

  return lines.join('\n');
}

function rendersScenarioProofOrderedTimeline(proof, rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    '## Ordered Execution Timeline',
    '',
    rendersScenarioTimingTable(proof, rootDir),
    '',
  ].join('\n');
}

function rendersScenarioTimingMetrics(proof) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    '## Timing And Call-Count Metrics',
    '',
    `- Scenario lead time ms: ${proof.timingMetrics.scenarioLeadTimeMs}`,
    `- Scenario cycle time ms: ${proof.timingMetrics.scenarioCycleTimeMs}`,
    `- Active execution time ms: ${proof.timingMetrics.activeExecutionTimeMs}`,
    `- Waiting time ms: ${proof.timingMetrics.waitingTimeMs}`,
    `- Slowest node id: ${proof.timingMetrics.slowestNodeId}`,
    `- Total observed calls: ${proof.callCountMetrics.totalObservedCalls}`,
    '',
  ].join('\n');
}

function rendersServiceLevelIndicatorSummary(proof) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    '## SLI Summary',
    '',
    '| name | value | unit | evidence source paths |',
    '| --- | ---: | --- | --- |',
  ];

  for (const sli of proof.serviceLevelIndicators || []) {
    lines.push(`| ${sli.name} | ${formatsValue(sli.value)} | ${sli.unit} | ${formatsValue(sli.evidenceSourcePaths)} |`);
  }

  lines.push('');
  return lines.join('\n');
}

function rendersServiceLevelObjectiveEvaluation(proof) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    '## SLO Evaluation',
    '',
    '| SLO id | SLI name | target | observed value | unit | status |',
    '| --- | --- | ---: | ---: | --- | --- |',
  ];

  for (const evaluation of proof.sloEvaluations || []) {
    lines.push(`| ${evaluation.sloId} | ${evaluation.sliName} | ${evaluation.target} | ${formatsValue(evaluation.observedValue)} | ${evaluation.unit} | ${evaluation.status} |`);
  }

  if (!proof.sloEvaluations || proof.sloEvaluations.length === 0) {
    lines.push('| not observed | not observed | not observed | not observed | not observed | not enough evidence |');
  }

  lines.push('');
  return lines.join('\n');
}

function rendersSlaSupportEvidence(proof) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    '## SLA Support Evidence',
    '',
    `- Supporting SLO evaluations: ${(proof.sloEvaluations || []).length}`,
    `- Unsupported SLA blocker code: sla-claim-without-slo-evidence`,
    '',
  ].join('\n');
}

function rendersBlockerWorklist(proof) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    '## Blocker Worklist',
    '',
  ];

  if (!proof.promotionDecision.blockerCodes || proof.promotionDecision.blockerCodes.length === 0) {
    lines.push('_No blockers._');
    lines.push('');
    return lines.join('\n');
  }

  for (const blockerCode of proof.promotionDecision.blockerCodes) {
    lines.push(`- finding code: ${blockerCode}`);
  }

  lines.push('');
  return lines.join('\n');
}

function rendersSourceEvidenceLinks(proof, rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    '## Source Evidence Links',
    '',
    `- Canonical JSON proof: ${formatsProofPathForReport(proof, rootDir)}`,
    `- Acceptance source: ${proof.acceptanceSource ? formatsRepoRelativePath(rootDir, proof.acceptanceSource.path) : NOT_OBSERVED}`,
  ];

  for (const telemetryPath of proof.telemetrySourcePaths || []) {
    lines.push(`- Telemetry source: ${formatsRepoRelativePath(rootDir, telemetryPath)}`);
  }

  for (const receiptPath of proof.receiptSourcePaths || []) {
    lines.push(`- Receipt source: ${formatsRepoRelativePath(rootDir, receiptPath)}`);
  }

  lines.push('');
  return lines.join('\n');
}

function rendersDenseTelemetryAppendix(proof) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    '## Dense Telemetry Appendix',
    '',
    '| node id | call index | telemetry event id | timestamp | duration ms | status |',
    '| --- | ---: | --- | --- | ---: | --- |',
  ];

  for (const node of proof.observedExecutionTimeline || []) {
    if (node.calls.length === 0) {
      lines.push(`| ${node.nodeId} | 0 | ${NOT_OBSERVED} | ${NOT_OBSERVED} | ${NOT_OBSERVED} | ${node.status} |`);
    }

    for (const call of node.calls) {
      lines.push(`| ${node.nodeId} | ${call.callIndex} | ${call.telemetryEventId} | ${call.timestamp} | ${call.durationMs} | ${call.status} |`);
    }
  }

  lines.push('');
  return lines.join('\n');
}

module.exports = { rendersScenarioProofReport, rendersScenarioProofExecutiveSummary, rendersScenarioProofIdentity, rendersScenarioProofPromotionDecision, rendersScenarioProofAsciiSketch, rendersScenarioProofOrderedTimeline, rendersScenarioTimingMetrics, rendersServiceLevelIndicatorSummary, rendersServiceLevelObjectiveEvaluation, rendersSlaSupportEvidence, rendersBlockerWorklist, rendersSourceEvidenceLinks, rendersDenseTelemetryAppendix };
