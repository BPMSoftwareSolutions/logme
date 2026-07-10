const { LogMe } = require('../../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../../packages/logme-testimony-core/src/sample-method');
const { NOT_OBSERVED } = require('../feature-execution-proof-shared-constants/feature-execution-proof-shared-constants');

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

module.exports = { sumsNumbers, summarizesCalls };
