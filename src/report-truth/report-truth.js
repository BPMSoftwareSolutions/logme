const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { loadsWorkspaceObservabilityConfig } = require('../loads-workspace-observability-config/loads-workspace-observability-config');
const { buildsDomainBodySterilityContract } = require('../builds-domain-body-sterility-contract/builds-domain-body-sterility-contract');
const { writesDomainBodySterilityReceipt } = require('../writes-domain-body-sterility-receipt/writes-domain-body-sterility-receipt');
const { checksReportTruthGate } = require('../report-provenance/report-provenance');

const SUMMARY_FIELD_NAMES = {
  'Files scanned': 'filesScanned',
  'Local executable methods': 'localExecutableMethods',
  'Domain-bound methods': 'domainBoundMethods',
  'Methods with LogMe call': 'methodsWithLogMeCall',
  'Silent local methods': 'silentLocalMethods',
  'Generic utility methods in repo': 'genericUtilityMethods',
  'Anonymous executable methods': 'anonymousExecutableMethods',
  'Methods outside domain vocabulary': 'methodsOutsideDomainVocabulary',
  'Unimplemented stub methods': 'unimplementedStubMethods',
};

function sha256Hex(value) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

function suppressTelemetryDuring(callback) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const previousAudit = process.env.LOGME_AUDIT;
  delete process.env.LOGME_AUDIT;

  try {
    return callback();
  } finally {
    if (previousAudit === undefined) {
      delete process.env.LOGME_AUDIT;
    } else {
      process.env.LOGME_AUDIT = previousAudit;
    }
  }
}

function readsMarkdownSection(reportContent, sectionTitle, nextSectionTitle) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const escapedTitle = sectionTitle.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
  const escapedNextTitle = nextSectionTitle ? nextSectionTitle.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&') : null;
  const pattern = escapedNextTitle
    ? new RegExp(`## ${escapedTitle}\\s+([\\s\\S]*?)\\n## ${escapedNextTitle}`, 'u')
    : new RegExp(`## ${escapedTitle}\\s+([\\s\\S]*)$`, 'u');
  const match = reportContent.match(pattern);

  return match ? match[1].trim() : '';
}

function readsReportSummary(reportContent) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const summaryBlock = readsMarkdownSection(reportContent, 'Sterility Summary', 'Findings');

  if (!summaryBlock) {
    return null;
  }

  const summary = {};
  const lines = summaryBlock.split('\n');

  for (const line of lines) {
    const trimmedLine = trimsLine(line);
    const parsed = parsesSummaryLine(trimmedLine);

    if (parsed) {
      summary[parsed.label] = parsed.value;
    }
  }

  return summary;
}

function trimsLine(line) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return line.trim();
}

function parsesSummaryLine(line) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const match = line.match(/^- ([^:]+):\s+(.*)$/u);

  if (!match) {
    return null;
  }

  return {
    label: match[1],
    value: match[2],
  };
}

function parsesIntegerField(summary, field) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const value = Number.parseInt(summary[field], 10);
  return Number.isNaN(value) ? null : value;
}

function parsesCoverageField(summary) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const coverage = Number.parseFloat(summary.Coverage);
  return Number.isNaN(coverage) ? null : coverage;
}

function filtersLanguageFinding(finding) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return finding.code !== 'anonymous-executable-method-detected'
    && finding.code !== 'local-method-name-outside-domain-vocabulary';
}

function derivesExpectedVerdict(summary) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const nonLanguageFindings = summary.findings.filter(filtersLanguageFinding);
  const isCoverageClean = nonLanguageFindings.length === 0;
  const isLanguagePure = summary.anonymousExecutableMethods === 0 && summary.methodsOutsideDomainVocabulary === 0;

  if (isCoverageClean && isLanguagePure) {
    return summary.domainContract.verdicts.sterile;
  }

  if (isCoverageClean) {
    return summary.domainContract.verdicts.languageImpure;
  }

  return summary.domainContract.verdicts.contaminated;
}

function readsMarkdownFindings(reportContent) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const findingsBlock = readsMarkdownSection(reportContent, 'Findings', 'Discovered Methods');

  if (!findingsBlock || findingsBlock.toLowerCase().includes('no findings')) {
    return [];
  }

  const blocks = findingsBlock.split(/\n\n+/u);
  const findings = [];

  for (const block of blocks) {
    const parsed = parsesFindingBlock(block.trim());

    if (parsed) {
      findings.push(parsed);
    }
  }

  return findings;
}

function parsesFindingBlock(block) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!block) {
    return null;
  }

  const finding = {
    code: '',
    filePath: '',
    methodName: '',
    reason: '',
  };

  const lines = block.split('\n');

  for (const line of lines) {
    const trimmedLine = trimsLine(line);

    if (trimmedLine.startsWith('- ')) {
      finding.code = trimmedLine.slice(2).trim();
    } else if (trimmedLine.startsWith('file: ')) {
      finding.filePath = trimmedLine.slice(6).trim();
    } else if (trimmedLine.startsWith('method: ')) {
      finding.methodName = trimmedLine.slice(8).trim();
    } else if (trimmedLine.startsWith('reason: ')) {
      finding.reason = trimmedLine.slice(8).trim();
    }
  }

  return finding;
}

