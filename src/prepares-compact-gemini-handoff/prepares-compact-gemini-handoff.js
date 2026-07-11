const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { normalizesTestimonyPath, resolvesTestimonyWorkspacePath } = require('../../packages/logme-testimony-remediation-primitives/src/normalizes-testimony-path');
const { buildsClassificationResponseSchema } = require('../calls-gemini-testimony-classifier/calls-gemini-testimony-classifier');
const { readsAllMethodCalls } = require('../plans-testimony-accuracy-backlog/plans-testimony-accuracy-backlog');

const HANDOFF_SCHEMA_VERSION = 'testimony-accuracy-gemini-handoff.v1';
const NOT_OBSERVED = 'not observed';

function readsSourceSlice(rootDir, sourcePath, lineRange, maxLines = 120) {
  if (process.env.LOGME_AUDIT === '1') LogMe(readsSourceSlice);
  const absolutePath = resolvesTestimonyWorkspacePath(rootDir, sourcePath);
  if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) return { sourcePath: normalizesTestimonyPath(sourcePath), lineRange, content: NOT_OBSERVED };
  const lines = fs.readFileSync(absolutePath, 'utf8').split(/\r?\n/u);
  const requestedStart = Number(lineRange && lineRange.start) || 1;
  const requestedEnd = Number(lineRange && lineRange.end) || Math.min(lines.length, requestedStart + maxLines - 1);
  const start = Math.max(1, requestedStart);
  const end = Math.min(lines.length, requestedEnd, start + maxLines - 1);
  return { sourcePath: normalizesTestimonyPath(path.relative(rootDir, absolutePath)), lineRange: { start, end }, content: lines.slice(start - 1, end).join('\n') };
}

function buildsCompactGeminiHandoff(config, backlogItem, proof, options = {}) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsCompactGeminiHandoff);
  const calls = readsAllMethodCalls(proof);
  const slices = [];
  for (const node of proof.declaredExecutableBody || []) slices.push(readsSourceSlice(config.rootDir, node.runtimePath, node.sourceLineRange, options.maxSliceLines));
  const currentBodyContractEntries = [];
  for (const entry of options.bodyContractEntries || []) {
    if (backlogItem.affectedSourcePaths.includes(entry.path)) currentBodyContractEntries.push(entry);
  }
  const noisyCallClusters = [];
  for (const call of calls) {
    if (call.methodName === NOT_OBSERVED || call.methodKind === NOT_OBSERVED || call.methodName === 'sampleMethod') {
      noisyCallClusters.push({
        nodeId: call.nodeId, sourcePath: normalizesTestimonyPath(call.runtimeFilePath || call.runtimePath), sourceLineRange: call.sourceLineRange,
        currentMethodName: call.methodName, observedTelemetryName: call.methodName, occurrenceCount: 1,
      });
    }
  }
  return {
    schemaVersion: HANDOFF_SCHEMA_VERSION, packetId: backlogItem.packetId, sourceProofPath: backlogItem.noisyProofArtifactPaths[0],
    sourceTelemetrySummary: { sourcePaths: backlogItem.telemetrySourcePaths, unnamedMethodCallCount: backlogItem.unnamedMethodCallCount, repeatedSampleMethodEventCount: backlogItem.repeatedSampleMethodEventCount },
    affectedSourceSlices: slices, currentBodyContractEntries, featureId: backlogItem.featureId, scenarioId: backlogItem.scenarioId, noisyCallClusters,
    candidateRemediationActions: [
      'replace generic testimony with actual native method identity', 'summarize package-boundary calls', 'extract pure utilities behind a package boundary',
      'suppress telemetry infrastructure from product drill-down', 'leave boundary cases for product-owner review',
    ],
    allowedPaths: backlogItem.allowedMutationPaths, blockedPaths: backlogItem.blockedMutationPaths, requiredOutputSchema: buildsClassificationResponseSchema(),
    compactnessPolicy: { entireRunFoldersIncluded: false, historicalArchivesIncluded: false, unrelatedSourceFilesIncluded: false, maxSourceSliceLines: options.maxSliceLines || 120 },
  };
}

module.exports = { HANDOFF_SCHEMA_VERSION, buildsCompactGeminiHandoff };
