const fs = require('node:fs');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { parsesJavascriptTypescriptSource } = require('../../packages/logme-method-inventory-primitives/src/parses-javascript-typescript-source');
const { extractsExecutableMethodNodes } = require('../../packages/logme-method-inventory-primitives/src/extracts-executable-method-nodes');
const { resolvesMethodName } = require('../../packages/logme-method-inventory-primitives/src/resolves-method-name');
const { resolvesMethodKind } = require('../../packages/logme-method-inventory-primitives/src/resolves-method-kind');
const { detectsLogmeCallInNode } = require('../../packages/logme-method-inventory-primitives/src/detects-logme-call-in-node');

function buildsMethodRecord(node, sourceFile, filePath, isUnimplementedStub, executionStep) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const { name, isAnonymous } = resolvesMethodName(node, sourceFile);
  const start = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd());

  return {
    filePath,
    name,
    isAnonymous,
    isUnimplementedStub,
    executionStep,
    kind: resolvesMethodKind(node),
    lineStart: start.line + 1,
    lineEnd: end.line + 1,
    hasLogMeCall: detectsLogmeCallInNode(node),
  };
}

function inventoriesExecutableDomainMethods(filePath, stubMarker, executionStepState) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let executionStep = 0;
  const content = fs.readFileSync(filePath, 'utf8');
  const isUnimplementedStub = Boolean(stubMarker) && content.trimStart().startsWith(stubMarker);
  const sourceFile = parsesJavascriptTypescriptSource(filePath, content);
  const methodNodes = extractsExecutableMethodNodes(sourceFile);

  function buildsMethodRecordForNode(node) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    const nextExecutionStep = executionStepState
      ? Array.isArray(executionStepState)
        ? ++executionStepState[0]
        : executionStepState.nextExecutionStep()
      : ++executionStep;

    return buildsMethodRecord(
      node,
      sourceFile,
      filePath,
      isUnimplementedStub,
      nextExecutionStep,
    );
  }

  return methodNodes.map(buildsMethodRecordForNode);
}

module.exports = { inventoriesExecutableDomainMethods };
