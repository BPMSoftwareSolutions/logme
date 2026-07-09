// Renders domain body sterility report
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { loadsReportLayoutContract } = require('../loads-report-layout-contract/loads-report-layout-contract');
const { rendersReportFromLayoutContract } = require('../renders-report-from-layout-contract/renders-report-from-layout-contract');

function rendersDomainBodySterilityReport(contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const { layoutSchema, layoutContract, reportSchema, executionSketchTemplate } = loadsReportLayoutContract();
  const contractWithTemplate = { ...contract, executionSketchTemplate };

  const result = rendersReportFromLayoutContract(layoutSchema, layoutContract, reportSchema, contractWithTemplate);

  if (!result.isValid) {
    const reasons = result.findings.map(formatsLayoutFindingAsText).join('; ');
    throw new Error(`report layout validation failed, report.md was not rendered: ${reasons}`);
  }

  return result.reportContent;
}

function formatsLayoutFindingAsText(finding) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return `${finding.code} (${finding.reason})`;
}

module.exports = { rendersDomainBodySterilityReport };
