const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');

const CLASSIFICATIONS = Object.freeze([
  'audit boundary',
  'product-domain-native',
  'product-domain-boundary-case',
  'package-boundary-summarized',
  'pure-utility-extract',
  'telemetry-infrastructure-suppress',
  'generated-evidence-ignore',
  'product-owner-review-required',
]);

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const BACKLOG_SCHEMA_VERSION = 'testimony-accuracy-remediation-backlog.v1';
const HANDOFF_SCHEMA_VERSION = 'testimony-accuracy-gemini-handoff.v1';
const CLASSIFICATION_SCHEMA_VERSION = 'testimony-classification.proposal.v1';
const PACKAGE_EXTRACTION_SCHEMA_VERSION = 'testimony-package-extraction.proposal.v1';
const PATCH_SCHEMA_VERSION = 'testimony-remediation-patch.proposal.v1';
const PROVIDER_USAGE_SCHEMA_VERSION = 'testimony-remediation-provider-usage.v1';
const VERIFICATION_SCHEMA_VERSION = 'testimony-accuracy-verification.report.v1';
const NOT_OBSERVED = 'not observed';

function normalizesSlashes(value) {
  if (process.env.LOGME_AUDIT === '1') LogMe(normalizesSlashes);
  return String(value || '').replace(/\\/gu, '/');
}

function resolvesWorkspacePath(rootDir, candidatePath) {
  if (process.env.LOGME_AUDIT === '1') LogMe(resolvesWorkspacePath);
  const withoutLineRange = normalizesSlashes(candidatePath).replace(/:\d+-\d+$/u, '');
  return path.isAbsolute(withoutLineRange) ? withoutLineRange : path.join(rootDir, withoutLineRange);
}

function readsJson(filePath) {
  if (process.env.LOGME_AUDIT === '1') LogMe(readsJson);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writesJson(rootDir, relativePath, value) {
  if (process.env.LOGME_AUDIT === '1') LogMe(writesJson);
  const absolutePath = path.join(rootDir, relativePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  return absolutePath;
}

function walksFiles(directoryPath, fileName, results = []) {
  if (process.env.LOGME_AUDIT === '1') LogMe(walksFiles);
  if (!fs.existsSync(directoryPath)) {
    return results;
  }

  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      walksFiles(entryPath, fileName, results);
    } else if (entry.name === fileName) {
      results.push(entryPath);
    }
  }

  return results;
}

function readsProofsForRun(rootDir, runId) {
  if (process.env.LOGME_AUDIT === '1') LogMe(readsProofsForRun);
  const featuresPath = path.join(rootDir, 'evidence', 'runs', runId, 'features');
  const proofEntries = [];
  for (const proofPath of walksFiles(featuresPath, 'feature-execution.contract.v1.json').sort()) {
    proofEntries.push({
      proofPath: normalizesSlashes(path.relative(rootDir, proofPath)),
      proof: readsJson(proofPath),
    });
  }
  return proofEntries;
}

function readsAllMethodCalls(proof) {
  if (process.env.LOGME_AUDIT === '1') LogMe(readsAllMethodCalls);
  const calls = [];
  for (const node of proof.observedExecutionTimeline || []) {
    for (const methodCall of node.methodCalls || []) {
      calls.push({ ...methodCall, nodeId: node.nodeId, nodeLabel: node.nodeLabel });
    }
  }
  return calls;
}

function countsRepeatedSampleMethodEvents(proof) {
  if (process.env.LOGME_AUDIT === '1') LogMe(countsRepeatedSampleMethodEvents);
  let count = 0;
  for (const node of proof.observedExecutionTimeline || []) {
    for (const methodCall of node.methodCalls || []) {
      if (methodCall.methodName === 'sampleMethod') {
        count += 1;
      }
    }
    for (const suppressedName of (node.telemetryInfrastructureSummary && node.telemetryInfrastructureSummary.suppressedMethodNames) || []) {
      if (suppressedName === 'sampleMethod') {
        count += node.telemetryInfrastructureSummary.eventCount || 0;
        break;
      }
    }
  }
  return count;
}

function uniquely(values) {
  if (process.env.LOGME_AUDIT === '1') LogMe(uniquely);
  const uniqueValues = new Set();
  for (const value of values) {
    if (value) uniqueValues.add(value);
  }
  return [...uniqueValues].sort();
}

