const { LogMe } = require('../../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../../packages/logme-testimony-core/src/sample-method');

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

module.exports = { countsObservedCalls, buildsNodeCallCountMetric, buildsNodeCallCountMetrics, calculatesCallCountMetrics };
