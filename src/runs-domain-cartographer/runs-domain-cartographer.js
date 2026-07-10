const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { mapsDomainBodyResponsibilities } = require('../maps-domain-body-responsibilities/maps-domain-body-responsibilities');
const { writesDomainMapEvidence } = require('../writes-domain-map-evidence/writes-domain-map-evidence');

function runsDomainCartographer(config, runId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const analysisContract = readsFrozenEvidenceContract(config, runId, 'domain-analysis', 'domain-body-analysis.contract.v1.json');
  const sprawlContract = readsFrozenEvidenceContract(config, runId, 'sprawl', 'domain-body-sprawl.contract.v1.json');
  const domainMap = mapsDomainBodyResponsibilities(config, analysisContract, sprawlContract);
  const receipt = writesDomainMapEvidence(config, domainMap);

  return { domainMap, receipt };
}

function readsFrozenEvidenceContract(config, runId, evidenceKind, fileName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const evidencePath = path.join(config.rootDir, 'evidence', 'runs', runId, evidenceKind, fileName);
  return JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
}

module.exports = {
  runsDomainCartographer,
};
