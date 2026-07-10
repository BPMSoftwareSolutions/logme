const ts = require('typescript');
const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

function collectsDeclaredNames(functionNode) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const declaredNames = new Set();

  for (const parameter of functionNode.parameters) {
    if (ts.isIdentifier(parameter.name)) {
      declaredNames.add(parameter.name.text);
    }
  }

  function visitsNode(node) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
      declaredNames.add(node.name.text);
    }

    if (ts.isFunctionDeclaration(node) && node.name) {
      declaredNames.add(node.name.text);
    }

    ts.forEachChild(node, visitsNode);
  }

  visitsNode(functionNode.body);
  return declaredNames;
}

module.exports = {
  collectsDeclaredNames,
};
