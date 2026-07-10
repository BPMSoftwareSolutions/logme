const { LogMe } = require('../../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../../packages/logme-testimony-core/src/sample-method');
const { NOT_OBSERVED } = require('../feature-execution-proof-shared-constants/feature-execution-proof-shared-constants');
const { formatsProofPathForReport, formatsRepoRelativePath, formatsSourcePathWithLineRange, formatsValue } = require('../formats-and-serializes-data/formats-and-serializes-data');
const { readsFirstBlockerCode, readsRuntimeStep } = require('../reads-runtime-and-source-data/reads-runtime-and-source-data');

function rendersMethodCallEvidenceReport(proof, rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    `# Method Call Evidence: ${proof.scenarioName}`,
    '',
    `- Run id: ${proof.runId}`,
    `- Feature id: ${proof.featureId}`,
    `- Scenario id: ${proof.scenarioId}`,
    `- Canonical JSON proof: ${formatsProofPathForReport(proof, rootDir)}`,
    `- Executable body report: executable-body-contract.report.md`,
    '',
  ];

  for (const node of proof.observedExecutionTimeline || []) {
    lines.push(`## ${node.nodeId} ${node.nodeLabel}`);
    lines.push('');

    if (!node.methodCalls || node.methodCalls.length === 0) {
      lines.push('- Method detail: missing');
      lines.push('- Blocker: observed-body-node-without-method-drilldown');
      lines.push('');
      continue;
    }

    for (const methodCall of node.methodCalls) {
      lines.push(`### ${methodCall.methodName} call ${String(methodCall.callIndex).padStart(3, '0')}`);
      lines.push('');
      lines.push(`- Runtime file: ${formatsSourcePathWithLineRange(rootDir, methodCall.runtimeFilePath || methodCall.runtimePath, methodCall.sourceLineRange)}`);
      lines.push(`- Method kind: ${methodCall.methodKind}`);
      lines.push(`- Telemetry event ids: ${formatsValue(methodCall.telemetryEventIds)}`);
      lines.push(`- Telemetry event path: ${formatsRepoRelativePath(rootDir, methodCall.telemetryEventPath)}`);
      lines.push(`- Receipt paths: ${formatsValue(methodCall.receiptPaths)}`);
      lines.push(`- Duration ms: ${methodCall.durationMs}`);
      lines.push(`- Status: ${methodCall.status}`);
      lines.push(`- Blocker code: ${methodCall.blockerCode}`);
      lines.push(`- Fix route: ${methodCall.fixRoute}`);
      lines.push('');
    }
  }

  return lines.join('\n');
}

function rendersScenarioMethodTimelineTable(proof, rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    '| runtime order | body node id | body node label | runtime file | method name | call index | started at | completed at | duration ms | elapsed since previous call ms | telemetry event ids | receipt paths | status | blocker code |',
    '| ---: | --- | --- | --- | --- | ---: | --- | --- | ---: | ---: | --- | --- | --- | --- |',
  ];
  let runtimeOrder = 1;

  for (const node of proof.observedExecutionTimeline || []) {
    if (!node.methodCalls || node.methodCalls.length === 0) {
      lines.push(`| ${runtimeOrder} | ${node.nodeId} | ${node.nodeLabel} | ${formatsRepoRelativePath(rootDir, node.runtimePath)} | ${NOT_OBSERVED} | 0 | ${NOT_OBSERVED} | ${NOT_OBSERVED} | ${NOT_OBSERVED} | ${NOT_OBSERVED} | ${formatsValue(node.telemetryEventIds)} | ${formatsValue(node.receiptPaths)} | method detail missing | observed-body-node-without-method-drilldown |`);
      runtimeOrder += 1;
    }

    for (const methodCall of node.methodCalls || []) {
      lines.push(`| ${runtimeOrder} | ${node.nodeId} | ${node.nodeLabel} | ${formatsRepoRelativePath(rootDir, methodCall.runtimeFilePath || methodCall.runtimePath)} | ${methodCall.methodName} | ${methodCall.callIndex} | ${methodCall.startedAt} | ${methodCall.completedAt} | ${methodCall.durationMs} | ${methodCall.elapsedSincePreviousCallMs} | ${formatsValue(methodCall.telemetryEventIds)} | ${formatsValue(methodCall.receiptPaths)} | ${methodCall.status} | ${methodCall.blockerCode} |`);
      runtimeOrder += 1;
    }
  }

  return lines.join('\n');
}

function rendersScenarioTimingTable(proof, rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    '| runtime step | node id | node label | runtime path | first seen at | last seen at | duration ms | elapsed since previous node ms | call count | status | blocker code |',
    '| --- | --- | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- |',
  ];

  for (const node of proof.observedExecutionTimeline || []) {
    lines.push(`| ${readsRuntimeStep(node)} | ${node.nodeId} | ${node.nodeLabel} | ${formatsRepoRelativePath(rootDir, node.runtimePath)} | ${node.firstSeenAt} | ${node.lastSeenAt} | ${node.durationMs} | ${node.elapsedSincePreviousNodeMs} | ${node.callCount} | ${node.status} | ${readsFirstBlockerCode(node)} |`);
  }

  return lines.join('\n');
}

function rendersFeatureExecutionReport(proof) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    `# ${proof.scenarioName}`,
    '',
    '## Execution Proof',
    '',
    `- Run id: ${proof.runId}`,
    `- Feature id: ${proof.featureId}`,
    `- Scenario id: ${proof.scenarioId}`,
    `- Proof JSON: ${proof.proofPath || NOT_OBSERVED}`,
    `- Promotion decision: ${proof.promotionDecision.status}`,
    `- Blockers: ${formatsValue(proof.promotionDecision.blockerCodes)}`,
    '',
    '```text',
  ];

  for (const node of proof.observedExecutionTimeline) {
    lines.push(`[${node.nodeId}] ${node.nodeLabel}`);
    lines.push(`|-- runtime path              : ${node.runtimePath}`);
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
  lines.push('| node id | call index | timestamp | duration ms | elapsed since previous node ms | status |');
  lines.push('| --- | ---: | --- | ---: | ---: | --- |');

  for (const node of proof.observedExecutionTimeline) {
    if (node.calls.length === 0) {
      lines.push(`| ${node.nodeId} | 0 | ${NOT_OBSERVED} | ${NOT_OBSERVED} | ${NOT_OBSERVED} | ${node.status} |`);
    }

    for (const call of node.calls) {
      lines.push(`| ${node.nodeId} | ${call.callIndex} | ${call.timestamp} | ${call.durationMs} | ${call.elapsedSincePreviousNodeMs} | ${call.status} |`);
    }
  }

  return `${lines.join('\n')}\n`;
}

module.exports = { rendersMethodCallEvidenceReport, rendersScenarioMethodTimelineTable, rendersScenarioTimingTable, rendersFeatureExecutionReport };
