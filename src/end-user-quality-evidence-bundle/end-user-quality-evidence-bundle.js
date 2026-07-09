const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const {
  buildsFeatureProofInventory,
  discoversFeatureScenarios,
} = require('../feature-execution-proof/feature-execution-proof');

const QA_BUNDLE_SCHEMA_VERSION = 'qa-evidence-bundle.manifest.v1';
const QA_GATE_SCHEMA_VERSION = 'qa-gate-decision.v1';
const QUALITY_BUNDLE_ROOT = path.join('quality', 'end-user-test-bundles');
const MISSING = 'missing';
const NOT_QAED = 'not QAed';
const QA_PASSED = 'QA passed';
const QA_FAILED = 'QA attempted failed';
const QA_BLOCKED = 'QA attempted blocked';
const QA_WAIVED = 'QA waived with approval';

const REQUIRED_BUNDLE_ARTIFACTS = [
  'qa-evidence-bundle.manifest.v1.json',
  'qa-evidence-bundle.report.md',
  'qa-gate-decision.v1.json',
  'qa-execution-timeline.table.md',
  'machine-environment.v1.json',
  'end-user-test-session.md',
  'feature-proof-links.v1.json',
  'report-artifact-index.v1.json',
  'blocker-worklist.md',
  'screenshots.index.md',
  'html-preview.index.md',
];

const REQUIRED_HUMAN_REPORTS = [
  'executable-body-contract.report.md',
  'execution-timeline.table.md',
  'method-execution-timeline.table.md',
  'method-call-evidence.report.md',
  'domain-body-sprawl.report.md',
  'domain-body-sprawl-hotspots.table.md',
  'report.md',
];

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

function buildsQualityBundlePath(rootDir, releaseCandidateId, qaRunId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return path.join(rootDir || process.cwd(), QUALITY_BUNDLE_ROOT, releaseCandidateId, qaRunId);
}

function readsFeatureFiles(featuresRoot) {
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

function hashesFile(filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function writesJsonArtifact(artifactPath, content) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  fs.mkdirSync(path.dirname(artifactPath), { recursive: true });
  fs.writeFileSync(artifactPath, `${JSON.stringify(content, null, 2)}\n`, 'utf8');
  return artifactPath;
}

function writesMarkdownArtifact(artifactPath, content) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  fs.mkdirSync(path.dirname(artifactPath), { recursive: true });
  fs.writeFileSync(artifactPath, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
  return artifactPath;
}

function redactsSecretText(value) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return String(value || '')
    .replace(/(token|api[_-]?key|password|secret)=([^&\s]+)/giu, '$1=[REDACTED]')
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/gu, 'Bearer [REDACTED]');
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

