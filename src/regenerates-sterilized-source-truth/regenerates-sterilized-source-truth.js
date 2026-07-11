const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { normalizesTestimonyPath } = require('../../packages/logme-testimony-remediation-primitives/src/normalizes-testimony-path');

const SOURCE_TRUTH_REGENERATION_SCHEMA_VERSION = 'testimony-source-truth-regeneration.v1';
const REQUIRED_SOURCE_TRUTH_ARTIFACT_TYPES = Object.freeze([
  'declared-file-system-body-contract', 'package-ownership-contract', 'feature-execution-proof-json', 'executable-body-report',
  'executable-body-tree', 'source-controlled-feature-proof-body', 'feature-status-projection',
]);

function rendersRegeneratedArtifactContent(artifact, sterilizationReceiptPath) {
  if (process.env.LOGME_AUDIT === '1') LogMe(rendersRegeneratedArtifactContent);
  if (artifact.type === 'feature-execution-proof-json') {
    const proof = typeof artifact.content === 'string' ? JSON.parse(artifact.content) : { ...artifact.content };
    proof.sterilizationReceiptPath = sterilizationReceiptPath;
    return `${JSON.stringify(proof, null, 2)}\n`;
  }
  const content = typeof artifact.content === 'string' ? artifact.content : `${JSON.stringify(artifact.content, null, 2)}\n`;
  if (artifact.type === 'executable-body-report' || artifact.type === 'executable-body-tree' || artifact.type === 'source-controlled-feature-proof-body') {
    if (content.includes(sterilizationReceiptPath)) return content;
    return `${content.trimEnd()}\n\n- sterilization receipt: ${sterilizationReceiptPath}\n`;
  }
  return content;
}

function writesRegeneratedArtifact(rootDir, artifact, sterilizationReceiptPath) {
  if (process.env.LOGME_AUDIT === '1') LogMe(writesRegeneratedArtifact);
  const artifactPath = path.join(rootDir, artifact.path);
  const nextContent = rendersRegeneratedArtifactContent(artifact, sterilizationReceiptPath);
  const previousContent = fs.existsSync(artifactPath) ? fs.readFileSync(artifactPath, 'utf8') : null;
  if (previousContent === nextContent) return { type: artifact.type, path: artifact.path, changed: false };
  fs.mkdirSync(path.dirname(artifactPath), { recursive: true });
  fs.writeFileSync(artifactPath, nextContent, 'utf8');
  return { type: artifact.type, path: artifact.path, changed: true };
}

function regeneratesSourceTruthArtifacts(config, sterilizationReceipt, artifacts) {
  if (process.env.LOGME_AUDIT === '1') LogMe(regeneratesSourceTruthArtifacts);
  if (!sterilizationReceipt || sterilizationReceipt.promotionDecision !== 'PROMOTABLE') {
    throw new Error('source truth regeneration requires a passing sterilization receipt');
  }
  const artifactsByType = new Map();
  for (const artifact of artifacts || []) artifactsByType.set(artifact.type, artifact);
  for (const requiredType of REQUIRED_SOURCE_TRUTH_ARTIFACT_TYPES) {
    if (!artifactsByType.has(requiredType)) throw new Error(`missing required source-truth artifact: ${requiredType}`);
  }
  const results = [];
  for (const requiredType of REQUIRED_SOURCE_TRUTH_ARTIFACT_TYPES) {
    const artifact = artifactsByType.get(requiredType);
    if (normalizesTestimonyPath(artifact.path).startsWith('evidence/runs/') && artifact.type !== 'feature-execution-proof-json') {
      throw new Error(`raw run evidence path is not allowed for ${artifact.type}: ${artifact.path}`);
    }
    results.push(writesRegeneratedArtifact(config.rootDir, artifact, sterilizationReceipt.sterilizationReceiptPath));
  }
  return {
    schemaVersion: SOURCE_TRUTH_REGENERATION_SCHEMA_VERSION, sterilizationReceiptPath: sterilizationReceipt.sterilizationReceiptPath,
    artifacts: results, statusChangedOnlyWhenContentChanged: true, rawRunEvidenceVersionControlAllowed: false,
  };
}

module.exports = { REQUIRED_SOURCE_TRUTH_ARTIFACT_TYPES, SOURCE_TRUTH_REGENERATION_SCHEMA_VERSION, regeneratesSourceTruthArtifacts };
