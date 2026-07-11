const { LogMe } = require('../../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../../packages/logme-testimony-core/src/sample-method');
const { MISSING, NOT_OBSERVED } = require('../feature-execution-proof-shared-constants/feature-execution-proof-shared-constants');
const { eventMatchesNode, findsReceiptPathsForNode, formatsSourceLineRange, readsEventTimestamp, readsMilliseconds, readsReceiptPathsForMethod, readsTelemetryEventIds, readsTelemetryEventIdsForMethod, readsTelemetryEventPaths, sortsEventsByTimeAndStep } = require('../acquires-and-processes-telemetry-data/acquires-and-processes-telemetry-data');
const { calculatesDurationMs } = require('../calculates-timing-and-performance-metrics/calculates-timing-and-performance-metrics');
const { summarizesCalls } = require('../provides-general-utility-functions/provides-general-utility-functions');

const PRODUCT_DOMAIN_NATIVE = 'product-domain-native';
const PACKAGE_BOUNDARY_SUMMARIZED = 'package-boundary-summarized';
const TELEMETRY_INFRASTRUCTURE_SUPPRESS = 'telemetry-infrastructure-suppress';

function readsAuditBoundary(event) {
  if (process.env.LOGME_AUDIT === '1') LogMe(readsAuditBoundary);
  return event.auditBoundary || event.testimonyClassification || event.classification || PRODUCT_DOMAIN_NATIVE;
}

function isMethodDrillDownEvent(event) {
  if (process.env.LOGME_AUDIT === '1') LogMe(isMethodDrillDownEvent);
  return ![PACKAGE_BOUNDARY_SUMMARIZED, TELEMETRY_INFRASTRUCTURE_SUPPRESS, 'generated-evidence-ignore'].includes(readsAuditBoundary(event));
}

function buildsTelemetryInfrastructureSummary(events) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsTelemetryInfrastructureSummary);
  const suppressedEvents = [];
  for (const event of events) {
    if (readsAuditBoundary(event) === TELEMETRY_INFRASTRUCTURE_SUPPRESS) suppressedEvents.push(event);
  }
  if (suppressedEvents.length === 0) {
    return null;
  }

  const suppressedMethodNames = [];
  const sourceEvidencePaths = [];
  for (const event of suppressedEvents) {
    suppressedMethodNames.push(event.methodName || event.name || NOT_OBSERVED);
    if (event.telemetryEventPath || event.eventPath) sourceEvidencePaths.push(event.telemetryEventPath || event.eventPath);
  }
  return {
    eventCount: suppressedEvents.length,
    suppressedMethodNames: [...new Set(suppressedMethodNames)].sort(),
    telemetryPackagePath: suppressedEvents[0].telemetryPackagePath || suppressedEvents[0].methodRuntimePath || suppressedEvents[0].runtimePath || NOT_OBSERVED,
    suppressionReason: 'classified telemetry infrastructure is retained as a summary outside product method drill-down',
    sourceEvidencePaths: [...new Set(sourceEvidencePaths)].sort(),
  };
}

function buildsPackageBoundarySummaries(events) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsPackageBoundarySummaries);
  const summariesByPath = new Map();
  for (const event of events) {
    if (readsAuditBoundary(event) !== PACKAGE_BOUNDARY_SUMMARIZED) {
      continue;
    }
    const packagePath = event.packagePath || event.methodRuntimePath || event.runtimePath || NOT_OBSERVED;
    if (!summariesByPath.has(packagePath)) {
      summariesByPath.set(packagePath, { packagePath, callCount: 0, methodNames: [], sourceEvidencePaths: [] });
    }
    const summary = summariesByPath.get(packagePath);
    summary.callCount += 1;
    summary.methodNames.push(event.methodName || event.name || NOT_OBSERVED);
    if (event.telemetryEventPath || event.eventPath) {
      summary.sourceEvidencePaths.push(event.telemetryEventPath || event.eventPath);
    }
  }

  const summaries = [];
  for (const summary of summariesByPath.values()) {
    summaries.push({
      ...summary,
      methodNames: [...new Set(summary.methodNames)].sort(),
      sourceEvidencePaths: [...new Set(summary.sourceEvidencePaths)].sort(),
      summaryReason: 'package behavior is summarized at the product-domain audit boundary',
    });
  }
  return summaries;
}

function rangeFallsOutsideDeclaredBody(event, node) {
  if (process.env.LOGME_AUDIT === '1') LogMe(rangeFallsOutsideDeclaredBody);
  const observedRange = event.workSourceLineRange || event.methodSourceLineRange || event.sourceLineRange;
  const declaredRange = node.sourceLineRange;
  if (!observedRange || !declaredRange || !Number.isFinite(Number(observedRange.start)) || !Number.isFinite(Number(observedRange.end)) || !Number.isFinite(Number(declaredRange.start)) || !Number.isFinite(Number(declaredRange.end))) {
    return false;
  }
  return Number(observedRange.start) < Number(declaredRange.start) || Number(observedRange.end) > Number(declaredRange.end);
}

function buildsObservedCall(event, index, previousTimestampMs, runStartMs) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const timestamp = readsEventTimestamp(event);
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