function buildsMachineEnvironment(options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const startedAt = options.startedAt || new Date().toISOString();
  const finishedAt = options.finishedAt || startedAt;
  const durationMs = options.durationMs !== undefined
    ? options.durationMs
    : Math.max(0, Date.parse(finishedAt) - Date.parse(startedAt));
  const gitCommit = readsGitValue(rootDir, ['rev-parse', 'HEAD'], 'working-tree');
  const gitStatus = readsGitValue(rootDir, ['status', '--porcelain'], '');

  return {
    schemaVersion: 'machine-environment.v1',
    releaseCandidateId: options.releaseCandidateId,
    qaRunId: options.qaRunId,
    machineId: options.machineId || os.hostname(),
    operatingSystem: `${os.type()} ${os.release()}`,
    cpuArchitecture: os.arch(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || process.env.TZ || 'not observed',
    nodeVersion: process.version,
    browserNameAndVersion: options.browserNameAndVersion || 'not applicable',
    viewportOrTerminalSize: options.viewportOrTerminalSize || `${process.stdout.columns || 'not observed'}x${process.stdout.rows || 'not observed'}`,
    gitBranch: options.gitBranch || readsGitValue(rootDir, ['branch', '--show-current'], 'not observed'),
    gitCommitOrWorkingTreeMarker: gitStatus ? `${gitCommit}+working-tree-changes` : gitCommit,
    repositoryRoot: rootDir,
    commandExecuted: redactsSecretText(options.commandExecuted || process.argv.join(' ')),
    startedAt,
    finishedAt,
    durationMs,
    ciProvider: options.ciProvider || process.env.CI_PROVIDER || (process.env.GITHUB_ACTIONS ? 'github-actions' : 'not applicable'),
    ciRunUrl: redactsSecretText(options.ciRunUrl || (process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : 'not applicable')),
  };
}

function readsBundleManifests(rootDir, releaseCandidateId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const bundleRoot = path.join(rootDir || process.cwd(), QUALITY_BUNDLE_ROOT);
  const releaseRoots = releaseCandidateId ? [path.join(bundleRoot, releaseCandidateId)] : readsDirectoryPaths(bundleRoot);
  const manifests = [];

  for (const releaseRoot of releaseRoots) {
    for (const runRoot of readsDirectoryPaths(releaseRoot)) {
      const manifestPath = path.join(runRoot, 'qa-evidence-bundle.manifest.v1.json');

      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        manifests.push({
          ...manifest,
          manifestPath,
          bundlePath: runRoot,
        });
      }
    }
  }

  return manifests.sort(sortsBundleManifestsByRunId);
}

function sortsBundleManifestsByRunId(first, second) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return String(first.qaRunId).localeCompare(String(second.qaRunId));
}

function readsDirectoryPaths(directoryPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  const entries = fs.readdirSync(directoryPath).sort();
  const directoryPaths = [];

  for (const entry of entries) {
    const entryPath = path.join(directoryPath, entry);

    if (fs.statSync(entryPath).isDirectory()) {
      directoryPaths.push(entryPath);
    }
  }

  return directoryPaths;
}

function indexesLatestQaByScenario(manifests) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const latestByScenario = new Map();

  for (const manifest of manifests) {
    for (const scenario of manifest.testedFeatureScenarios || []) {
      latestByScenario.set(`${scenario.featureId}/${scenario.scenarioId}`, {
        manifest,
        scenario,
      });
    }
  }

  return latestByScenario;
}

function classifiesQaStatus(manifest, scenario) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!manifest) {
    return NOT_QAED;
  }

  return scenario.qaStatus || manifest.qaStatus || manifest.qualityGateDecision || QA_BLOCKED;
}

function buildsQualityInventory(options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const featureInventory = buildsFeatureProofInventory({
    rootDir,
    featuresRoot: options.featuresRoot || path.join(rootDir, 'docs', 'features'),
    evidenceRoot: options.evidenceRoot || path.join(rootDir, 'evidence'),
    runId: options.proofRunId || options.runId || 'quality-inventory',
    implementationIndex: options.implementationIndex || {},
    featureFiles: options.featureFiles || readsFeatureFiles(options.featuresRoot || path.join(rootDir, 'docs', 'features')),
    generatedAt: options.generatedAt,
  });
  const latestByScenario = indexesLatestQaByScenario(readsBundleManifests(rootDir));
  const rows = [];

  for (const scenario of featureInventory.scenarios) {
    const latest = latestByScenario.get(`${scenario.featureId}/${scenario.scenarioId}`);
    const manifest = latest ? latest.manifest : null;
    const qaScenario = latest ? latest.scenario : null;

    rows.push({
      featureId: scenario.featureId,
      scenarioId: scenario.scenarioId,
      scenarioName: scenario.scenarioName,
      implementationProofStatus: scenario.proofStatus,
      qaStatus: classifiesQaStatus(manifest, qaScenario),
      latestQaRunId: manifest ? manifest.qaRunId : MISSING,
      latestQaBundlePath: manifest ? formatsRepoRelativePath(rootDir, manifest.bundlePath) : MISSING,
      qualityGateDecision: manifest ? manifest.qualityGateDecision : MISSING,
      reviewerOrApprover: qaScenario && qaScenario.reviewerOrApprover ? qaScenario.reviewerOrApprover : (manifest ? manifest.reviewerOrApprover || MISSING : MISSING),
      blockerCodes: manifest ? manifest.blockerCodes || [] : [],
    });
  }

  return {
    schemaVersion: 'end-user-quality-inventory.v1',
    generatedAt: options.generatedAt || new Date().toISOString(),
    rows,
  };
}

