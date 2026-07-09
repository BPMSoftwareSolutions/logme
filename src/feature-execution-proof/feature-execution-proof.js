const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const FEATURE_PROOF_SCHEMA_VERSION = 'feature-execution.contract.v1';
const FEATURE_PROOF_GENERATOR_NAME = 'LogMe feature execution proof';
const FEATURE_PROOF_INVENTORY_SCHEMA_VERSION = 'feature-proof-inventory.contract.v1';
const NOT_OBSERVED = 'not observed';
const MISSING = 'missing';

function slugifies(value) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return String(value || 'unknown')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '') || 'unknown';
}

function readsLines(filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n').split('\n');
}

function discoversFeatureScenarios(featureFilePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = readsLines(featureFilePath);
  let featureName = path.basename(featureFilePath, path.extname(featureFilePath));
  let featureLine = 1;
  const scenarios = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const featureMatch = line.match(/^\s*Feature:\s+(.+)$/u);
    const scenarioMatch = line.match(/^\s*Scenario:\s+(.+)$/u);

    if (featureMatch) {
      featureName = featureMatch[1].trim();
      featureLine = index + 1;
    }

    if (scenarioMatch) {
      const scenarioName = scenarioMatch[1].trim();
      scenarios.push({
        scenarioId: slugifies(scenarioName),
        scenarioName,
        startLine: index + 1,
        endLine: lines.length,
      });
    }
  }

  for (let index = 0; index < scenarios.length; index += 1) {
    if (scenarios[index + 1]) {
      scenarios[index].endLine = scenarios[index + 1].startLine - 1;
    }
  }

  return {
    featureId: slugifies(featureName),
    featureName,
    featureLine,
    sourcePath: featureFilePath,
    scenarios,
  };
}

function discoversFeatureFiles(featuresRoot) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!fs.existsSync(featuresRoot)) {
    return [];
  }

  const entries = fs.readdirSync(featuresRoot).sort();
  const featureFiles = [];

  for (const entry of entries) {
    if (entry.endsWith('.feature.md') || entry.endsWith('.feature')) {
      featureFiles.push(path.join(featuresRoot, entry));
    }
  }

  return featureFiles;
}

function buildsFeatureProofPath(evidenceRoot, runId, featureId, scenarioId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return path.join(
    evidenceRoot,
    'runs',
    runId,
    'features',
    featureId,
    'scenarios',
    scenarioId,
    'feature-execution.contract.v1.json',
  );
}

function selectsScenarioProofStatus({ implementationStatus, proofPath, blockers }) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (implementationStatus !== 'implemented') {
    return 'not implemented';
  }

  if (!proofPath || !fs.existsSync(proofPath)) {
    return 'implemented not executed';
  }

  const proof = JSON.parse(fs.readFileSync(proofPath, 'utf8'));
  const blockerFindings = blockers || proof.blockerFindings || [];
  return blockerFindings.length > 0 || proof.promotionDecision.status === 'blocked'
    ? 'executed blocked'
    : 'proven';
}

function buildsFeatureProofInventory(options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const featuresRoot = options.featuresRoot || path.join(rootDir, 'docs', 'features');
  const evidenceRoot = options.evidenceRoot || path.join(rootDir, 'evidence');
  const runId = options.runId || new Date().toISOString().replace(/[:.]/gu, '-');
  const implementationIndex = options.implementationIndex || {};
  const featureFiles = options.featureFiles || discoversFeatureFiles(featuresRoot);
  const scenarios = [];

  for (const featureFile of featureFiles) {
    const feature = discoversFeatureScenarios(featureFile);

    for (const scenario of feature.scenarios) {
      const key = `${feature.featureId}/${scenario.scenarioId}`;
      const implementationStatus = implementationIndex[key] || implementationIndex[scenario.scenarioId] || 'not implemented';
      const evidencePacketPath = buildsFeatureProofPath(evidenceRoot, runId, feature.featureId, scenario.scenarioId);
      const proofStatus = selectsScenarioProofStatus({
        implementationStatus,
        proofPath: evidencePacketPath,
      });

      scenarios.push({
        runId,
        featureId: feature.featureId,
        featureName: feature.featureName,
        scenarioId: scenario.scenarioId,
        scenarioName: scenario.scenarioName,
        acceptanceSourcePath: feature.sourcePath,
        acceptanceSourceLineRange: {
          start: scenario.startLine,
          end: scenario.endLine,
        },
        implementationStatus,
        proofStatus,
        evidencePacketPath,
        blockerCodes: [],
      });
    }
  }

  return {
    schemaVersion: FEATURE_PROOF_INVENTORY_SCHEMA_VERSION,
    runId,
    generatedAt: options.generatedAt || new Date().toISOString(),
    generatorName: FEATURE_PROOF_GENERATOR_NAME,
    scenarios,
  };
}

