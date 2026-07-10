const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { promotesDecompositionPlan, promotesFullFileDecomposition } = require('../promotes-decomposition-plan/promotes-decomposition-plan');
const { mapsFunctionCallGraph } = require('../../packages/logme-method-inventory-primitives/src/maps-function-call-graph');
const { clustersFunctionsByCallGraph } = require('../../packages/logme-method-inventory-primitives/src/clusters-functions-by-call-graph');
const { proposesSemanticDecomposition } = require('../proposes-semantic-decomposition/proposes-semantic-decomposition');

function runsDecompositionPromotion(config, currentFilePath, entryMethodName, newBodyName, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const result = promotesDecompositionPlan(config, currentFilePath, { entryMethodName, newBodyName });

  if (result.promotable && options.write) {
    writesFileEdits(result.fileEdits);
  }

  return { ...result, written: Boolean(result.promotable && options.write) };
}

async function runsFullFileDecompositionPromotion(config, currentFilePath, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const absolutePath = path.join(config.rootDir, currentFilePath);
  const content = fs.readFileSync(absolutePath, 'utf8');
  const callGraphResult = mapsFunctionCallGraph(content, currentFilePath);
  const clusters = clustersFunctionsByCallGraph(callGraphResult);
  const groups = await proposesSemanticDecomposition(callGraphResult, clusters, options.decompositionOptions || {});
  const result = promotesFullFileDecomposition(config, currentFilePath, groups);

  if (result.promotable && options.write) {
    writesFileEdits(result.fileEdits);
  }

  return { ...result, groups, written: Boolean(result.promotable && options.write) };
}

function writesFileEdits(fileEdits) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  for (const fileEdit of fileEdits) {
    fs.mkdirSync(path.dirname(fileEdit.absolutePath), { recursive: true });
    fs.writeFileSync(fileEdit.absolutePath, fileEdit.newContent, 'utf8');
  }
}

module.exports = {
  runsDecompositionPromotion,
  runsFullFileDecompositionPromotion,
};
