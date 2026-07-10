const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { discoversFeatureScenarios, slugifies } = require('../feature-execution-proof/feature-execution-proof');

const FEATURE_STATUS_SCHEMA_VERSION = 'feature-status.v1';
const FEATURE_BOARD_SCHEMA_VERSION = 'feature-quality-board.v1';
const FEATURE_STATUS_GENERATOR_NAME = 'LogMe feature filesystem quality status projection';
const FEATURE_BOARD_GENERATOR_NAME = 'LogMe feature quality board filesystem body';
const STATUS_DIRECTORY_NAME = '_feature-status';
const MISSING = 'missing';
const NOT_OBSERVED = 'not observed';
const STATUS_ORDER = [
  'stale',
  'qa-blocked',
  'qa-failed',
  'implemented.not-tested',
  'proof-blocked',
  'not-implemented',
  'qa-passed',
  'qa-waived',
  'qa-passed.promoted',
];

function recordsAuditTestimony() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }
}

function formatsRepoRelativePath(rootDir, filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!filePath) {
    return MISSING;
  }

  if (!path.isAbsolute(filePath)) {
    return String(filePath).replace(/\\/gu, '/');
  }

  return path.relative(rootDir || process.cwd(), filePath).replace(/\\/gu, '/');
}

function hashesText(value) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return crypto.createHash('sha256').update(String(value), 'utf8').digest('hex');
}

function hashesFile(filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function readsJsonFile(filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readsGitValue(rootDir, args, fallback) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  try {
    return execFileSync('git', args, { cwd: rootDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || fallback;
  } catch (error) {
    return fallback;
  }
}

function discoversFeatureSpecFiles(featuresRoot) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!fs.existsSync(featuresRoot)) {
    return [];
  }

  const featureFiles = [];
  for (const entry of fs.readdirSync(featuresRoot).sort()) {
    const entryPath = path.join(featuresRoot, entry);
    const stat = fs.statSync(entryPath);

    if (stat.isFile() && (entry.endsWith('.feature.md') || entry.endsWith('.feature'))) {
      featureFiles.push(entryPath);
    }

    if (stat.isDirectory()) {
      const nestedFeaturePath = path.join(entryPath, 'feature.md');
      if (fs.existsSync(nestedFeaturePath)) {
        featureFiles.push(nestedFeaturePath);
      }
    }
  }

  return featureFiles;
}

function discoversFeatureSpecs(options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const featuresRoot = options.featuresRoot || path.join(rootDir, 'docs', 'features');
  const featuresById = new Map();
  const duplicates = [];

  for (const featureFile of discoversFeatureSpecFiles(featuresRoot)) {
    const parsed = discoversFeatureScenarios(featureFile);
    const featureId = parsed.featureId || slugifies(path.basename(featureFile).replace(/\.feature\.md$|\.feature$|\.md$/gu, ''));
    const feature = {
      featureId,
      featureName: parsed.featureName,
      sourceFeaturePath: formatsRepoRelativePath(rootDir, featureFile),
      absoluteSourceFeaturePath: featureFile,
      sourceFeatureContentHash: hashesFile(featureFile),
      scenarioCount: parsed.scenarios.length,
      scenarios: parsed.scenarios,
    };

    if (featuresById.has(featureId)) {
      duplicates.push({
        code: 'duplicate-feature-id',
        featureId,
        paths: [featuresById.get(featureId).sourceFeaturePath, feature.sourceFeaturePath],
      });
      continue;
    }

    featuresById.set(featureId, feature);
  }

  return {
    features: [...featuresById.values()].sort(sortsFeatureSpecsById),
    findings: duplicates,
  };
}

function sortsFeatureSpecsById(first, second) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return first.featureId.localeCompare(second.featureId);
}

function readsDirectoryPaths(directoryPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  const directories = [];
  for (const entry of fs.readdirSync(directoryPath).sort()) {
    const entryPath = path.join(directoryPath, entry);
    if (fs.statSync(entryPath).isDirectory()) {
      directories.push(entryPath);
    }
  }

  return directories;
}

