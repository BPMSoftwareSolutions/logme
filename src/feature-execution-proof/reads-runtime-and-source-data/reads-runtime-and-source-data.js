const { LogMe } = require('../../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../../packages/logme-testimony-core/src/sample-method');
const fs = require('node:fs');
const { NOT_OBSERVED } = require('../feature-execution-proof-shared-constants/feature-execution-proof-shared-constants');

function readsFirstBlockerCode(node) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!Array.isArray(node.blockerCodes) || node.blockerCodes.length === 0) {
    return NOT_OBSERVED;
  }

  return node.blockerCodes[0];
}

function readsLines(filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n').split('\n');
}

function readsRuntimeStep(node) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!Array.isArray(node.telemetryEventIds) || node.telemetryEventIds.length === 0) {
    return NOT_OBSERVED;
  }

  return node.telemetryEventIds[0];
}

module.exports = { readsFirstBlockerCode, readsLines, readsRuntimeStep };
