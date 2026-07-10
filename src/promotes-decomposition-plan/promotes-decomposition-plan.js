const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { extractsSelfContainedMethodSource } = require('../../packages/logme-method-inventory-primitives/src/extracts-self-contained-method-source');
const { mapsFunctionCallGraph } = require('../../packages/logme-method-inventory-primitives/src/maps-function-call-graph');
const { clustersFunctionsByCallGraph } = require('../../packages/logme-method-inventory-primitives/src/clusters-functions-by-call-graph');

function promotesDecompositionPlan(config, currentFilePath, options) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const entryMethodName = options.entryMethodName;
  const newBodyName = options.newBodyName;
  const absolutePath = path.join(config.rootDir, currentFilePath);
  const content = fs.readFileSync(absolutePath, 'utf8');

  const callGraphResult = mapsFunctionCallGraph(content, currentFilePath);
  const clusters = clustersFunctionsByCallGraph(callGraphResult);
  const targetCluster = findsClusterContainingMethod(clusters, entryMethodName);

  if (!targetCluster) {
    return { promotable: false, reason: `no call-graph cluster contains method "${entryMethodName}"`, fileEdits: [] };
  }

  if (targetCluster.freeIdentifiers.length > 0) {
    return {
      promotable: false,
      reason: `cluster containing "${entryMethodName}" has module-level dependencies: ${targetCluster.freeIdentifiers.join(', ')}; not safe to move without carrying those along`,
      fileEdits: [],
    };
  }

  const extraction = extractsClusterMethods(content, currentFilePath, targetCluster.memberNames);
  if (extraction.blockedMembers.length > 0) {
    return { promotable: false, reason: buildsBlockedReason(extraction.blockedMembers), fileEdits: [] };
  }

  const isEntryMethodExported = checksIsExported(content, entryMethodName);
  const newFileRelativePath = buildsNewFileRelativePath(currentFilePath, newBodyName);
  const newFileEdit = buildsNewFileEdit(config, newFileRelativePath, extraction.resolvedMembers, entryMethodName);
  const domainFileEdit = buildsDomainFileEdit(config, currentFilePath, content, extraction.resolvedMembers, newFileRelativePath, entryMethodName, isEntryMethodExported);

  return {
    promotable: true,
    entryMethodName,
    movedMethodNames: targetCluster.memberNames,
    newFileRelativePath,
    fileEdits: [newFileEdit, domainFileEdit],
  };
}

function findsClusterContainingMethod(clusters, entryMethodName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  for (const cluster of clusters) {
    if (cluster.memberNames.includes(entryMethodName)) {
      return cluster;
    }
  }

  return null;
}

function extractsClusterMethods(content, filePath, memberNames) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const resolvedMembers = [];
  const blockedMembers = [];

  for (const memberName of memberNames) {
    const extraction = extractsSelfContainedMethodSource(content, filePath, memberName, { allowedFreeIdentifiers: memberNames });

    if (!extraction.extracted) {
      blockedMembers.push({ memberName, reason: extraction.reason });
      continue;
    }

    resolvedMembers.push(extraction);
  }

  resolvedMembers.sort(comparesByStartPosition);
  return { resolvedMembers, blockedMembers };
}

function comparesByStartPosition(first, second) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return first.startPosition - second.startPosition;
}

function buildsBlockedReason(blockedMembers) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const reasons = [];
  for (const blockedMember of blockedMembers) {
    reasons.push(`${blockedMember.memberName}: ${blockedMember.reason}`);
  }

  return reasons.join('; ');
}

function checksIsExported(content, methodName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const exportsBlockMatch = content.match(/module\.exports\s*=\s*\{([\s\S]*?)\};?\s*$/u);
  if (!exportsBlockMatch) {
    return false;
  }

  const exportedNamePattern = new RegExp(`\\b${methodName}\\b`, 'u');
  return exportedNamePattern.test(exportsBlockMatch[1]);
}