function readsQaBundleRecords(rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const bundleRoot = path.join(rootDir, 'quality', 'end-user-test-bundles');
  const bundles = [];

  for (const releaseRoot of readsDirectoryPaths(bundleRoot)) {
    for (const qaRoot of readsDirectoryPaths(releaseRoot)) {
      const manifestPath = path.join(qaRoot, 'qa-evidence-bundle.manifest.v1.json');
      if (!fs.existsSync(manifestPath)) {
        continue;
      }

      const manifest = readsJsonFile(manifestPath);
      const gateDecisionPath = path.join(qaRoot, 'qa-gate-decision.v1.json');
      const gateDecision = fs.existsSync(gateDecisionPath) ? readsJsonFile(gateDecisionPath) : null;
      bundles.push({
        manifest,
        gateDecision,
        bundlePath: qaRoot,
        manifestPath,
        gateDecisionPath: fs.existsSync(gateDecisionPath) ? gateDecisionPath : null,
        machineEnvironmentPath: path.join(qaRoot, 'machine-environment.v1.json'),
      });
    }
  }

  return bundles.sort(sortsQaBundlesByRunId);
}

function sortsQaBundlesByRunId(first, second) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return String(first.manifest.qaRunId || '').localeCompare(String(second.manifest.qaRunId || ''));
}

function indexesLatestQaBundleByFeature(rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const latestByFeature = new Map();
  for (const bundle of readsQaBundleRecords(rootDir)) {
    const scenarios = bundle.manifest.testedFeatureScenarios || [];
    const featureIds = new Set();

    if (bundle.manifest.featureId) {
      featureIds.add(bundle.manifest.featureId);
    }

    for (const scenario of scenarios) {
      if (scenario.featureId) {
        featureIds.add(scenario.featureId);
      }
    }

    for (const featureId of featureIds) {
      latestByFeature.set(featureId, bundle);
    }
  }

  return latestByFeature;
}

function readsExecutionProofRecords(rootDir, featureId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const runsRoot = path.join(rootDir, 'evidence', 'runs');
  const records = [];

  for (const runRoot of readsDirectoryPaths(runsRoot)) {
    const featureRoot = path.join(runRoot, 'features', featureId, 'scenarios');
    for (const scenarioRoot of readsDirectoryPaths(featureRoot)) {
      const proofPath = path.join(scenarioRoot, 'feature-execution.contract.v1.json');
      if (fs.existsSync(proofPath)) {
        records.push({
          runId: path.basename(runRoot),
          proofPath,
          proof: readsJsonFile(proofPath),
        });
      }
    }
  }

  return records.sort(sortsProofRecordsByRunId);
}

function sortsProofRecordsByRunId(first, second) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return String(first.runId).localeCompare(String(second.runId));
}

function collectsBlockerCodes(values) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const codes = [];
  for (const value of values) {
    for (const code of value || []) {
      if (code && !codes.includes(code)) {
        codes.push(code);
      }
    }
  }

  return codes;
}

function readsQaStatus(bundle) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!bundle) {
    return 'not QAed';
  }

  if (bundle.gateDecision && bundle.gateDecision.qualityGateDecision) {
    return bundle.gateDecision.qualityGateDecision;
  }

  return bundle.manifest.qaStatus || bundle.manifest.qualityGateDecision || 'QA attempted blocked';
}

function readsFindingCode(finding) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return finding.code;
}

function rendersStaleReason(finding) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return `${finding.code}: ${finding.path}`;
}

function selectsDisplayStatus(status) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (status.staleReasons.length > 0) {
    return 'stale';
  }

  if (status.endUserQaStatus === 'QA passed' && status.promotionStatus === 'promoted') {
    return 'qa-passed.promoted';
  }

  if (status.endUserQaStatus === 'QA passed') {
    return 'qa-passed';
  }

  if (status.endUserQaStatus === 'QA waived with approval') {
    return 'qa-waived';
  }

  if (String(status.endUserQaStatus).toLowerCase().includes('failed')) {
    return 'qa-failed';
  }

  if (String(status.endUserQaStatus).toLowerCase().includes('blocked') || String(status.endUserQaStatus).toUpperCase() === 'BLOCKED') {
    return 'qa-blocked';
  }

  if (status.implementationStatus === 'implemented' && status.executionProofStatus === 'proven') {
    return 'implemented.not-tested';
  }

  if (status.executionProofStatus === 'blocked') {
    return 'proof-blocked';
  }

  return 'not-implemented';
}

function recommendsNextAction(status) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (status.displayStatus === 'stale') {
    return 'regenerate evidence or rerun the status projection';
  }

  if (status.displayStatus === 'not-implemented') {
    return 'implement the feature and generate execution proof';
  }

  if (status.displayStatus === 'implemented.not-tested') {
    return 'run the LLM end-user testing conveyor';
  }

  if (status.displayStatus === 'proof-blocked') {
    return `resolve execution proof blocker ${status.blockerCodes[0] || 'proof-blocked'}`;
  }

  if (status.displayStatus === 'qa-blocked' || status.displayStatus === 'qa-failed') {
    return `resolve QA blocker ${status.blockerCodes[0] || 'qa-blocked'}`;
  }

  if (status.displayStatus === 'qa-passed') {
    return 'run deterministic promotion gate';
  }

  if (status.displayStatus === 'qa-waived') {
    return 'review waiver approval before promotion';
  }

  return 'keep promoted QA bundle immutable';
}

