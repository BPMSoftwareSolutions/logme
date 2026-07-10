const { LogMe } = require('../../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../../packages/logme-testimony-core/src/sample-method');
const fs = require('node:fs');
const path = require('node:path');
const { FEATURE_PROOF_GENERATOR_NAME, FEATURE_PROOF_INVENTORY_SCHEMA_VERSION } = require('../feature-execution-proof-shared-constants/feature-execution-proof-shared-constants');
const { slugifies } = require('../formats-and-serializes-data/formats-and-serializes-data');
const { buildsFeatureProofPath } = require('../manages-report-file-paths/manages-report-file-paths');
const { readsLines } = require('../reads-runtime-and-source-data/reads-runtime-and-source-data');

function buildsFeatureProofInventory(options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const featuresRoot = options.featuresRoot || path.join(rootDir, 'docs', 'features');
  const evidenceRoot = options.evidenceRoot || path.join(rootDir, 'evidence');
  const runId = options.runId || new Date().toISOString().replace(/[:.]/gu, '-');
  const implementationIndex = options.implementationIndex || {};
  const featureFiles = options.featureFiles || discoversFeatureFiles(featuresRoot);
  const scenarios = [];

  for (const featureFile of featureFiles) {
    const feature = discoversFeatureScenarios(featureFile);

    for (const scenario of feature.scenarios) {
      const key = `${feature.featureId}/${scenario.scenarioId}`;
      const implementationStatus = implementationIndex[key] || implementationIndex[scenario.scenarioId] || 'not implemented';
      const evidencePacketPath = buildsFeatureProofPath(evidenceRoot, runId, feature.featureId, scenario.scenarioId);
      const proofStatus = selectsScenarioProofStatus({
        implementationStatus,
        proofPath: evidencePacketPath,
      });

      scenarios.push({
        runId,
        featureId: feature.featureId,
        featureName: feature.featureName,
        scenarioId: scenario.scenarioId,
        scenarioName: scenario.scenarioName,
        acceptanceSourcePath: feature.sourcePath,
        acceptanceSourceLineRange: {
          start: scenario.startLine,
          end: scenario.endLine,
        },
        implementationStatus,
        proofStatus,
        evidencePacketPath,
        blockerCodes: [],
      });
    }
  }

  return {
    schemaVersion: FEATURE_PROOF_INVENTORY_SCHEMA_VERSION,
    runId,
    generatedAt: options.generatedAt || new Date().toISOString(),
    generatorName: FEATURE_PROOF_GENERATOR_NAME,
    scenarios,
  };
}

function discoversFeatureFiles(featuresRoot) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!fs.existsSync(featuresRoot)) {
    return [];
  }

  const entries = fs.readdirSync(featuresRoot).sort();
  const featureFiles = [];

  for (const entry of entries) {
    if (entry.endsWith('.feature.md') || entry.endsWith('.feature')) {
      featureFiles.push(path.join(featuresRoot, entry));
    }
  }

  return featureFiles;
}

function discoversFeatureScenarios(featureFilePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = readsLines(featureFilePath);
  let featureName = path.basename(featureFilePath, path.extname(featureFilePath));
  let featureLine = 1;
  const scenarios = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const featureMatch = line.match(/^\s*Feature:\s+(.+)$/u);
    const scenarioMatch = line.match(/^\s*Scenario:\s+(.+)$/u);

    if (featureMatch) {
      featureName = featureMatch[1].trim();
      featureLine = index + 1;
    }

    if (scenarioMatch) {
      const scenarioName = scenarioMatch[1].trim();
      scenarios.push({
        scenarioId: slugifies(scenarioName),
        scenarioName,
        startLine: index + 1,
        endLine: lines.length,
      });
    }
  }

  for (let index = 0; index < scenarios.length; index += 1) {
    if (scenarios[index + 1]) {
      scenarios[index].endLine = scenarios[index + 1].startLine - 1;
    }
  }

  return {
    featureId: slugifies(featureName),
    featureName,
    featureLine,
    sourcePath: featureFilePath,
    scenarios,
  };
}

function selectsScenarioProofStatus({ implementationStatus, proofPath, blockers }) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (implementationStatus !== 'implemented') {
    return 'not implemented';
  }

  if (!proofPath || !fs.existsSync(proofPath)) {
    return 'implemented not executed';
  }

  const proof = JSON.parse(fs.readFileSync(proofPath, 'utf8'));
  const blockerFindings = blockers || proof.blockerFindings || [];
  return blockerFindings.length > 0 || proof.promotionDecision.status === 'blocked'
    ? 'executed blocked'
    : 'proven';
}

module.exports = { buildsFeatureProofInventory, discoversFeatureFiles, discoversFeatureScenarios, selectsScenarioProofStatus };
