const ts = require('typescript');
const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

function collectsDeclaredNames(functionNode) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const declaredNames = new Set();

  for (const parameter of functionNode.parameters) {
    addsBindingNames(parameter.name, declaredNames);
  }

  function visitsNode(node) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    if (ts.isVariableDeclaration(node)) {
      addsBindingNames(node.name, declaredNames);
    }

    if (ts.isFunctionDeclaration(node) && node.name) {
      declaredNames.add(node.name.text);
    }

    if ((ts.isArrowFunction(node) || ts.isFunctionExpression(node)) && node.parameters) {
      for (const parameter of node.parameters) {
        addsBindingNames(parameter.name, declaredNames);
      }
    }

    if (ts.isCatchClause(node) && node.variableDeclaration) {
      addsBindingNames(node.variableDeclaration.name, declaredNames);
    }

    ts.forEachChild(node, visitsNode);
  }

  visitsNode(functionNode.body);
  return declaredNames;
}

function addsBindingNames(bindingName, declaredNames) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (ts.isIdentifier(bindingName)) {
    declaredNames.add(bindingName.text);
    return;
  }

  if (ts.isObjectBindingPattern(bindingName) || ts.isArrayBindingPattern(bindingName)) {
    for (const element of bindingName.elements) {
      if (ts.isBindingElement(element)) {
        addsBindingNames(element.name, declaredNames);
      }
    }
  }
}

module.exports = {
  collectsDeclaredNames,
};
