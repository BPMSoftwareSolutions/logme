const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const DOMAIN_MAP_SCHEMA_VERSION = 'domain-map.proposal.v1';

const CLASSIFICATIONS = {
  PRODUCT_DOMAIN_BODY: 'product-domain body',
  PACKAGE_PRIMITIVE: 'package primitive',
  GENERATED_EVIDENCE: 'generated evidence',
  TEST_BODY: 'test body',
  SCAFFOLD_OR_ENTRYPOINT: 'scaffold or entrypoint',
  AMBIGUOUS: 'ambiguous',
};

function mapsDomainBodyResponsibilities(config, analysisContract, sprawlContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const runId = resolvesSourceRunId(analysisContract, sprawlContract);
  const sprawlByPath = indexesSprawlEntriesByPath(sprawlContract);
  const fileEntries = [];
  const ambiguousPaths = [];

  for (const sourceFile of analysisContract.sourceFiles || []) {
    const entry = classifiesSourceFile(sourceFile, sprawlByPath.get(sourceFile.filePath));
    fileEntries.push(entry);
    if (entry.classification === CLASSIFICATIONS.AMBIGUOUS) {
      ambiguousPaths.push(entry.filePath);
    }
  }

  return {
    schemaVersion: DOMAIN_MAP_SCHEMA_VERSION,
    sourceRunId: runId,
    evidencePath: `quality/domain-remediation/${runId}/domain-map.proposal.v1.json`,
    reportPath: `quality/domain-remediation/${runId}/domain-map.report.md`,
    sourceArtifacts: {
      domainAnalysisContractPath: analysisContract.evidencePath,
      domainSprawlContractPath: sprawlContract.evidencePath,
    },
    summary: buildsDomainMapSummary(fileEntries, ambiguousPaths),
    fileEntries,
  };
}

function resolvesSourceRunId(analysisContract, sprawlContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (analysisContract.runId !== sprawlContract.runId) {
    throw new Error('domain analysis and sprawl contracts must share the same source run id');
  }

  return analysisContract.runId;
}

function indexesSprawlEntriesByPath(sprawlContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const sprawlByPath = new Map();
  for (const sourceFile of sprawlContract.sourceFiles || []) {
    sprawlByPath.set(sourceFile.filePath, sourceFile);
  }

  return sprawlByPath;
}

function classifiesSourceFile(sourceFile, sprawlEntry) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const classification = resolvesFileClassification(sourceFile, sprawlEntry);
  const responsibility = resolvesPrimaryResponsibility(sourceFile);
  const featureScenarioTieOut = sourceFile.featureScenarioTieOut || {};

  return {
    filePath: sourceFile.filePath,
    classification,
    primaryBodyResponsibility: responsibility,
    hasScenarioTieOut: featureScenarioTieOut.status !== 'missing scenario tie-out',
    waiverClassCandidate: resolvesWaiverClassCandidate(classification),
    classificationReason: resolvesClassificationReason(classification, sourceFile, sprawlEntry),
    findingCodes: sourceFile.findingCodes || [],
  };
}

function resolvesFileClassification(sourceFile, sprawlEntry) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const filePath = sourceFile.filePath;

  if (filePath.startsWith('packages/')) {
    return CLASSIFICATIONS.PACKAGE_PRIMITIVE;
  }

  if (filePath.startsWith('evidence/') || filePath.startsWith('quality/')) {
    return CLASSIFICATIONS.GENERATED_EVIDENCE;
  }

  if (filePath.startsWith('tests/') || /\.test\.js$/u.test(filePath)) {
    return CLASSIFICATIONS.TEST_BODY;
  }

  if (!filePath.startsWith('src/')) {
    return CLASSIFICATIONS.SCAFFOLD_OR_ENTRYPOINT;
  }

  const sprawlFindingCodes = (sprawlEntry && sprawlEntry.findingCodes) || [];

  if (sprawlFindingCodes.includes('mixed-responsibility-file')) {
    return CLASSIFICATIONS.AMBIGUOUS;
  }

  if (sprawlFindingCodes.includes('package-worthy-mechanic-inside-domain-body')) {
    return CLASSIFICATIONS.AMBIGUOUS;
  }

  return CLASSIFICATIONS.PRODUCT_DOMAIN_BODY;
}

function resolvesPrimaryResponsibility(sourceFile) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const clusters = sourceFile.responsibilityClusters || [];
  if (clusters.length === 0) {
    return 'unclassified responsibility';
  }

  return clusters[0].name;
}

function resolvesWaiverClassCandidate(classification) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return classification === CLASSIFICATIONS.AMBIGUOUS;
}

function resolvesClassificationReason(classification, sourceFile, sprawlEntry) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (classification === CLASSIFICATIONS.PACKAGE_PRIMITIVE) {
    return 'file path is under packages/ and is a reusable mechanic, not a domain body';
  }

  if (classification === CLASSIFICATIONS.GENERATED_EVIDENCE) {
    return 'file path is under evidence/ or quality/ and is generated output, not authored source';
  }

  if (classification === CLASSIFICATIONS.TEST_BODY) {
    return 'file path is under tests/ or matches a test file naming pattern';
  }

  if (classification === CLASSIFICATIONS.SCAFFOLD_OR_ENTRYPOINT) {
    return 'file path is outside src/ and functions as a scaffold or workspace entrypoint';
  }

  if (classification === CLASSIFICATIONS.AMBIGUOUS) {
    const sprawlFindingCodes = (sprawlEntry && sprawlEntry.findingCodes) || [];
    const clusterCount = (sourceFile.responsibilityClusters || []).length;

    if (sprawlFindingCodes.includes('mixed-responsibility-file')) {
      return `file was flagged mixed-responsibility-file by sprawl analysis (${clusterCount} responsibility clusters) and cannot be assigned one primary body responsibility without product-owner review`;
    }

    if (sprawlFindingCodes.includes('package-worthy-mechanic-inside-domain-body')) {
      return 'file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction';
    }

    return 'file could not be classified with available evidence';
  }

  return 'file is within sprawl responsibility-cluster thresholds and is declared in a file-system body contract';
}

function buildsDomainMapSummary(fileEntries, ambiguousPaths) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const classificationCounts = {};
  for (const classificationName of Object.values(CLASSIFICATIONS)) {
    classificationCounts[classificationName] = 0;
  }

  for (const entry of fileEntries) {
    classificationCounts[entry.classification] += 1;
  }

  return {
    totalFilesMapped: fileEntries.length,
    classificationCounts,
    ambiguousFileCount: ambiguousPaths.length,
    ambiguousFilePaths: [...ambiguousPaths].sort(),
  };
}

module.exports = {
  CLASSIFICATIONS,
  DOMAIN_MAP_SCHEMA_VERSION,
  mapsDomainBodyResponsibilities,
};
