const fs = require('node:fs');
const path = require('node:path');
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

module.exports = {
  promotesDecompositionPlan,
};
