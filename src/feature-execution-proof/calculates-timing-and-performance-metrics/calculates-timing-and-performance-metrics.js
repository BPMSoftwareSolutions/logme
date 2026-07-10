const { LogMe } = require('../../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../../packages/logme-testimony-core/src/sample-method');
const { NOT_OBSERVED } = require('../feature-execution-proof-shared-constants/feature-execution-proof-shared-constants');
const { readsCallDurations, readsElapsedBetweenNodes, readsMethodCalls, readsMilliseconds, readsObservedCalls } = require('../acquires-and-processes-telemetry-data/acquires-and-processes-telemetry-data');
const { sumsNumbers } = require('../provides-general-utility-functions/provides-general-utility-functions');

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

function calculatesMethodTimingMetrics(nodes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const methodCalls = readsMethodCalls(nodes);
  const methodDurations = readsCallDurations(methodCalls);
  const slowestMethodCall = findsSlowestMethodCall(methodCalls);
  const totalMethodExecutionTimeMs = methodDurations.length > 0 ? sumsNumbers(methodDurations) : NOT_OBSERVED;
  const totalObservedWaitTimeMs = calculatesTotalObservedWaitTimeMs(methodCalls);

  return {
    totalObservedMethodCalls: methodCalls.length,
    slowestMethodCall: slowestMethodCall || NOT_OBSERVED,
    totalMethodExecutionTimeMs,
    totalObservedWaitTimeMs,
  };
}

function calculatesTotalObservedWaitTimeMs(methodCalls) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const waits = [];

  for (const methodCall of methodCalls) {
    if (typeof methodCall.elapsedSincePreviousCallMs === 'number') {
      waits.push(methodCall.elapsedSincePreviousCallMs);
    }
  }

  return waits.length > 0 ? sumsNumbers(waits) : NOT_OBSERVED;
}

function findsSlowestMethodCall(methodCalls) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let slowestMethodCall = null;

  for (const methodCall of methodCalls) {
    if (typeof methodCall.durationMs === 'number' && (!slowestMethodCall || methodCall.durationMs > slowestMethodCall.durationMs)) {
      slowestMethodCall = methodCall;
    }
  }

  return slowestMethodCall;
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

module.exports = { calculatesDurationMs, calculatesTimingMetrics, calculatesMethodTimingMetrics, calculatesTotalObservedWaitTimeMs, findsSlowestMethodCall, findsSlowestNode, buildsNodeDurationMetric, buildsNodeDurationMetrics };