function buildsEvidenceHashes(rootDir, proofRecords, qaBundle, promotionDecisionPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const hashes = {};
  if (proofRecords.length > 0) {
    const proof = proofRecords[proofRecords.length - 1];
    hashes.latestExecutionProof = {
      path: formatsRepoRelativePath(rootDir, proof.proofPath),
      sha256: hashesFile(proof.proofPath),
    };
  }

  if (qaBundle) {
    hashes.latestQaBundleManifest = {
      path: formatsRepoRelativePath(rootDir, qaBundle.manifestPath),
      sha256: hashesFile(qaBundle.manifestPath),
    };
  }

  if (promotionDecisionPath && fs.existsSync(promotionDecisionPath)) {
    hashes.latestPromotionDecision = {
      path: formatsRepoRelativePath(rootDir, promotionDecisionPath),
      sha256: hashesFile(promotionDecisionPath),
    };
  }

  return hashes;
}

function detectsBundleVerificationFindings(rootDir, qaBundle, qaStatus) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const findings = [];
  if (!qaBundle || !String(qaStatus).toLowerCase().includes('passed')) {
    return findings;
  }

  for (const artifact of ['qa-evidence-bundle.manifest.v1.json', 'machine-environment.v1.json', 'qa-gate-decision.v1.json', 'qa-evidence-bundle.report.md']) {
    const artifactPath = path.join(qaBundle.bundlePath, artifact);
    if (!fs.existsSync(artifactPath)) {
      findings.push({
        code: 'feature-qa-bundle-missing-artifact',
        path: formatsRepoRelativePath(rootDir, artifactPath),
      });
    }
  }

  for (const linkedReport of qaBundle.manifest.linkedReports || []) {
    const linkedPath = path.join(rootDir, linkedReport.bundlePath);
    if (!fs.existsSync(linkedPath) || hashesFile(linkedPath) !== linkedReport.sha256) {
      findings.push({
        code: 'qa-bundle-hash-mismatch',
        path: linkedReport.bundlePath,
      });
    }
  }

  return findings;
}

