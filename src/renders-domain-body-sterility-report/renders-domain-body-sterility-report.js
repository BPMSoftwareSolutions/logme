// Renders domain body sterility report
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { rendersMarkdownTable } = require('../../packages/logme-report-primitives/src/renders-markdown-table');
const { rendersMarkdownSummary } = require('../../packages/logme-report-primitives/src/renders-markdown-summary');
const { rendersAsciiExecutionFlow } = require('../../packages/logme-report-primitives/src/renders-ascii-execution-flow');

function rendersDomainBodySterilityReport(contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const findingRows = rendersMarkdownSummary(contract);
  const table = rendersMarkdownTable(contract.methods);

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

  function rendersBlockerSummary(contractWithFindings) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    if (contractWithFindings.findings.length === 0) {
      return '_No blockers. Promotion allowed._';
    }

    return contractWithFindings.findings.slice(0, 3).map(formatsBlockerLine).join('\n\n');
  }

  function formatsProvenanceLine(label, value) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return `- ${label}: ${value}`;
  }

  function formatsLawAsMarkdown(law) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return `- ${law}`;
  }

  return [
    `# ${contract.domainContract.reportTitle}`,
    '',
    '## Execution Flow Sketch',
    '',
    '```text',
    rendersAsciiExecutionFlow(contract),
    '```',
    '',
    '## Blocker Summary',
    '',
    rendersBlockerSummary(contract),
    '',
    '## Provenance',
    '',
    formatsProvenanceLine('Report schema version', contract.provenance.reportSchemaVersion),
    formatsProvenanceLine('Generator name', contract.provenance.generatorName),
    formatsProvenanceLine('Generation timestamp', contract.provenance.generationTimestamp),
    formatsProvenanceLine('Generation command', contract.provenance.generationCommand),
    formatsProvenanceLine('Git commit or working tree marker', contract.provenance.gitWorkingTreeMarker),
    formatsProvenanceLine('Config path', contract.provenance.configPath),
    formatsProvenanceLine('Config hash', contract.provenance.configHash),
    formatsProvenanceLine('Source inventory hash', contract.provenance.sourceInventoryHash),
    formatsProvenanceLine('Run id', contract.provenance.runId),
    formatsProvenanceLine('Evidence directory', contract.provenance.evidenceDirectory),
    '',
    '## Config',
    '',
    `- Root: ${contract.rootDir}`,
    `- Extensions: ${contract.includeExtensions.join(', ')}`,
    `- Config: ${contract.configPath}`,
    `- Forbidden local utility names: ${contract.forbiddenLocalUtilityNames.join(', ')}`,
    `- Include test files: ${contract.includeTestFiles ? 'yes' : 'no'}`,
    `- Excluded files: ${contract.includeTestFiles ? 'none (includeTestFiles is true)' : (contract.excludeFiles.join(', ') || 'none')}`,
    '',
    '## Hard Laws',
    '',
    ...contract.domainContract.laws.map(formatsLawAsMarkdown),
    '',
    '## Sterility Summary',
    '',
    `- Files scanned: ${contract.filesScanned}`,
    `- Local executable methods: ${contract.localExecutableMethods}`,
    `- Domain-bound methods: ${contract.domainBoundMethods}`,
    `- Methods with LogMe call: ${contract.methodsWithLogMeCall}`,
    `- Silent local methods: ${contract.silentLocalMethods}`,
    `- Generic utility methods in repo: ${contract.genericUtilityMethods}`,
    `- Anonymous executable methods: ${contract.anonymousExecutableMethods}`,
    `- Methods outside domain vocabulary: ${contract.methodsOutsideDomainVocabulary}`,
    `- Unimplemented stub methods: ${contract.unimplementedStubMethods}`,
    '- External package methods: ignored / package-governed',
    `- Coverage: ${contract.coverage}%`,
    `- Verdict: ${contract.verdict}`,
    '',
    '## Findings',
    '',
    findingRows,
    '',
    '## Discovered Methods',
    '',
    table,
    '',
  ].join('\n');
}

module.exports = { rendersDomainBodySterilityReport };
