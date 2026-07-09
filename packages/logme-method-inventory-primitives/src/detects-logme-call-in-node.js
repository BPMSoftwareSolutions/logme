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

function detectsLogmeCallInNode(node) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let found = false;

  function searchesForLogmeCall(currentNode) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    if (found) {
      return;
    }

    if (ts.isCallExpression(currentNode)) {
      const expression = currentNode.expression;
      if (ts.isIdentifier(expression) && expression.text === 'LogMe') {
        found = true;
        return;
      }
      if (ts.isPropertyAccessExpression(expression) && expression.name.text === 'LogMe') {
        found = true;
        return;
      }
    }

    if (currentNode !== node && isMethodLikeNode(currentNode)) {
      return;
    }

    ts.forEachChild(currentNode, searchesForLogmeCall);
  }

  if (node.body) {
    searchesForLogmeCall(node.body);
  }

  return found;
}

module.exports = { detectsLogmeCallInNode };