function buildsFeatureStatusContract(feature, context) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const proofRecords = readsExecutionProofRecords(context.rootDir, feature.featureId);
  const latestProof = proofRecords[proofRecords.length - 1] || null;
  const qaBundle = context.latestQaByFeature.get(feature.featureId) || null;
  const qaStatus = readsQaStatus(qaBundle);
  const qaFindings = detectsBundleVerificationFindings(context.rootDir, qaBundle, qaStatus);
  const proofBlockers = latestProof ? collectsBlockerCodes([
    latestProof.proof.blockerCodes,
    latestProof.proof.blockerFindings ? latestProof.proof.blockerFindings.map(readsFindingCode) : [],
    latestProof.proof.promotionDecision ? latestProof.proof.promotionDecision.blockerCodes : [],
  ]) : [];
  const qaBlockers = qaBundle ? collectsBlockerCodes([
    qaBundle.manifest.blockerCodes,
    qaBundle.gateDecision ? qaBundle.gateDecision.blockerCodes : [],
    qaFindings.map(readsFindingCode),
  ]) : [];
  const implementationStatus = proofRecords.length > 0 || qaBundle ? 'implemented' : 'not implemented';
  const executionProofStatus = proofBlockers.length > 0 ? 'blocked' : (proofRecords.length > 0 ? 'proven' : 'not proven');
  const promotionDecisionPath = qaBundle && qaBundle.gateDecision && qaBundle.gateDecision.promotable === true
    ? qaBundle.gateDecisionPath
    : null;
  const promotionStatus = promotionDecisionPath ? 'promoted' : 'not promoted';
  const status = {
    staleReasons: qaFindings.map(rendersStaleReason),
    implementationStatus,
    executionProofStatus,
    endUserQaStatus: qaStatus,
    promotionStatus,
    blockerCodes: collectsBlockerCodes([proofBlockers, qaBlockers]),
  };
  const displayStatus = selectsDisplayStatus(status);
  const releaseCandidateId = qaBundle ? qaBundle.manifest.releaseCandidateId || MISSING : MISSING;
  const qaRunId = qaBundle ? qaBundle.manifest.qaRunId || MISSING : MISSING;
  const contract = {
    schemaVersion: FEATURE_STATUS_SCHEMA_VERSION,
    featureId: feature.featureId,
    featureName: feature.featureName,
    sourceFeaturePath: feature.sourceFeaturePath,
    sourceFeatureContentHash: feature.sourceFeatureContentHash,
    displayStatus,
    implementationStatus,
    executionProofStatus,
    endUserQaStatus: qaStatus,
    promotionStatus: displayStatus === 'stale' ? 'not promoted' : promotionStatus,
    latestExecutionRunId: latestProof ? latestProof.runId : MISSING,
    latestQaRunId: qaRunId,
    latestReleaseCandidateId: releaseCandidateId,
    latestExecutionProofPath: latestProof ? formatsRepoRelativePath(context.rootDir, latestProof.proofPath) : MISSING,
    latestQaBundlePath: qaBundle ? formatsRepoRelativePath(context.rootDir, qaBundle.bundlePath) : MISSING,
    latestQaGateDecisionPath: qaBundle && qaBundle.gateDecisionPath ? formatsRepoRelativePath(context.rootDir, qaBundle.gateDecisionPath) : MISSING,
    latestPromotionDecisionPath: promotionDecisionPath ? formatsRepoRelativePath(context.rootDir, promotionDecisionPath) : MISSING,
    evidenceHashes: buildsEvidenceHashes(context.rootDir, proofRecords, qaBundle, promotionDecisionPath),
    blockerCodes: status.blockerCodes,
    staleReasons: status.staleReasons,
    blockerCount: status.blockerCodes.length,
    generatedAt: context.generatedAt,
    generatorName: FEATURE_STATUS_GENERATOR_NAME,
  };

  contract.nextRecommendedAction = recommendsNextAction(contract);
  contract.productOwnerSummary = buildsProductOwnerSummary(contract);
  return contract;
}

function appliesStaleReasonsFromPreviousContract(status, previousStatus) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!previousStatus || !previousStatus.displayStatus) {
    return status;
  }

  const staleReasons = detectsPreviousPassingStatusDrift(status, previousStatus);
  if (staleReasons.length === 0) {
    return status;
  }

  const staleStatus = {
    ...status,
    displayStatus: 'stale',
    promotionStatus: 'not promoted',
    staleReasons,
  };
  staleStatus.nextRecommendedAction = recommendsNextAction(staleStatus);
  staleStatus.productOwnerSummary = buildsProductOwnerSummary(staleStatus);
  return staleStatus;
}

function detectsPreviousPassingStatusDrift(status, previousStatus) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!isPassingDisplayStatus(previousStatus.displayStatus) && !isPassingDisplayStatus(status.displayStatus)) {
    return [];
  }

  const reasons = [];
  if (previousStatus.sourceFeatureContentHash && previousStatus.sourceFeatureContentHash !== status.sourceFeatureContentHash) {
    reasons.push(`source-feature-content-hash changed: ${status.sourceFeaturePath}`);
  }

  for (const evidenceHashKey of Object.keys(status.evidenceHashes || {}).sort()) {
    const previousHash = previousStatus.evidenceHashes ? previousStatus.evidenceHashes[evidenceHashKey] : null;
    const currentHash = status.evidenceHashes[evidenceHashKey];
    if (previousHash && currentHash && previousHash.sha256 !== currentHash.sha256) {
      reasons.push(`${evidenceHashKey} changed: ${currentHash.path}`);
    }
  }

  return reasons;
}

function isPassingDisplayStatus(displayStatus) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return displayStatus === 'qa-passed' || displayStatus === 'qa-passed.promoted';
}

function buildsProductOwnerSummary(status) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (status.displayStatus === 'qa-passed.promoted') {
    return `${status.featureName} has QA pass evidence and deterministic promotion evidence.`;
  }

  if (status.displayStatus === 'qa-passed') {
    return `${status.featureName} passed QA, but release promotion is still separate.`;
  }

  if (status.displayStatus === 'implemented.not-tested') {
    return `${status.featureName} has implementation proof but no end-user QA bundle.`;
  }

  if (status.displayStatus === 'stale') {
    return `${status.featureName} has projection or evidence verification drift.`;
  }

  return `${status.featureName} is currently ${status.displayStatus}.`;
}

