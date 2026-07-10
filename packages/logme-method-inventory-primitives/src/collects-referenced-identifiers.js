const ts = require('typescript');
const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

function collectsReferencedIdentifiers(bodyNode) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const referencedNames = new Set();

  function visitsNode(node) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    if (ts.isPropertyAccessExpression(node)) {
      visitsNode(node.expression);
      return;
    }

    if (ts.isPropertyAssignment(node)) {
      if (ts.isComputedPropertyName(node.name)) {
        visitsNode(node.name);
      }

      visitsNode(node.initializer);
      return;
    }

    if (ts.isShorthandPropertyAssignment(node)) {
      referencedNames.add(node.name.text);
      return;
    }

    if (ts.isIdentifier(node)) {
      referencedNames.add(node.text);
    }

    ts.forEachChild(node, visitsNode);
  }

  visitsNode(bodyNode);
  return referencedNames;
}

module.exports = {
  collectsReferencedIdentifiers,
};
