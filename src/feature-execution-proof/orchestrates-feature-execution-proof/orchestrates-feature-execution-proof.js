const { LogMe } = require('../../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../../packages/logme-testimony-core/src/sample-method');
const { FEATURE_PROOF_GENERATOR_NAME, FEATURE_PROOF_SCHEMA_VERSION, NOT_OBSERVED } = require('../feature-execution-proof-shared-constants/feature-execution-proof-shared-constants');
const { readsTelemetrySourcePaths } = require('../acquires-and-processes-telemetry-data/acquires-and-processes-telemetry-data');
const { calculatesCallCountMetrics } = require('../calculates-call-count-metrics/calculates-call-count-metrics');
const { calculatesMethodTimingMetrics, calculatesTimingMetrics } = require('../calculates-timing-and-performance-metrics/calculates-timing-and-performance-metrics');
const { buildsObservedExecutionTimeline, normalizesDeclaredNodes, stampsMethodCallOwnership } = require('../constructs-observed-execution-model/constructs-observed-execution-model');
const { buildsPromotionDecision } = require('../determines-promotion-eligibility/determines-promotion-eligibility');
const { calculatesServiceLevelIndicators, evaluatesServiceLevelObjectives } = require('../evaluates-service-level-indicators-objectives/evaluates-service-level-indicators-objectives');
const { checksExternalizedPackageProof } = require('../../writes-package-audit-receipt/writes-package-audit-receipt');

function buildsExternalPackageProofFindings(externalPackageDependencies) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsExternalPackageProofFindings);
  const findings = [];
  for (const dependency of externalPackageDependencies || []) {
    const proofCheck = checksExternalizedPackageProof(dependency);
    if (proofCheck.verdict === 'BLOCKED') {
      findings.push({
        code: proofCheck.findingCode,
        packageName: dependency.packageName || NOT_OBSERVED,
        reason: `external package proof is missing required fields: ${proofCheck.missingFields.join(', ')}`,
        recommendedFix: 'provide a current external package audit receipt or release proof without mutating external package internals',
      });
    }
  }
  return findings;
}

function buildsFeatureExecutionProof(input) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const declaredNodes = normalizesDeclaredNodes(input.declaredExecutableBody || []);
  const telemetryEvents = input.telemetryEvents || [];
  const receiptSourcePaths = input.receiptSourcePaths || input.receiptPaths || [];
  const observedExecutionTimeline = buildsObservedExecutionTimeline(
    declaredNodes,
    telemetryEvents,
    receiptSourcePaths,
    input.runStartedAt,
  );
  stampsMethodCallOwnership(observedExecutionTimeline, input.featureId, input.scenarioId);
  const blockerFindings = [...(input.blockerFindings || [])];
  for (const finding of buildsExternalPackageProofFindings(input.externalPackageDependencies)) blockerFindings.push(finding);
  const promotionDecision = buildsPromotionDecision(observedExecutionTimeline, blockerFindings);
  const proof = {
    schemaVersion: FEATURE_PROOF_SCHEMA_VERSION,
    runId: input.runId,
    featureId: input.featureId,
    scenarioId: input.scenarioId,
    scenarioName: input.scenarioName,
    generatedAt: input.generatedAt || new Date().toISOString(),
    generatorName: FEATURE_PROOF_GENERATOR_NAME,
    runStartedAt: input.runStartedAt || NOT_OBSERVED,
    receiptWrittenAt: input.receiptWrittenAt || NOT_OBSERVED,
    acceptanceSource: input.acceptanceSource,
    declaredExecutableBody: declaredNodes,
    observedExecutionTimeline,
    telemetrySourcePaths: readsTelemetrySourcePaths(telemetryEvents),
    receiptSourcePaths,
    timingMetrics: null,
    methodTimingMetrics: null,
    callCountMetrics: null,
    blockerFindings,
    promotionDecision,
  };
  proof.timingMetrics = calculatesTimingMetrics(observedExecutionTimeline, proof.runStartedAt, proof.receiptWrittenAt);
  proof.methodTimingMetrics = calculatesMethodTimingMetrics(observedExecutionTimeline);
  proof.callCountMetrics = calculatesCallCountMetrics(observedExecutionTimeline);
  proof.serviceLevelIndicators = calculatesServiceLevelIndicators(proof);
  proof.sloEvaluations = evaluatesServiceLevelObjectives(proof, input.sloTargets || []);

  return proof;
}

module.exports = { buildsExternalPackageProofFindings, buildsFeatureExecutionProof };