function buildsNewFileRelativePath(currentFilePath, newBodyName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const currentDirectory = path.dirname(currentFilePath);
  return `${currentDirectory}/${newBodyName}/${newBodyName}.js`;
}

function buildsNewFileEdit(config, newFileRelativePath, resolvedMembers, entryMethodName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const sourceTexts = [];
  for (const resolvedMember of resolvedMembers) {
    sourceTexts.push(resolvedMember.sourceText);
  }

  const newFileContent = [
    "const { LogMe } = require('../../../packages/logme-testimony-core/src/LogMe');",
    "const { sampleMethod } = require('../../../packages/logme-testimony-core/src/sample-method');",
    '',
    sourceTexts.join('\n\n'),
    '',
    `module.exports = { ${entryMethodName} };`,
    '',
  ].join('\n');

  return {
    kind: 'create-decomposed-file',
    filePath: newFileRelativePath,
    absolutePath: path.join(config.rootDir, newFileRelativePath),
    newContent: newFileContent,
  };
}

function buildsDomainFileEdit(config, currentFilePath, content, resolvedMembers, newFileRelativePath, entryMethodName, isEntryMethodExported) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let remainingContent = removesResolvedMembers(content, resolvedMembers);
  const requireLine = buildsRelativeRequireLine(currentFilePath, newFileRelativePath, entryMethodName);
  remainingContent = insertsRequireLineAfterImports(remainingContent, requireLine);

  if (!isEntryMethodExported) {
    remainingContent = appendsToExports(remainingContent, entryMethodName);
  }

  return {
    kind: 'update-decomposed-domain-file',
    filePath: currentFilePath,
    absolutePath: path.join(config.rootDir, currentFilePath),
    newContent: remainingContent,
  };
}

function removesResolvedMembers(content, resolvedMembers) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let remainingContent = content;
  for (let index = resolvedMembers.length - 1; index >= 0; index -= 1) {
    const member = resolvedMembers[index];
    remainingContent = `${remainingContent.slice(0, member.startPosition)}${remainingContent.slice(member.endPosition)}`;
  }

  return remainingContent;
}

function buildsRelativeRequireLine(domainFilePath, newFileRelativePath, entryMethodName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const domainFileDirectory = path.dirname(domainFilePath);
  const newFileWithoutExtension = newFileRelativePath.replace(/\.js$/u, '');
  let relativeRequirePath = path.relative(domainFileDirectory, newFileWithoutExtension).replace(/\\/gu, '/');

  if (!relativeRequirePath.startsWith('.')) {
    relativeRequirePath = `./${relativeRequirePath}`;
  }

  return `const { ${entryMethodName} } = require('${relativeRequirePath}');`;
}

function insertsRequireLineAfterImports(content, requireLine) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = content.split('\n');
  let lastRequireLineIndex = -1;

  for (let index = 0; index < lines.length; index += 1) {
    if (/^const .+= require\(/u.test(lines[index])) {
      lastRequireLineIndex = index;
    }
  }

  if (lastRequireLineIndex === -1) {
    return `${requireLine}\n${content}`;
  }

  lines.splice(lastRequireLineIndex + 1, 0, requireLine);
  return lines.join('\n');
}