function writesFeatureProofInventory(inventory, outputPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(inventory, null, 2)}\n`, 'utf8');

  return {
    inventoryPath: outputPath,
    bytesWritten: Buffer.byteLength(JSON.stringify(inventory, null, 2), 'utf8') + 1,
  };
}

function normalizesDeclaredNode(node, index) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    nodeId: node.nodeId || String(index).padStart(2, '0'),
    nodeLabel: node.nodeLabel || node.label || node.name || `node ${index + 1}`,
    contractPath: node.contractPath || NOT_OBSERVED,
    runtimePath: node.runtimePath || NOT_OBSERVED,
    sourceLineRange: node.sourceLineRange || {
      start: NOT_OBSERVED,
      end: NOT_OBSERVED,
    },
    requiredReceiptPaths: node.requiredReceiptPaths || node.receiptPaths || [],
  };
}

function eventMatchesNode(event, node) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return event.nodeId === node.nodeId
    || event.runtimePath === node.runtimePath
    || event.nodeLabel === node.nodeLabel
    || event.name === node.nodeLabel;
}

function sortsEventsByTimeAndStep(first, second) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const firstTime = Date.parse(first.timestamp || first.startedAt || first.firstSeenAt || '');
  const secondTime = Date.parse(second.timestamp || second.startedAt || second.firstSeenAt || '');

  if (!Number.isNaN(firstTime) && !Number.isNaN(secondTime) && firstTime !== secondTime) {
    return firstTime - secondTime;
  }

  return (first.executionStep || 0) - (second.executionStep || 0);
}

function readsMilliseconds(timestamp) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const parsed = Date.parse(timestamp || '');
  return Number.isNaN(parsed) ? null : parsed;
}

function calculatesDurationMs(event) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (typeof event.durationMs === 'number') {
    return event.durationMs;
  }

  const start = readsMilliseconds(event.startedAt || event.timestamp || event.firstSeenAt);
  const end = readsMilliseconds(event.finishedAt || event.lastSeenAt || event.timestamp);

  if (start === null || end === null) {
    return NOT_OBSERVED;
  }

  return Math.max(0, end - start);
}

function buildsObservedCall(event, index, previousTimestampMs, runStartMs) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const timestamp = event.timestamp || event.startedAt || event.firstSeenAt || NOT_OBSERVED;
  const timestampMs = readsMilliseconds(timestamp);

  return {
    callIndex: index,
    telemetryEventId: event.telemetryEventId || event.eventId || event.id || `event-${index}`,
    telemetryEventPath: event.telemetryEventPath || event.eventPath || NOT_OBSERVED,
    timestamp,
    firstSeenAt: event.firstSeenAt || event.startedAt || timestamp,
    lastSeenAt: event.lastSeenAt || event.finishedAt || timestamp,
    durationMs: calculatesDurationMs(event),
    elapsedSinceRunStartMs: timestampMs !== null && runStartMs !== null ? timestampMs - runStartMs : NOT_OBSERVED,
    elapsedSincePreviousNodeMs: timestampMs !== null && previousTimestampMs !== null ? timestampMs - previousTimestampMs : NOT_OBSERVED,
    status: event.status || 'observed',
  };
}

function summarizesCalls(calls) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (calls.length === 0) {
    return {
      callCount: 0,
      firstCallTimestamp: NOT_OBSERVED,
      lastCallTimestamp: NOT_OBSERVED,
      totalDurationMs: NOT_OBSERVED,
      minimumCallDurationMs: NOT_OBSERVED,
      maximumCallDurationMs: NOT_OBSERVED,
      averageCallDurationMs: NOT_OBSERVED,
    };
  }

  const durations = [];

  for (const call of calls) {
    if (typeof call.durationMs === 'number') {
      durations.push(call.durationMs);
    }
  }

  const totalDurationMs = durations.length > 0
    ? sumsNumbers(durations)
    : NOT_OBSERVED;

  return {
    callCount: calls.length,
    firstCallTimestamp: calls[0].timestamp,
    lastCallTimestamp: calls[calls.length - 1].timestamp,
    totalDurationMs,
    minimumCallDurationMs: durations.length > 0 ? Math.min(...durations) : NOT_OBSERVED,
    maximumCallDurationMs: durations.length > 0 ? Math.max(...durations) : NOT_OBSERVED,
    averageCallDurationMs: durations.length > 0 ? totalDurationMs / durations.length : NOT_OBSERVED,
  };
}

function sumsNumbers(numbers) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let sum = 0;

  for (const number of numbers) {
    sum += number;
  }

  return sum;
}

function findsReceiptPathsForNode(node, receiptPaths) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (node.requiredReceiptPaths.length === 0) {
    const matchingReceiptPaths = [];

    for (const receiptPath of receiptPaths) {
      if (String(receiptPath).includes(node.nodeId)) {
        matchingReceiptPaths.push(receiptPath);
      }
    }

    return matchingReceiptPaths;
  }

  const observedReceiptPaths = [];

  for (const receiptPath of node.requiredReceiptPaths) {
    if (receiptPaths.includes(receiptPath)) {
      observedReceiptPaths.push(receiptPath);
    }
  }

  return observedReceiptPaths;
}

function buildsObservedCalls(sortedEvents, previousTimestampMs, runStartMs) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const calls = [];

  for (let index = 0; index < sortedEvents.length; index += 1) {
    calls.push(buildsObservedCall(sortedEvents[index], index + 1, previousTimestampMs, runStartMs));
  }

  return calls;
}

function readsTelemetryEventIds(calls) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const telemetryEventIds = [];

  for (const call of calls) {
    telemetryEventIds.push(call.telemetryEventId);
  }

  return telemetryEventIds;
}

function readsTelemetryEventPaths(calls) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const telemetryEventPaths = [];

  for (const call of calls) {
    if (call.telemetryEventPath !== NOT_OBSERVED && !telemetryEventPaths.includes(call.telemetryEventPath)) {
      telemetryEventPaths.push(call.telemetryEventPath);
    }
  }

  return telemetryEventPaths;
}

function buildsObservedNode(node, matchingEvents, receiptPaths, previousTimestampMs, runStartMs) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const sortedEvents = [...matchingEvents].sort(sortsEventsByTimeAndStep);
  const calls = buildsObservedCalls(sortedEvents, previousTimestampMs, runStartMs);
  const callSummary = summarizesCalls(calls);
  const nodeReceiptPaths = findsReceiptPathsForNode(node, receiptPaths);
  const receiptStatus = node.requiredReceiptPaths.length === 0 || nodeReceiptPaths.length === node.requiredReceiptPaths.length
    ? 'observed'
    : MISSING;
  const telemetryEventIds = readsTelemetryEventIds(calls);
  const telemetryEventPaths = readsTelemetryEventPaths(calls);
  const lastCall = calls[calls.length - 1] || null;
  const blockerCodes = [];

  if (calls.length === 0) {
    blockerCodes.push('telemetry-not-observed');
  }

  if (receiptStatus === MISSING) {
    blockerCodes.push('required-receipt-missing');
  }

  return {
    nodeId: node.nodeId,
    nodeLabel: node.nodeLabel,
    contractPath: node.contractPath,
    runtimePath: node.runtimePath,
    sourceLineRange: node.sourceLineRange,
    telemetryEventIds,
    telemetryEventPath: telemetryEventPaths[0] || NOT_OBSERVED,
    telemetryEventPaths,
    firstSeenAt: callSummary.firstCallTimestamp,
    lastSeenAt: callSummary.lastCallTimestamp,
    durationMs: callSummary.totalDurationMs,
    elapsedSinceRunStartMs: calls[0] ? calls[0].elapsedSinceRunStartMs : NOT_OBSERVED,
    elapsedSincePreviousNodeMs: calls[0] ? calls[0].elapsedSincePreviousNodeMs : NOT_OBSERVED,
    callCount: callSummary.callCount,
    calls,
    callSummary,
    receiptPaths: nodeReceiptPaths,
    receiptStatus,
    status: calls.length === 0 ? NOT_OBSERVED : (receiptStatus === MISSING ? MISSING : 'observed'),
    blockerCodes,
    lastObservedTimestampMs: lastCall ? readsMilliseconds(lastCall.timestamp) : previousTimestampMs,
  };
}

function buildsObservedExecutionTimeline(declaredNodes, telemetryEvents, receiptPaths, runStartedAt) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const runStartMs = readsMilliseconds(runStartedAt);
  let previousTimestampMs = runStartMs;
  const observedNodes = [];

  for (const declaredNode of declaredNodes) {
    const matchingEvents = [];

    for (const telemetryEvent of telemetryEvents) {
      if (eventMatchesNode(telemetryEvent, declaredNode)) {
        matchingEvents.push(telemetryEvent);
      }
    }

    const observedNode = buildsObservedNode(declaredNode, matchingEvents, receiptPaths, previousTimestampMs, runStartMs);
    previousTimestampMs = observedNode.lastObservedTimestampMs;
    delete observedNode.lastObservedTimestampMs;
    observedNodes.push(observedNode);
  }

  return observedNodes;
}

function readsObservedCalls(nodes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const observedCalls = [];

  for (const node of nodes) {
    for (const call of node.calls) {
      if (call.timestamp !== NOT_OBSERVED) {
        observedCalls.push(call);
      }
    }
  }

  return observedCalls;
}

function readsCallDurations(calls) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const durations = [];

  for (const call of calls) {
    if (typeof call.durationMs === 'number') {
      durations.push(call.durationMs);
    }
  }

  return durations;
}

function readsElapsedBetweenNodes(nodes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const elapsedBetweenNodes = [];

  for (const node of nodes) {
    if (typeof node.elapsedSincePreviousNodeMs === 'number') {
      elapsedBetweenNodes.push(node.elapsedSincePreviousNodeMs);
    }
  }

  return elapsedBetweenNodes;
}

function findsSlowestNode(nodes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let slowestNode = null;

  for (const node of nodes) {
    if (typeof node.durationMs === 'number' && (!slowestNode || node.durationMs > slowestNode.durationMs)) {
      slowestNode = node;
    }
  }

  return slowestNode;
}

function buildsNodeDurationMetric(node) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    nodeId: node.nodeId,
    durationMs: node.durationMs,
  };
}

function buildsNodeDurationMetrics(nodes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const nodeDurationMs = [];

  for (const node of nodes) {
    nodeDurationMs.push(buildsNodeDurationMetric(node));
  }

  return nodeDurationMs;
}

function calculatesTimingMetrics(nodes, runStartedAt, receiptWrittenAt) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const observedCalls = readsObservedCalls(nodes);
  const durations = readsCallDurations(observedCalls);
  const runStartMs = readsMilliseconds(runStartedAt);
  const receiptMs = readsMilliseconds(receiptWrittenAt);
  const firstCallMs = observedCalls.length > 0 ? readsMilliseconds(observedCalls[0].timestamp) : null;
  const lastCallMs = observedCalls.length > 0 ? readsMilliseconds(observedCalls[observedCalls.length - 1].timestamp) : null;
  const elapsedBetweenNodes = readsElapsedBetweenNodes(nodes);
  const slowestNode = findsSlowestNode(nodes);
  const activeExecutionTimeMs = durations.length > 0
    ? sumsNumbers(durations)
    : NOT_OBSERVED;
  const cycleTimeMs = firstCallMs !== null && lastCallMs !== null ? Math.max(0, lastCallMs - firstCallMs) : NOT_OBSERVED;

  return {
    scenarioLeadTimeMs: runStartMs !== null && receiptMs !== null ? Math.max(0, receiptMs - runStartMs) : NOT_OBSERVED,
    scenarioCycleTimeMs: cycleTimeMs,
    activeExecutionTimeMs,
    waitingTimeMs: typeof cycleTimeMs === 'number' && typeof activeExecutionTimeMs === 'number'
      ? Math.max(0, cycleTimeMs - activeExecutionTimeMs)
      : NOT_OBSERVED,
    nodeDurationMs: buildsNodeDurationMetrics(nodes),
    elapsedBetweenNodesMs: elapsedBetweenNodes.length > 0 ? elapsedBetweenNodes : NOT_OBSERVED,
    slowestNodeId: slowestNode ? slowestNode.nodeId : NOT_OBSERVED,
    totalObservedCalls: observedCalls.length,
  };
}

function buildsNodeCallCountMetric(node) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    nodeId: node.nodeId,
    callCount: node.callCount,
    firstCallTimestamp: node.callSummary.firstCallTimestamp,
    lastCallTimestamp: node.callSummary.lastCallTimestamp,
  };
}

function countsObservedCalls(nodes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let totalObservedCalls = 0;

  for (const node of nodes) {
    totalObservedCalls += node.callCount;
  }

  return totalObservedCalls;
}

function buildsNodeCallCountMetrics(nodes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const nodeCallCounts = [];

  for (const node of nodes) {
    nodeCallCounts.push(buildsNodeCallCountMetric(node));
  }

  return nodeCallCounts;
}

function calculatesCallCountMetrics(nodes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    totalObservedCalls: countsObservedCalls(nodes),
    nodeCallCounts: buildsNodeCallCountMetrics(nodes),
  };
}

function buildsSli(name, description, numerator, denominator, unit, value, measurementWindow, evidenceSourcePaths) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    name,
    description,
    numerator,
    denominator,
    unit,
    value,
    measurementWindow,
    evidenceSourcePaths,
  };
}

function calculatesServiceLevelIndicators(proof) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const nodes = proof.observedExecutionTimeline || [];
  const observedNodeCount = countsNodesWithObservedTelemetry(nodes);
  const receiptCoveredCount = countsNodesWithObservedReceipts(nodes);
  const blockerCount = (proof.blockerFindings || []).length;
  const measurementWindow = {
    startedAt: proof.runStartedAt || NOT_OBSERVED,
    endedAt: proof.receiptWrittenAt || proof.generatedAt,
  };
  const evidencePaths = [
    ...proof.telemetrySourcePaths,
    ...proof.receiptSourcePaths,
  ];

  return [
    buildsSli('scenario success rate', 'proven scenarios divided by evaluated scenarios', proof.promotionDecision.status === 'proven' ? 1 : 0, 1, 'ratio', proof.promotionDecision.status === 'proven' ? 1 : 0, measurementWindow, evidencePaths),
    buildsSli('scenario lead time ms', 'elapsed time from scenario request acceptance to final required receipt write', proof.timingMetrics.scenarioLeadTimeMs, 1, 'ms', proof.timingMetrics.scenarioLeadTimeMs, measurementWindow, evidencePaths),
    buildsSli('scenario cycle time ms', 'elapsed time from first executable runtime node to last executable runtime node', proof.timingMetrics.scenarioCycleTimeMs, 1, 'ms', proof.timingMetrics.scenarioCycleTimeMs, measurementWindow, evidencePaths),
    buildsSli('node duration ms', 'observed duration by executable body node', proof.timingMetrics.nodeDurationMs, nodes.length, 'ms', proof.timingMetrics.nodeDurationMs, measurementWindow, evidencePaths),
    buildsSli('elapsed between nodes ms', 'observed elapsed time between executable body nodes', proof.timingMetrics.elapsedBetweenNodesMs, nodes.length, 'ms', proof.timingMetrics.elapsedBetweenNodesMs, measurementWindow, evidencePaths),
    buildsSli('receipt write latency ms', 'elapsed time from final runtime observation to final required receipt write', proof.receiptWriteLatencyMs || NOT_OBSERVED, 1, 'ms', proof.receiptWriteLatencyMs || NOT_OBSERVED, measurementWindow, evidencePaths),
    buildsSli('telemetry completeness percentage', 'nodes with observed telemetry divided by declared nodes', observedNodeCount, nodes.length, 'percent', nodes.length > 0 ? (observedNodeCount / nodes.length) * 100 : NOT_OBSERVED, measurementWindow, proof.telemetrySourcePaths),
    buildsSli('receipt coverage percentage', 'nodes with required receipts divided by declared nodes', receiptCoveredCount, nodes.length, 'percent', nodes.length > 0 ? (receiptCoveredCount / nodes.length) * 100 : NOT_OBSERVED, measurementWindow, proof.receiptSourcePaths),
    buildsSli('blocker rate', 'blocker findings divided by declared nodes', blockerCount, nodes.length, 'ratio', nodes.length > 0 ? blockerCount / nodes.length : NOT_OBSERVED, measurementWindow, evidencePaths),
    buildsSli('retry count', 'observed repeated calls beyond first calls per node', proof.callCountMetrics.totalObservedCalls - observedNodeCount, proof.callCountMetrics.totalObservedCalls, 'count', proof.callCountMetrics.totalObservedCalls - observedNodeCount, measurementWindow, evidencePaths),
    buildsSli('total observed calls', 'total runtime calls observed in telemetry', proof.callCountMetrics.totalObservedCalls, 1, 'count', proof.callCountMetrics.totalObservedCalls, measurementWindow, proof.telemetrySourcePaths),
  ];
}

function countsNodesWithObservedTelemetry(nodes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let observedNodeCount = 0;

  for (const node of nodes) {
    if (node.callCount > 0) {
      observedNodeCount += 1;
    }
  }

  return observedNodeCount;
}

function countsNodesWithObservedReceipts(nodes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let receiptCoveredCount = 0;

  for (const node of nodes) {
    if (node.receiptStatus === 'observed') {
      receiptCoveredCount += 1;
    }
  }

  return receiptCoveredCount;
}

function indexesSlisByName(slis) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const sliByName = new Map();

  for (const sli of slis) {
    sliByName.set(sli.name, sli);
  }

  return sliByName;
}

function evaluatesSingleServiceLevelObjective(proof, sliByName, target) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const sli = sliByName.get(target.sliName);
  let status = 'not enough evidence';

  if (sli && typeof sli.value === 'number') {
    if (target.operator === '<=') {
      status = sli.value <= target.target ? 'met' : 'missed';
    } else if (target.operator === '>=') {
      status = sli.value >= target.target ? 'met' : 'missed';
    } else if (target.operator === '===') {
      status = sli.value === target.target ? 'met' : 'missed';
    }
  }

  return {
    sloId: target.sloId,
    featureId: proof.featureId,
    scenarioId: proof.scenarioId,
    sliName: target.sliName,
    target: target.target,
    observedValue: sli ? sli.value : NOT_OBSERVED,
    unit: target.unit || (sli && sli.unit) || NOT_OBSERVED,
    measurementWindow: sli ? sli.measurementWindow : {
      startedAt: NOT_OBSERVED,
      endedAt: NOT_OBSERVED,
    },
    status,
    evidencePacketPaths: proof.proofPath ? [proof.proofPath] : [],
  };
}

function evaluatesServiceLevelObjectives(proof, sloTargets = []) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const sliByName = indexesSlisByName(proof.serviceLevelIndicators || []);
  const evaluations = [];

  for (const target of sloTargets) {
    evaluations.push(evaluatesSingleServiceLevelObjective(proof, sliByName, target));
  }

  return evaluations;
}

function readsBlockerFindingCode(finding) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return finding.code;
}

function readsNodeBlockerCodes(node) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return node.blockerCodes;
}

function buildsPromotionDecision(nodes, blockerFindings) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const blockerCodes = [];

  for (const finding of blockerFindings) {
    blockerCodes.push(readsBlockerFindingCode(finding));
  }

  for (const node of nodes) {
    const nodeBlockerCodes = readsNodeBlockerCodes(node);

    for (const blockerCode of nodeBlockerCodes) {
      blockerCodes.push(blockerCode);
    }
  }

  return {
    status: blockerCodes.length === 0 ? 'proven' : 'blocked',
    blockerCodes,
    reason: blockerCodes.length === 0
      ? 'all declared executable body nodes have observed telemetry and required receipts'
      : 'one or more executable body nodes lack observed telemetry, required receipts, or explicit blocker clearance',
  };
}

function normalizesDeclaredNodes(declaredExecutableBody) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const declaredNodes = [];

  for (let index = 0; index < declaredExecutableBody.length; index += 1) {
    declaredNodes.push(normalizesDeclaredNode(declaredExecutableBody[index], index));
  }

  return declaredNodes;
}

function readsTelemetrySourcePaths(telemetryEvents) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const telemetrySourcePaths = [];

  for (const event of telemetryEvents) {
    const telemetryPath = event.telemetryEventPath || event.eventPath;

    if (telemetryPath && !telemetrySourcePaths.includes(telemetryPath)) {
      telemetrySourcePaths.push(telemetryPath);
    }
  }

  return telemetrySourcePaths;
}

function buildsFeatureExecutionProof(input) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const declaredNodes = normalizesDeclaredNodes(input.declaredExecutableBody || []);
  const telemetryEvents = input.telemetryEvents || [];
  const receiptSourcePaths = input.receiptSourcePaths || input.receiptPaths || [];
  const observedExecutionTimeline = buildsObservedExecutionTimeline(
    declaredNodes,
    telemetryEvents,
    receiptSourcePaths,
    input.runStartedAt,
  );
  const blockerFindings = input.blockerFindings || [];
  const promotionDecision = buildsPromotionDecision(observedExecutionTimeline, blockerFindings);
  const proof = {
    schemaVersion: FEATURE_PROOF_SCHEMA_VERSION,
    runId: input.runId,
    featureId: input.featureId,
    scenarioId: input.scenarioId,
    scenarioName: input.scenarioName,
    generatedAt: input.generatedAt || new Date().toISOString(),
    generatorName: FEATURE_PROOF_GENERATOR_NAME,
    runStartedAt: input.runStartedAt || NOT_OBSERVED,
    receiptWrittenAt: input.receiptWrittenAt || NOT_OBSERVED,
    acceptanceSource: input.acceptanceSource,
    declaredExecutableBody: declaredNodes,
    observedExecutionTimeline,
    telemetrySourcePaths: readsTelemetrySourcePaths(telemetryEvents),
    receiptSourcePaths,
    timingMetrics: null,
    callCountMetrics: null,
    blockerFindings,
    promotionDecision,
  };
  proof.timingMetrics = calculatesTimingMetrics(observedExecutionTimeline, proof.runStartedAt, proof.receiptWrittenAt);
  proof.callCountMetrics = calculatesCallCountMetrics(observedExecutionTimeline);
  proof.serviceLevelIndicators = calculatesServiceLevelIndicators(proof);
  proof.sloEvaluations = evaluatesServiceLevelObjectives(proof, input.sloTargets || []);

  return proof;
}

function writesFeatureExecutionProof(proof, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const evidenceRoot = options.evidenceRoot || path.join(process.cwd(), 'evidence');
  const proofPath = options.proofPath || buildsFeatureProofPath(evidenceRoot, proof.runId, proof.featureId, proof.scenarioId);
  const proofWithPath = {
    ...proof,
    proofPath,
  };

  fs.mkdirSync(path.dirname(proofPath), { recursive: true });
  fs.writeFileSync(proofPath, `${JSON.stringify(proofWithPath, null, 2)}\n`, 'utf8');

  return {
    proofPath,
    bytesWritten: Buffer.byteLength(JSON.stringify(proofWithPath, null, 2), 'utf8') + 1,
    proof: proofWithPath,
  };
}

function formatsValue(value) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (value === undefined || value === null) {
    return NOT_OBSERVED;
  }

  if (Array.isArray(value)) {
    return value.length === 0 ? NOT_OBSERVED : value.join(', ');
  }

  return String(value);
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

function escapesCsv(value) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const text = formatsValue(value);

  if (/[",\r\n]/u.test(text)) {
    return `"${text.replace(/"/gu, '""')}"`;
  }

  return text;
}

