// Renders markdown summary of findings
const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

function rendersMarkdownSummary(contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (contract.findings.length === 0) {
    return contract.domainContract.cleanFindingsLabel;
  }

  function formatsFindingAsMarkdown(finding) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    const methodDetail = finding.methodName ? [`  method: ${finding.methodName}`] : [];
    return [
      `- ${finding.code}`,
      `  file: ${finding.filePath}`,
      ...methodDetail,
      `  reason: ${finding.reason}`,
    ].join('\n');
  }

  return contract.findings.map(formatsFindingAsMarkdown).join('\n\n');
}

module.exports = { rendersMarkdownSummary };