function buildsStatusContractPath(featuresRoot, featureId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return path.join(featuresRoot, STATUS_DIRECTORY_NAME, `${featureId}.status.v1.json`);
}

function buildsStatusSentinelPath(featuresRoot, displayStatus, featureId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return path.join(featuresRoot, `_STATUS.${displayStatus}.${featureId}.md`);
}

function discoversStatusSentinels(featuresRoot, featureId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!fs.existsSync(featuresRoot)) {
    return [];
  }

  const suffix = `.${featureId}.md`;
  const sentinels = [];
  for (const entry of fs.readdirSync(featuresRoot).sort()) {
    if (entry.startsWith('_STATUS.') && entry.endsWith(suffix)) {
      sentinels.push(path.join(featuresRoot, entry));
    }
  }

  return sentinels;
}

function readsPreviousStatusContract(featuresRoot, featureId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const statusContractPath = buildsStatusContractPath(featuresRoot, featureId);
  if (!fs.existsSync(statusContractPath)) {
    return null;
  }

  try {
    return readsJsonFile(statusContractPath);
  } catch (error) {
    return null;
  }
}

function formatsSentinelPathForFinding(rootDir, sentinelPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return formatsRepoRelativePath(rootDir, sentinelPath);
}

function detectsDuplicateStatusSentinels(rootDir, featureId, existingSentinels) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (existingSentinels.length < 2) {
    return [];
  }

  return [{
    code: 'duplicate-feature-status-sentinel',
    featureId,
    path: existingSentinels.map(formatsSentinelPathForFinding.bind(null, rootDir)).join(', '),
  }];
}

function removesObsoleteStatusSentinels(featuresRoot, featureId, expectedPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  for (const sentinelPath of discoversStatusSentinels(featuresRoot, featureId)) {
    if (sentinelPath !== expectedPath) {
      fs.unlinkSync(sentinelPath);
    }
  }
}

function rendersStatusSentinel(status, sourceJsonPath, sourceJsonHash) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    `# ${status.displayStatus}: ${status.featureName}`,
    '',
    '> Generated projection. This sentinel is not the source of truth; the JSON status contract is the source used to render it.',
    '',
    `- feature id: ${status.featureId}`,
    `- feature name: ${status.featureName}`,
    `- display status: ${status.displayStatus}`,
    `- implementation status: ${status.implementationStatus}`,
    `- execution proof status: ${status.executionProofStatus}`,
    `- end-user QA status: ${status.endUserQaStatus}`,
    `- promotion status: ${status.promotionStatus}`,
    `- latest execution proof path: ${status.latestExecutionProofPath}`,
    `- latest QA bundle path: ${status.latestQaBundlePath}`,
    `- latest promotion decision path: ${status.latestPromotionDecisionPath}`,
    `- blocker count: ${status.blockerCount}`,
    `- blocker codes: ${status.blockerCodes.length > 0 ? status.blockerCodes.join(', ') : 'none'}`,
    `- generated at: ${status.generatedAt}`,
    `- generated by: ${status.generatorName}`,
    `- source feature document: ${status.sourceFeaturePath}`,
    `- source JSON contract: ${sourceJsonPath}`,
    '',
    '## Product Owner Summary',
    '',
    status.productOwnerSummary,
    '',
    '## Next Recommended Action',
    '',
    status.nextRecommendedAction,
    '',
    '## Generated Signature',
    '',
    `- generator name: ${FEATURE_STATUS_GENERATOR_NAME}`,
    `- generated at: ${status.generatedAt}`,
    `- source JSON path: ${sourceJsonPath}`,
    `- source JSON hash: ${sourceJsonHash}`,
  ];

  if (status.displayStatus === 'qa-passed') {
    lines.splice(25, 0, 'QA passed is not the same as release promotion.', '');
  }

  return `${lines.join('\n')}\n`;
}

function writesJsonArtifact(artifactPath, content) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  fs.mkdirSync(path.dirname(artifactPath), { recursive: true });
  fs.writeFileSync(artifactPath, `${JSON.stringify(content, null, 2)}\n`, 'utf8');
  return artifactPath;
}

function writesTextArtifact(artifactPath, content) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  fs.mkdirSync(path.dirname(artifactPath), { recursive: true });
  fs.writeFileSync(artifactPath, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
  return artifactPath;
}

