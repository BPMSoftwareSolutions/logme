const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { buildsFeatureEvidenceIndex } = require('../builds-feature-evidence-index/builds-feature-evidence-index');

function writesFeatureEvidenceIndex(rootDir, catalog) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const index = buildsFeatureEvidenceIndex(catalog);
  const indexPath = path.join(rootDir, 'evidence', 'index', 'feature-evidence-index.v1.json');

  fs.mkdirSync(path.dirname(indexPath), { recursive: true });
  fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

  return { indexPath, index };
}

module.exports = {
  writesFeatureEvidenceIndex,
};