function buildsMethodCall(event, node, index, previousMethodTimestampMs, nodeStartMs, nodeReceiptPaths, receiptStatus) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const fallbackId = `method-event-${node.nodeId}-${index}`;
  const startedAt = event.methodStartedAt || event.startedAt || event.firstSeenAt || readsEventTimestamp(event);
  const completedAt = event.methodCompletedAt || event.completedAt || event.finishedAt || event.lastSeenAt || readsEventTimestamp(event);
  const startedAtMs = readsMilliseconds(startedAt);
  const sourceLineRange = formatsSourceLineRange(event.methodSourceLineRange || event.sourceLineRange || node.sourceLineRange);
  const receiptPaths = readsReceiptPathsForMethod(event, nodeReceiptPaths);
  const methodReceiptStatus = receiptStatus === MISSING ? MISSING : (receiptPaths.length > 0 ? 'observed' : MISSING);
  const blockerCode = methodReceiptStatus === MISSING ? 'method-call-receipt-missing' : (event.blockerCode || NOT_OBSERVED);

  return {
    callIndex: index,
    methodName: event.methodName || event.name || NOT_OBSERVED,
    methodKind: event.methodKind || event.kind || NOT_OBSERVED,
    auditBoundary: readsAuditBoundary(event),
    runtimeFilePath: event.methodRuntimePath || event.runtimeFilePath || event.runtimePath || node.runtimePath,
    runtimePath: event.methodRuntimePath || event.runtimeFilePath || event.runtimePath || node.runtimePath,
    sourceLineRange,
    owningFeatureId: event.featureId || NOT_OBSERVED,
    owningScenarioId: event.scenarioId || NOT_OBSERVED,
    owningNodeId: node.nodeId,
    owningNodeLabel: node.nodeLabel,
    contractPath: node.contractPath,
    startedAt,
    completedAt,
    durationMs: calculatesDurationMs({
      ...event,
      startedAt,
      finishedAt: completedAt,
    }),
    elapsedSincePreviousCallMs: startedAtMs !== null && previousMethodTimestampMs !== null ? startedAtMs - previousMethodTimestampMs : NOT_OBSERVED,
    elapsedSinceNodeStartMs: startedAtMs !== null && nodeStartMs !== null ? startedAtMs - nodeStartMs : NOT_OBSERVED,
    telemetryEventIds: readsTelemetryEventIdsForMethod(event, fallbackId),
    telemetryEventPath: event.telemetryEventPath || event.eventPath || NOT_OBSERVED,
    receiptPaths,
    receiptStatus: methodReceiptStatus,
    status: event.status === 'blocked' || methodReceiptStatus === MISSING ? 'blocked' : 'ok',
    blockerCode,
    fixRoute: blockerCode === 'method-call-receipt-missing'
      ? 'write method-level receipt proof and link it to this method call'
      : (event.fixRoute || 'none'),
  };
}

function buildsMethodCalls(sortedEvents, node, nodeReceiptPaths, receiptStatus) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const methodCalls = [];
  const nodeStartMs = sortedEvents.length > 0 ? readsMilliseconds(readsEventTimestamp(sortedEvents[0])) : null;
  let previousMethodTimestampMs = nodeStartMs;

  for (let index = 0; index < sortedEvents.length; index += 1) {
    if (!isMethodDrillDownEvent(sortedEvents[index])) {
      continue;
    }
    const methodCall = buildsMethodCall(
      sortedEvents[index],
      node,
      methodCalls.length + 1,
      previousMethodTimestampMs,
      nodeStartMs,
      nodeReceiptPaths,
      receiptStatus,
    );
    previousMethodTimestampMs = readsMilliseconds(methodCall.startedAt);
    methodCalls.push(methodCall);
  }

  return methodCalls;
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
  const methodCalls = buildsMethodCalls(sortedEvents, node, nodeReceiptPaths, receiptStatus);
  const telemetryInfrastructureSummary = buildsTelemetryInfrastructureSummary(sortedEvents);
  const packageBoundarySummaries = buildsPackageBoundarySummaries(sortedEvents);
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

  if (calls.length > 0 && methodCalls.length === 0 && !telemetryInfrastructureSummary && packageBoundarySummaries.length === 0) {
    blockerCodes.push('observed-body-node-without-method-drilldown');
  }

  for (const methodCall of methodCalls) {
    if (methodCall.auditBoundary === PRODUCT_DOMAIN_NATIVE && (methodCall.methodName === NOT_OBSERVED || methodCall.methodKind === NOT_OBSERVED)) {
      if (!blockerCodes.includes('product-method-name-not-observed')) {
        blockerCodes.push('product-method-name-not-observed');
      }
      methodCall.status = 'blocked';
      methodCall.blockerCode = 'product-method-name-not-observed';
      methodCall.fixRoute = 'create a bounded Gemini testimony remediation packet for this native product call';
    }
    if (methodCall.blockerCode !== NOT_OBSERVED && !blockerCodes.includes(methodCall.blockerCode)) {
      blockerCodes.push(methodCall.blockerCode);
    }
  }

  let rangeIncomplete = false;
  for (const event of sortedEvents) {
    if (rangeFallsOutsideDeclaredBody(event, node)) rangeIncomplete = true;
  }
  if (rangeIncomplete) {
    blockerCodes.push('executable-body-source-range-incomplete');
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
    methodCalls,
    packageBoundarySummaries,
    telemetryInfrastructureSummary,
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

function stampsMethodCallOwnership(nodes, featureId, scenarioId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  for (const node of nodes) {
    for (const methodCall of node.methodCalls || []) {
      if (methodCall.owningFeatureId === NOT_OBSERVED) {
        methodCall.owningFeatureId = featureId;
      }

      if (methodCall.owningScenarioId === NOT_OBSERVED) {
        methodCall.owningScenarioId = scenarioId;
      }
    }
  }
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

module.exports = { buildsObservedCall, buildsObservedCalls, buildsMethodCall, buildsMethodCalls, buildsObservedNode, buildsObservedExecutionTimeline, stampsMethodCallOwnership, normalizesDeclaredNode, normalizesDeclaredNodes, buildsPackageBoundarySummaries, buildsTelemetryInfrastructureSummary, rangeFallsOutsideDeclaredBody, readsAuditBoundary };
