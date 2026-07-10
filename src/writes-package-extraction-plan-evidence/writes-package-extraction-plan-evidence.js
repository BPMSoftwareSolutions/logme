const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

function writesPackageExtractionPlanEvidence(config, packageExtractionPlan) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const evidencePath = path.join(config.rootDir, packageExtractionPlan.evidencePath);
  const evidenceContent = `${JSON.stringify(packageExtractionPlan, null, 2)}\n`;
  const reportPath = path.join(config.rootDir, packageExtractionPlan.reportPath);
  const reportContent = rendersPackageExtractionPlanReport(packageExtractionPlan);

  fs.mkdirSync(path.dirname(evidencePath), { recursive: true });
  fs.writeFileSync(evidencePath, evidenceContent, 'utf8');
  fs.writeFileSync(reportPath, reportContent, 'utf8');

  return {
    evidencePath,
    reportPath,
    bytesWritten: Buffer.byteLength(evidenceContent, 'utf8'),
    reportBytesWritten: Buffer.byteLength(reportContent, 'utf8'),
    sectionCount: packageExtractionPlan.sections.length,
  };
}

function rendersPackageExtractionPlanReport(packageExtractionPlan) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const summary = packageExtractionPlan.summary;

  return [
    '# Package Extraction Plan Report',
    '',
    `Source run: ${packageExtractionPlan.sourceRunId}`,
    `Domain sprawl contract: ${packageExtractionPlan.sourceArtifacts.domainSprawlContractPath}`,
    '',
    `Total candidates: ${summary.totalCandidates}`,
    `Resolved sections: ${summary.resolvedSections}`,
    `Unresolved sections: ${summary.unresolvedSections}`,
    '',
    ...rendersAllSections(packageExtractionPlan.sections),
  ].join('\n');
}

function rendersAllSections(sections) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (sections.length === 0) {
    return ['_No package extraction candidates._', ''];
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

  const lines = [
    `## ${section.filePath}`,
    '',
    `- Classification: ${section.classification || 'unresolved'}`,
    `- Target package: ${section.targetPackage || 'n/a'}`,
    `- Extracted method names: ${section.extractedMethodNames.length > 0 ? section.extractedMethodNames.join(', ') : 'none'}`,
    `- Domain call-site guidance: ${section.domainCallSiteGuidance || 'n/a'}`,
    `- Finding codes: ${section.findingCodes.length > 0 ? section.findingCodes.join(', ') : 'none'}`,
    `- Reasoning: ${section.reasoningNote || 'n/a'}`,
    '',
  ];

  return lines;
}

module.exports = {
  rendersPackageExtractionPlanReport,
  writesPackageExtractionPlanEvidence,
};
