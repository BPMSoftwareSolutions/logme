const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { readsTestimonyJson, writesTestimonyJson } = require('../../packages/logme-testimony-remediation-primitives/src/reads-writes-testimony-json');
const { buildsCompactGeminiHandoff } = require('../prepares-compact-gemini-handoff/prepares-compact-gemini-handoff');

function writesTestimonyPlanningArtifacts(config, backlog, proofsByPath = new Map(), options = {}) {
  if (process.env.LOGME_AUDIT === '1') LogMe(writesTestimonyPlanningArtifacts);
  const writtenPaths = [writesTestimonyJson(config.rootDir, backlog.evidencePath, backlog)];
  const handoffs = [];
  for (const item of backlog.backlogItems) {
    const proof = proofsByPath.get(item.noisyProofArtifactPaths[0]) || readsTestimonyJson(path.join(config.rootDir, item.noisyProofArtifactPaths[0]));
    const handoff = buildsCompactGeminiHandoff(config, item, proof, options);
    const handoffPath = `quality/domain-remediation/${backlog.sourceRunId}/testimony-accuracy/${item.packetId}.gemini-handoff.v1.json`;
    writtenPaths.push(writesTestimonyJson(config.rootDir, handoffPath, handoff));
    handoffs.push({ handoff, handoffPath });
  }
  return { writtenPaths, handoffs };
}

module.exports = { writesTestimonyPlanningArtifacts };