function readsScenarioKey(scenario) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return `${scenario.featureId}/${scenario.scenarioId}`;
}

function buildsRequiredReportCandidates(options) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const candidates = [];

  for (const reportPath of options.humanReportPaths || []) {
    candidates.push(path.isAbsolute(reportPath) ? reportPath : path.join(options.rootDir, reportPath));
  }

  for (const scenario of options.testedFeatureScenarios || []) {
    const packetRoot = path.join(options.evidenceRoot, 'runs', scenario.proofRunId || options.proofRunId || options.qaRunId, 'features', scenario.featureId, 'scenarios', scenario.scenarioId);
    candidates.push(path.join(packetRoot, 'executable-body-contract.report.md'));
    candidates.push(path.join(packetRoot, 'execution-timeline.table.md'));
    candidates.push(path.join(packetRoot, 'method-execution-timeline.table.md'));
    candidates.push(path.join(packetRoot, 'method-call-evidence.report.md'));
  }

  candidates.push(path.join(options.evidenceRoot, 'runs', options.proofRunId || options.qaRunId, 'sprawl', 'domain-body-sprawl.report.md'));
  candidates.push(path.join(options.evidenceRoot, 'runs', options.proofRunId || options.qaRunId, 'sprawl', 'domain-body-sprawl-hotspots.table.md'));
  candidates.push(path.join(options.rootDir, 'report.md'));
  return [...new Set(candidates)];
}

function linksHumanReports(options) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const linkedReports = [];
  const missingReports = [];
  const reportDirectory = path.join(options.bundlePath, 'linked-reports');
  const candidates = buildsRequiredReportCandidates(options);

  for (const reportPath of candidates) {
    const reportName = path.basename(reportPath);

    if (!fs.existsSync(reportPath)) {
      if (REQUIRED_HUMAN_REPORTS.includes(reportName)) {
        missingReports.push(formatsRepoRelativePath(options.rootDir, reportPath));
      }
      continue;
    }

    const relativeSource = formatsRepoRelativePath(options.rootDir, reportPath);
    const snapshotName = relativeSource.replace(/[^A-Za-z0-9_.-]+/gu, '__');
    const snapshotPath = path.join(reportDirectory, snapshotName);
    fs.mkdirSync(path.dirname(snapshotPath), { recursive: true });
    fs.copyFileSync(reportPath, snapshotPath);
    linkedReports.push({
      sourcePath: relativeSource,
      bundlePath: formatsRepoRelativePath(options.rootDir, snapshotPath),
      sha256: hashesFile(snapshotPath),
    });
  }

  return {
    linkedReports,
    missingReports,
  };
}

function buildsQaGateDecision(input) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const blockerCodes = [...input.blockerCodes];
  const hasFailedScenario = detectsFailedQaScenario(input.testedFeatureScenarios);
  const hasUnapprovedWaiver = detectsUnapprovedQaWaiver(input.testedFeatureScenarios);

  if (input.missingReports.length > 0 && !blockerCodes.includes('qa-bundle-missing-human-proof-report')) {
    blockerCodes.push('qa-bundle-missing-human-proof-report');
  }

  if (hasFailedScenario && !blockerCodes.includes('qa-scenario-not-passed')) {
    blockerCodes.push('qa-scenario-not-passed');
  }

  if (hasUnapprovedWaiver && !blockerCodes.includes('qa-waiver-without-approval')) {
    blockerCodes.push('qa-waiver-without-approval');
  }

  return {
    schemaVersion: QA_GATE_SCHEMA_VERSION,
    releaseCandidateId: input.releaseCandidateId,
    qaRunId: input.qaRunId,
    qualityGateDecision: blockerCodes.length === 0 ? QA_PASSED : 'BLOCKED',
    promotable: blockerCodes.length === 0,
    promotionRecommendation: blockerCodes.length === 0 ? 'promote' : 'do not promote',
    blockerCount: blockerCodes.length,
    blockerCodes,
    decidedAt: input.decidedAt,
  };
}