function projectsFeatureExecutionProofToCsv(proofs) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const proofList = Array.isArray(proofs) ? proofs : [proofs];
  const rows = [[
    'run id',
    'feature id',
    'scenario id',
    'node id',
    'node label',
    'runtime path',
    'call index',
    'timestamp',
    'duration ms',
    'elapsed since previous node ms',
    'status',
    'blocker code',
  ]];

  for (const proof of proofList) {
    for (const node of proof.observedExecutionTimeline) {
      if (node.calls.length === 0) {
        rows.push([proof.runId, proof.featureId, proof.scenarioId, node.nodeId, node.nodeLabel, node.runtimePath, 0, NOT_OBSERVED, NOT_OBSERVED, NOT_OBSERVED, node.status, node.blockerCodes[0] || NOT_OBSERVED]);
      }

      for (const call of node.calls) {
        rows.push([proof.runId, proof.featureId, proof.scenarioId, node.nodeId, node.nodeLabel, node.runtimePath, call.callIndex, call.timestamp, call.durationMs, call.elapsedSincePreviousNodeMs, call.status, node.blockerCodes[0] || NOT_OBSERVED]);
      }
    }
  }

  const renderedRows = [];

  for (const row of rows) {
    const escapedCells = [];

    for (const cell of row) {
      escapedCells.push(escapesCsv(cell));
    }

    renderedRows.push(escapedCells.join(','));
  }

  return `${renderedRows.join('\n')}\n`;
}

