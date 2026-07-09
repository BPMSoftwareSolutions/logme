const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { rendersDomainBodySterilityReport } = require('../renders-domain-body-sterility-report/renders-domain-body-sterility-report');
const { writesDomainReceipt } = require('../../packages/logme-testimony-core/src/writes-domain-receipt');

function writesDomainBodySterilityReceipt(contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const reportMarkdown = rendersDomainBodySterilityReport(contract);
  const receiptFromWrite = writesDomainReceipt(contract.reportPath, reportMarkdown);

  return {
    reportPath: receiptFromWrite.reportPath,
    bytesWritten: receiptFromWrite.bytesWritten,
    reportContent: reportMarkdown,
  };
}

module.exports = { writesDomainBodySterilityReceipt };
