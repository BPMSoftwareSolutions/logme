const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { normalizesTestimonyPath } = require('../../packages/logme-testimony-remediation-primitives/src/normalizes-testimony-path');
const { readsTestimonyJson } = require('../../packages/logme-testimony-remediation-primitives/src/reads-writes-testimony-json');
const { walksTestimonyArtifacts } = require('../../packages/logme-testimony-remediation-primitives/src/walks-testimony-artifacts');
const { collectsUniqueTestimonyValues } = require('../../packages/logme-testimony-remediation-primitives/src/collects-unique-testimony-values');

const BACKLOG_SCHEMA_VERSION = 'testimony-accuracy-remediation-backlog.v1';
const NOT_OBSERVED = 'not observed';

function readsProofsForRun(rootDir, runId) {
  if (process.env.LOGME_AUDIT === '1') LogMe(readsProofsForRun);
  const featuresPath = path.join(rootDir, 'evidence', 'runs', runId, 'features');
  const proofEntries = [];
  for (const proofPath of walksTestimonyArtifacts(featuresPath, 'feature-execution.contract.v1.json').sort()) {
    proofEntries.push({ proofPath: normalizesTestimonyPath(path.relative(rootDir, proofPath)), proof: readsTestimonyJson(proofPath) });
  }
  return proofEntries;
}

function readsAllMethodCalls(proof) {
  if (process.env.LOGME_AUDIT === '1') LogMe(readsAllMethodCalls);
  const calls = [];
  for (const node of proof.observedExecutionTimeline || []) {
    for (const methodCall of node.methodCalls || []) calls.push({ ...methodCall, nodeId: node.nodeId, nodeLabel: node.nodeLabel });
  }
  return calls;
}

function countsRepeatedSampleMethodEvents(proof) {
  if (process.env.LOGME_AUDIT === '1') LogMe(countsRepeatedSampleMethodEvents);
  let count = 0;
  for (const node of proof.observedExecutionTimeline || []) {
    for (const methodCall of node.methodCalls || []) {
      if (methodCall.methodName === 'sampleMethod') count += 1;
    }
    const summary = node.telemetryInfrastructureSummary;
    if (summary && summary.suppressedMethodNames.includes('sampleMethod')) count += summary.eventCount || 0;
  }
  return count;
}

function infersAffectedSourcePaths(proof, calls) {
  if (process.env.LOGME_AUDIT === '1') LogMe(infersAffectedSourcePaths);
  const paths = [];
  for (const node of proof.declaredExecutableBody || []) paths.push(node.runtimePath);
  for (const call of calls) paths.push(call.runtimeFilePath || call.runtimePath);
  const normalizedPaths = [];
  for (const sourcePath of paths) normalizedPaths.push(normalizesTestimonyPath(sourcePath).replace(/:\d+-\d+$/u, ''));
  return collectsUniqueTestimonyValues(normalizedPaths);
}

function suspectsCallPaths(calls, category) {
  if (process.env.LOGME_AUDIT === '1') LogMe(suspectsCallPaths);
  const paths = [];
  for (const call of calls) {
    const runtimePath = String(call.runtimePath || '');
    const methodName = call.methodName || '';
    const matches = (category === 'primary' && !runtimePath.includes('/packages/'))
      || (category === 'package' && runtimePath.includes('/packages/'))
      || (category === 'utility' && /util|format|parse|sort|read|write/iu.test(methodName))
      || (category === 'telemetry' && (methodName === 'sampleMethod' || /LogMe|telemetry/iu.test(methodName)));
    if (matches) paths.push(call.runtimeFilePath || call.runtimePath);
  }
  return collectsUniqueTestimonyValues(paths);
}

function buildsTestimonyBacklogItem(runId, proofPath, proof) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsTestimonyBacklogItem);
  const calls = readsAllMethodCalls(proof);
  let unnamedMethodCallCount = 0;
  for (const call of calls) {
    if (call.methodName === NOT_OBSERVED || call.methodKind === NOT_OBSERVED) unnamedMethodCallCount += 1;
  }
  const repeatedSampleMethodEventCount = countsRepeatedSampleMethodEvents(proof);
  const packetId = `${proof.featureId}--${proof.scenarioId}`;
  const outputRoot = `quality/domain-remediation/${runId}/testimony-accuracy`;
  const affectedSourcePaths = infersAffectedSourcePaths(proof, calls);
  return {
    packetId, sourceRunId: runId, featureId: proof.featureId, scenarioId: proof.scenarioId,
    noisyProofArtifactPaths: [proofPath], telemetrySourcePaths: collectsUniqueTestimonyValues(proof.telemetrySourcePaths || []),
    affectedSourcePaths, unnamedMethodCallCount, repeatedSampleMethodEventCount,
    suspectedPrimaryProductCalls: suspectsCallPaths(calls, 'primary'), suspectedPackageBoundaryCalls: suspectsCallPaths(calls, 'package'),
    suspectedPureUtilityCalls: suspectsCallPaths(calls, 'utility'), suspectedTelemetryInfrastructureCalls: suspectsCallPaths(calls, 'telemetry'),
    geminiWorkerRole: 'Gemini Testimony Classifier Worker', defaultExecutor: 'gemini-worker-packet',
    allowedMutationPaths: collectsUniqueTestimonyValues([...affectedSourcePaths, 'contracts/file-system-bodies/02_declared/']),
    blockedMutationPaths: [`evidence/runs/${runId}/`, 'docs/feature-proofs/'],
    requiredProposalArtifacts: [`${outputRoot}/${packetId}.classification.proposal.v1.json`, `${outputRoot}/${packetId}.patch.proposal.v1.json`],
    requiredVerificationCommands: ['npm test', 'npm run report:truth:fast'],
    promotionCriteria: [
      'classification proposal passed adversarial review and product-owner acceptance',
      'no product-domain-native call has methodName or methodKind equal to not observed',
      'telemetry infrastructure is summarized outside product method drill-down',
      'historical evidence and other blocked paths are unchanged',
    ],
  };
}

function plansTestimonyAccuracyBacklog(config, runId, options = {}) {
  if (process.env.LOGME_AUDIT === '1') LogMe(plansTestimonyAccuracyBacklog);
  const proofEntries = options.proofEntries || readsProofsForRun(config.rootDir, runId);
  const backlogItems = [];
  for (const entry of proofEntries) {
    const item = buildsTestimonyBacklogItem(runId, entry.proofPath, entry.proof);
    if (item.unnamedMethodCallCount > 0 || item.repeatedSampleMethodEventCount > 0) backlogItems.push(item);
  }
  return {
    schemaVersion: BACKLOG_SCHEMA_VERSION, sourceRunId: runId,
    executorPolicy: {
      preferredProvider: 'gemini', highVolumeExecutor: 'gemini-worker-packet',
      platformAgentResponsibilities: ['create bounded work packets', 'run deterministic verification', 'promote accepted patches', 'summarize results for product-owner review'],
      fallbackRequires: ['explicit provider failure', 'product-owner override'],
    },
    evidencePath: `quality/domain-remediation/${runId}/testimony-accuracy/remediation-backlog.v1.json`, backlogItems,
  };
}

module.exports = { BACKLOG_SCHEMA_VERSION, buildsTestimonyBacklogItem, plansTestimonyAccuracyBacklog, readsAllMethodCalls, readsProofsForRun };
