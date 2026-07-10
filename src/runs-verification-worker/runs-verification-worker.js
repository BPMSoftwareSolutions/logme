const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { verifiesRemediationPacket } = require('../verifies-remediation-packet/verifies-remediation-packet');
const { writesVerificationReportEvidence } = require('../writes-verification-report-evidence/writes-verification-report-evidence');

function runsVerificationWorker(config, runId, packetId, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const packet = readsBacklogPacket(config, runId, packetId);
  const verificationReport = verifiesRemediationPacket(config, packet, options);
  const receipt = writesVerificationReportEvidence(config, runId, verificationReport);

  return { verificationReport, receipt };
}

function readsBacklogPacket(config, runId, packetId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const backlogPath = path.join(config.rootDir, 'quality', 'domain-remediation', runId, 'remediation-backlog.v1.json');
  const backlog = JSON.parse(fs.readFileSync(backlogPath, 'utf8'));
  const packet = backlog.backlogItems.find(matchesPacketId);

  if (!packet) {
    throw new Error(`no backlog item found with packetId "${packetId}" in ${backlogPath}`);
  }

  return packet;

  function matchesPacketId(item) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return item.packetId === packetId;
  }
}

module.exports = {
  runsVerificationWorker,
};
