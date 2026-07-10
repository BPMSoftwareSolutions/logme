const ts = require('typescript');
const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');
const { collectsReferencedIdentifiers } = require('./collects-referenced-identifiers');
const { collectsDeclaredNames } = require('./collects-declared-names');

const GLOBAL_AND_SHARED_IDENTIFIERS = new Set([
  'String', 'Number', 'Boolean', 'Array', 'Object', 'JSON', 'Math', 'Date', 'Map', 'Set',
  'console', 'undefined', 'null', 'true', 'false', 'NaN', 'Infinity', 'Promise', 'Error',
  'RegExp', 'Symbol', 'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'Buffer', 'process',
  'LogMe', 'sampleMethod',
]);

function findsTopLevelFunctionDeclarations(sourceFile) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const functionsByName = new Map();

  function visitsNode(node) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    if (ts.isFunctionDeclaration(node) && node.name) {
      functionsByName.set(node.name.text, node);
    }

    ts.forEachChild(node, visitsNode);
  }

  visitsNode(sourceFile);
  return functionsByName;
}

function mapsFunctionCallGraph(content, filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const scriptKind = filePath.endsWith('.ts') ? ts.ScriptKind.TS : ts.ScriptKind.JS;
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, scriptKind);
  const functionsByName = findsTopLevelFunctionDeclarations(sourceFile);
  const functionNames = new Set(functionsByName.keys());

  const callGraph = new Map();
  const freeIdentifiersByFunction = new Map();

  for (const [functionName, functionNode] of functionsByName) {
    const declaredNames = collectsDeclaredNames(functionNode);
    const referencedNames = collectsReferencedIdentifiers(functionNode.body);
    const calledFunctionNames = [];
    const freeIdentifiers = [];

    for (const referencedName of referencedNames) {
      if (referencedName === functionName || declaredNames.has(referencedName)) {
        continue;
      }

      if (functionNames.has(referencedName)) {
        calledFunctionNames.push(referencedName);
      } else if (!GLOBAL_AND_SHARED_IDENTIFIERS.has(referencedName)) {
        freeIdentifiers.push(referencedName);
      }
    }

    callGraph.set(functionName, calledFunctionNames);
    freeIdentifiersByFunction.set(functionName, freeIdentifiers);
  }

  return { functionNames: Array.from(functionNames), callGraph, freeIdentifiersByFunction };
}

module.exports = {
  mapsFunctionCallGraph,
};
