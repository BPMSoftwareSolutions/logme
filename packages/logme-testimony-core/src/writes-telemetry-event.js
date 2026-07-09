const testimonyReentrancyGuard = require('./testimony-reentrancy-guard');
const { sampleMethod } = require('./sample-method');

let executionStep = 0;

function writesTelemetryEvent(method) {
  if (process.env.LOGME_AUDIT === '1' && !testimonyReentrancyGuard.isTestifying) {
    testimonyReentrancyGuard.isTestifying = true;
    try {
      const { LogMe } = require('./LogMe');
      LogMe(sampleMethod);
    } finally {
      testimonyReentrancyGuard.isTestifying = false;
    }
  }

  return {
    executionStep: ++executionStep,
    name: method.name || '(anonymous)',
    source: method.toString().split(/\r?\n/),
  };
}

module.exports = { writesTelemetryEvent };