function infersAffectedSourcePaths(proof, calls) {
  if (process.env.LOGME_AUDIT === '1') LogMe(infersAffectedSourcePaths);
  const paths = [];
  for (const node of proof.declaredExecutableBody || []) {
    paths.push(node.runtimePath);
  }
  for (const call of calls) {
    paths.push(call.runtimeFilePath || call.runtimePath);
  }
  const normalizedPaths = [];
  for (const sourcePath of paths) normalizedPaths.push(normalizesSlashes(sourcePath).replace(/:\d+-\d+$/u, ''));
  return uniquely(normalizedPaths);
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
  return uniquely(paths);
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

  return {
    packetId,
    sourceRunId: runId,
    featureId: proof.featureId,
    scenarioId: proof.scenarioId,
    noisyProofArtifactPaths: [proofPath],
    telemetrySourcePaths: uniquely(proof.telemetrySourcePaths || []),
    affectedSourcePaths: infersAffectedSourcePaths(proof, calls),
    unnamedMethodCallCount,
    repeatedSampleMethodEventCount,
    suspectedPrimaryProductCalls: suspectsCallPaths(calls, 'primary'),
    suspectedPackageBoundaryCalls: suspectsCallPaths(calls, 'package'),
    suspectedPureUtilityCalls: suspectsCallPaths(calls, 'utility'),
    suspectedTelemetryInfrastructureCalls: suspectsCallPaths(calls, 'telemetry'),
    geminiWorkerRole: 'Gemini Testimony Classifier Worker',
    defaultExecutor: 'gemini-worker-packet',
    allowedMutationPaths: uniquely([...infersAffectedSourcePaths(proof, calls), 'contracts/file-system-bodies/02_declared/']),
    blockedMutationPaths: [`evidence/runs/${runId}/`, 'docs/feature-proofs/'],
    requiredProposalArtifacts: [
      `${outputRoot}/${packetId}.classification.proposal.v1.json`,
      `${outputRoot}/${packetId}.patch.proposal.v1.json`,
    ],
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
    if (item.unnamedMethodCallCount > 0 || item.repeatedSampleMethodEventCount > 0) {
      backlogItems.push(item);
    }
  }

  return {
    schemaVersion: BACKLOG_SCHEMA_VERSION,
    sourceRunId: runId,
    executorPolicy: {
      preferredProvider: 'gemini',
      highVolumeExecutor: 'gemini-worker-packet',
      platformAgentResponsibilities: [
        'create bounded work packets',
        'run deterministic verification',
        'promote accepted patches',
        'summarize results for product-owner review',
      ],
      fallbackRequires: ['explicit provider failure', 'product-owner override'],
    },
    evidencePath: `quality/domain-remediation/${runId}/testimony-accuracy/remediation-backlog.v1.json`,
    backlogItems,
  };
}

function readsSourceSlice(rootDir, sourcePath, lineRange, maxLines = 120) {
  if (process.env.LOGME_AUDIT === '1') LogMe(readsSourceSlice);
  const absolutePath = resolvesWorkspacePath(rootDir, sourcePath);
  if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
    return { sourcePath: normalizesSlashes(sourcePath), lineRange, content: NOT_OBSERVED };
  }

  const lines = fs.readFileSync(absolutePath, 'utf8').split(/\r?\n/u);
  const requestedStart = Number(lineRange && lineRange.start) || 1;
  const requestedEnd = Number(lineRange && lineRange.end) || Math.min(lines.length, requestedStart + maxLines - 1);
  const start = Math.max(1, requestedStart);
  const end = Math.min(lines.length, requestedEnd, start + maxLines - 1);
  return {
    sourcePath: normalizesSlashes(path.relative(rootDir, absolutePath)),
    lineRange: { start, end },
    content: lines.slice(start - 1, end).join('\n'),
  };
}

