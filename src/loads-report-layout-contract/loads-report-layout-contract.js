const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { readsJsonConfigFile } = require('../../packages/logme-config-primitives/src/reads-json-config-file');
const { parsesExecutionSketchTemplate } = require('../../packages/logme-report-primitives/src/parses-execution-sketch-template');

const PACKAGE_ROOT = path.resolve(__dirname, '..', '..');

function loadsReportLayoutContract() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const layoutSchemaPath = path.join(PACKAGE_ROOT, 'contracts', 'domains', 'logme2', 'report-layout.schema.v1.json');
  const layoutContractPath = path.join(PACKAGE_ROOT, 'contracts', 'domains', 'logme2', 'report-layout.contract.v1.json');
  const reportSchemaPath = path.join(PACKAGE_ROOT, 'contracts', 'domains', 'logme2', 'sterility-report.schema.v1.json');
  const templatePath = path.join(PACKAGE_ROOT, 'contracts', 'templates', 'logme2', 'execution-sketch.template.txt');

  return {
    layoutSchema: readsJsonConfigFile(layoutSchemaPath),
    layoutContract: readsJsonConfigFile(layoutContractPath),
    reportSchema: readsJsonConfigFile(reportSchemaPath),
    executionSketchTemplate: parsesExecutionSketchTemplate(fs.readFileSync(templatePath, 'utf8')),
  };
}

module.exports = { loadsReportLayoutContract };
