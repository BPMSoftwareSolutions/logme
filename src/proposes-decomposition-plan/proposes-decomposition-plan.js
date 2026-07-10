const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const DECOMPOSITION_PLAN_SCHEMA_VERSION = 'decomposition-plan.report.v1';
const DECOMPOSE_BEFORE_RENAME_CLASSIFICATION = 'decompose before rename';

function proposesDecompositionPlan(analysisContract, renamePlan) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const analysisByPath = indexesAnalysisSourceFilesByPath(analysisContract);
  const candidatePaths = selectsDecompositionCandidatePaths(renamePlan);
  const sections = [];

  for (const filePath of candidatePaths) {
    const sourceFile = analysisByPath.get(filePath);
    if (sourceFile) {
      sections.push(buildsDecompositionSection(sourceFile));
    }
  }

  return {
    schemaVersion: DECOMPOSITION_PLAN_SCHEMA_VERSION,
    sourceRunId: analysisContract.runId,
    reportPath: `quality/domain-remediation/${analysisContract.runId}/decomposition-plan.report.md`,
    sourceArtifacts: {
      domainAnalysisContractPath: analysisContract.evidencePath,
      renamePlanPath: renamePlan.evidencePath,
    },
    summary: {
      totalCandidates: sections.length,
    },
    sections,
  };
}

function indexesAnalysisSourceFilesByPath(analysisContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const analysisByPath = new Map();
  for (const sourceFile of analysisContract.sourceFiles || []) {
    analysisByPath.set(sourceFile.filePath, sourceFile);
  }

  return analysisByPath;
}

function selectsDecompositionCandidatePaths(renamePlan) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const candidatePaths = [];
  for (const entry of renamePlan.entries) {
    if (entry.classification === DECOMPOSE_BEFORE_RENAME_CLASSIFICATION) {
      candidatePaths.push(entry.currentPath);
    }
  }

  return candidatePaths;
}

function buildsDecompositionSection(sourceFile) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const currentResponsibilities = buildsCurrentResponsibilities(sourceFile);
  const proposedBodies = buildsProposedBodies(sourceFile);

  return {
    currentPath: sourceFile.filePath,
    currentResponsibilities,
    proposedBodies,
    scenarioTieOuts: 'not yet assigned; run the Scenario Tie-Out Worker against each proposed body after this plan is accepted',
    contractUpdates: 'add one file-system body contract entry per proposed body; remove or narrow the entry for the current path',
    importMigrationPlan: 'not yet determined; requires an import-site scan against the accepted proposed paths after promotion',
    behaviorPreservingTests: buildsBehaviorPreservingTestsNote(sourceFile),
    rollbackNotes: `revert to ${sourceFile.filePath} and its original contract entry if any behavior-preserving test fails after the split`,
  };
}

function buildsCurrentResponsibilities(sourceFile) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const responsibilities = [];
  for (const cluster of sourceFile.responsibilityClusters || []) {
    responsibilities.push({ name: cluster.name, methodNames: cluster.methodNames });
  }

  return responsibilities;
}

function buildsProposedBodies(sourceFile) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const proposedBodies = [];
  const proposedFiles = (sourceFile.decomposition && sourceFile.decomposition.proposedFiles) || [];

  for (const proposedFile of proposedFiles) {
    proposedBodies.push({
      proposedPath: proposedFile.proposedFilePath,
      sourceMethodNames: proposedFile.sourceMethodNames,
      reason: proposedFile.reason,
      contractActionRequired: proposedFile.contractActionRequired,
    });
  }

  return proposedBodies;
}

function buildsBehaviorPreservingTestsNote(sourceFile) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const methodCount = sourceFile.executableMethodCount || 0;
  return `existing tests for ${sourceFile.filePath} must continue to pass; add one test per proposed body covering its ${methodCount > 0 ? 'moved' : 'new'} methods before promotion`;
}

module.exports = {
  DECOMPOSITION_PLAN_SCHEMA_VERSION,
  proposesDecompositionPlan,
};