function buildsCompactGeminiHandoff(config, backlogItem, proof, options = {}) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsCompactGeminiHandoff);
  const calls = readsAllMethodCalls(proof);
  const slices = [];
  for (const node of proof.declaredExecutableBody || []) {
    slices.push(readsSourceSlice(config.rootDir, node.runtimePath, node.sourceLineRange, options.maxSliceLines));
  }

  const currentBodyContractEntries = [];
  for (const entry of options.bodyContractEntries || []) {
    if (backlogItem.affectedSourcePaths.includes(entry.path)) currentBodyContractEntries.push(entry);
  }
  const noisyCallClusters = [];
  for (const call of calls) {
    if (call.methodName === NOT_OBSERVED || call.methodKind === NOT_OBSERVED || call.methodName === 'sampleMethod') {
      noisyCallClusters.push({
      nodeId: call.nodeId,
      sourcePath: normalizesSlashes(call.runtimeFilePath || call.runtimePath),
      sourceLineRange: call.sourceLineRange,
      currentMethodName: call.methodName,
      observedTelemetryName: call.methodName,
      occurrenceCount: 1,
      });
    }
  }

  return {
    schemaVersion: HANDOFF_SCHEMA_VERSION,
    packetId: backlogItem.packetId,
    sourceProofPath: backlogItem.noisyProofArtifactPaths[0],
    sourceTelemetrySummary: {
      sourcePaths: backlogItem.telemetrySourcePaths,
      unnamedMethodCallCount: backlogItem.unnamedMethodCallCount,
      repeatedSampleMethodEventCount: backlogItem.repeatedSampleMethodEventCount,
    },
    affectedSourceSlices: slices,
    currentBodyContractEntries,
    featureId: backlogItem.featureId,
    scenarioId: backlogItem.scenarioId,
    noisyCallClusters,
    candidateRemediationActions: [
      'replace generic testimony with actual native method identity',
      'summarize package-boundary calls',
      'extract pure utilities behind a package boundary',
      'suppress telemetry infrastructure from product drill-down',
      'leave boundary cases for product-owner review',
    ],
    allowedPaths: backlogItem.allowedMutationPaths,
    blockedPaths: backlogItem.blockedMutationPaths,
    requiredOutputSchema: buildsClassificationResponseSchema(),
    compactnessPolicy: {
      entireRunFoldersIncluded: false,
      historicalArchivesIncluded: false,
      unrelatedSourceFilesIncluded: false,
      maxSourceSliceLines: options.maxSliceLines || 120,
    },
  };
}

function buildsClassificationResponseSchema() {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsClassificationResponseSchema);
  return {
    type: 'OBJECT',
    properties: {
      classifications: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            sourcePath: { type: 'STRING' },
            sourceLineRange: {
              type: 'OBJECT',
              properties: { start: { type: 'INTEGER' }, end: { type: 'INTEGER' } },
              required: ['start', 'end'],
            },
            currentMethodName: { type: 'STRING' },
            observedTelemetryName: { type: 'STRING' },
            inferredIntendedMethodName: { type: 'STRING' },
            auditBoundary: { type: 'STRING', enum: CLASSIFICATIONS },
            reason: { type: 'STRING' },
            evidenceCitations: { type: 'ARRAY', items: { type: 'STRING' } },
            confidence: { type: 'NUMBER' },
            recommendedRemediationAction: { type: 'STRING' },
          },
          required: ['sourcePath', 'sourceLineRange', 'currentMethodName', 'observedTelemetryName', 'inferredIntendedMethodName', 'auditBoundary', 'reason', 'evidenceCitations', 'confidence', 'recommendedRemediationAction'],
        },
      },
    },
    required: ['classifications'],
  };
}

function rendersClassifierPrompt(handoff) {
  if (process.env.LOGME_AUDIT === '1') LogMe(rendersClassifierPrompt);
  return [
    'You are the Gemini Testimony Classifier Worker.',
    'Classify every noisy call using only the bounded JSON packet below.',
    'Do not edit files. Do not assert promotion. Deterministic gates decide promotion.',
    `Allowed classifications: ${CLASSIFICATIONS.join(', ')}.`,
    'Return structured JSON matching requiredOutputSchema, never prose-only output.',
    '',
    JSON.stringify(handoff),
  ].join('\n');
}

function buildsGeminiRequestBody(handoff) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsGeminiRequestBody);
  return {
    contents: [{ role: 'user', parts: [{ text: rendersClassifierPrompt(handoff) }] }],
    generationConfig: {
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
      responseSchema: buildsClassificationResponseSchema(),
    },
  };
}