function readsMarkdownMethodTable(reportContent) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const tableBlock = readsMarkdownSection(reportContent, 'Discovered Methods');

  if (!tableBlock) {
    return [];
  }

  const rows = [];
  const lines = tableBlock.split('\n');

  for (const line of lines) {
    const trimmedLine = trimsLine(line);

    if (isMarkdownTableRow(trimmedLine) && !isMarkdownHeaderRow(trimmedLine) && !isMarkdownSeparatorRow(trimmedLine)) {
      rows.push(splitsMarkdownTableRow(trimmedLine));
    }
  }

  return rows;
}

function isMarkdownTableRow(line) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return line.startsWith('| ');
}

function isMarkdownHeaderRow(line) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return line.includes('Scan Order');
}

function isMarkdownSeparatorRow(line) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return line.includes('| --- |');
}

function splitsMarkdownTableRow(line) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const segments = line.split(' | ');
  const cells = [];

  for (const segment of segments) {
    cells.push(segment.replace(/^\| |\|$/gu, '').trim());
  }

  return cells;
}

function validatesReportFreshness(expectedReportContent, currentReportContent) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return expectedReportContent === currentReportContent;
}

function validatesSummaryToRowConsistency(expectedSummary, reportContent) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const parsedSummary = readsReportSummary(reportContent);
  const parsedFindings = readsMarkdownFindings(reportContent);
  const parsedRows = readsMarkdownMethodTable(reportContent);

  if (!parsedSummary) {
    return {
      matches: false,
      parsedSummary,
      parsedFindings,
      parsedRows,
      mismatchedFields: SUMMARY_FIELD_NAMES,
    };
  }

  const mismatchedFields = [];
  const summaryLabels = Object.keys(SUMMARY_FIELD_NAMES);

  for (const field of summaryLabels) {
    const expectedFieldName = SUMMARY_FIELD_NAMES[field];
    let matches = true;

    if (field === 'Coverage') {
      matches = parsesCoverageField(parsedSummary) === expectedSummary.coverage;
    } else if (field === 'Verdict') {
      matches = parsedSummary.Verdict === expectedSummary.verdict;
    } else {
      matches = parsesIntegerField(parsedSummary, field) === expectedSummary[expectedFieldName];
    }

    if (!matches) {
      mismatchedFields.push(field);
    }
  }

  return {
    matches: mismatchedFields.length === 0
      && parsedFindings.length === expectedSummary.findings.length
      && parsedRows.length === expectedSummary.methods.length,
    parsedSummary,
    parsedFindings,
    parsedRows,
    mismatchedFields,
  };
}

function buildsReportTruthSnapshotCore() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const config = loadsWorkspaceObservabilityConfig();
  const built = buildsDomainBodySterilityContract(config);
  const receipt = writesDomainBodySterilityReceipt(built.contract);
  const currentReportContent = receipt.reportContent;
  const currentReportHash = sha256Hex(currentReportContent);
  const expectedReportHash = sha256Hex(built.reportContent);
  const truthGate = checksReportTruthGate(currentReportContent, built.provenance.sourceInventoryHash);
  const summaryConsistency = validatesSummaryToRowConsistency(built.summary, currentReportContent);
  const derivedVerdict = derivesExpectedVerdict({
    ...built.summary,
    findings: built.findings,
    domainContract: built.summary.domainContract,
  });

  return {
    config,
    ...built,
    expectedReportContent: built.reportContent,
    currentReportContent,
    currentReportHash,
    expectedReportHash,
    truthGate,
    summaryConsistency,
    derivedVerdict,
  };
}

function buildsReportTruthSnapshot() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return suppressTelemetryDuring(buildsReportTruthSnapshotCore);
}

function collectsTopFindingCodes(findings, limit = 3) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const topCodes = [];

  for (const finding of findings) {
    topCodes.push(finding.code);

    if (topCodes.length >= limit) {
      break;
    }
  }

  return topCodes;
}

function collectsTopFindingPaths(findings, limit = 3) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const uniquePaths = [];

  for (const finding of findings) {
    if (finding.filePath && !uniquePaths.includes(finding.filePath)) {
      uniquePaths.push(finding.filePath);
    }

    if (uniquePaths.length >= limit) {
      break;
    }
  }

  return uniquePaths;
}

