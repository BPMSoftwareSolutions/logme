const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

function writesDecompositionPlanEvidence(config, decompositionPlan) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const reportPath = path.join(config.rootDir, decompositionPlan.reportPath);
  const reportContent = rendersDecompositionPlanReport(decompositionPlan);

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, reportContent, 'utf8');

  return {
    reportPath,
    reportBytesWritten: Buffer.byteLength(reportContent, 'utf8'),
    sectionCount: decompositionPlan.sections.length,
  };
}

function rendersDecompositionPlanReport(decompositionPlan) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    '# Decomposition Plan Report',
    '',
    `Source run: ${decompositionPlan.sourceRunId}`,
    `Domain analysis contract: ${decompositionPlan.sourceArtifacts.domainAnalysisContractPath}`,
    `Rename plan: ${decompositionPlan.sourceArtifacts.renamePlanPath}`,
    '',
    `Total candidates in this pass: ${decompositionPlan.summary.totalCandidates}`,
    '',
    'Implementation files must not be changed until each section below is accepted by a product owner.',
    '',
    ...rendersAllSections(decompositionPlan.sections),
  ].join('\n');
}

function rendersAllSections(sections) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (sections.length === 0) {
    return ['_No decomposition candidates in this pass._', ''];
  }

  const lines = [];
  for (const section of sections) {
    lines.push(...rendersSection(section));
  }

  return lines;
}

function rendersSection(section) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    `## ${section.currentPath}`,
    '',
    '### Current Responsibilities',
    '',
    ...rendersResponsibilityLines(section.currentResponsibilities),
    '',
    '### Proposed Action-Bearing Body Names',
    '',
    ...rendersProposedBodyLines(section.proposedBodies),
    '',
    '### Scenario Tie-Outs',
    '',
    section.scenarioTieOuts,
    '',
    '### Contract Updates',
    '',
    section.contractUpdates,
    '',
    '### Import Migration Plan',
    '',
    section.importMigrationPlan,
    '',
    '### Behavior-Preserving Tests',
    '',
    section.behaviorPreservingTests,
    '',
    '### Rollback Notes',
    '',
    section.rollbackNotes,
    '',
  ];
}

function rendersResponsibilityLines(currentResponsibilities) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (currentResponsibilities.length === 0) {
    return ['_None._'];
  }

  const lines = [];
  for (const responsibility of currentResponsibilities) {
    lines.push(`- ${responsibility.name}: ${responsibility.methodNames.join(', ')}`);
  }

  return lines;
}

function rendersProposedBodyLines(proposedBodies) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (proposedBodies.length === 0) {
    return ['_None._'];
  }

  const lines = [];
  for (const proposedBody of proposedBodies) {
    lines.push(`- ${proposedBody.proposedPath}: ${proposedBody.sourceMethodNames.join(', ')} -- ${proposedBody.reason} (${proposedBody.contractActionRequired})`);
  }

  return lines;
}

module.exports = {
  rendersDecompositionPlanReport,
  writesDecompositionPlanEvidence,
};