function extractsGeminiText(data) {
  if (process.env.LOGME_AUDIT === '1') LogMe(extractsGeminiText);
  const candidate = data.candidates && data.candidates[0];
  if (!candidate || !candidate.content || !Array.isArray(candidate.content.parts)) {
    return '';
  }
  const parts = [];
  for (const part of candidate.content.parts) parts.push(part.text || '');
  return parts.join('');
}

async function callsGeminiTestimonyClassifier(handoff, options = {}) {
  if (process.env.LOGME_AUDIT === '1') LogMe(callsGeminiTestimonyClassifier);
  const apiKey = options.apiKey || process.env.LOC_GEMINI_API_KEY;
  const model = options.model || GEMINI_MODEL;
  const fetchImpl = options.fetchImpl || fetch;
  if (!apiKey) {
    return { provider: 'gemini', model, retryCount: 0, fallbackReason: null, callFailure: { type: 'authentication-error', message: 'LOC_GEMINI_API_KEY is not set' } };
  }

  try {
    const response = await fetchImpl(`${GEMINI_BASE_URL}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildsGeminiRequestBody(handoff)),
    });
    if (!response.ok) {
      return { provider: 'gemini', model, retryCount: 0, fallbackReason: null, callFailure: { type: `http-${response.status}`, message: await response.text() } };
    }
    const data = await response.json();
    return {
      provider: 'gemini',
      model,
      rawResponseText: extractsGeminiText(data),
      usage: data.usageMetadata || null,
      retryCount: 0,
      fallbackReason: null,
      callFailure: null,
    };
  } catch (error) {
    return { provider: 'gemini', model, retryCount: 0, fallbackReason: null, callFailure: { type: error.name === 'AbortError' ? 'timeout-error' : 'network-error', message: error.message } };
  }
}

function validatesClassification(classification, handoff) {
  if (process.env.LOGME_AUDIT === '1') LogMe(validatesClassification);
  if (!CLASSIFICATIONS.includes(classification.auditBoundary)) {
    throw new Error(`unsupported testimony classification: ${classification.auditBoundary}`);
  }
  const sourcePath = normalizesSlashes(classification.sourcePath);
  let sourceIsBounded = false;
  for (const slice of handoff.affectedSourceSlices) {
    if (normalizesSlashes(slice.sourcePath) === sourcePath) sourceIsBounded = true;
  }
  if (!sourceIsBounded) {
    throw new Error(`classification cites source outside bounded handoff: ${sourcePath}`);
  }
}

function buildsClassificationProposal(handoff, workerResult) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsClassificationProposal);
  if (workerResult.callFailure) {
    throw new Error(`Gemini testimony classification failed: ${workerResult.callFailure.type}: ${workerResult.callFailure.message}`);
  }
  const parsed = JSON.parse(workerResult.rawResponseText);
  if (!Array.isArray(parsed.classifications)) {
    throw new Error('Gemini testimony classification response must contain classifications[]');
  }
  for (const classification of parsed.classifications) {
    validatesClassification(classification, handoff);
  }
  return {
    schemaVersion: CLASSIFICATION_SCHEMA_VERSION,
    packetId: handoff.packetId,
    featureId: handoff.featureId,
    scenarioId: handoff.scenarioId,
    implementationFilesMutated: false,
    classifications: parsed.classifications,
  };
}

function buildsProviderUsage(runId, handoff, workerResult, paths) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsProviderUsage);
  const usage = workerResult.usage || {};
  return {
    schemaVersion: PROVIDER_USAGE_SCHEMA_VERSION,
    provider: workerResult.provider || 'gemini',
    model: workerResult.model || GEMINI_MODEL,
    packetId: handoff.packetId,
    promptArtifactPath: paths.promptArtifactPath,
    responseArtifactPath: paths.responseArtifactPath,
    tokenEstimate: usage.totalTokenCount || usage.total_tokens || Math.ceil(Buffer.byteLength(JSON.stringify(handoff), 'utf8') / 4),
    retryCount: workerResult.retryCount || 0,
    fallbackReason: workerResult.fallbackReason || null,
    sourceRunId: runId,
  };
}

function buildsPackageExtractionProposal(runId, classificationProposal) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsPackageExtractionProposal);
  const extractionCandidates = [];
  for (const classification of classificationProposal.classifications) {
    if (classification.auditBoundary !== 'pure-utility-extract') continue;
    extractionCandidates.push({
      currentSourcePath: classification.sourcePath,
      currentMethodName: classification.inferredIntendedMethodName || classification.currentMethodName,
      proposedPackagePath: classification.proposedPackagePath || 'packages/<product-owner-selected-package>/',
      proposedPackageMethodName: classification.proposedPackageMethodName || classification.inferredIntendedMethodName,
      callingProductDomainBody: classification.callingProductDomainBody || classification.sourcePath,
      utilityReason: classification.reason,
      behaviorPreservingTests: classification.behaviorPreservingTests || ['npm test'],
      importMigrationPlan: classification.importMigrationPlan || 'replace the local call with an explicit package import after acceptance',
      packageLevelAuditOwner: classification.packageLevelAuditOwner || 'product owner must assign package audit ownership',
      rollbackNote: classification.rollbackNote || 'revert the accepted extraction patch and restore the original import',
    });
  }
  return {
    schemaVersion: PACKAGE_EXTRACTION_SCHEMA_VERSION,
    packetId: classificationProposal.packetId,
    sourceRunId: runId,
    extractionCandidates,
  };
}

function buildsProductOwnerReview(classificationProposal) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsProductOwnerReview);
  const reviewRows = [];
  for (const classification of classificationProposal.classifications) {
    if (!['product-domain-boundary-case', 'product-owner-review-required'].includes(classification.auditBoundary)) continue;
    reviewRows.push({
      candidateMethod: classification.inferredIntendedMethodName || classification.currentMethodName,
      competingClassifications: classification.competingClassifications || ['product-domain-native', 'pure-utility-extract'],
      productMeaningArgument: classification.productMeaningArgument || classification.reason,
      utilityExtractionArgument: classification.utilityExtractionArgument || 'requires product-owner judgment',
      expectedProofImpact: classification.expectedProofImpact || 'changes whether the call is expanded in product method drill-down',
      reviewerDecisionNeeded: true,
    });
  }
  return reviewRows;
}

function buildsPatchProposal(runId, backlogItem, classificationProposal, review) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsPatchProposal);
  if (!review || review.adversarialReviewVerdict !== 'PASS' || review.productOwnerAccepted !== true) {
    throw new Error('classification must pass adversarial review and product-owner acceptance before patch proposal generation');
  }

  const unresolvedBoundaryCases = buildsProductOwnerReview(classificationProposal);
  if (unresolvedBoundaryCases.length > 0 && !review.boundaryCaseDecisions) {
    throw new Error('boundary cases require explicit product-owner decisions before patch proposal generation');
  }

  const proposedPaths = [];
  for (const classification of classificationProposal.classifications) proposedPaths.push(classification.sourcePath);
  const changedPaths = uniquely(proposedPaths);
  for (const changedPath of changedPaths) {
    let allowed = false;
    for (const allowedPath of backlogItem.allowedMutationPaths) {
      if (normalizesSlashes(changedPath).startsWith(normalizesSlashes(allowedPath))) allowed = true;
    }
    if (!allowed) {
      throw new Error(`classification proposes a changed path outside the packet allowlist: ${changedPath}`);
    }
    let blocked = false;
    for (const blockedPath of backlogItem.blockedMutationPaths) {
      if (normalizesSlashes(changedPath).startsWith(normalizesSlashes(blockedPath))) blocked = true;
    }
    if (blocked) {
      throw new Error(`classification proposes a changed path under a blocked path: ${changedPath}`);
    }
  }

  const testimonyReplacements = [];
  for (const classification of classificationProposal.classifications) {
    if (classification.auditBoundary !== 'product-domain-native') continue;
    testimonyReplacements.push({
      sourcePath: classification.sourcePath,
      sourceLineRange: classification.sourceLineRange,
      from: `LogMe(${classification.currentMethodName})`,
      to: `LogMe(${classification.inferredIntendedMethodName})`,
      preservesProductDomainName: true,
    });
  }
  return {
    schemaVersion: PATCH_SCHEMA_VERSION,
    packetId: backlogItem.packetId,
    sourceRunId: runId,
    changedPaths,
    testimonyReplacements,
    packageExtractionChanges: buildsPackageExtractionProposal(runId, classificationProposal).extractionCandidates,
    importUpdates: [],
    bodyContractUpdates: [],
    featureAndScenarioTieOutUpdates: [],
    expectedBeforeMetrics: {
      unnamedProductMethodCalls: backlogItem.unnamedMethodCallCount,
      sampleMethodTelemetryEvents: backlogItem.repeatedSampleMethodEventCount,
    },
    expectedAfterMetrics: {
      unnamedProductMethodCalls: 0,
      sampleMethodTelemetryEvents: 0,
    },
    verificationCommands: backlogItem.requiredVerificationCommands,
    blockedPaths: backlogItem.blockedMutationPaths,
    historicalEvidenceMutationAllowed: false,
  };
}

function calculatesTestimonyMetrics(proofs) {
  if (process.env.LOGME_AUDIT === '1') LogMe(calculatesTestimonyMetrics);
  const metrics = {
    unnamedProductMethodCalls: 0,
    sampleMethodTelemetryEvents: 0,
    packageBoundarySummarizedCalls: 0,
    productDomainNativeCallsWithAccurateNames: 0,
    proofReportByteSize: 0,
  };
  for (const proof of proofs || []) {
    metrics.proofReportByteSize += Buffer.byteLength(JSON.stringify(proof), 'utf8');
    for (const node of proof.observedExecutionTimeline || []) {
      for (const methodCall of node.methodCalls || []) {
        const boundary = methodCall.auditBoundary || 'product-domain-native';
        if (boundary === 'product-domain-native') {
          if (methodCall.methodName === NOT_OBSERVED || methodCall.methodKind === NOT_OBSERVED) {
            metrics.unnamedProductMethodCalls += 1;
          } else {
            metrics.productDomainNativeCallsWithAccurateNames += 1;
          }
        }
        if (methodCall.methodName === 'sampleMethod') {
          metrics.sampleMethodTelemetryEvents += 1;
        }
      }
      for (const summary of node.packageBoundarySummaries || []) {
        metrics.packageBoundarySummarizedCalls += summary.callCount || 0;
      }
      if (node.telemetryInfrastructureSummary && node.telemetryInfrastructureSummary.suppressedMethodNames.includes('sampleMethod')) {
        metrics.sampleMethodTelemetryEvents += node.telemetryInfrastructureSummary.eventCount || 0;
      }
    }
  }
  return metrics;
}

function buildsTestimonyVerificationReport(packetId, beforeProofs, afterProofs, options = {}) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsTestimonyVerificationReport);
  const beforeMetrics = calculatesTestimonyMetrics(beforeProofs);
  const afterMetrics = calculatesTestimonyMetrics(afterProofs);
  const findings = [];
  if (afterMetrics.unnamedProductMethodCalls > 0) {
    findings.push({ code: 'product-method-name-not-observed', recommendedFix: 'create a bounded Gemini testimony remediation packet' });
  }
  for (const proof of afterProofs || []) {
    for (const code of (proof.promotionDecision && proof.promotionDecision.blockerCodes) || []) {
      let alreadyRecorded = false;
      for (const finding of findings) {
        if (finding.code === code) alreadyRecorded = true;
      }
      if (!alreadyRecorded) {
        findings.push({ code, recommendedFix: 'resolve the deterministic proof blocker and rerun the affected feature scenario' });
      }
    }
  }
  let commandsPassed = true;
  for (const result of options.commandResults || []) {
    if (result.exitCode !== 0) commandsPassed = false;
  }
  return {
    schemaVersion: VERIFICATION_SCHEMA_VERSION,
    packetId,
    verificationCommands: options.verificationCommands || [],
    commandResults: options.commandResults || [],
    comparison: {
      unnamedProductMethodCallsBefore: beforeMetrics.unnamedProductMethodCalls,
      unnamedProductMethodCallsAfter: afterMetrics.unnamedProductMethodCalls,
      sampleMethodTelemetryEventsBefore: beforeMetrics.sampleMethodTelemetryEvents,
      sampleMethodTelemetryEventsAfter: afterMetrics.sampleMethodTelemetryEvents,
      packageBoundarySummarizedCalls: afterMetrics.packageBoundarySummarizedCalls,
      productDomainNativeCallsWithAccurateNames: afterMetrics.productDomainNativeCallsWithAccurateNames,
      proofReportByteSizeBefore: beforeMetrics.proofReportByteSize,
      proofReportByteSizeAfter: afterMetrics.proofReportByteSize,
    },
    findings,
    promotionDecision: findings.length === 0 && commandsPassed ? 'PROMOTABLE' : 'BLOCKED',
  };
}

async function runsTestimonyClassificationWorker(config, runId, backlogItem, proof, options = {}) {
  if (process.env.LOGME_AUDIT === '1') LogMe(runsTestimonyClassificationWorker);
  const handoff = buildsCompactGeminiHandoff(config, backlogItem, proof, options);
  const outputRoot = `quality/domain-remediation/${runId}/testimony-accuracy`;
  const handoffPath = `${outputRoot}/${backlogItem.packetId}.gemini-handoff.v1.json`;
  writesJson(config.rootDir, handoffPath, handoff);
  const workerResult = await callsGeminiTestimonyClassifier(handoff, options);
  if (workerResult.callFailure) {
    const usage = buildsProviderUsage(runId, handoff, workerResult, { promptArtifactPath: handoffPath, responseArtifactPath: NOT_OBSERVED });
    usage.providerFailure = workerResult.callFailure;
    const usagePath = `${outputRoot}/${backlogItem.packetId}.provider-usage.v1.json`;
    writesJson(config.rootDir, usagePath, usage);
    return { handoff, handoffPath, workerResult, proposal: null, usage, usagePath };
  }

  const responsePath = `${outputRoot}/${backlogItem.packetId}.gemini-response.v1.json`;
  writesJson(config.rootDir, responsePath, JSON.parse(workerResult.rawResponseText));
  const proposal = buildsClassificationProposal(handoff, workerResult);
  const proposalPath = `${outputRoot}/${backlogItem.packetId}.classification.proposal.v1.json`;
  writesJson(config.rootDir, proposalPath, proposal);
  const usage = buildsProviderUsage(runId, handoff, workerResult, { promptArtifactPath: handoffPath, responseArtifactPath: responsePath });
  const usagePath = `${outputRoot}/${backlogItem.packetId}.provider-usage.v1.json`;
  writesJson(config.rootDir, usagePath, usage);
  return { handoff, handoffPath, workerResult, responsePath, proposal, proposalPath, usage, usagePath };
}

function writesTestimonyPlanningArtifacts(config, backlog, proofsByPath = new Map(), options = {}) {
  if (process.env.LOGME_AUDIT === '1') LogMe(writesTestimonyPlanningArtifacts);
  const writtenPaths = [writesJson(config.rootDir, backlog.evidencePath, backlog)];
  const handoffs = [];
  for (const item of backlog.backlogItems) {
    const proof = proofsByPath.get(item.noisyProofArtifactPaths[0]) || readsJson(path.join(config.rootDir, item.noisyProofArtifactPaths[0]));
    const handoff = buildsCompactGeminiHandoff(config, item, proof, options);
    const handoffPath = `quality/domain-remediation/${backlog.sourceRunId}/testimony-accuracy/${item.packetId}.gemini-handoff.v1.json`;
    writtenPaths.push(writesJson(config.rootDir, handoffPath, handoff));
    handoffs.push({ handoff, handoffPath });
  }
  return { writtenPaths, handoffs };
}

module.exports = {
  BACKLOG_SCHEMA_VERSION,
  CLASSIFICATIONS,
  CLASSIFICATION_SCHEMA_VERSION,
  GEMINI_MODEL,
  HANDOFF_SCHEMA_VERSION,
  PACKAGE_EXTRACTION_SCHEMA_VERSION,
  PATCH_SCHEMA_VERSION,
  PROVIDER_USAGE_SCHEMA_VERSION,
  VERIFICATION_SCHEMA_VERSION,
  buildsClassificationProposal,
  buildsClassificationResponseSchema,
  buildsCompactGeminiHandoff,
  buildsGeminiRequestBody,
  buildsPackageExtractionProposal,
  buildsPatchProposal,
  buildsProductOwnerReview,
  buildsProviderUsage,
  buildsTestimonyBacklogItem,
  buildsTestimonyVerificationReport,
  calculatesTestimonyMetrics,
  callsGeminiTestimonyClassifier,
  plansTestimonyAccuracyBacklog,
  readsProofsForRun,
  rendersClassifierPrompt,
  runsTestimonyClassificationWorker,
  writesJson,
  writesTestimonyPlanningArtifacts,
};
