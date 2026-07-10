const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { formatsMarkdownCell } = require('../../packages/logme-report-primitives/src/formats-markdown-cell');

function writesDomainBodySprawlEvidence(config, sprawlContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const evidencePath = path.join(config.rootDir, sprawlContract.evidencePath);
  const evidenceContent = `${JSON.stringify(sprawlContract, null, 2)}\n`;

  fs.mkdirSync(path.dirname(evidencePath), { recursive: true });
  fs.writeFileSync(evidencePath, evidenceContent, 'utf8');
  const canonicalSprawlContract = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
  const reportPath = path.join(config.rootDir, canonicalSprawlContract.reportPath);
  const hotspotTablePath = path.join(config.rootDir, canonicalSprawlContract.hotspotTablePath);
  const reportContent = rendersDomainBodySprawlReport(canonicalSprawlContract);
  const hotspotTableContent = rendersDomainBodySprawlHotspotTable(canonicalSprawlContract);

  fs.writeFileSync(reportPath, reportContent, 'utf8');
  fs.writeFileSync(hotspotTablePath, hotspotTableContent, 'utf8');

  return {
    evidencePath,
    reportPath,
    hotspotTablePath,
    bytesWritten: Buffer.byteLength(evidenceContent, 'utf8'),
    reportBytesWritten: Buffer.byteLength(reportContent, 'utf8'),
    hotspotTableBytesWritten: Buffer.byteLength(hotspotTableContent, 'utf8'),
  };
}

function rendersDomainBodySprawlReport(sprawlContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const summary = sprawlContract.summary;

  return [
    '# Domain Body Sprawl Report',
    '',
    `Canonical JSON evidence: ${sprawlContract.evidencePath}`,
    '',
    '## Executive Sprawl Summary',
    '',
    `- Total source files scanned: ${summary.totalSourceFilesScanned}`,
    `- Focused files: ${summary.focusedFiles}`,
    `- Watchlist files: ${summary.watchlistFiles}`,
    `- God-file candidates: ${summary.godFileCandidates}`,
    `- Package extraction candidates: ${summary.packageExtractionCandidates}`,
    `- Mixed-responsibility files: ${summary.mixedResponsibilityFiles}`,
    `- Orphan artifacts: ${summary.orphanArtifacts}`,
    '',
    '## Top Hotspots',
    '',
    rendersHotspotRowsTable(summary.topSprawlHotspots),
    '',
    '## God-File Candidates',
    '',
    rendersFileInventorySection(sprawlContract.sourceFiles, 'god-file candidate'),
    '',
    '## Package Extraction Candidates',
    '',
    rendersFileInventorySection(sprawlContract.sourceFiles, 'package extraction candidate'),
    '',
    '## Mixed Responsibility Files',
    '',
    rendersFindingCodeSection(sprawlContract.sourceFiles, 'mixed-responsibility-file'),
    '',
    '## Orphan And Scattered Artifacts',
    '',
    rendersArtifactFindingsSection(sprawlContract.artifactFindings),
    '',
    '## Severe Promotion Blockers',
    '',
    rendersSeverePromotionBlockersSection(sprawlContract),
    '',
    '## Watchlist Files',
    '',
    rendersFileInventorySection(sprawlContract.sourceFiles, 'watchlist'),
    '',
    '## One-Line Fix Routes',
    '',
    rendersFixRouteSection(sprawlContract.summary.topSprawlHotspots),
    '',
    '## Source Evidence Links',
    '',
    `- JSON evidence: ${sprawlContract.evidencePath}`,
    `- Hotspot table: ${sprawlContract.hotspotTablePath}`,
    '',
    '## Dense File Inventory Appendix',
    '',
    rendersDenseFileInventoryAppendix(sprawlContract.sourceFiles),
    '',
  ].join('\n');
}

function rendersDomainBodySprawlHotspotTable(sprawlContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    '| Rank | File Path | Classification | Line Count | Executable Method Count | Responsibility Cluster Count | Generic Mechanic Count | Sterility Finding Count | Blocker Count | Recommended Owner Action |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rendersRankedHotspotRows(sprawlContract.summary.topSprawlHotspots),
    '',
  ].join('\n');
}