function verifiesSentinelMatchesStatus(rootDir, sentinelPath, status) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!fs.existsSync(sentinelPath)) {
    return [];
  }

  const content = fs.readFileSync(sentinelPath, 'utf8');
  const findings = [];

  if (!content.includes(`display status: ${status.displayStatus}`)) {
    findings.push({
      code: 'feature-status-filesystem-mismatch',
      featureId: status.featureId,
      expectedPath: formatsRepoRelativePath(rootDir, buildsStatusSentinelPath(path.dirname(sentinelPath), status.displayStatus, status.featureId)),
      observedPath: formatsRepoRelativePath(rootDir, sentinelPath),
    });
  }

  if (!content.includes('## Generated Signature')) {
    findings.push({
      code: 'feature-status-sentinel-drift',
      featureId: status.featureId,
      path: formatsRepoRelativePath(rootDir, sentinelPath),
    });
  }

  return findings;
}

function writesFeatureStatusProjection(options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const featuresRoot = options.featuresRoot || path.join(rootDir, 'docs', 'features');
  const generatedAt = options.generatedAt || new Date().toISOString();
  const discovered = discoversFeatureSpecs({ rootDir, featuresRoot });
  const context = {
    rootDir,
    generatedAt,
    latestQaByFeature: indexesLatestQaBundleByFeature(rootDir),
  };
  const statuses = [];
  const findings = [...discovered.findings];

  for (const feature of discovered.features) {
    const status = appliesStaleReasonsFromPreviousContract(
      buildsFeatureStatusContract(feature, context),
      readsPreviousStatusContract(featuresRoot, feature.featureId),
    );
    const expectedSentinelPath = buildsStatusSentinelPath(featuresRoot, status.displayStatus, status.featureId);
    const existingSentinels = discoversStatusSentinels(featuresRoot, status.featureId);

    findings.push(...detectsDuplicateStatusSentinels(rootDir, status.featureId, existingSentinels));
    for (const existingSentinel of existingSentinels) {
      findings.push(...verifiesSentinelMatchesStatus(rootDir, existingSentinel, status));
    }

    removesObsoleteStatusSentinels(featuresRoot, status.featureId, expectedSentinelPath);
    const statusContractPath = buildsStatusContractPath(featuresRoot, status.featureId);
    writesJsonArtifact(statusContractPath, status);
    const sourceJsonPath = formatsRepoRelativePath(rootDir, statusContractPath);
    const sourceJsonHash = hashesFile(statusContractPath);
    writesTextArtifact(expectedSentinelPath, rendersStatusSentinel(status, sourceJsonPath, sourceJsonHash));
    status.statusContractPath = sourceJsonPath;
    status.statusSentinelPath = formatsRepoRelativePath(rootDir, expectedSentinelPath);
    statuses.push(status);
  }

  return {
    statuses,
    findings,
    generatedAt,
    featuresRoot,
  };
}

function countsByDisplayStatus(statuses) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const counts = {};
  for (const status of STATUS_ORDER) {
    counts[status] = 0;
  }

  for (const status of statuses) {
    counts[status.displayStatus] = (counts[status.displayStatus] || 0) + 1;
  }

  return counts;
}

function readsTopBlockerCode(row) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return row.blockerCodes && row.blockerCodes.length > 0 ? row.blockerCodes[0] : 'none';
}

function buildsBoardRows(statuses, findings) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const staleFeatureIds = new Set();
  for (const finding of findings) {
    if (finding.featureId) {
      staleFeatureIds.add(finding.featureId);
    }
  }

  const rows = [];
  for (const status of statuses) {
    rows.push(buildsBoardRow(status, staleFeatureIds));
  }

  return rows.sort(sortsBoardRowsByProductUrgency);
}

function buildsBoardRow(status, staleFeatureIds) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    featureId: status.featureId,
    featureName: status.featureName,
    displayStatus: staleFeatureIds.has(status.featureId) ? 'stale' : status.displayStatus,
    implementationStatus: status.implementationStatus,
    executionProofStatus: status.executionProofStatus,
    endUserQaStatus: status.endUserQaStatus,
    promotionStatus: staleFeatureIds.has(status.featureId) ? 'not promoted' : status.promotionStatus,
    latestReleaseCandidateId: status.latestReleaseCandidateId,
    latestQaRunId: status.latestQaRunId,
    latestQaBundlePath: status.latestQaBundlePath,
    blockerCount: status.blockerCount,
    topBlockerCode: readsTopBlockerCode(status),
    staleIndicator: staleFeatureIds.has(status.featureId) || status.displayStatus === 'stale' ? 'stale' : 'current',
    nextAction: status.nextRecommendedAction,
    statusSentinelPath: status.statusSentinelPath,
    sourceFeaturePath: status.sourceFeaturePath,
    statusContractPath: status.statusContractPath,
    blockerCodes: status.blockerCodes,
    generatedAt: status.generatedAt,
  };
}

