const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

function writesDomainMapEvidence(config, domainMap) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const evidencePath = path.join(config.rootDir, domainMap.evidencePath);
  const evidenceContent = `${JSON.stringify(domainMap, null, 2)}\n`;

  fs.mkdirSync(path.dirname(evidencePath), { recursive: true });
  fs.writeFileSync(evidencePath, evidenceContent, 'utf8');
  const canonicalDomainMap = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));

  const reportPath = path.join(config.rootDir, canonicalDomainMap.reportPath);
  const reportContent = rendersDomainMapReport(canonicalDomainMap);
  fs.writeFileSync(reportPath, reportContent, 'utf8');

  return {
    evidencePath,
    reportPath,
    bytesWritten: Buffer.byteLength(evidenceContent, 'utf8'),
    reportBytesWritten: Buffer.byteLength(reportContent, 'utf8'),
  };
}

function rendersDomainMapReport(domainMap) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const summary = domainMap.summary;

  return [
    '# Domain Map Report',
    '',
    `Canonical JSON evidence: ${domainMap.evidencePath}`,
    '',
    '## Executive Summary',
    '',
    `- Total files mapped: ${summary.totalFilesMapped}`,
    ...rendersClassificationCountLines(summary.classificationCounts),
    `- Ambiguous files needing product-owner review: ${summary.ambiguousFileCount}`,
    '',
    '## Ambiguous Files Requiring Review',
    '',
    rendersAmbiguousFilesSection(domainMap.fileEntries),
    '',
    '## File Responsibility Inventory',
    '',
    rendersFileInventoryTable(domainMap.fileEntries),
    '',
    '## Source Evidence Links',
    '',
    `- Domain analysis contract: ${domainMap.sourceArtifacts.domainAnalysisContractPath}`,
    `- Domain sprawl contract: ${domainMap.sourceArtifacts.domainSprawlContractPath}`,
    '',
  ].join('\n');
}

function rendersClassificationCountLines(classificationCounts) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [];
  for (const classificationName of Object.keys(classificationCounts)) {
    lines.push(`- ${classificationName}: ${classificationCounts[classificationName]}`);
  }

  return lines;
}

function rendersAmbiguousFilesSection(fileEntries) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rows = [];
  for (const entry of fileEntries) {
    if (entry.classification === 'ambiguous') {
      rows.push(`- ${entry.filePath}: ${entry.classificationReason}`);
    }
  }

  return rows.length === 0 ? '_No ambiguous files._' : rows.join('\n');
}

function rendersFileInventoryTable(fileEntries) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (fileEntries.length === 0) {
    return '_No files mapped._';
  }

  const rows = [
    '| File Path | Classification | Primary Responsibility | Scenario Tie-Out |',
    '| --- | --- | --- | --- |',
  ];

  for (const entry of fileEntries) {
    rows.push([
      '|',
      formatsMarkdownCell(entry.filePath),
      formatsMarkdownCell(entry.classification),
      formatsMarkdownCell(entry.primaryBodyResponsibility),
      entry.hasScenarioTieOut ? 'yes' : 'missing',
      '|',
    ].join(' '));
  }

  return rows.join('\n');
}

function formatsMarkdownCell(value) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return String(value).replace(/\|/gu, '\\|').replace(/\r?\n/gu, ' ');
}

module.exports = {
  rendersDomainMapReport,
  writesDomainMapEvidence,
};