function rendersRankedHotspotRows(hotspots) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rows = [];
  let rank = 1;

  for (const hotspot of hotspots) {
    rows.push([
      '|',
      rank,
      formatsMarkdownCell(hotspot.filePath),
      formatsMarkdownCell(hotspot.classification),
      hotspot.lineCount,
      hotspot.executableMethodCount,
      hotspot.responsibilityClusterCount,
      hotspot.genericMechanicCount,
      hotspot.sterilityFindingCount,
      hotspot.blockerCount,
      formatsMarkdownCell(hotspot.recommendedOwnerAction),
      '|',
    ].join(' '));
    rank += 1;
  }

  return rows;
}

function rendersHotspotRowsTable(hotspots) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (hotspots.length === 0) {
    return '_No sprawl hotspots detected._';
  }

  return rendersDomainBodySprawlHotspotTable({ summary: { topSprawlHotspots: hotspots } }).trimEnd();
}

function rendersFileInventorySection(sourceFiles, classification) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rows = [];
  for (const sourceFile of sourceFiles) {
    if (sourceFile.classification === classification) {
      rows.push(rendersFileSummaryLine(sourceFile));
    }
  }

  return rows.length === 0 ? '_None._' : rows.join('\n');
}

function rendersFindingCodeSection(sourceFiles, findingCode) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rows = [];
  for (const sourceFile of sourceFiles) {
    if (sourceFile.findingCodes.includes(findingCode)) {
      rows.push(rendersFileSummaryLine(sourceFile));
    }
  }

  return rows.length === 0 ? '_None._' : rows.join('\n');
}

function rendersArtifactFindingsSection(artifactFindings) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (artifactFindings.length === 0) {
    return '_None._';
  }

  const rows = [];
  for (const finding of artifactFindings) {
    rows.push(`- ${finding.code}: ${finding.filePath} (expected home: ${finding.expectedHome}; owner: ${finding.declaredOwner})`);
  }

  return rows.join('\n');
}

function rendersSeverePromotionBlockersSection(sprawlContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rows = [];
  for (const hotspot of sprawlContract.summary.topSprawlHotspots) {
    if (hotspot.blockerCount > 0) {
      rows.push(`- ${hotspot.filePath}: ${hotspot.blockerCount} blocker(s); ${hotspot.recommendedOwnerAction}`);
    }
  }

  return rows.length === 0 ? '_No severe sprawl blockers in top hotspots._' : rows.join('\n');
}

function rendersFixRouteSection(hotspots) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (hotspots.length === 0) {
    return '_None._';
  }

  const rows = [];
  for (const hotspot of hotspots) {
    rows.push(`- ${hotspot.filePath}: ${hotspot.recommendedOwnerAction}`);
  }

  return rows.join('\n');
}

function rendersDenseFileInventoryAppendix(sourceFiles) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (sourceFiles.length === 0) {
    return '_No source files scanned._';
  }

  const rows = [
    '| File Path | Scope | Lines | Bytes | Methods | Exports | Imports | Nested Functions | Clusters | Side Effects | Findings |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ];

  for (const sourceFile of sourceFiles) {
    rows.push([
      '|',
      formatsMarkdownCell(sourceFile.filePath),
      formatsMarkdownCell(sourceFile.packageOrDomainScope),
      sourceFile.lineCount,
      sourceFile.byteCount,
      sourceFile.executableMethodCount,
      sourceFile.exportedSymbolCount,
      sourceFile.importedModuleCount,
      sourceFile.localNestedFunctionCount,
      sourceFile.responsibilityClusters.length,
      formatsMarkdownCell(sourceFile.sideEffectLanes.join(', ') || 'none'),
      formatsMarkdownCell(sourceFile.findingCodes.join(', ') || 'none'),
      '|',
    ].join(' '));
  }

  return rows.join('\n');
}

function rendersFileSummaryLine(sourceFile) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return `- ${sourceFile.filePath}: ${sourceFile.lineCount} lines, ${sourceFile.executableMethodCount} methods, ${sourceFile.responsibilityClusters.length} cluster(s); ${sourceFile.fixRoute}`;
}

module.exports = {
  rendersDomainBodySprawlHotspotTable,
  rendersDomainBodySprawlReport,
  writesDomainBodySprawlEvidence,
};