function indexesSloEvaluationsById(evaluations) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const evaluationsById = new Map();

  for (const evaluation of evaluations) {
    evaluationsById.set(evaluation.sloId, evaluation);
  }

  return evaluationsById;
}

function readsSupportingEvaluations(evaluationsById, supportingSloIds) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const supportingEvaluations = [];

  for (const sloId of supportingSloIds) {
    supportingEvaluations.push(evaluationsById.get(sloId));
  }

  return supportingEvaluations;
}

function detectsUnsupportedSupportingEvaluation(supportingEvaluations) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (supportingEvaluations.length === 0) {
    return true;
  }

  for (const evaluation of supportingEvaluations) {
    if (!evaluation || evaluation.status !== 'met') {
      return true;
    }
  }

  return false;
}

function checksFeatureReportTruthGate(reportContent, proof) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const findings = [];

  if (!reportContent.includes(proof.proofPath || 'feature-execution.contract.v1.json')) {
    findings.push({
      code: 'feature-report-fact-without-json-proof',
      reason: 'the report does not cite the canonical feature execution proof JSON',
    });
  }

  const claimMatches = reportContent.matchAll(/\b(duration ms|call count|promotion decision|receipt status):\s*([^\n|]+)/giu);

  for (const match of claimMatches) {
    const claimedValue = match[2].trim();

    if (claimedValue !== NOT_OBSERVED && !JSON.stringify(proof).includes(claimedValue)) {
      findings.push({
        code: 'feature-report-fact-without-json-proof',
        reason: `report claim "${match[0].trim()}" is absent from feature-execution.contract.v1.json`,
      });
    }
  }

  return {
    verdict: findings.length === 0 ? 'PASS' : 'BLOCKED',
    findings,
  };
}

