const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { scansEvidenceRuns } = require('../scans-evidence-runs/scans-evidence-runs');
const { classifiesEvidenceRetention } = require('../classifies-evidence-retention/classifies-evidence-retention');
const { readsActivePinnedRunIds } = require('../pins-evidence-run/pins-evidence-run');

const CATALOG_SCHEMA_VERSION = 'evidence-catalog.v1';
const FEATURE_ID_PATTERN = /features\/([^/]+)\/scenarios\/([^/]+)/gu;
const RELEASE_CANDIDATE_PATTERN = /end-user-test-bundles\/([^/]+)\//u;
const PI_PATTERN = /\/pi\/([^/]+)\//u;

function writesEvidenceCatalog(rootDir, referenceContextOverrides = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const runs = scansEvidenceRuns(rootDir);
  const referenceContext = buildsReferenceContext(rootDir, referenceContextOverrides);
  const catalogEntries = buildsCatalogEntries(runs, referenceContext);
  const catalog = {
    schemaVersion: CATALOG_SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    runCount: catalogEntries.length,
    runs: catalogEntries,
  };

  const catalogPath = path.join(rootDir, 'evidence', 'index', 'evidence-catalog.v1.json');
  const reportPath = path.join(rootDir, 'evidence', 'index', 'evidence-catalog.report.md');

  writesJsonArtifact(catalogPath, catalog);
  writesTextArtifact(reportPath, rendersCatalogReport(catalog));

  return { catalogPath, reportPath, catalog };
}

function buildsReferenceContext(rootDir, overrides) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    latestEvidenceReportRunIds: overrides.latestEvidenceReportRunIds || new Set(),
    featureStatusContractRunIds: overrides.featureStatusContractRunIds || new Set(),
    qaEvidenceBundleRunIds: overrides.qaEvidenceBundleRunIds || new Set(),
    promotionDecisionRunIds: overrides.promotionDecisionRunIds || new Set(),
    piEvidenceDigestRunIds: overrides.piEvidenceDigestRunIds || new Set(),
    reportTruthReceiptRunIds: overrides.reportTruthReceiptRunIds || new Set(),
    manualPinRunIds: overrides.manualPinRunIds || readsActivePinnedRunIds(rootDir),
    now: overrides.now || new Date(),
  };
}

function buildsCatalogEntries(runs, referenceContext) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const catalogEntries = [];
  for (const run of runs) {
    catalogEntries.push(buildsCatalogEntry(run, referenceContext));
  }

  return catalogEntries;
}

function buildsCatalogEntry(run, referenceContext) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const ids = extractsEvidenceIds(run.artifactPaths);
  const retention = classifiesEvidenceRetention(run, referenceContext);

  return {
    runId: run.runId,
    createdAt: run.createdAt,
    lastModifiedAt: run.lastModifiedAt,
    totalByteSize: run.totalByteSize,
    artifactCount: run.artifactCount,
    reportVerdict: run.reportVerdict,
    reportTruthStatus: run.reportTruthStatus,
    featureIds: ids.featureIds,
    scenarioIds: ids.scenarioIds,
    releaseCandidateIds: ids.releaseCandidateIds,
    piIds: ids.piIds,
    referencedBy: retention.references,
    retentionClassification: retention.classification,
    artifactPaths: run.artifactPaths,
  };
}

function extractsEvidenceIds(artifactPaths) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const featureIds = new Set();
  const scenarioIds = new Set();
  const releaseCandidateIds = new Set();
  const piIds = new Set();

  for (const artifactPath of artifactPaths) {
    extractsFeatureAndScenarioIds(artifactPath, featureIds, scenarioIds);
    extractsReleaseCandidateId(artifactPath, releaseCandidateIds);
    extractsPiId(artifactPath, piIds);
  }

  return {
    featureIds: Array.from(featureIds).sort(),
    scenarioIds: Array.from(scenarioIds).sort(),
    releaseCandidateIds: Array.from(releaseCandidateIds).sort(),
    piIds: Array.from(piIds).sort(),
  };
}

function extractsFeatureAndScenarioIds(artifactPath, featureIds, scenarioIds) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  for (const match of artifactPath.matchAll(FEATURE_ID_PATTERN)) {
    featureIds.add(match[1]);
    scenarioIds.add(match[2]);
  }
}

function extractsReleaseCandidateId(artifactPath, releaseCandidateIds) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const match = artifactPath.match(RELEASE_CANDIDATE_PATTERN);
  if (match) {
    releaseCandidateIds.add(match[1]);
  }
}

function extractsPiId(artifactPath, piIds) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const match = artifactPath.match(PI_PATTERN);
  if (match) {
    piIds.add(match[1]);
  }
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

function rendersCatalogReport(catalog) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    '# Evidence Catalog',
    '',
    `Generated at: ${catalog.generatedAt}`,
    `Run count: ${catalog.runCount}`,
    '',
    '| Run ID | Retention | Report Verdict | Bytes | Artifacts | Features | Referenced By |',
    '| --- | --- | --- | --- | --- | --- | --- |',
  ];

  for (const run of catalog.runs) {
    lines.push(rendersCatalogRow(run));
  }

  if (catalog.runs.length === 0) {
    lines.push('| _none_ | | | | | | |');
  }

  lines.push('');
  lines.push('This catalog is inventory only. No run artifact was deleted, archived, or rewritten while generating it.');

  return lines.join('\n');
}

function rendersCatalogRow(run) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return `| ${run.runId} | ${run.retentionClassification} | ${run.reportVerdict || '-'} | ${run.totalByteSize} | ${run.artifactCount} | ${run.featureIds.join(', ') || '-'} | ${run.referencedBy.join(', ') || '-'} |`;
}

module.exports = {
  CATALOG_SCHEMA_VERSION,
  writesEvidenceCatalog,
  extractsEvidenceIds,
  buildsReferenceContext,
};
