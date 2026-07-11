const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { writesTestimonyJson } = require('../../packages/logme-testimony-remediation-primitives/src/reads-writes-testimony-json');
const { buildsCompactGeminiHandoff } = require('../prepares-compact-gemini-handoff/prepares-compact-gemini-handoff');
const { callsGeminiTestimonyClassifier } = require('../calls-gemini-testimony-classifier/calls-gemini-testimony-classifier');
const { buildsClassificationProposal, buildsProviderUsage } = require('../proposes-testimony-remediation/proposes-testimony-remediation');

const NOT_OBSERVED = 'not observed';

async function runsTestimonyClassificationWorker(config, runId, backlogItem, proof, options = {}) {
  if (process.env.LOGME_AUDIT === '1') LogMe(runsTestimonyClassificationWorker);
  const handoff = buildsCompactGeminiHandoff(config, backlogItem, proof, options);
  const outputRoot = `quality/domain-remediation/${runId}/testimony-accuracy`;
  const handoffPath = `${outputRoot}/${backlogItem.packetId}.gemini-handoff.v1.json`;
  writesTestimonyJson(config.rootDir, handoffPath, handoff);
  const workerResult = await callsGeminiTestimonyClassifier(handoff, options);
  if (workerResult.callFailure) {
    const usage = buildsProviderUsage(runId, handoff, workerResult, { promptArtifactPath: handoffPath, responseArtifactPath: NOT_OBSERVED });
    usage.providerFailure = workerResult.callFailure;
    const usagePath = `${outputRoot}/${backlogItem.packetId}.provider-usage.v1.json`;
    writesTestimonyJson(config.rootDir, usagePath, usage);
    return { handoff, handoffPath, workerResult, proposal: null, usage, usagePath };
  }
  const responsePath = `${outputRoot}/${backlogItem.packetId}.gemini-response.v1.json`;
  writesTestimonyJson(config.rootDir, responsePath, JSON.parse(workerResult.rawResponseText));
  const proposal = buildsClassificationProposal(handoff, workerResult);
  const proposalPath = `${outputRoot}/${backlogItem.packetId}.classification.proposal.v1.json`;
  writesTestimonyJson(config.rootDir, proposalPath, proposal);
  const usage = buildsProviderUsage(runId, handoff, workerResult, { promptArtifactPath: handoffPath, responseArtifactPath: responsePath });
  const usagePath = `${outputRoot}/${backlogItem.packetId}.provider-usage.v1.json`;
  writesTestimonyJson(config.rootDir, usagePath, usage);
  return { handoff, handoffPath, workerResult, responsePath, proposal, proposalPath, usage, usagePath };
}

module.exports = { runsTestimonyClassificationWorker };