function sortsBoardRowsByProductUrgency(first, second) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const firstOrder = STATUS_ORDER.indexOf(first.displayStatus);
  const secondOrder = STATUS_ORDER.indexOf(second.displayStatus);
  if (firstOrder !== secondOrder) {
    return firstOrder - secondOrder;
  }

  return first.featureId.localeCompare(second.featureId);
}

function buildsBlockerSummary(rows, findings) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const counts = new Map();
  for (const row of rows) {
    for (const code of row.blockerCodes || []) {
      counts.set(code, (counts.get(code) || 0) + 1);
    }
  }

  for (const finding of findings) {
    counts.set(finding.code, (counts.get(finding.code) || 0) + 1);
  }

  const summary = [];
  for (const entry of counts.entries()) {
    summary.push(buildsBlockerSummaryEntry(entry));
  }

  return summary.sort(sortsBlockerSummaryByFrequency);
}

function buildsBlockerSummaryEntry(entry) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return { code: entry[0], count: entry[1] };
}

function sortsBlockerSummaryByFrequency(first, second) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return second.count - first.count || first.code.localeCompare(second.code);
}

function buildsFeatureQualityBoard(statusProjection, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const rows = buildsBoardRows(statusProjection.statuses, statusProjection.findings);
  const counts = countsByDisplayStatus(rows);
  const gitStatus = readsGitValue(rootDir, ['status', '--porcelain'], '');
  const gitCommit = readsGitValue(rootDir, ['rev-parse', 'HEAD'], 'working-tree');

  return {
    schemaVersion: FEATURE_BOARD_SCHEMA_VERSION,
    generatedAt: statusProjection.generatedAt,
    generatorName: FEATURE_BOARD_GENERATOR_NAME,
    repositoryRoot: rootDir,
    gitBranch: readsGitValue(rootDir, ['branch', '--show-current'], NOT_OBSERVED),
    gitCommitOrWorkingTreeMarker: gitStatus ? `${gitCommit}+working-tree-changes` : gitCommit,
    totalFeatures: rows.length,
    featuresNotImplemented: counts['not-implemented'] || 0,
    featuresImplementedNotTested: counts['implemented.not-tested'] || 0,
    featuresProofBlocked: counts['proof-blocked'] || 0,
    featuresQaNotRun: counts['qa-not-run'] || 0,
    featuresQaBlocked: counts['qa-blocked'] || 0,
    featuresQaFailed: counts['qa-failed'] || 0,
    featuresQaPassed: counts['qa-passed'] || 0,
    featuresQaPassedPromoted: counts['qa-passed.promoted'] || 0,
    staleFeatures: counts.stale || 0,
    boardRows: rows,
    sourceStatusContractHashes: buildsSourceStatusContractHashes(rootDir, rows),
    blockerSummary: buildsBlockerSummary(rows, statusProjection.findings),
    findings: statusProjection.findings,
  };
}

function buildsSourceStatusContractHashes(rootDir, rows) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const hashes = [];
  for (const row of rows) {
    hashes.push({
      path: row.statusContractPath,
      sha256: hashesFile(path.join(rootDir, row.statusContractPath)),
    });
  }

  return hashes;
}

function rendersBoardSummary(board) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    `- total features: ${board.totalFeatures}`,
    `- not implemented: ${board.featuresNotImplemented}`,
    `- implemented not tested: ${board.featuresImplementedNotTested}`,
    `- proof blocked: ${board.featuresProofBlocked}`,
    `- QA not run: ${board.featuresQaNotRun}`,
    `- QA blocked: ${board.featuresQaBlocked}`,
    `- QA failed: ${board.featuresQaFailed}`,
    `- QA passed: ${board.featuresQaPassed}`,
    `- QA passed promoted: ${board.featuresQaPassedPromoted}`,
    `- stale: ${board.staleFeatures}`,
  ].join('\n');
}

function rendersBlockerSummary(board) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (board.blockerSummary.length === 0) {
    return '_No blocker codes observed._';
  }

  const lines = [];
  for (const blocker of board.blockerSummary) {
    lines.push(`- ${blocker.code}: ${blocker.count}`);
  }

  return lines.join('\n');
}

