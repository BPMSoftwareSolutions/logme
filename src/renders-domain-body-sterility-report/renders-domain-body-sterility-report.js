// Renders domain body sterility report
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { rendersMarkdownTable } = require('../../packages/logme-report-primitives/src/renders-markdown-table');
const { rendersMarkdownSummary } = require('../../packages/logme-report-primitives/src/renders-markdown-summary');

function rendersDomainBodySterilityReport(contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const findingRows = rendersMarkdownSummary(contract);
  const table = rendersMarkdownTable(contract.methods);

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