function detectsFailedQaScenario(scenarios) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  for (const scenario of scenarios) {
    if (scenario.qaStatus === QA_FAILED || scenario.qaStatus === QA_BLOCKED) {
      return true;
    }
  }

  return false;
}

function detectsUnapprovedQaWaiver(scenarios) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  for (const scenario of scenarios) {
    if (scenario.qaStatus === QA_WAIVED && !scenario.reviewerOrApprover) {
      return true;
    }
  }

  return false;
}

function writesQualityEvidenceBundle(options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const releaseCandidateId = options.releaseCandidateId;
  const qaRunId = options.qaRunId;
  const evidenceRoot = options.evidenceRoot || path.join(rootDir, 'evidence');
  const bundlePath = options.bundlePath || buildsQualityBundlePath(rootDir, releaseCandidateId, qaRunId);
  const startedAt = options.startedAt || new Date().toISOString();
  const finishedAt = options.finishedAt || startedAt;
  const testedFeatureScenarios = options.testedFeatureScenarios || [];
  const linkResult = linksHumanReports({
    ...options,
    rootDir,
    evidenceRoot,
    bundlePath,
    qaRunId,
    testedFeatureScenarios,
  });
  const gateDecision = buildsQaGateDecision({
    releaseCandidateId,
    qaRunId,
    testedFeatureScenarios,
    missingReports: linkResult.missingReports,
    blockerCodes: options.blockerCodes || [],
    decidedAt: finishedAt,
  });
  const machineEnvironment = buildsMachineEnvironment({
    ...options,
    rootDir,
    releaseCandidateId,
    qaRunId,
    startedAt,
    finishedAt,
  });
  const manifest = {
    schemaVersion: QA_BUNDLE_SCHEMA_VERSION,
    releaseCandidateId,
    qaRunId,
    createdAt: finishedAt,
    qaStatus: gateDecision.promotable ? QA_PASSED : (options.qaStatus || QA_BLOCKED),
    qualityGateDecision: gateDecision.qualityGateDecision,
    reviewerOrApprover: options.reviewerOrApprover || MISSING,
    operatorIdentity: options.operatorIdentity || os.userInfo().username,
    endUserSurface: options.endUserSurface || 'CLI command used by a product owner',
    testedFeatureScenarios,
    blockerCodes: gateDecision.blockerCodes,
    linkedReports: linkResult.linkedReports,
    missingReports: linkResult.missingReports,
    artifacts: REQUIRED_BUNDLE_ARTIFACTS,
  };

  writesJsonArtifact(path.join(bundlePath, 'machine-environment.v1.json'), machineEnvironment);
  writesJsonArtifact(path.join(bundlePath, 'qa-gate-decision.v1.json'), gateDecision);
  writesJsonArtifact(path.join(bundlePath, 'feature-proof-links.v1.json'), {
    schemaVersion: 'feature-proof-links.v1',
    releaseCandidateId,
    qaRunId,
    linkedReports: linkResult.linkedReports,
    missingReports: linkResult.missingReports,
  });
  writesJsonArtifact(path.join(bundlePath, 'report-artifact-index.v1.json'), {
    schemaVersion: 'report-artifact-index.v1',
    releaseCandidateId,
    qaRunId,
    reviewedMarkdownReports: options.reviewedMarkdownReports || readsLinkedReportSourcePaths(linkResult.linkedReports),
    reviewedHtmlPreviews: options.reviewedHtmlPreviews || [],
  });
  writesMarkdownArtifact(path.join(bundlePath, 'qa-execution-timeline.table.md'), rendersQaExecutionTimeline(manifest, machineEnvironment));
  writesMarkdownArtifact(path.join(bundlePath, 'end-user-test-session.md'), rendersEndUserTestSession(manifest, options));
  writesMarkdownArtifact(path.join(bundlePath, 'blocker-worklist.md'), rendersBlockerWorklist(manifest));
  writesMarkdownArtifact(path.join(bundlePath, 'screenshots.index.md'), rendersScreenshotsIndex(releaseCandidateId, qaRunId, options.screenshots || []));
  writesMarkdownArtifact(path.join(bundlePath, 'html-preview.index.md'), rendersHtmlPreviewIndex(releaseCandidateId, qaRunId, options.htmlPreviews || []));
  writesJsonArtifact(path.join(bundlePath, 'qa-evidence-bundle.manifest.v1.json'), manifest);
  writesMarkdownArtifact(path.join(bundlePath, 'qa-evidence-bundle.report.md'), rendersQualityEvidenceBundleReport(manifest, machineEnvironment, gateDecision));

  return {
    bundlePath,
    manifest,
    gateDecision,
    machineEnvironment,
  };
}

