const crypto = require('node:crypto');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const FEATURE_PROOF_BODY_SCHEMA_VERSION = 'feature-proof-body.v1';
const GENERATOR_NAME = 'LogMe feature proof publisher';
const MISSING_SCENARIO_FINDING = 'source-controlled-feature-proof-missing-scenario';

function sha256Hex(value) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

function findsMissingScenarios(currentScenarios, coveredScenarios) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const coveredIds = new Set(coveredScenarios.map(readsScenarioId));
  const missingScenarios = [];

  for (const scenario of currentScenarios) {
    if (!coveredIds.has(scenario.scenarioId)) {
      missingScenarios.push(scenario.scenarioId);
    }
  }

  return missingScenarios;
}

function readsScenarioId(scenario) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return scenario.scenarioId;
}

function buildsScenarioCoverageSection(scenarioProof) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const proof = scenarioProof.proof;
  const declaredPromotionStatus = proof && proof.promotionDecision ? proof.promotionDecision.status : 'not proven';
  const blockerCodes = proof && proof.promotionDecision ? [...(proof.promotionDecision.blockerCodes || [])] : [];
  for (const code of findsDeterministicTestimonyBlockers(proof)) {
    if (!blockerCodes.includes(code)) {
      blockerCodes.push(code);
    }
  }
  const promotionStatus = declaredPromotionStatus === 'proven' && blockerCodes.length === 0 ? 'proven' : 'not proven';

  return {
    scenarioId: scenarioProof.scenarioId,
    scenarioName: scenarioProof.scenarioName,
    acceptanceSourceLineRange: scenarioProof.acceptanceSourceLineRange,
    proofStatus: promotionStatus === 'proven' ? 'proven' : 'not proven',
    selectedRunId: scenarioProof.runId,
    executionSummary: scenarioProof.executionSummary || (promotionStatus === 'proven' ? 'all declared executable body nodes observed with required receipts' : promotionStatus),
    blockerCodes,
    sourceProofArtifactHashes: scenarioProof.artifactHashes || {},
  };
}

function findsDeterministicTestimonyBlockers(proof) {
  if (process.env.LOGME_AUDIT === '1') LogMe(findsDeterministicTestimonyBlockers);
  const blockers = [];
  for (const node of (proof && proof.observedExecutionTimeline) || []) {
    for (const methodCall of node.methodCalls || []) {
      const auditBoundary = methodCall.auditBoundary || 'product-domain-native';
      if (auditBoundary === 'product-domain-native' && (methodCall.methodName === 'not observed' || methodCall.methodKind === 'not observed')) {
        blockers.push('product-method-name-not-observed');
      }
      const declaredRange = node.sourceLineRange;
      const observedRange = methodCall.sourceLineRange;
      if (hasNumericRange(declaredRange) && hasNumericRange(observedRange)
        && (Number(observedRange.start) < Number(declaredRange.start) || Number(observedRange.end) > Number(declaredRange.end))) {
        blockers.push('executable-body-source-range-incomplete');
      }
    }
  }
  return [...new Set(blockers)];
}

function hasNumericRange(lineRange) {
  if (process.env.LOGME_AUDIT === '1') LogMe(hasNumericRange);
  return lineRange && Number.isFinite(Number(lineRange.start)) && Number.isFinite(Number(lineRange.end));
}

function buildsFeatureProofBody(input) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const missingScenarios = findsMissingScenarios(input.currentScenarios, input.scenarioProofs);
  const scenarioSections = input.scenarioProofs.map(buildsScenarioCoverageSection);
  const provenScenarioCount = scenarioSections.filter(isProvenSection).length;
  const blockerSummary = collectsBlockerSummary(scenarioSections);

  const artifactHashes = {};
  for (const scenarioProof of input.scenarioProofs) {
    artifactHashes[scenarioProof.scenarioId] = scenarioProof.artifactHashes || {};
  }

  const sourceFeatureHash = sha256Hex(input.sourceFeatureContent || '');

  return {
    schemaVersion: FEATURE_PROOF_BODY_SCHEMA_VERSION,
    generatorName: GENERATOR_NAME,
    generatedAt: input.generatedAt || new Date().toISOString(),
    featureId: input.featureId,
    featureName: input.featureName,
    sourceFeaturePath: input.sourceFeaturePath,
    sourceFeatureContentHash: sourceFeatureHash,
    selectedProofRunId: input.selectedProofRunId,
    proofRunGeneratedAt: input.proofRunGeneratedAt,
    scenarioCoverageSummary: {
      totalScenarios: input.currentScenarios.length,
      provenScenarios: provenScenarioCount,
      missingScenarios,
    },
    scenarioSections,
    promotionDecision: missingScenarios.length === 0 && provenScenarioCount === input.currentScenarios.length ? 'proven' : 'not proven',
    blockerSummary,
    sliSummary: input.sliSummary || [],
    sloSummary: input.sloSummary || [],
    artifactHashes,
    regenerationCommand: input.regenerationCommand || `npm run feature:proof:promote -- --feature ${input.featureId} --run ${input.selectedProofRunId}`,
  };
}

function isProvenSection(section) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return section.proofStatus === 'proven';
}

