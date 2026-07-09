const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { rendersMarkdownTable } = require('../../packages/logme-report-primitives/src/renders-markdown-table');
const { rendersMarkdownSummary } = require('../../packages/logme-report-primitives/src/renders-markdown-summary');
const { rendersAsciiExecutionFlow } = require('../../packages/logme-report-primitives/src/renders-ascii-execution-flow');
const { resolvesDottedPath } = require('../validates-report-contract/validates-report-contract');
const { validatesReportLayoutContract } = require('../validates-report-layout-contract/validates-report-layout-contract');

function substitutesLine(line, contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return line.replace(/\{\{\s*([^}\s]+)\s*\}\}/gu, substitutesSingleVariable);

  function substitutesSingleVariable(fullMatch, variable) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    const resolved = resolvesDottedPath(contract, variable);
    return resolved === undefined || resolved === null ? '' : String(resolved);
  }
}

function rendersBlockerSummarySection(contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (contract.findings.length === 0) {
    return '_No blockers. Promotion allowed._';
  }

  function formatsBlockerFixRoute(finding) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    const fixRoutes = {
      'stale-report-projection': 'regenerate the report from the current source inventory',
      'contaminated-verdict': 'resolve the contaminated finding and rerun the audit',
      'summary-to-row-mismatch': 'rebuild the summary from the current findings and methods table',
      'unsupported-clean-or-sterile-claim': 'align the verdict with the current findings',
    };

    return fixRoutes[finding.code] || 'inspect the cited method and rerun the report';
  }

  function findsMethodForFinding(finding) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    function matchesFindingMethod(method) {
      if (process.env.LOGME_AUDIT === '1') {
        LogMe(sampleMethod);
      }

      return method.filePath === finding.filePath && method.name === finding.methodName;
    }

    function matchesFindingPath(method) {
      if (process.env.LOGME_AUDIT === '1') {
        LogMe(sampleMethod);
      }

      return method.filePath === finding.filePath;
    }

    return contract.methods.find(matchesFindingMethod)
      || contract.methods.find(matchesFindingPath)
      || null;
  }

  function formatsBlockerLine(finding) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    const method = findsMethodForFinding(finding);
    const sourcePath = method ? method.filePath : finding.filePath;
    const lineRange = method ? `${method.lineStart}-${method.lineEnd}` : 'unknown';
    const telemetryStatus = method && method.hasLogMeCall ? 'observed' : 'missing';

    return [
      `- finding code: ${finding.code}`,
      `  method: ${finding.methodName || 'unknown'}`,
      `  source path: ${sourcePath}`,
      `  line range: ${lineRange}`,
      `  telemetry status: ${telemetryStatus}`,
      `  one-line fix route: ${formatsBlockerFixRoute(finding)}`,
    ].join('\n');
  }

  return contract.findings.slice(0, 3).map(formatsBlockerLine).join('\n\n');
}

function rendersConfigSummarySection(contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    `- Root: ${contract.rootDir}`,
    `- Extensions: ${contract.includeExtensions.join(', ')}`,
    `- Config: ${contract.configPath}`,
    `- Forbidden local utility names: ${contract.forbiddenLocalUtilityNames.join(', ')}`,
    `- Include test files: ${contract.includeTestFiles ? 'yes' : 'no'}`,
    `- Excluded files: ${contract.includeTestFiles ? 'none (includeTestFiles is true)' : (contract.excludeFiles.join(', ') || 'none')}`,
  ].join('\n');
}

function rendersHardLawsSection(contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  function formatsLawAsMarkdown(law) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return `- ${law}`;
  }

  return contract.domainContract.laws.map(formatsLawAsMarkdown).join('\n');
}

function rendersSprawlSummarySection(contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!contract.sprawl || !contract.sprawl.summary) {
    return '_No sprawl evidence artifact was attached to this report contract._';
  }

  const summary = contract.sprawl.summary;
  const summaryLines = [
    `- Evidence artifact: ${contract.sprawl.evidencePath}`,
    `- Total source files scanned: ${summary.totalSourceFilesScanned}`,
    `- Focused files: ${summary.focusedFiles}`,
    `- Watchlist files: ${summary.watchlistFiles}`,
    `- God-file candidates: ${summary.godFileCandidates}`,
    `- Package extraction candidates: ${summary.packageExtractionCandidates}`,
    `- Mixed-responsibility files: ${summary.mixedResponsibilityFiles}`,
    `- Orphan artifacts: ${summary.orphanArtifacts}`,
  ];

  if (summary.topSprawlHotspots.length === 0) {
    return [...summaryLines, '', '_No sprawl hotspots detected._'].join('\n');
  }

  const hotspotRows = summary.topSprawlHotspots.map(formatsSprawlHotspotRow);

  return [
    ...summaryLines,
    '',
    'Top sprawl hotspots:',
    '',
    '| File | Classification | Lines | Methods | Clusters | Generic Mechanics | Findings | Fix Route |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...hotspotRows,
  ].join('\n');
}

function formatsSprawlHotspotRow(hotspot) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    '|',
    hotspot.filePath,
    hotspot.classification,
    hotspot.lineCount,
    hotspot.executableMethodCount,
    hotspot.responsibilityClusterCount,
    hotspot.genericMechanicCount,
    hotspot.findingCodes.join(', ') || 'none',
    hotspot.fixRoute,
    '|',
  ].join(' ');
}

function rendersSectionBody(sectionId, section, contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (Array.isArray(section.template)) {
    function rendersTemplateLine(line) {
      if (process.env.LOGME_AUDIT === '1') {
        LogMe(sampleMethod);
      }

      return substitutesLine(line, contract);
    }

    return section.template.map(rendersTemplateLine).join('\n');
  }

  if (section.template === 'kind:ascii-execution-sketch') {
    return ['```text', rendersAsciiExecutionFlow(contract, contract.executionSketchTemplate), '```'].join('\n');
  }

  if (section.template === 'kind:blocker-summary') {
    return rendersBlockerSummarySection(contract);
  }

  if (section.template === 'kind:config-summary') {
    return rendersConfigSummarySection(contract);
  }

  if (section.template === 'kind:hard-laws') {
    return rendersHardLawsSection(contract);
  }

  if (section.template === 'kind:sprawl-summary') {
    return rendersSprawlSummarySection(contract);
  }

  if (section.template === 'kind:findings-summary') {
    return rendersMarkdownSummary(contract);
  }

  if (section.template === 'kind:discovered-methods-table') {
    return rendersMarkdownTable(contract.methods);
  }

  throw new Error(`unknown report layout template kind for section "${sectionId}": ${section.template}`);
}

function rendersReportFromLayoutContract(layoutSchema, layoutContract, reportSchema, contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const validation = validatesReportLayoutContract(layoutSchema, layoutContract, reportSchema);

  if (!validation.isValid) {
    return { isValid: false, findings: validation.findings, reportContent: null };
  }

  function rendersSection(sectionId) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    const section = layoutContract.sections[sectionId];
    return [`## ${section.title}`, '', rendersSectionBody(sectionId, section, contract), ''];
  }

  const reportContent = [
    `# ${layoutContract.reportTitle}`,
    '',
    ...layoutContract.sectionOrder.flatMap(rendersSection),
  ].join('\n');

  return { isValid: true, findings: [], reportContent };
}

module.exports = { rendersReportFromLayoutContract };