function readsLinkedReportSourcePaths(linkedReports) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const sourcePaths = [];

  for (const report of linkedReports) {
    sourcePaths.push(report.sourcePath);
  }

  return sourcePaths;
}

function rendersQaExecutionTimeline(manifest, machineEnvironment) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    `# QA Execution Timeline: ${manifest.releaseCandidateId}`,
    '',
    `- Release candidate id: ${manifest.releaseCandidateId}`,
    `- QA run id: ${manifest.qaRunId}`,
    '',
    '| step | timestamp | evidence | status |',
    '| --- | --- | --- | --- |',
    `| start | ${machineEnvironment.startedAt} | ${manifest.endUserSurface} | observed |`,
    `| finish | ${machineEnvironment.finishedAt} | qa-gate-decision.v1.json | ${manifest.qualityGateDecision} |`,
    '',
  ].join('\n');
}

function rendersEndUserTestSession(manifest, options) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    `# End User Test Session: ${manifest.releaseCandidateId}`,
    '',
    `- Release candidate id: ${manifest.releaseCandidateId}`,
    `- QA run id: ${manifest.qaRunId}`,
    `- End-user surface inspected: ${manifest.endUserSurface}`,
    `- QA operator or automation identity: ${manifest.operatorIdentity}`,
    `- Command executed: ${redactsSecretText(options.commandExecuted || 'not observed')}`,
    '',
    options.sessionNotes || '_No reviewer notes recorded._',
    '',
  ].join('\n');
}

function rendersBlockerWorklist(manifest) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    `# Blocker Worklist: ${manifest.releaseCandidateId}`,
    '',
    `- Release candidate id: ${manifest.releaseCandidateId}`,
    `- QA run id: ${manifest.qaRunId}`,
    '',
  ];

  if (!manifest.blockerCodes || manifest.blockerCodes.length === 0) {
    lines.push('_No blockers._', '');
    return lines.join('\n');
  }

  for (const blockerCode of manifest.blockerCodes) {
    lines.push(`- finding code: ${blockerCode}`);
  }

  lines.push('');
  return lines.join('\n');
}

function rendersScreenshotsIndex(releaseCandidateId, qaRunId, screenshots) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    `# Screenshots Index: ${releaseCandidateId}`,
    '',
    `- Release candidate id: ${releaseCandidateId}`,
    `- QA run id: ${qaRunId}`,
    '',
    '| screenshot path | viewport | status | blocker code |',
    '| --- | --- | --- | --- |',
  ];

  for (const screenshot of screenshots) {
    lines.push(`| ${screenshot.path} | ${screenshot.viewport || 'not observed'} | ${screenshot.status || 'reviewed'} | ${screenshot.blockerCode || 'not observed'} |`);
  }

  if (screenshots.length === 0) {
    lines.push('| not applicable | not applicable | not applicable | not observed |');
  }

  lines.push('');
  return lines.join('\n');
}

