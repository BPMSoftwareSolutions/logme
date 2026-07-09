const ts = require('typescript');
const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

function resolvesMethodKind(node) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (ts.isFunctionDeclaration(node)) {
    return 'function';
  }

  if (ts.isMethodDeclaration(node)) {
    return 'method';
  }

  if (ts.isArrowFunction(node)) {
    return 'arrow-function';
  }

  if (ts.isFunctionExpression(node)) {
    return 'function-expression';
  }

  if (ts.isGetAccessorDeclaration(node)) {
    return 'getter';
  }

  if (ts.isSetAccessorDeclaration(node)) {
    return 'setter';
  }

  return node.kind ? ts.SyntaxKind[node.kind] : 'unknown';
}

module.exports = { resolvesMethodKind };
