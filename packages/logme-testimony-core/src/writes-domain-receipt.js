const fs = require('node:fs');
const { LogMe } = require('./LogMe');
const { sampleMethod } = require('./sample-method');

function writesDomainReceipt(reportPath, reportContent) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  fs.writeFileSync(reportPath, reportContent, 'utf8');

  return {
    reportPath,
    bytesWritten: Buffer.byteLength(reportContent, 'utf8'),
  };
}

module.exports = { writesDomainReceipt };
