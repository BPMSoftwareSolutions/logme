const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

function writesVerificationReportEvidence(config, runId, verificationReport) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const reportRelativePath = `quality/domain-remediation/${runId}/verification/${verificationReport.packetId}.report.md`;
  const reportPath = path.join(config.rootDir, reportRelativePath);
  const reportContent = rendersVerificationReport(verificationReport);

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, reportContent, 'utf8');

  return {
    reportPath,
    reportRelativePath,
    reportBytesWritten: Buffer.byteLength(reportContent, 'utf8'),
  };
}

function rendersVerificationReport(verificationReport) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    `# Verification Report: ${verificationReport.packetId}`,
    '',
    `Promotion decision: ${verificationReport.promotionDecision}`,
    '',
    '## Commands Run',
    '',
    ...rendersCommandLines(verificationReport.commandsRun),
    '',
    '## Test Results',
    '',
    `${verificationReport.testResults.ran ? verificationReport.testResults.summary : 'no test command was run'}`,
    '',
    '## Before Metrics',
    '',
    rendersMetricsBlock(verificationReport.beforeMetrics),
    '',
    '## After Metrics',
    '',
    rendersMetricsBlock(verificationReport.afterMetrics),
    '',
    '## Changed Files',
    '',
    ...rendersChangedFileLines(verificationReport.changedFiles),
    '',
    '## Unresolved Risks',
    '',
    ...rendersRiskLines(verificationReport.unresolvedRisks),
    '',
  ].join('\n');
}

function rendersCommandLines(commandsRun) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (commandsRun.length === 0) {
    return ['_No verification commands were configured for this packet._'];
  }

  const lines = [];
  for (const commandResult of commandsRun) {
    lines.push(`- \`${commandResult.command}\`: exit code ${commandResult.exitCode}${commandResult.timedOut ? ' (timed out)' : ''}`);
  }

  return lines;
}

function rendersMetricsBlock(metrics) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return metrics ? `\`\`\`json\n${JSON.stringify(metrics, null, 2)}\n\`\`\`` : '_Not supplied._';
}

function rendersChangedFileLines(changedFiles) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (changedFiles.length === 0) {
    return ['_None reported._'];
  }

  const lines = [];
  for (const changedFile of changedFiles) {
    lines.push(`- ${changedFile}`);
  }

  return lines;
}

function rendersRiskLines(unresolvedRisks) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (unresolvedRisks.length === 0) {
    return ['_None._'];
  }

  const lines = [];
  for (const risk of unresolvedRisks) {
    lines.push(`- ${risk}`);
  }

  return lines;
}

module.exports = {
  rendersVerificationReport,
  writesVerificationReportEvidence,
};