function appendsToExports(content, entryMethodName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return content.replace(/module\.exports\s*=\s*\{/u, `module.exports = {\n  ${entryMethodName},`);
}

function promotesFullFileDecomposition(config, filePath, groups) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const resolvedGroups = selectsResolvedGroups(groups);
  if (resolvedGroups.length === 0) {
    return { promotable: false, reason: 'no group in the decomposition plan has a proposedFileStem to promote', fileEdits: [] };
  }

  const absoluteFilePath = path.join(config.rootDir, filePath);
  const content = fs.readFileSync(absoluteFilePath, 'utf8');
  const sourceFile = parsesFullSourceFile(content, filePath);
  const functionSources = extractsAllFunctionSources(sourceFile, content);
  const moduleConstants = extractsModuleLevelConstants(sourceFile, content);
  const publicExportNames = extractsPublicExportNames(sourceFile);

  const missingFunctions = findsMissingFunctionSources(resolvedGroups, functionSources);
  if (missingFunctions.length > 0) {
    return { promotable: false, reason: `could not locate source for: ${missingFunctions.join(', ')}`, fileEdits: [] };
  }

  const requiredConstants = findsRequiredConstants(resolvedGroups, moduleConstants);
  const featureDirectory = path.dirname(filePath).replace(/\\/gu, '/');
  const fileEdits = [];

  const constantsFileEdit = buildsSharedConstantsFileEdit(config, featureDirectory, requiredConstants, moduleConstants);
  if (constantsFileEdit) {
    fileEdits.push(constantsFileEdit);
  }

  const memberToStem = buildsMemberToStemIndex(resolvedGroups);

  for (const group of resolvedGroups) {
    fileEdits.push(buildsGroupFileEdit(config, featureDirectory, group, functionSources, memberToStem, requiredConstants, constantsFileEdit));
  }

  fileEdits.push(buildsOriginalFileBarrelEdit(config, filePath, content, sourceFile, resolvedGroups, publicExportNames, memberToStem, requiredConstants, constantsFileEdit));

  return { promotable: true, fileEdits };
}

function selectsResolvedGroups(groups) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const resolved = [];
  for (const group of groups) {
    if (group.proposedFileStem) {
      resolved.push(group);
    }
  }

  return resolved;
}

function parsesFullSourceFile(content, filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const scriptKind = filePath.endsWith('.ts') ? ts.ScriptKind.TS : ts.ScriptKind.JS;
  return ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, scriptKind);
}

function extractsAllFunctionSources(sourceFile, content) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const functionSources = new Map();

  function visitsNode(node) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    if (ts.isFunctionDeclaration(node) && node.name) {
      functionSources.set(node.name.text, content.slice(node.getStart(sourceFile), node.getEnd()).trim());
    }

    ts.forEachChild(node, visitsNode);
  }

  visitsNode(sourceFile);
  return functionSources;
}

function extractsModuleLevelConstants(sourceFile, content) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const moduleConstants = new Map();

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.initializer && !isRequireCall(declaration.initializer)) {
        moduleConstants.set(declaration.name.text, content.slice(statement.getStart(sourceFile), statement.getEnd()).trim());
      }
    }
  }

  return moduleConstants;
}

function isRequireCall(expressionNode) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return ts.isCallExpression(expressionNode) && ts.isIdentifier(expressionNode.expression) && expressionNode.expression.text === 'require';
}

function extractsPublicExportNames(sourceFile) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const exportNames = [];

  for (const statement of sourceFile.statements) {
    if (!ts.isExpressionStatement(statement) || !ts.isBinaryExpression(statement.expression)) {
      continue;
    }

    const assignment = statement.expression;
    const isModuleExportsAssignment = ts.isPropertyAccessExpression(assignment.left)
      && ts.isIdentifier(assignment.left.expression)
      && assignment.left.expression.text === 'module'
      && assignment.left.name.text === 'exports';

    if (isModuleExportsAssignment && ts.isObjectLiteralExpression(assignment.right)) {
      for (const property of assignment.right.properties) {
        if (ts.isShorthandPropertyAssignment(property)) {
          exportNames.push(property.name.text);
        } else if (ts.isPropertyAssignment(property) && ts.isIdentifier(property.name)) {
          exportNames.push(property.name.text);
        }
      }
    }
  }

  return exportNames;
}

function findsMissingFunctionSources(resolvedGroups, functionSources) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const missing = [];
  for (const group of resolvedGroups) {
    for (const memberName of group.memberNames) {
      if (!functionSources.has(memberName)) {
        missing.push(memberName);
      }
    }
  }

  return missing;
}

