const { writesTelemetryEvent } = require('./writes-telemetry-event');
const { sampleMethod } = require('./sample-method');
const testimonyReentrancyGuard = require('./testimony-reentrancy-guard');

function LogMe(method) {
  if (process.env.LOGME_AUDIT === '1' && !testimonyReentrancyGuard.isTestifying) {
    testimonyReentrancyGuard.isTestifying = true;
    try {
      LogMe(sampleMethod);
    } finally {
      testimonyReentrancyGuard.isTestifying = false;
    }
  }

  if (typeof method === 'function') {
    const event = writesTelemetryEvent(method);
    console.log(JSON.stringify(event, null, 2));
    return event;
  }

  const { runsLogMeDomainAudit } = require('../../../src/runs-logme-domain-audit');
  return runsLogMeDomainAudit();
}

module.exports = { LogMe };
