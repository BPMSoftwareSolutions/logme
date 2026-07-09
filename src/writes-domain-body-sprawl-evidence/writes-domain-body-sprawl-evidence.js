const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

function writesDomainBodySprawlEvidence(config, sprawlContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const evidencePath = path.join(config.rootDir, sprawlContract.evidencePath);
  const evidenceContent = `${JSON.stringify(sprawlContract, null, 2)}\n`;

  fs.mkdirSync(path.dirname(evidencePath), { recursive: true });
  fs.writeFileSync(evidencePath, evidenceContent, 'utf8');

  return {
    evidencePath,
    bytesWritten: Buffer.byteLength(evidenceContent, 'utf8'),
  };
}

module.exports = { writesDomainBodySprawlEvidence };