function findsRequiredConstants(resolvedGroups, moduleConstants) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const requiredConstants = new Set();
  for (const group of resolvedGroups) {
    for (const freeIdentifier of group.freeIdentifiers) {
      if (moduleConstants.has(freeIdentifier)) {
        requiredConstants.add(freeIdentifier);
      }
    }
  }

  return requiredConstants;
}

function buildsSharedConstantsFileEdit(config, featureDirectory, requiredConstants, moduleConstants) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (requiredConstants.size === 0) {
    return null;
  }

  const constantNames = Array.from(requiredConstants).sort();
  const constantsStem = `${path.basename(featureDirectory)}-shared-constants`;
  const relativePath = path.posix.join(featureDirectory, constantsStem, `${constantsStem}.js`);

  const declarationLines = [];
  for (const constantName of constantNames) {
    declarationLines.push(moduleConstants.get(constantName));
  }

  const fileContent = [
    ...declarationLines,
    '',
    `module.exports = { ${constantNames.join(', ')} };`,
    '',
  ].join('\n');

  return {
    kind: 'create-decomposed-file',
    filePath: relativePath,
    absolutePath: path.join(config.rootDir, relativePath),
    newContent: fileContent,
    exportedNames: constantNames,
    stem: constantsStem,
  };
}

function buildsMemberToStemIndex(resolvedGroups) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const memberToStem = new Map();
  for (const group of resolvedGroups) {
    for (const memberName of group.memberNames) {
      memberToStem.set(memberName, group.proposedFileStem);
    }
  }

  return memberToStem;
}

function buildsGroupFileEdit(config, featureDirectory, group, functionSources, memberToStem, requiredConstants, constantsFileEdit) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const relativePath = path.posix.join(featureDirectory, group.proposedFileStem, `${group.proposedFileStem}.js`);
  const requireLines = buildsGroupRequireLines(group, memberToStem, requiredConstants, constantsFileEdit);
  const functionBlocks = [];

  for (const memberName of group.memberNames) {
    functionBlocks.push(functionSources.get(memberName));
  }

  const fileContent = [
    ...requireLines,
    '',
    functionBlocks.join('\n\n'),
    '',
    `module.exports = { ${group.memberNames.join(', ')} };`,
    '',
  ].join('\n');

  return {
    kind: 'create-decomposed-file',
    filePath: relativePath,
    absolutePath: path.join(config.rootDir, relativePath),
    newContent: fileContent,
    exportedNames: group.memberNames,
    stem: group.proposedFileStem,
  };
}

function buildsGroupRequireLines(group, memberToStem, requiredConstants, constantsFileEdit) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const requireLines = [
    "const { LogMe } = require('../../../packages/logme-testimony-core/src/LogMe');",
    "const { sampleMethod } = require('../../../packages/logme-testimony-core/src/sample-method');",
  ];

  for (const nodeBuiltin of NODE_BUILTIN_FREE_IDENTIFIERS) {
    if (group.freeIdentifiers.includes(nodeBuiltin)) {
      requireLines.push(`const ${nodeBuiltin} = require('node:${nodeBuiltin}');`);
    }
  }

  const neededConstants = [];
  for (const freeIdentifier of group.freeIdentifiers) {
    if (requiredConstants.has(freeIdentifier)) {
      neededConstants.push(freeIdentifier);
    }
  }

  if (neededConstants.length > 0 && constantsFileEdit) {
    requireLines.push(`const { ${neededConstants.sort().join(', ')} } = require('../${constantsFileEdit.stem}/${constantsFileEdit.stem}');`);
  }

  const crossGroupCalledNames = findsCrossGroupCalledNames(group, memberToStem);
  const byStem = new Map();
  for (const calledName of crossGroupCalledNames) {
    const stem = memberToStem.get(calledName);
    if (!byStem.has(stem)) {
      byStem.set(stem, []);
    }

    byStem.get(stem).push(calledName);
  }

  const sortedStems = Array.from(byStem.keys()).sort();
  for (const stem of sortedStems) {
    const names = byStem.get(stem).sort();
    requireLines.push(`const { ${names.join(', ')} } = require('../${stem}/${stem}');`);
  }

  return requireLines;
}

