const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { promotesPackageExtractionPlan } = require('../promotes-package-extraction-plan/promotes-package-extraction-plan');

function runsPackageExtractionPromotion(config, runId, methodName, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const evidencePath = path.join(config.rootDir, 'quality', 'domain-remediation', runId, 'package-extraction-plan.v1.json');
  const packageExtractionPlan = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
  const result = promotesPackageExtractionPlan(config, packageExtractionPlan, { methodName });

  if (result.promotable && options.write) {
    for (const fileEdit of result.fileEdits) {
      fs.mkdirSync(path.dirname(fileEdit.absolutePath), { recursive: true });
      fs.writeFileSync(fileEdit.absolutePath, fileEdit.newContent, 'utf8');
    }
  }

  return { ...result, evidencePath, written: Boolean(result.promotable && options.write) };
}

module.exports = {
  runsPackageExtractionPromotion,
};
