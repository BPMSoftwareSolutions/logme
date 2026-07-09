const ts = require('typescript');
const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

function isMethodLikeNode(checkNode) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return ts.isFunctionDeclaration(checkNode)
    || ts.isFunctionExpression(checkNode)
    || ts.isArrowFunction(checkNode)
    || ts.isMethodDeclaration(checkNode)
    || ts.isGetAccessorDeclaration(checkNode)
    || ts.isSetAccessorDeclaration(checkNode);
}

function extractsExecutableMethodNodes(sourceFile) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const methods = [];

  function collectsMethodLikeNode(node) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    if (isMethodLikeNode(node)) {
      methods.push(node);
    }

    ts.forEachChild(node, collectsMethodLikeNode);
  }

  collectsMethodLikeNode(sourceFile);
  return methods;
}

module.exports = { extractsExecutableMethodNodes };