function rendersBoardRows(rows) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    '| feature id | feature name | display status | implementation status | execution proof status | end-user QA status | promotion status | latest release candidate id | latest QA run id | latest QA bundle path | blocker count | top blocker code | stale indicator | next action |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- |',
  ];

  for (const row of rows) {
    lines.push(`| ${row.featureId} | ${row.featureName} | ${row.displayStatus} | ${row.implementationStatus} | ${row.executionProofStatus} | ${row.endUserQaStatus} | ${row.promotionStatus} | ${row.latestReleaseCandidateId} | ${row.latestQaRunId} | ${row.latestQaBundlePath} | ${row.blockerCount} | ${row.topBlockerCode} | ${row.staleIndicator} | ${row.nextAction} |`);
  }

  return lines.join('\n');
}

function rendersFeatureQualityBoardMarkdown(board) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const activeRows = [];
  const promotedRows = [];
  for (const row of board.boardRows) {
    if (row.displayStatus === 'qa-passed.promoted') {
      promotedRows.push(row);
    } else {
      activeRows.push(row);
    }
  }

  return [
    '# Feature Quality Board',
    '',
    '> Generated projection. Do not hand-author this board; regenerate it from feature status contracts.',
    '',
    '## PI Summary Counts',
    '',
    rendersBoardSummary(board),
    '',
    '## Top Blocker Codes',
    '',
    rendersBlockerSummary(board),
    '',
    '## Features Needing Action',
    '',
    rendersBoardRows(activeRows),
    '',
    '## Promoted Features',
    '',
    promotedRows.length > 0 ? rendersBoardRows(promotedRows) : '_No promoted features._',
    '',
    '## Board Findings',
    '',
    rendersBoardFindings(board.findings),
    '',
    `Generated at: ${board.generatedAt}`,
    `Generated by: ${board.generatorName}`,
  ].join('\n');
}

function rendersBoardFindings(findings) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (findings.length === 0) {
    return '_No board findings._';
  }

  const lines = [];
  for (const finding of findings) {
    lines.push(`- ${finding.code}: ${finding.featureId || 'board'} ${finding.path || finding.expectedPath || ''}`);
  }

  return lines.join('\n');
}

function rendersFeatureQualityTree(rootDir, featuresRoot) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = ['docs/features/'];
  const entries = fs.existsSync(featuresRoot) ? fs.readdirSync(featuresRoot).sort() : [];
  for (const entry of entries) {
    const entryPath = path.join(featuresRoot, entry);
    if (entry === STATUS_DIRECTORY_NAME) {
      lines.push('|-- _feature-status/');
      for (const statusEntry of fs.readdirSync(entryPath).sort()) {
        lines.push(`|   |-- ${statusEntry}`);
      }
    } else if (entry === '_FEATURE-QUALITY-BOARD.md'
      || entry === '_FEATURE-QUALITY-BOARD.v1.json'
      || entry === '_FEATURE-QUALITY-TREE.txt'
      || entry.startsWith('_STATUS.')
      || entry.endsWith('.feature.md')
      || entry.endsWith('.feature')) {
      lines.push(`|-- ${entry}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

function writesFeatureQualityBoardProjection(options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const featuresRoot = options.featuresRoot || path.join(rootDir, 'docs', 'features');
  const statusProjection = writesFeatureStatusProjection({ ...options, rootDir, featuresRoot });
  const board = buildsFeatureQualityBoard(statusProjection, { rootDir });
  const boardJsonPath = path.join(featuresRoot, '_FEATURE-QUALITY-BOARD.v1.json');
  const boardMarkdownPath = path.join(featuresRoot, '_FEATURE-QUALITY-BOARD.md');
  const treePath = path.join(featuresRoot, '_FEATURE-QUALITY-TREE.txt');

  writesJsonArtifact(boardJsonPath, board);
  writesTextArtifact(boardMarkdownPath, rendersFeatureQualityBoardMarkdown(board));
  writesTextArtifact(treePath, rendersFeatureQualityTree(rootDir, featuresRoot));

  return {
    board,
    boardJsonPath,
    boardMarkdownPath,
    treePath,
    statusProjection,
    findings: board.findings,
  };
}

module.exports = {
  FEATURE_BOARD_GENERATOR_NAME,
  FEATURE_BOARD_SCHEMA_VERSION,
  FEATURE_STATUS_GENERATOR_NAME,
  FEATURE_STATUS_SCHEMA_VERSION,
  buildsFeatureQualityBoard,
  buildsFeatureStatusContract,
  discoversFeatureSpecs,
  rendersFeatureQualityBoardMarkdown,
  rendersFeatureQualityTree,
  rendersStatusSentinel,
  writesFeatureQualityBoardProjection,
  writesFeatureStatusProjection,
};