function buildsFailureBlockers(snapshot) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const blockers = [];
  const seenCodes = new Set();

  function addsBlocker(blocker) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    if (seenCodes.has(blocker.code)) {
      return;
    }

    seenCodes.add(blocker.code);
    blockers.push(blocker);
  }

  if (!validatesReportFreshness(snapshot.expectedReportContent, snapshot.currentReportContent)) {
    addsBlocker({
      code: 'stale-report-projection',
      reason: 'the committed report body does not match the report regenerated from current source',
      path: snapshot.config.reportPath,
    });
  }

  if (snapshot.summary.verdict === snapshot.summary.domainContract.verdicts.contaminated) {
    addsBlocker({
      code: 'contaminated-verdict',
      reason: 'the regenerated report verdict is contaminated',
      path: snapshot.findings[0] ? snapshot.findings[0].filePath : snapshot.config.reportPath,
    });
  }

  if (!snapshot.truthGate || snapshot.truthGate.verdict !== 'PASS') {
    addsBlocker({
      code: 'stale-report-projection',
      reason: 'the committed report provenance does not match current source inventory',
      path: snapshot.findings[0] ? snapshot.findings[0].filePath : snapshot.config.reportPath,
    });
  }

  if (!snapshot.summaryConsistency.matches) {
    addsBlocker({
      code: 'summary-to-row-mismatch',
      reason: 'the rendered summary does not agree with the finding rows or discovered methods table',
      path: snapshot.config.reportPath,
    });
  }

  if (snapshot.summary.verdict !== snapshot.derivedVerdict) {
    addsBlocker({
      code: 'unsupported-clean-or-sterile-claim',
      reason: 'the report verdict does not match the verdict derived from the current inventory and findings',
      path: snapshot.config.reportPath,
    });
  }

  return blockers;
}

function formatsReportTruthSummary(result) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [result.status];
  lines.push(`report verdict: ${result.reportVerdict}`);
  lines.push(`coverage: ${result.coverage}%`);
  lines.push(`silent local methods: ${result.silentLocalMethods}`);
  lines.push(`anonymous executable methods: ${result.anonymousExecutableMethods}`);
  lines.push(`top finding codes: ${result.topFindingCodes.length > 0 ? result.topFindingCodes.join(', ') : 'none'}`);
  lines.push(`top finding paths: ${result.topFindingPaths.length > 0 ? result.topFindingPaths.join(', ') : 'none'}`);
  return lines.join('\n');
}

function writesReportTruthEvidence(snapshot, result) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const evidenceDirectory = path.join(snapshot.provenance.evidenceDirectory, 'runs', snapshot.provenance.runId);
  const evidencePath = path.join(evidenceDirectory, 'report-truth.v1.json');
  fs.mkdirSync(evidenceDirectory, { recursive: true });

  const payload = {
    schemaVersion: 'report-truth.v1',
    generatedAt: new Date().toISOString(),
    reportPath: snapshot.config.reportPath,
    currentReportHash: snapshot.currentReportHash,
    expectedReportHash: snapshot.expectedReportHash,
    reportVerdict: result.reportVerdict,
    coverage: result.coverage,
    silentLocalMethods: result.silentLocalMethods,
    anonymousExecutableMethods: result.anonymousExecutableMethods,
    topFindingCodes: result.topFindingCodes,
    topFindingPaths: result.topFindingPaths,
    blockers: result.blockers,
    truthGate: snapshot.truthGate,
    summaryConsistency: snapshot.summaryConsistency,
    derivedVerdict: snapshot.derivedVerdict,
  };

  fs.writeFileSync(evidencePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  return evidencePath;
}

function runsReportTruthCommand(options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const snapshot = buildsReportTruthSnapshot();
  const blockers = buildsFailureBlockers(snapshot);
  const topFindingCodes = collectsTopFindingCodes(snapshot.findings);
  const topFindingPaths = collectsTopFindingPaths(snapshot.findings);
  const reportVerdict = snapshot.summary.verdict;
  const coverage = snapshot.summary.coverage;
  const silentLocalMethods = snapshot.summary.silentLocalMethods;
  const anonymousExecutableMethods = snapshot.summary.anonymousExecutableMethods;
  const status = blockers.length > 0
    ? 'tests pass, report truth gate fails'
    : 'tests pass, report truth gate passes';

  const result = {
    exitCode: blockers.length > 0 ? 1 : 0,
    status,
    reportVerdict,
    coverage,
    silentLocalMethods,
    anonymousExecutableMethods,
    topFindingCodes,
    topFindingPaths,
    blockers,
    snapshot,
  };

  if (options.writeEvidence !== false) {
    result.evidencePath = writesReportTruthEvidence(snapshot, result);
  }

  return result;
}

function buildsReportTruthHookMessage(result, commandToRun = 'npm run report:truth') {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const firstActionablePath = result.topFindingPaths[0] || result.snapshot.config.reportPath;

  return [
    'Report truth gate failed.',
    `Run ${commandToRun} before committing or pushing.`,
    `First actionable finding path: ${firstActionablePath}`,
  ].join('\n');
}

module.exports = {
  buildsReportTruthHookMessage,
  buildsReportTruthSnapshot,
  collectsTopFindingCodes,
  collectsTopFindingPaths,
  derivesExpectedVerdict,
  formatsReportTruthSummary,
  readsMarkdownFindings,
  readsMarkdownMethodTable,
  readsReportSummary,
  runsReportTruthCommand,
  suppressTelemetryDuring,
  validatesReportFreshness,
  validatesSummaryToRowConsistency,
  writesReportTruthEvidence,
};