function checksUnsupportedSlaClaims(proof, slaClaims = []) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const evaluationsById = indexesSloEvaluationsById(proof.sloEvaluations || []);
  const findings = [];

  for (const claim of slaClaims) {
    const supportingEvaluations = readsSupportingEvaluations(evaluationsById, claim.supportingSloIds || []);
    const hasUnsupportedEvidence = detectsUnsupportedSupportingEvaluation(supportingEvaluations);

    if (hasUnsupportedEvidence) {
      findings.push({
        code: 'sla-claim-without-slo-evidence',
        slaId: claim.slaId,
        reason: 'the SLA claim is not supported by met SLO evidence in the canonical proof',
      });
    }
  }

  return findings;
}

module.exports = {
  FEATURE_PROOF_GENERATOR_NAME,
  FEATURE_PROOF_INVENTORY_SCHEMA_VERSION,
  FEATURE_PROOF_SCHEMA_VERSION,
  buildsFeatureExecutionProof,
  buildsFeatureProofInventory,
  buildsFeatureProofPath,
  calculatesServiceLevelIndicators,
  checksFeatureReportTruthGate,
  checksUnsupportedSlaClaims,
  discoversFeatureScenarios,
  evaluatesServiceLevelObjectives,
  projectsFeatureExecutionProofToCsv,
  rendersFeatureExecutionReport,
  slugifies,
  writesFeatureExecutionProof,
  writesFeatureProofInventory,
};
