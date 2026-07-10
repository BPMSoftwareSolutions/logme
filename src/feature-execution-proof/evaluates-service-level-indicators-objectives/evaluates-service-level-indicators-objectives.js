const { LogMe } = require('../../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../../packages/logme-testimony-core/src/sample-method');
const { NOT_OBSERVED } = require('../feature-execution-proof-shared-constants/feature-execution-proof-shared-constants');

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

module.exports = { buildsSli, calculatesServiceLevelIndicators, countsNodesWithObservedTelemetry, countsNodesWithObservedReceipts, indexesSlisByName, evaluatesSingleServiceLevelObjective, evaluatesServiceLevelObjectives };
