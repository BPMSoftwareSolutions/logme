const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { callsScenarioTieOutWorker } = require('../calls-scenario-tieout-worker/calls-scenario-tieout-worker');

const TIEOUT_SCHEMA_VERSION = 'scenario-tieout.proposal.v1';
const UNSUPPORTED_FINDING = 'scenario-tieout-unsupported';
const VALID_EVIDENCE_SOURCES = new Set([
  'feature document',
  'test file',
  'executable method',
  'generated report section',
  'receipt artifact',
]);

async function proposesScenarioTieOut(config, domainMap, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const callWorker = options.callWorker || callsScenarioTieOutWorker;
  const featureDocPaths = listsFeatureDocPaths(config.rootDir);
  const candidates = selectsTieOutCandidates(domainMap);
  const mappings = [];

  for (const candidate of candidates) {
    const request = buildsTieOutRequest(config, candidate, featureDocPaths);
    const workerResult = await callWorker(request, options.callerOptions || {});
    mappings.push(buildsMappingFromWorkerResult(config, candidate, request, workerResult));
  }

  return {
    schemaVersion: TIEOUT_SCHEMA_VERSION,
    sourceRunId: domainMap.sourceRunId,
    evidencePath: `quality/domain-remediation/${domainMap.sourceRunId}/scenario-tieout.proposal.v1.json`,
    sourceArtifacts: {
      domainMapProposalPath: domainMap.evidencePath,
    },
    summary: buildsTieOutSummary(mappings),
    mappings,
  };
}

function selectsTieOutCandidates(domainMap) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const candidates = [];
  for (const entry of domainMap.fileEntries) {
    if (entry.classification === 'product-domain body' && !entry.hasScenarioTieOut) {
      candidates.push(entry);
    }
  }

  return candidates;
}

function listsFeatureDocPaths(rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const featureDir = path.join(rootDir, 'docs', 'features');
  if (!fs.existsSync(featureDir)) {
    return [];
  }

  const featureDocPaths = [];
  for (const entry of fs.readdirSync(featureDir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.feature.md')) {
      featureDocPaths.push(`docs/features/${entry.name}`);
    }
  }

  return featureDocPaths.sort();
}

function resolvesCandidateTestFilePaths(rootDir, filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const stem = path.basename(filePath, '.js');
  const candidateTestPath = `tests/${stem}.test.js`;

  return fs.existsSync(path.join(rootDir, candidateTestPath)) ? [candidateTestPath] : [];
}

function buildsTieOutRequest(config, candidate, featureDocPaths) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    filePath: candidate.filePath,
    primaryBodyResponsibility: candidate.primaryBodyResponsibility,
    classification: candidate.classification,
    candidateFeatureDocPaths: featureDocPaths,
    candidateTestFilePaths: resolvesCandidateTestFilePaths(config.rootDir, candidate.filePath),
  };
}

function buildsMappingFromWorkerResult(config, candidate, request, workerResult) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (workerResult.callFailure) {
    return buildsUnsupportedMapping(candidate.filePath, `worker call failed: ${workerResult.callFailure.type} - ${workerResult.callFailure.message}`);
  }

  const parsed = parsesWorkerResponseText(workerResult.rawResponseText);
  if (!parsed) {
    const truncationNote = workerResult.finishReason === 'MAX_TOKENS' ? ' (response was truncated at the token limit)' : '';
    return buildsUnsupportedMapping(candidate.filePath, `worker response was not valid JSON${truncationNote}`);
  }

  const verification = verifiesEvidenceCitation(config.rootDir, request, parsed);
  if (!verification.verified) {
    return buildsUnsupportedMapping(candidate.filePath, verification.reason, parsed);
  }

  return {
    filePath: candidate.filePath,
    featureId: parsed.featureId,
    scenarioId: parsed.scenarioId,
    evidenceCitation: {
      source: parsed.evidenceSource,
      reference: parsed.evidenceCitation,
    },
    confidence: parsed.confidence,
    reviewerAction: 'review before promotion',
    findingCodes: [],
    reasoning: parsed.reasoning,
  };
}

function parsesWorkerResponseText(rawResponseText) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!rawResponseText) {
    return null;
  }

  try {
    return JSON.parse(rawResponseText);
  } catch {
    return null;
  }
}

function verifiesEvidenceCitation(rootDir, request, parsed) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!VALID_EVIDENCE_SOURCES.has(parsed.evidenceSource)) {
    return { verified: false, reason: `worker returned unsupported evidence source "${parsed.evidenceSource}"` };
  }

  if (!parsed.evidenceCitation) {
    return { verified: false, reason: 'worker returned an empty evidence citation' };
  }

  if (parsed.evidenceSource === 'feature document' && !request.candidateFeatureDocPaths.includes(parsed.evidenceCitation)) {
    return { verified: false, reason: `cited feature document "${parsed.evidenceCitation}" does not exist in docs/features/` };
  }

  if (parsed.evidenceSource === 'test file' && !request.candidateTestFilePaths.includes(parsed.evidenceCitation)) {
    return { verified: false, reason: `cited test file "${parsed.evidenceCitation}" does not exist in tests/` };
  }

  if ((parsed.evidenceSource === 'feature document' || parsed.evidenceSource === 'test file') && !fs.existsSync(path.join(rootDir, parsed.evidenceCitation))) {
    return { verified: false, reason: `cited evidence path "${parsed.evidenceCitation}" was not found on disk` };
  }

  return { verified: true, reason: null };
}

function buildsUnsupportedMapping(filePath, reason, parsed) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    filePath,
    featureId: (parsed && parsed.featureId) || null,
    scenarioId: (parsed && parsed.scenarioId) || null,
    evidenceCitation: null,
    confidence: 'low',
    reviewerAction: 'product-owner review required',
    findingCodes: [UNSUPPORTED_FINDING],
    reasoning: reason,
  };
}

function buildsTieOutSummary(mappings) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let supportedCount = 0;
  let unsupportedCount = 0;

  for (const mapping of mappings) {
    if (mapping.findingCodes.includes(UNSUPPORTED_FINDING)) {
      unsupportedCount += 1;
    } else {
      supportedCount += 1;
    }
  }

  return {
    totalCandidates: mappings.length,
    supportedMappings: supportedCount,
    unsupportedMappings: unsupportedCount,
  };
}

module.exports = {
  TIEOUT_SCHEMA_VERSION,
  UNSUPPORTED_FINDING,
  proposesScenarioTieOut,
};
