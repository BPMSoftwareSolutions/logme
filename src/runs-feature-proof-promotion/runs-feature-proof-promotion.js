const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { discoversFeatureScenarios } = require('../feature-execution-proof/discovers-feature-and-scenario-metadata/discovers-feature-and-scenario-metadata');
const { buildsFeatureProofBody, computesFeatureProofBodyHash, rendersFeatureProofBody, sha256Hex } = require('../promotes-feature-execution-proof/promotes-feature-execution-proof');

function buildsFeatureProofBodyPath(rootDir, featureId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return path.join(rootDir, 'docs', 'feature-proofs', `${featureId}.proof.md`);
}

function readsScenarioProofsFromRun(rootDir, runId, featureId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const scenariosRoot = path.join(rootDir, 'evidence', 'runs', runId, 'features', featureId, 'scenarios');

  if (!fs.existsSync(scenariosRoot)) {
    return [];
  }

  const scenarioProofs = [];

  for (const scenarioId of fs.readdirSync(scenariosRoot).sort()) {
    const scenarioDir = path.join(scenariosRoot, scenarioId);
    const proofPath = path.join(scenarioDir, 'feature-execution.contract.v1.json');

    if (!fs.existsSync(proofPath)) {
      continue;
    }

    const proof = JSON.parse(fs.readFileSync(proofPath, 'utf8'));
    scenarioProofs.push({
      scenarioId,
      scenarioName: proof.scenarioName,
      runId,
      acceptanceSourceLineRange: proof.acceptanceSource ? proof.acceptanceSource.lineRange : undefined,
      proof,
      artifactHashes: buildsArtifactHashesForScenario(scenarioDir),
    });
  }

  return scenarioProofs;
}

function buildsArtifactHashesForScenario(scenarioDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const artifactHashes = {};

  for (const entry of fs.readdirSync(scenarioDir).sort()) {
    const entryPath = path.join(scenarioDir, entry);

    if (fs.statSync(entryPath).isFile()) {
      artifactHashes[entry] = sha256Hex(fs.readFileSync(entryPath, 'utf8'));
    }
  }

  return artifactHashes;
}

function readsLatestScenarioGeneratedAt(scenarioProofs) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let latest = undefined;

  for (const scenarioProof of scenarioProofs) {
    const generatedAt = scenarioProof.proof.generatedAt;

    if (!latest || (generatedAt && generatedAt > latest)) {
      latest = generatedAt;
    }
  }

  return latest;
}

function runsFeatureProofPromotion(config, featureId, runId, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = config.rootDir;
  const featureFilePath = path.join(rootDir, 'docs', 'features', `${featureId}.feature.md`);
  const sourceFeatureContent = fs.readFileSync(featureFilePath, 'utf8');
  const feature = discoversFeatureScenarios(featureFilePath);
  const scenarioProofs = readsScenarioProofsFromRun(rootDir, runId, featureId);

  const body = buildsFeatureProofBody({
    featureId,
    featureName: feature.featureName,
    sourceFeaturePath: path.relative(rootDir, featureFilePath).replace(/\\/gu, '/'),
    sourceFeatureContent,
    currentScenarios: feature.scenarios,
    scenarioProofs,
    selectedProofRunId: runId,
    proofRunGeneratedAt: readsLatestScenarioGeneratedAt(scenarioProofs),
    generatedAt: options.generatedAt,
  });

  const bodyHash = computesFeatureProofBodyHash(body);
  const proofBodyPath = buildsFeatureProofBodyPath(rootDir, featureId);
  const content = `${rendersFeatureProofBody(body, rootDir)}\n<!-- proof body hash: ${bodyHash} -->\n`;

  if (options.write) {
    fs.mkdirSync(path.dirname(proofBodyPath), { recursive: true });
    fs.writeFileSync(proofBodyPath, content, 'utf8');
  }

  return {
    proofBodyPath,
    body,
    bodyHash,
    content,
    written: Boolean(options.write),
  };
}

module.exports = {
  buildsArtifactHashesForScenario,
  buildsFeatureProofBodyPath,
  readsScenarioProofsFromRun,
  runsFeatureProofPromotion,
};
