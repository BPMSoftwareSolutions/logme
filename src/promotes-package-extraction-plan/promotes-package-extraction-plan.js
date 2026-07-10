const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { extractsSelfContainedMethodSource } = require('../../packages/logme-method-inventory-primitives/src/extracts-self-contained-method-source');

function promotesPackageExtractionPlan(config, packageExtractionPlan, options) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const methodName = options.methodName;
  const promotableFilePaths = selectsFilesExportingMethod(packageExtractionPlan, methodName);

  if (promotableFilePaths.length === 0) {
    return { promotable: false, reason: `no existing-package section in the plan names extracted method "${methodName}"`, fileEdits: [] };
  }

  const targetPackage = readsTargetPackage(packageExtractionPlan, promotableFilePaths[0]);
  const extractions = extractsMethodFromEachFile(config, promotableFilePaths, methodName);

  if (extractions.blockedFiles.length > 0) {
    return { promotable: false, reason: buildsBlockedReason(extractions.blockedFiles), fileEdits: [] };
  }

  const uniqueSourceTexts = new Set(extractions.resolvedFiles.map(readsSourceText));
  if (uniqueSourceTexts.size > 1) {
    return { promotable: false, reason: `method "${methodName}" has different implementations across files; refusing to promote a lossy merge`, fileEdits: [] };
  }

  const packageFileRelativePath = buildsPackageFileRelativePath(targetPackage, methodName);
  const fileEdits = buildsFileEdits(config, extractions.resolvedFiles, methodName, packageFileRelativePath);
  const packageFileEdit = buildsPackageFileEdit(config, packageFileRelativePath, methodName, extractions.resolvedFiles[0].sourceText);

  return {
    promotable: true,
    targetPackage,
    methodName,
    packageFileRelativePath,
    fileEdits: [packageFileEdit, ...fileEdits],
  };
}

function selectsFilesExportingMethod(packageExtractionPlan, methodName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const matchingFilePaths = [];
  for (const section of packageExtractionPlan.sections || []) {
    if (section.classification !== 'existing package') {
      continue;
    }

    if ((section.extractedMethodNames || []).includes(methodName)) {
      matchingFilePaths.push(section.filePath);
    }
  }

  return matchingFilePaths;
}

function readsTargetPackage(packageExtractionPlan, firstFilePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  for (const section of packageExtractionPlan.sections || []) {
    if (section.filePath === firstFilePath) {
      return section.targetPackage;
    }
  }

  return null;
}

function extractsMethodFromEachFile(config, filePaths, methodName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const resolvedFiles = [];
  const blockedFiles = [];

  for (const filePath of filePaths) {
    const absolutePath = path.join(config.rootDir, filePath);
    const content = fs.readFileSync(absolutePath, 'utf8');
    const extraction = extractsSelfContainedMethodSource(content, filePath, methodName);

    if (!extraction.extracted) {
      blockedFiles.push({ filePath, reason: extraction.reason });
      continue;
    }

    resolvedFiles.push({ filePath, content, sourceText: extraction.sourceText, startPosition: extraction.startPosition, endPosition: extraction.endPosition });
  }

  return { resolvedFiles, blockedFiles };
}

function buildsBlockedReason(blockedFiles) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const reasons = [];
  for (const blockedFile of blockedFiles) {
    reasons.push(`${blockedFile.filePath}: ${blockedFile.reason}`);
  }

  return reasons.join('; ');
}

function readsSourceText(resolvedFile) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return resolvedFile.sourceText;
}

function buildsPackageFileRelativePath(targetPackage, methodName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const kebabName = kebabCasesMethodName(methodName);
  return `packages/${targetPackage}/src/${kebabName}.js`;
}

function kebabCasesMethodName(methodName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return methodName.replace(/([a-z0-9])([A-Z])/gu, '$1-$2').toLowerCase();
}

function buildsPackageFileEdit(config, packageFileRelativePath, methodName, sourceText) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const packageFileContent = [
    "const { LogMe } = require('../../logme-testimony-core/src/LogMe');",
    "const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');",
    '',
    sourceText,
    '',
    `module.exports = { ${methodName} };`,
    '',
  ].join('\n');

  return {
    kind: 'create-package-file',
    filePath: packageFileRelativePath,
    absolutePath: path.join(config.rootDir, packageFileRelativePath),
    newContent: packageFileContent,
  };
}

function buildsFileEdits(config, resolvedFiles, methodName, packageFileRelativePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const fileEdits = [];
  for (const resolvedFile of resolvedFiles) {
    fileEdits.push(buildsDomainFileEdit(config, resolvedFile, methodName, packageFileRelativePath));
  }

  return fileEdits;
}

function buildsDomainFileEdit(config, resolvedFile, methodName, packageFileRelativePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const beforeMethod = resolvedFile.content.slice(0, resolvedFile.startPosition);
  const afterMethod = resolvedFile.content.slice(resolvedFile.endPosition);
  const withoutMethod = `${beforeMethod}${afterMethod}`;
  const requireLine = buildsRelativeRequireLine(resolvedFile.filePath, packageFileRelativePath, methodName);
  const newContent = insertsRequireLineAfterImports(withoutMethod, requireLine);

  return {
    kind: 'update-domain-file',
    filePath: resolvedFile.filePath,
    absolutePath: path.join(config.rootDir, resolvedFile.filePath),
    newContent,
  };
}

function buildsRelativeRequireLine(domainFilePath, packageFileRelativePath, methodName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const domainFileDirectory = path.dirname(domainFilePath);
  const packageFileWithoutExtension = packageFileRelativePath.replace(/\.js$/u, '');
  let relativeRequirePath = path.relative(domainFileDirectory, packageFileWithoutExtension).replace(/\\/gu, '/');

  if (!relativeRequirePath.startsWith('.')) {
    relativeRequirePath = `./${relativeRequirePath}`;
  }

  return `const { ${methodName} } = require('${relativeRequirePath}');`;
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

module.exports = {
  promotesPackageExtractionPlan,
};
