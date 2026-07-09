const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { loadsWorkspaceObservabilityConfig } = require('../loads-workspace-observability-config/loads-workspace-observability-config');
const { buildsDomainBodySterilityContract } = require('../builds-domain-body-sterility-contract/builds-domain-body-sterility-contract');
const { checksReportTruthGate } = require('../report-provenance/report-provenance');

const SUMMARY_FIELDS = [
  'Files scanned',
  'Local executable methods',
  'Domain-bound methods',
  'Methods with LogMe call',
  'Silent local methods',
  'Generic utility methods in repo',
  'Anonymous executable methods',
  'Methods outside domain vocabulary',
  'Unimplemented stub methods',
  'Coverage',
  'Verdict',
];

function sha256Hex(value) {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

function suppressTelemetryDuring(callback) {
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
  const escapedTitle = sectionTitle.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
  const escapedNextTitle = nextSectionTitle ? nextSectionTitle.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&') : null;
  const pattern = escapedNextTitle
    ? new RegExp(`## ${escapedTitle}\\s+([\\s\\S]*?)\\n## ${escapedNextTitle}`, 'u')
    : new RegExp(`## ${escapedTitle}\\s+([\\s\\S]*)$`, 'u');
  const match = reportContent.match(pattern);

  return match ? match[1].trim() : '';
}

function readsReportSummary(reportContent) {
  const summaryBlock = readsMarkdownSection(reportContent, 'Sterility Summary', 'Findings');

  if (!summaryBlock) {
    return null;
  }

  const summary = {};

  for (const line of summaryBlock.split('\n')) {
    const match = line.match(/^- ([^:]+):\s+(.*)$/u);
    if (match) {
      summary[match[1]] = match[2];
    }
  }

  return summary;
}

function parsesIntegerField(summary, field) {
  const value = Number.parseInt(summary[field], 10);
  return Number.isNaN(value) ? null : value;
}

function parsesCoverageField(summary) {
  const coverage = Number.parseFloat(summary.Coverage);
  return Number.isNaN(coverage) ? null : coverage;
}

function derivesExpectedVerdict(summary) {
  const languageFindingCodes = [
    'anonymous-executable-method-detected',
    'local-method-name-outside-domain-vocabulary',
  ];
  const nonLanguageFindings = summary.findings.filter((finding) => !languageFindingCodes.includes(finding.code));
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
  const findingsBlock = readsMarkdownSection(reportContent, 'Findings', 'Discovered Methods');

  if (!findingsBlock || findingsBlock === '_No findings._') {
    return [];
  }

  const blocks = findingsBlock.split(/\n\n+/u).map((block) => block.trim()).filter(Boolean);

  return blocks.map((block) => {
    const lines = block.split('\n').map((line) => line.trim());
    const finding = {
      code: '',
      filePath: '',
      methodName: '',
      reason: '',
    };

    for (const line of lines) {
      if (line.startsWith('- ')) {
        finding.code = line.slice(2).trim();
      } else if (line.startsWith('file: ')) {
        finding.filePath = line.slice(6).trim();
      } else if (line.startsWith('method: ')) {
        finding.methodName = line.slice(8).trim();
      } else if (line.startsWith('reason: ')) {
        finding.reason = line.slice(8).trim();
      }
    }

    return finding;
  });
}

function readsMarkdownMethodTable(reportContent) {
  const tableBlock = readsMarkdownSection(reportContent, 'Discovered Methods');

  if (!tableBlock) {
    return [];
  }

  return tableBlock
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('| '))
    .filter((line) => !line.includes('| --- |'))
    .filter((line) => !line.includes('Scan Order'))
    .map((line) => line.split(' | ').map((segment) => segment.replace(/^\| |\|$/gu, '').trim()));
}

function validatesReportFreshness(expectedReportContent, currentReportContent) {
  return expectedReportContent === currentReportContent;
}

function validatesSummaryToRowConsistency(expectedSummary, reportContent) {
  const parsedSummary = readsReportSummary(reportContent);
  const parsedFindings = readsMarkdownFindings(reportContent);
  const parsedRows = readsMarkdownMethodTable(reportContent);

  if (!parsedSummary) {
    return {
      matches: false,
      parsedSummary,
      parsedFindings,
      parsedRows,
    };
  }

  const mismatchedFields = SUMMARY_FIELDS.filter((field) => {
    if (field === 'Coverage') {
      return parsesCoverageField(parsedSummary) !== expectedSummary.coverage;
    }

    if (field === 'Verdict') {
      return parsedSummary.Verdict !== expectedSummary.verdict;
    }

    const expectedFieldName = {
      'Files scanned': 'filesScanned',
      'Local executable methods': 'localExecutableMethods',
      'Domain-bound methods': 'domainBoundMethods',
      'Methods with LogMe call': 'methodsWithLogMeCall',
      'Silent local methods': 'silentLocalMethods',
      'Generic utility methods in repo': 'genericUtilityMethods',
      'Anonymous executable methods': 'anonymousExecutableMethods',
      'Methods outside domain vocabulary': 'methodsOutsideDomainVocabulary',
      'Unimplemented stub methods': 'unimplementedStubMethods',
    }[field];

    return parsesIntegerField(parsedSummary, field) !== expectedSummary[expectedFieldName];
  });

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

function buildsReportTruthSnapshot() {
  return suppressTelemetryDuring(() => {
    const config = loadsWorkspaceObservabilityConfig();
    const built = buildsDomainBodySterilityContract(config);
    const currentReportContent = fs.existsSync(config.reportPath)
      ? fs.readFileSync(config.reportPath, 'utf8')
      : '';
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
      currentReportContent,
      currentReportHash,
      expectedReportHash,
      truthGate,
      summaryConsistency,
      derivedVerdict,
    };
  });
}

function collectsTopFindingCodes(findings, limit = 3) {
  return findings.slice(0, limit).map((finding) => finding.code);
}

function collectsTopFindingPaths(findings, limit = 3) {
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
  const blockers = [];
  const seenCodes = new Set();

  function addsBlocker(blocker) {
    if (seenCodes.has(blocker.code)) {
      return;
    }

    seenCodes.add(blocker.code);
    blockers.push(blocker);
  }

  if (!validatesReportFreshness(snapshot.reportContent || snapshot.expectedReportContent, snapshot.currentReportContent)) {
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
