const ts = require('typescript');
const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');
const { collectsReferencedIdentifiers } = require('./collects-referenced-identifiers');
const { collectsDeclaredNames } = require('./collects-declared-names');

function findsFunctionDeclarationByName(sourceFile, methodName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let foundNode = null;

  function visitsNode(node) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    if (ts.isFunctionDeclaration(node) && node.name && node.name.text === methodName) {
      foundNode = node;
      return;
    }

    ts.forEachChild(node, visitsNode);
  }

  visitsNode(sourceFile);
  return foundNode;
}

function collectsFreeIdentifiers(functionNode) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const declaredNames = collectsDeclaredNames(functionNode);
  const referencedNames = collectsReferencedIdentifiers(functionNode.body);

  const freeIdentifiers = [];
  for (const referencedName of referencedNames) {
    if (!declaredNames.has(referencedName) && !GLOBAL_IDENTIFIERS.has(referencedName)) {
      freeIdentifiers.push(referencedName);
    }
  }

  return freeIdentifiers;
}

const GLOBAL_IDENTIFIERS = new Set([
  'String', 'Number', 'Boolean', 'Array', 'Object', 'JSON', 'Math', 'Date', 'Map', 'Set',
  'console', 'undefined', 'null', 'true', 'false', 'NaN', 'Infinity', 'Promise', 'Error',
  'RegExp', 'Symbol', 'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'Buffer', 'process',
  'LogMe', 'sampleMethod',
]);

function extractsSelfContainedMethodSource(content, filePath, methodName, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const scriptKind = filePath.endsWith('.ts') ? ts.ScriptKind.TS : ts.ScriptKind.JS;
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, scriptKind);
  const functionNode = findsFunctionDeclarationByName(sourceFile, methodName);

  if (!functionNode) {
    return { extracted: false, reason: `no top-level function declaration named "${methodName}" was found in ${filePath}` };
  }

  const allowedFreeIdentifiers = new Set(options.allowedFreeIdentifiers || []);
  const freeIdentifiers = collectsFreeIdentifiers(functionNode);
  const unresolvedFreeIdentifiers = [];
  for (const identifier of freeIdentifiers) {
    if (!allowedFreeIdentifiers.has(identifier)) {
      unresolvedFreeIdentifiers.push(identifier);
    }
  }

  if (unresolvedFreeIdentifiers.length > 0) {
    return {
      extracted: false,
      reason: `method "${methodName}" references identifiers outside its own scope: ${unresolvedFreeIdentifiers.join(', ')}; not safe to move without dependency analysis`,
    };
  }

  const sourceText = content.slice(functionNode.getFullStart(), functionNode.getEnd()).trim();

  return {
    extracted: true,
    methodName,
    sourceText,
    startPosition: functionNode.getFullStart(),
    endPosition: functionNode.getEnd(),
  };
}

module.exports = {
  extractsSelfContainedMethodSource,
};
