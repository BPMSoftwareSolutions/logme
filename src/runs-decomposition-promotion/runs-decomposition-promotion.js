const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { promotesDecompositionPlan } = require('../promotes-decomposition-plan/promotes-decomposition-plan');

function runsDecompositionPromotion(config, currentFilePath, entryMethodName, newBodyName, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const result = promotesDecompositionPlan(config, currentFilePath, { entryMethodName, newBodyName });

  if (result.promotable && options.write) {
    for (const fileEdit of result.fileEdits) {
      fs.mkdirSync(path.dirname(fileEdit.absolutePath), { recursive: true });
      fs.writeFileSync(fileEdit.absolutePath, fileEdit.newContent, 'utf8');
    }
  }

  return { ...result, written: Boolean(result.promotable && options.write) };
}

module.exports = {
  runsDecompositionPromotion,
};
