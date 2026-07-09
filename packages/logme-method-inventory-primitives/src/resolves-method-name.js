const ts = require('typescript');
const { resolvesMethodKind } = require('./resolves-method-kind');
const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

function resolvesMethodName(node, sourceFile) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (node.name && ts.isIdentifier(node.name)) {
    return { name: node.name.text, isAnonymous: false };
  }

  if (node.name) {
    return { name: node.name.getText(sourceFile), isAnonymous: false };
  }

  const parent = node.parent;
  if (!parent) {
    return { name: '(anonymous)', isAnonymous: true };
  }

  if (ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)) {
    return { name: parent.name.text, isAnonymous: false };
  }

  if (ts.isPropertyAssignment(parent) || ts.isShorthandPropertyAssignment(parent)) {
    return { name: parent.name.getText(sourceFile), isAnonymous: false };
  }

  if (ts.isBinaryExpression(parent) && parent.left && ts.isIdentifier(parent.left)) {
    return { name: parent.left.text, isAnonymous: false };
  }

  const kind = resolvesMethodKind(node);
  const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  return {
    name: `${kind} @ ${position.line + 1}:${position.character + 1}`,
    isAnonymous: true,
  };
}

module.exports = { resolvesMethodName };