function rendersHtmlPreviewIndex(releaseCandidateId, qaRunId, previews) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    `# HTML Preview Index: ${releaseCandidateId}`,
    '',
    `- Release candidate id: ${releaseCandidateId}`,
    `- QA run id: ${qaRunId}`,
    '',
    '| source Markdown report path | generated HTML path or artifact URL | screenshot path | viewport | render timestamp | visual QA status | blocker code |',
    '| --- | --- | --- | --- | --- | --- | --- |',
  ];

  for (const preview of previews) {
    lines.push(`| ${preview.sourceMarkdownReportPath} | ${preview.generatedHtmlPathOrArtifactUrl} | ${preview.screenshotPath || 'not observed'} | ${preview.viewport || 'not observed'} | ${preview.renderTimestamp || 'not observed'} | ${preview.visualQaStatus || 'reviewed'} | ${preview.blockerCode || 'not observed'} |`);
  }

  if (previews.length === 0) {
    lines.push('| not applicable | not applicable | not applicable | not applicable | not applicable | not applicable | not observed |');
  }

  lines.push('');
  return lines.join('\n');
}

function rendersQualityEvidenceBundleReport(manifest, machineEnvironment, gateDecision) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    `# QA Evidence Bundle: ${manifest.releaseCandidateId}`,
    '',
    '## Product QA Decision',
    '',
    `- Release candidate id: ${manifest.releaseCandidateId}`,
    `- QA run id: ${manifest.qaRunId}`,
    `- Quality gate decision: ${gateDecision.qualityGateDecision}`,
    `- Tested feature scenarios: ${manifest.testedFeatureScenarios.length}`,
    `- QA operator or automation identity: ${manifest.operatorIdentity}`,
    `- Machine identity: ${machineEnvironment.machineId}`,
    `- Started at: ${machineEnvironment.startedAt}`,
    `- Finished at: ${machineEnvironment.finishedAt}`,
    `- Duration ms: ${machineEnvironment.durationMs}`,
    `- Blocker count: ${gateDecision.blockerCount}`,
    `- Promotion recommendation: ${gateDecision.promotionRecommendation}`,
    '',
    '## Executive QA Summary',
    '',
    gateDecision.promotable ? 'QA passed. The release candidate is promotable.' : 'QA blocked. See the blocker worklist before promotion.',
    '',
    '## Tested User Journeys',
    '',
    '| feature id | scenario id | scenario name | QA status | reviewer or approver |',
    '| --- | --- | --- | --- | --- |',
  ];

  for (const scenario of manifest.testedFeatureScenarios) {
    lines.push(`| ${scenario.featureId} | ${scenario.scenarioId} | ${scenario.scenarioName || scenario.scenarioId} | ${scenario.qaStatus || manifest.qaStatus} | ${scenario.reviewerOrApprover || manifest.reviewerOrApprover} |`);
  }

  lines.push(
    '',
    '## End-User Surface Inspected',
    '',
    `- ${manifest.endUserSurface}`,
    '',
    '## Generated Markdown Reports Reviewed',
    '',
    rendersLinkedReportList(manifest.linkedReports, '.md'),
    '',
    '## Generated HTML Previews Reviewed',
    '',
    '- See html-preview.index.md',
    '',
    '## Linked Executable Body Proof Reports',
    '',
    rendersLinkedReportList(manifest.linkedReports, 'executable-body-contract.report.md'),
    '',
    '## Linked Sprawl Reports',
    '',
    rendersLinkedReportList(manifest.linkedReports, 'domain-body-sprawl'),
    '',
    '## Screenshots Or Visual Evidence Index',
    '',
    '- See screenshots.index.md',
    '',
    '## Machine And Run Provenance',
    '',
    '- See machine-environment.v1.json',
    '',
    '## Blocker Worklist',
    '',
    manifest.blockerCodes.length === 0 ? '_No blockers._' : rendersBlockerCodeLines(manifest.blockerCodes),
    '',
    '## Reviewer Notes',
    '',
    '_Add approval or reviewer notes here before promotion._',
    '',
  );

  return lines.join('\n');
}

