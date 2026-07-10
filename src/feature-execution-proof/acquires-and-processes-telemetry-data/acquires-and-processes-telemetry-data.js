const { LogMe } = require('../../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../../packages/logme-testimony-core/src/sample-method');
const { NOT_OBSERVED } = require('../feature-execution-proof-shared-constants/feature-execution-proof-shared-constants');

function readsEventTimestamp(event) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return event.timestamp || event.startedAt || event.firstSeenAt || NOT_OBSERVED;
}

function readsMilliseconds(timestamp) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const parsed = Date.parse(timestamp || '');
  return Number.isNaN(parsed) ? null : parsed;
}

function formatsSourceLineRange(lineRange) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!lineRange || lineRange.start === NOT_OBSERVED || lineRange.end === NOT_OBSERVED) {
    return {
      start: NOT_OBSERVED,
      end: NOT_OBSERVED,
    };
  }

  return lineRange;
}

function readsReceiptPathsForMethod(event, nodeReceiptPaths) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (Array.isArray(event.receiptPaths)) {
    return event.receiptPaths;
  }

  if (event.receiptPath) {
    return [event.receiptPath];
  }

  return nodeReceiptPaths;
}

function readsTelemetryEventIdsForMethod(event, fallbackId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (Array.isArray(event.telemetryEventIds) && event.telemetryEventIds.length > 0) {
    return event.telemetryEventIds;
  }

  return [event.telemetryEventId || event.eventId || event.id || fallbackId];
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

function readsMethodCalls(nodes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const methodCalls = [];

  for (const node of nodes) {
    for (const methodCall of node.methodCalls || []) {
      methodCalls.push(methodCall);
    }
  }

  return methodCalls;
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

module.exports = { readsEventTimestamp, readsMilliseconds, formatsSourceLineRange, readsReceiptPathsForMethod, readsTelemetryEventIdsForMethod, readsTelemetryEventIds, readsTelemetryEventPaths, readsTelemetrySourcePaths, eventMatchesNode, sortsEventsByTimeAndStep, readsMethodCalls, readsObservedCalls, readsCallDurations, readsElapsedBetweenNodes, findsReceiptPathsForNode };
