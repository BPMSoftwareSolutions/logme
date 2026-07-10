const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

function writesBodyContractPatchEvidence(config, bodyContractPatch) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const evidencePath = path.join(config.rootDir, bodyContractPatch.evidencePath);
  const evidenceContent = `${JSON.stringify(bodyContractPatch, null, 2)}\n`;

  fs.mkdirSync(path.dirname(evidencePath), { recursive: true });
  fs.writeFileSync(evidencePath, evidenceContent, 'utf8');
  const canonicalPatch = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));

  return {
    evidencePath,
    bytesWritten: Buffer.byteLength(evidenceContent, 'utf8'),
    entryCount: canonicalPatch.entries.length,
  };
}

module.exports = {
  writesBodyContractPatchEvidence,
};