function rendersBlockerCodeLines(blockerCodes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [];

  for (const blockerCode of blockerCodes) {
    lines.push(`- ${blockerCode}`);
  }

  return lines.join('\n');
}

function rendersLinkedReportList(linkedReports, includesText) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rows = [];

  for (const report of linkedReports) {
    if (report.sourcePath.includes(includesText)) {
      rows.push(report);
    }
  }

  if (rows.length === 0) {
    return '_None._';
  }

  const lines = [];

  for (const report of rows) {
    lines.push(`- ${report.sourcePath} (sha256: ${report.sha256})`);
  }

  return lines.join('\n');
}

function checksManifestHashes(manifest, rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const findings = [];

  for (const report of manifest.linkedReports || []) {
    const bundlePath = path.join(rootDir, report.bundlePath);

    if (!fs.existsSync(bundlePath) || hashesFile(bundlePath) !== report.sha256) {
      findings.push({
        code: 'qa-bundle-hash-mismatch',
        path: report.bundlePath,
      });
    }
  }

  return findings;
}

function runsQualityPromotionGate(options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const releaseCandidateId = options.releaseCandidateId;
  const manifests = readsBundleManifests(rootDir, releaseCandidateId);

  if (manifests.length === 0) {
    return {
      schemaVersion: QA_GATE_SCHEMA_VERSION,
      releaseCandidateId,
      qaRunId: MISSING,
      qualityGateDecision: 'BLOCKED',
      promotable: false,
      blockerCodes: ['release-candidate-without-end-user-qa-bundle'],
      blockerCount: 1,
    };
  }

  const manifest = manifests[manifests.length - 1];
  const findings = checksManifestHashes(manifest, rootDir);
  const blockerCodes = mergesBlockerCodes(manifest.blockerCodes || [], findings);

  if (!fs.existsSync(path.join(manifest.bundlePath, 'machine-environment.v1.json'))) {
    blockerCodes.push('qa-bundle-missing-machine-provenance');
  }

  for (const artifact of REQUIRED_BUNDLE_ARTIFACTS) {
    if (!fs.existsSync(path.join(manifest.bundlePath, artifact))) {
      blockerCodes.push('qa-bundle-missing-required-artifact');
      break;
    }
  }

  const hasUnpassedScenario = detectsUnpassedQaScenario(manifest.testedFeatureScenarios || [], manifest.qaStatus);

  if (hasUnpassedScenario) {
    blockerCodes.push('qa-scenario-not-passed');
  }

  const uniqueBlockerCodes = deduplicatesCodes(blockerCodes);
  const decision = {
    schemaVersion: QA_GATE_SCHEMA_VERSION,
    releaseCandidateId,
    qaRunId: manifest.qaRunId,
    qualityGateDecision: uniqueBlockerCodes.length === 0 ? QA_PASSED : 'BLOCKED',
    promotable: uniqueBlockerCodes.length === 0,
    promotionRecommendation: uniqueBlockerCodes.length === 0 ? 'promote' : 'do not promote',
    blockerCount: uniqueBlockerCodes.length,
    blockerCodes: uniqueBlockerCodes,
    decidedAt: options.decidedAt || new Date().toISOString(),
    immutable: uniqueBlockerCodes.length === 0,
  };

  writesJsonArtifact(path.join(manifest.bundlePath, 'qa-gate-decision.v1.json'), decision);
  return decision;
}

function mergesBlockerCodes(blockerCodes, findings) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const mergedCodes = [];

  for (const blockerCode of blockerCodes) {
    mergedCodes.push(blockerCode);
  }

  for (const finding of findings) {
    mergedCodes.push(finding.code);
  }

  return deduplicatesCodes(mergedCodes);
}