function findsCrossGroupCalledNames(group, memberToStem) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const crossGroupCalledNames = new Set();
  for (const freeIdentifier of group.freeIdentifiers) {
    if (memberToStem.has(freeIdentifier) && memberToStem.get(freeIdentifier) !== group.proposedFileStem) {
      crossGroupCalledNames.add(freeIdentifier);
    }
  }

  return crossGroupCalledNames;
}

function buildsOriginalFileBarrelEdit(config, filePath, content, sourceFile, resolvedGroups, publicExportNames, memberToStem, requiredConstants, constantsFileEdit) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const movedNames = new Set();
  for (const group of resolvedGroups) {
    for (const memberName of group.memberNames) {
      movedNames.add(memberName);
    }
  }

  const stems = new Set();
  for (const group of resolvedGroups) {
    stems.add(group.proposedFileStem);
  }

  const sortedStems = Array.from(stems).sort();
  const requireLines = [];

  for (const stem of sortedStems) {
    const namesForStem = [];
    for (const [memberName, memberStem] of memberToStem) {
      if (memberStem === stem && movedNames.has(memberName)) {
        namesForStem.push(memberName);
      }
    }

    requireLines.push(`const { ${namesForStem.sort().join(', ')} } = require('./${stem}/${stem}');`);
  }

  if (constantsFileEdit) {
    const constantNames = Array.from(requiredConstants).sort();
    requireLines.push(`const { ${constantNames.join(', ')} } = require('./${constantsFileEdit.stem}/${constantsFileEdit.stem}');`);
  }

  const movedConstantNames = constantsFileEdit ? new Set(requiredConstants) : new Set();
  const remainingContent = removesMovedDeclarationsFromSource(sourceFile, content, movedNames, movedConstantNames);
  const insertionPoint = findsLastRequireLineIndex(remainingContent);
  const lines = remainingContent.split('\n');
  lines.splice(insertionPoint + 1, 0, ...requireLines);

  return {
    kind: 'update-decomposed-domain-file',
    filePath,
    absolutePath: path.join(config.rootDir, filePath),
    newContent: lines.join('\n'),
    preservedExportCount: publicExportNames.length,
  };
}

function removesMovedDeclarationsFromSource(sourceFile, content, movedNames, movedConstantNames) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const removalRanges = [];

  function visitsNode(node) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    if (ts.isFunctionDeclaration(node) && node.name && movedNames.has(node.name.text)) {
      removalRanges.push([node.getFullStart(), node.getEnd()]);
      return;
    }

    if (ts.isVariableStatement(node)) {
      const declaration = node.declarationList.declarations[0];
      if (declaration && ts.isIdentifier(declaration.name) && movedConstantNames.has(declaration.name.text)) {
        removalRanges.push([node.getFullStart(), node.getEnd()]);
        return;
      }
    }

    ts.forEachChild(node, visitsNode);
  }

  visitsNode(sourceFile);
  removalRanges.sort(comparesRangesDescending);

  let remainingContent = content;
  for (const [start, end] of removalRanges) {
    remainingContent = remainingContent.slice(0, start) + remainingContent.slice(end);
  }

  return remainingContent;
}

function comparesRangesDescending(firstRange, secondRange) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return secondRange[0] - firstRange[0];
}

function findsLastRequireLineIndex(content) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = content.split('\n');
  let lastRequireLineIndex = -1;

  for (let index = 0; index < lines.length; index += 1) {
    if (/^const .+= require\(/u.test(lines[index])) {
      lastRequireLineIndex = index;
    }
  }

  return lastRequireLineIndex;
}

const NODE_BUILTIN_FREE_IDENTIFIERS = new Set(['fs', 'path']);

module.exports = {
  promotesDecompositionPlan,
  promotesFullFileDecomposition,
};