function collectsBlockerSummary(scenarioSections) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const blockerCodes = new Set();

  for (const section of scenarioSections) {
    for (const code of section.blockerCodes) {
      blockerCodes.add(code);
    }
  }

  return [...blockerCodes];
}

function computesFeatureProofBodyHash(body) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const stableBody = {
    featureId: body.featureId,
    sourceFeatureContentHash: body.sourceFeatureContentHash,
    selectedProofRunId: body.selectedProofRunId,
    scenarioSections: body.scenarioSections,
    promotionDecision: body.promotionDecision,
    artifactHashes: body.artifactHashes,
  };

  return sha256Hex(JSON.stringify(stableBody));
}

function rendersFeatureProofBody(body, rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [];

  lines.push(`# Feature Proof: ${body.featureName}`);
  lines.push('');
  lines.push('> Source-controlled feature proof body. Regenerate from a selected proof run; do not hand-edit.');
  lines.push('');
  lines.push('## Feature Identity');
  lines.push('');
  lines.push(`- feature id: ${body.featureId}`);
  lines.push(`- feature name: ${body.featureName}`);
  lines.push(`- source feature document: ${body.sourceFeaturePath}`);
  lines.push(`- source feature document content hash: ${body.sourceFeatureContentHash}`);
  lines.push('');
  lines.push('## Selected Proof Run');
  lines.push('');
  lines.push(`- selected proof run id: ${body.selectedProofRunId}`);
  lines.push(`- proof run generated at: ${body.proofRunGeneratedAt}`);
  lines.push(`- proof body generated at: ${body.generatedAt}`);
  lines.push('');
  lines.push('## Scenario Coverage Summary');
  lines.push('');
  lines.push(`- total scenarios: ${body.scenarioCoverageSummary.totalScenarios}`);
  lines.push(`- proven scenarios: ${body.scenarioCoverageSummary.provenScenarios}`);
  lines.push(`- missing scenarios: ${body.scenarioCoverageSummary.missingScenarios.length === 0 ? 'none' : body.scenarioCoverageSummary.missingScenarios.join(', ')}`);
  lines.push('');
  lines.push('## Scenario Execution Outcomes');
  lines.push('');

  for (const section of body.scenarioSections) {
    lines.push(`### ${section.scenarioName}`);
    lines.push('');
    lines.push(`- scenario id: ${section.scenarioId}`);
    lines.push(`- acceptance source line range: ${section.acceptanceSourceLineRange ? `${section.acceptanceSourceLineRange.start}-${section.acceptanceSourceLineRange.end}` : 'not observed'}`);
    lines.push(`- proof status: ${section.proofStatus}`);
    lines.push(`- selected run id: ${section.selectedRunId}`);
    lines.push(`- execution summary: ${section.executionSummary}`);
    lines.push(`- blocker codes: ${section.blockerCodes.length === 0 ? 'none' : section.blockerCodes.join(', ')}`);
    lines.push(`- source proof artifact hashes: ${JSON.stringify(section.sourceProofArtifactHashes)}`);
    lines.push('');
  }

  for (const scenario of body.scenarioCoverageSummary.missingScenarios) {
    lines.push(`### ${scenario} (not proven)`);
    lines.push('');
    lines.push('- proof status: not proven');
    lines.push('- reason: no scenario proof section found in the selected proof run');
    lines.push('');
  }

  lines.push('## Promotion Decision');
  lines.push('');
  lines.push(`- promotion decision: ${body.promotionDecision}`);
  lines.push('');
  lines.push('## Blocker Summary');
  lines.push('');
  lines.push(body.blockerSummary.length === 0 ? '- none' : body.blockerSummary.map(mapsBlockerLine).join('\n'));
  lines.push('');
  lines.push('## SLI and SLO Summary');
  lines.push('');
  lines.push(body.sliSummary.length === 0 && body.sloSummary.length === 0 ? '- not observed' : renderSliSloLines(body));
  lines.push('');
  lines.push('## Proof Run Artifact Hashes');
  lines.push('');
  lines.push('```json');
  lines.push(JSON.stringify(body.artifactHashes, null, 2));
  lines.push('```');
  lines.push('');
  lines.push('## Regeneration Command');
  lines.push('');
  lines.push('```');
  lines.push(body.regenerationCommand);
  lines.push('```');
  lines.push('');
  lines.push('## Source-Controlled Proof Body Generated-At Timestamp');
  lines.push('');
  lines.push(`- generated at: ${body.generatedAt}`);
  lines.push('');

  return lines.join('\n');
}

function mapsBlockerLine(code) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return `- ${code}`;
}

function renderSliSloLines(body) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [];

  for (const sli of body.sliSummary) {
    lines.push(`- SLI ${sli.name}: ${sli.value} ${sli.unit}`);
  }

  for (const slo of body.sloSummary) {
    lines.push(`- SLO ${slo.sloId}: ${slo.status}`);
  }

  return lines.join('\n');
}

module.exports = {
  FEATURE_PROOF_BODY_SCHEMA_VERSION,
  GENERATOR_NAME,
  MISSING_SCENARIO_FINDING,
  buildsFeatureProofBody,
  computesFeatureProofBodyHash,
  findsMissingScenarios,
  findsDeterministicTestimonyBlockers,
  rendersFeatureProofBody,
  sha256Hex,
};