function detectsUnpassedQaScenario(scenarios, defaultQaStatus) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  for (const scenario of scenarios) {
    const status = scenario.qaStatus || defaultQaStatus;

    if (status !== QA_PASSED && status !== QA_WAIVED) {
      return true;
    }
  }

  return false;
}

function deduplicatesCodes(codes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const uniqueCodes = [];

  for (const code of codes) {
    if (!uniqueCodes.includes(code)) {
      uniqueCodes.push(code);
    }
  }

  return uniqueCodes;
}

function buildsQaReadinessRows(rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const latestByRelease = new Map();

  for (const manifest of readsBundleManifests(rootDir || process.cwd())) {
    latestByRelease.set(manifest.releaseCandidateId, manifest);
  }

  const rows = [];

  for (const manifest of latestByRelease.values()) {
    const scenarios = manifest.testedFeatureScenarios || [];
    rows.push({
      releaseCandidateId: manifest.releaseCandidateId,
      latestQaRunId: manifest.qaRunId,
      qaStatus: manifest.qaStatus,
      qualityGateDecision: manifest.qualityGateDecision,
      testedScenarioCount: scenarios.length,
      failedScenarioCount: countsFailedQaScenarios(scenarios),
      waivedScenarioCount: countsWaivedQaScenarios(scenarios),
      bundlePath: formatsRepoRelativePath(rootDir, manifest.bundlePath),
      qaReportPath: `${formatsRepoRelativePath(rootDir, manifest.bundlePath)}/qa-evidence-bundle.report.md`,
      machineProvenancePath: `${formatsRepoRelativePath(rootDir, manifest.bundlePath)}/machine-environment.v1.json`,
    });
  }

  return rows;
}

function countsFailedQaScenarios(scenarios) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let failedCount = 0;

  for (const scenario of scenarios) {
    if (scenario.qaStatus === QA_FAILED || scenario.qaStatus === QA_BLOCKED) {
      failedCount += 1;
    }
  }

  return failedCount;
}

function countsWaivedQaScenarios(scenarios) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let waivedCount = 0;

  for (const scenario of scenarios) {
    if (scenario.qaStatus === QA_WAIVED) {
      waivedCount += 1;
    }
  }

  return waivedCount;
}

function rendersQaReadinessSection(rows) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!rows || rows.length === 0) {
    return '';
  }

  const lines = [
    '## QA Readiness',
    '',
    '| release candidate id | latest QA run id | QA status | quality gate decision | tested scenario count | failed scenario count | waived scenario count | bundle path | QA report path | machine provenance path |',
    '| --- | --- | --- | --- | ---: | ---: | ---: | --- | --- | --- |',
  ];

  for (const row of rows) {
    lines.push(`| ${row.releaseCandidateId} | ${row.latestQaRunId} | ${row.qaStatus} | ${row.qualityGateDecision} | ${row.testedScenarioCount} | ${row.failedScenarioCount} | ${row.waivedScenarioCount} | ${row.bundlePath} | ${row.qaReportPath} | ${row.machineProvenancePath} |`);
  }

  lines.push('');
  return lines.join('\n');
}

function rendersGlobalReportWithQaReadiness(reportContent, rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const section = rendersQaReadinessSection(buildsQaReadinessRows(rootDir || process.cwd()));
  return section ? `${reportContent.trimEnd()}\n\n${section}` : reportContent;
}

module.exports = {
  QA_BLOCKED,
  QA_FAILED,
  QA_PASSED,
  QA_WAIVED,
  REQUIRED_BUNDLE_ARTIFACTS,
  buildsMachineEnvironment,
  buildsQaReadinessRows,
  buildsQualityBundlePath,
  buildsQualityInventory,
  discoversFeatureScenarios,
  rendersGlobalReportWithQaReadiness,
  rendersQaReadinessSection,
  rendersQualityEvidenceBundleReport,
  runsQualityPromotionGate,
  writesQualityEvidenceBundle,
};
