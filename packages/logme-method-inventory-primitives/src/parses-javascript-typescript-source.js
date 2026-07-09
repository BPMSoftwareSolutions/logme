const path = require('node:path');
const ts = require('typescript');
const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

function getScriptKind(filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const extension = path.extname(filePath).toLowerCase();
  if (extension === '.ts') {
    return ts.ScriptKind.TS;
  }

  return ts.ScriptKind.JS;
}

function parsesJavascriptTypescriptSource(filePath, content) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const scriptKind = getScriptKind(filePath);
  return ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, scriptKind);
}

module.exports = { parsesJavascriptTypescriptSource };
