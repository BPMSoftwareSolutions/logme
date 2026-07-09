const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { parsesJavascriptTypescriptSource } = require('../../packages/logme-method-inventory-primitives/src/parses-javascript-typescript-source');

const DEFAULT_SPRAWL_THRESHOLDS = {
  maxLinesBeforeWatchlist: 220,
  maxExecutableMethodsBeforeWatchlist: 16,
  maxResponsibilityClustersBeforeGodFileCandidate: 4,
  maxGenericMechanicsBeforePackageExtractionCandidate: 0,
  maxSideEffectLanesBeforeOrchestratorReview: 3,
  authorizedDenseOrchestratorPaths: [],
};

const GENERIC_MECHANIC_PATTERNS = [
  { mechanic: 'slug/string formatting', pattern: /(slug|string|format|trim|replace|lowercase|uppercase)/iu },
  { mechanic: 'CSV escaping or projection', pattern: /(csv|escape|projection|project)/iu },
  { mechanic: 'file line reading', pattern: /(readline|readlines|split\(['"`]\\n|split\(['"`]\\r\\n|readfilesync)/iu },
  { mechanic: 'path joining or path normalization', pattern: /(path\.join|path\.resolve|path\.normalize|relativepath|normalize)/iu },
  { mechanic: 'sorting comparators', pattern: /(sort\(|compare|comparator|localecompare)/iu },
  { mechanic: 'timestamp arithmetic', pattern: /(timestamp|date\.now|duration|elapsed|time)/iu },
  { mechanic: 'table formatting', pattern: /(markdown.*table|table|row|column)/iu },
  { mechanic: 'schema-agnostic JSON writing', pattern: /(json\.stringify|writejson|schema)/iu },
];

function buildsDomainBodySprawlContract(config, sourceFiles, methods, findings, provenance) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const thresholds = normalizesSprawlThresholds(config.sprawlThresholds);
  const declaredBody = loadsDeclaredFileSystemBody(config.rootDir);
  const sourceFileEntries = [];
  for (const filePath of sourceFiles) {
    sourceFileEntries.push(buildsSourceFileSprawlEntry(config, thresholds, declaredBody, filePath, methods, findings));
  }
  const artifactFindings = buildsArtifactFindings(config, declaredBody);
  const allFindingCodes = [];
  for (const entry of sourceFileEntries) {
    allFindingCodes.push(...entry.findingCodes);
  }

  for (const finding of artifactFindings) {
    allFindingCodes.push(finding.code);
  }
  const summary = buildsSprawlSummary(sourceFileEntries, artifactFindings);

  return {
    schemaVersion: 'domain-body-sprawl.contract.v1',
    runId: provenance.runId,
    evidencePath: `evidence/runs/${provenance.runId}/sprawl/domain-body-sprawl.contract.v1.json`,
    reportPath: `evidence/runs/${provenance.runId}/sprawl/domain-body-sprawl.report.md`,
    hotspotTablePath: `evidence/runs/${provenance.runId}/sprawl/domain-body-sprawl-hotspots.table.md`,
    thresholds,
    summary,
    sourceFiles: sourceFileEntries,
    artifactFindings,
    findingCodes: Array.from(new Set(allFindingCodes)).sort(),
  };
}

function normalizesSprawlThresholds(thresholds) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    ...DEFAULT_SPRAWL_THRESHOLDS,
    ...(thresholds || {}),
    authorizedDenseOrchestratorPaths: Array.isArray(thresholds && thresholds.authorizedDenseOrchestratorPaths)
      ? thresholds.authorizedDenseOrchestratorPaths
      : DEFAULT_SPRAWL_THRESHOLDS.authorizedDenseOrchestratorPaths,
  };
}

function loadsDeclaredFileSystemBody(rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const contractPath = path.join(rootDir, 'contracts', 'file-system-bodies', '02_declared', 'logme.file-system-body.contract.v1.json');
  return JSON.parse(fs.readFileSync(contractPath, 'utf8'));
}

function buildsSourceFileSprawlEntry(config, thresholds, declaredBody, filePath, methods, findings) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(config.rootDir, filePath).replace(/\\/gu, '/');
  const fileMethods = [];
  for (const method of methods) {
    if (method.filePath === filePath) {
      fileMethods.push(method);
    }
  }
  const sourceFile = parsesJavascriptTypescriptSource(filePath, content);
  const astSignals = inventoriesAstSignals(sourceFile, content);
  const sterilityFindings = [];
  for (const finding of findings) {
    if (finding.filePath === filePath) {
      sterilityFindings.push(finding);
    }
  }
  const responsibilityClusters = buildsResponsibilityClusters(config, relativePath, fileMethods, astSignals);
  const genericMechanicCandidates = buildsGenericMechanicCandidates(fileMethods, content);
  const sideEffectLanes = detectsSideEffectLanes(content);
  const contractPathsReferenced = extractsContractPaths(content);
  const featureIdsReferenced = extractsFeatureIds(content);
  const findingCodes = buildsFileFindingCodes(
    thresholds,
    relativePath,
    declaredBody,
    content,
    fileMethods,
    responsibilityClusters,
    genericMechanicCandidates,
    sideEffectLanes,
    sterilityFindings,
  );
  const classification = classifiesSprawlFile(
    thresholds,
    relativePath,
    fileMethods,
    content,
    responsibilityClusters,
    genericMechanicCandidates,
    findingCodes,
  );

  return {
    filePath: relativePath,
    packageOrDomainScope: resolvesPackageOrDomainScope(relativePath),
    lineCount: countsLines(content),
    byteCount: Buffer.byteLength(content, 'utf8'),
    executableMethodCount: fileMethods.length,
    exportedSymbolCount: astSignals.exportedSymbolCount,
    importedModuleCount: astSignals.importedModuleCount,
    localNestedFunctionCount: countsLocalNestedFunctions(fileMethods),
    domainVocabularyTokens: extractsDomainVocabularyTokens(config, relativePath, fileMethods),
    responsibilityClusters,
    sideEffectLanes,
    featureIdsReferenced,
    contractPathsReferenced,
    genericMechanicCandidates,
    findingCodes,
    classification,
    signalsTriggered: buildsTriggeredSignals(thresholds, content, fileMethods, responsibilityClusters, genericMechanicCandidates, sideEffectLanes),
    fixRoute: buildsSprawlFixRoute(classification, findingCodes, relativePath, contractPathsReferenced),
  };
}

function inventoriesAstSignals(sourceFile, content) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let importedModuleCount = 0;
  let exportedSymbolCount = 0;

  function visitsNode(node) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    if (ts.isImportDeclaration(node) || (ts.isCallExpression(node) && node.expression.getText(sourceFile) === 'require')) {
      importedModuleCount += 1;
    }

    if (ts.isExportDeclaration(node) || ts.isExportAssignment(node)) {
      exportedSymbolCount += 1;
    }

    ts.forEachChild(node, visitsNode);
  }

  visitsNode(sourceFile);

  if (/module\.exports\s*=/u.test(content)) {
    exportedSymbolCount += 1;
  }

  return { importedModuleCount, exportedSymbolCount };
}

function buildsResponsibilityClusters(config, relativePath, fileMethods, astSignals) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const clusters = new Map();

  function recordsCluster(name, signal) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    if (!clusters.has(name)) {
      clusters.set(name, { name, signals: [] });
    }

    clusters.get(name).signals.push(signal);
  }

  for (const method of fileMethods) {
    const token = extractsFirstDomainToken(config, method.name);
    recordsCluster(token || 'unclear-domain-vocabulary', `method:${method.name}`);
  }

  if (astSignals.importedModuleCount > 3) {
    recordsCluster('integration-coupling', `imports:${astSignals.importedModuleCount}`);
  }

  if (/render|markdown|table|report/iu.test(relativePath)) {
    recordsCluster('rendering-or-projection', `path:${relativePath}`);
  }

  if (/validate|gate|detect/iu.test(relativePath)) {
    recordsCluster('validation-or-gate', `path:${relativePath}`);
  }

  return Array.from(clusters.values());
}

function buildsGenericMechanicCandidates(fileMethods, content) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const candidates = [];

  for (const candidate of GENERIC_MECHANIC_PATTERNS) {
    if (!candidate.pattern.test(content)) {
      continue;
    }

    const methodNames = [];
    for (const method of fileMethods) {
      if (candidate.pattern.test(method.name)) {
        methodNames.push(method.name);
      }
    }

    candidates.push({
      mechanic: candidate.mechanic,
      methodNames,
      fixRoute: `move ${candidate.mechanic} to a package primitive unless the body contract names it as domain-specific`,
    });
  }

  return candidates;
}

function detectsSideEffectLanes(content) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lanes = [];
  if (/fs\.|readFile|writeFile/iu.test(content)) lanes.push('filesystem');
  if (/process\.env|process\.argv/iu.test(content)) lanes.push('process');
  if (/console\./iu.test(content)) lanes.push('console');
  if (/child_process|exec|spawn/iu.test(content)) lanes.push('shell');
  if (/fetch\(|https?\.request/iu.test(content)) lanes.push('network');
  return lanes;
}

function extractsContractPaths(content) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const contractPaths = [];
  for (const match of content.matchAll(/contracts\/[A-Za-z0-9_./-]+/gu)) {
    contractPaths.push(match[0]);
  }

  return contractPaths;
}

function extractsFeatureIds(content) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const featureIds = [];
  for (const match of content.matchAll(/featureId['"]?\s*:\s*['"]([^'"]+)['"]/gu)) {
    featureIds.push(match[1]);
  }

  return featureIds;
}

function buildsFileFindingCodes(
  thresholds,
  relativePath,
  declaredBody,
  content,
  fileMethods,
  responsibilityClusters,
  genericMechanicCandidates,
  sideEffectLanes,
  sterilityFindings,
) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const findingCodes = [];
  for (const finding of sterilityFindings) {
    findingCodes.push(finding.code);
  }

  if (!isDeclaredSourceFile(declaredBody, relativePath)) {
    findingCodes.push('orphan-source-file');
  }

  if (genericMechanicCandidates.length > thresholds.maxGenericMechanicsBeforePackageExtractionCandidate && relativePath.startsWith('src/')) {
    findingCodes.push('package-worthy-mechanic-inside-domain-body');
  }

  if (responsibilityClusters.length > thresholds.maxResponsibilityClustersBeforeGodFileCandidate) {
    findingCodes.push('mixed-responsibility-file');
  }

  if (countsLines(content) > thresholds.maxLinesBeforeWatchlist || fileMethods.length > thresholds.maxExecutableMethodsBeforeWatchlist) {
    findingCodes.push('god-file-candidate');
  }

  if (sideEffectLanes.length > thresholds.maxSideEffectLanesBeforeOrchestratorReview && !thresholds.authorizedDenseOrchestratorPaths.includes(relativePath)) {
    findingCodes.push('mixed-responsibility-file');
  }

  return Array.from(new Set(findingCodes)).sort();
}

function classifiesSprawlFile(thresholds, relativePath, fileMethods, content, responsibilityClusters, genericMechanicCandidates, findingCodes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (thresholds.authorizedDenseOrchestratorPaths.includes(relativePath)) {
    return 'authorized dense orchestrator';
  }

  if (genericMechanicCandidates.length > thresholds.maxGenericMechanicsBeforePackageExtractionCandidate && relativePath.startsWith('src/')) {
    return 'package extraction candidate';
  }

  if (findingCodes.includes('god-file-candidate')) {
    return 'god-file candidate';
  }

  if (responsibilityClusters.length > 1 || countsLines(content) > thresholds.maxLinesBeforeWatchlist || fileMethods.length > thresholds.maxExecutableMethodsBeforeWatchlist) {
    return 'watchlist';
  }

  return 'focused';
}

function buildsTriggeredSignals(thresholds, content, fileMethods, responsibilityClusters, genericMechanicCandidates, sideEffectLanes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const signals = [];
  if (countsLines(content) > thresholds.maxLinesBeforeWatchlist) signals.push(`line count ${countsLines(content)} exceeds ${thresholds.maxLinesBeforeWatchlist}`);
  if (fileMethods.length > thresholds.maxExecutableMethodsBeforeWatchlist) signals.push(`method count ${fileMethods.length} exceeds ${thresholds.maxExecutableMethodsBeforeWatchlist}`);
  if (responsibilityClusters.length > thresholds.maxResponsibilityClustersBeforeGodFileCandidate) signals.push(`responsibility clusters ${responsibilityClusters.length} exceeds ${thresholds.maxResponsibilityClustersBeforeGodFileCandidate}`);
  if (genericMechanicCandidates.length > thresholds.maxGenericMechanicsBeforePackageExtractionCandidate) signals.push(`generic mechanics ${genericMechanicCandidates.length} exceeds ${thresholds.maxGenericMechanicsBeforePackageExtractionCandidate}`);
  if (sideEffectLanes.length > thresholds.maxSideEffectLanesBeforeOrchestratorReview) signals.push(`side-effect lanes ${sideEffectLanes.length} exceeds ${thresholds.maxSideEffectLanesBeforeOrchestratorReview}`);
  return signals;
}

function buildsSprawlFixRoute(classification, findingCodes, relativePath, contractPathsReferenced) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (findingCodes.includes('orphan-source-file')) {
    return 'declare the file in contracts/file-system-bodies/02_declared/logme.file-system-body.contract.v1.json or move it under an owned package body';
  }

  if (classification === 'package extraction candidate') {
    return 'move generic mechanics to packages/logme-*-primitives or document why the mechanic is domain-specific';
  }

  if (findingCodes.includes('mixed-responsibility-file')) {
    return contractPathsReferenced.length > 0
      ? `split along the responsibility boundary authorized by ${contractPathsReferenced[0]}`
      : 'name the next durable product boundary in a body contract before splitting mechanically';
  }

  if (classification === 'god-file candidate') {
    return 'review triggered signals and either extract a product boundary or authorize dense orchestration in sprawl thresholds';
  }

  return `keep ${relativePath} cohesive and observable`;
}

function buildsArtifactFindings(config, declaredBody) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const declaredFiles = new Set(declaredBody.requiredPaths.files || []);
  const checks = [
    { directory: 'src', code: 'orphan-source-file', expectedHome: 'requiredPaths.files or owns.runtime' },
    { directory: 'tests', code: 'orphan-test-file', expectedHome: 'requiredPaths.files' },
    { directory: 'contracts', code: 'orphan-contract-file', expectedHome: 'requiredPaths.files or owns.contracts' },
  ];

  const artifactFindings = [];

  for (const check of checks) {
    const checkedFiles = walksFiles(path.join(config.rootDir, check.directory));
    for (const filePath of checkedFiles) {
      const relativePath = path.relative(config.rootDir, filePath).replace(/\\/gu, '/');
      if (declaredFiles.has(relativePath)) {
        continue;
      }

      artifactFindings.push({
        code: check.code,
        filePath: relativePath,
        expectedHome: check.expectedHome,
        declaredOwner: declaredBody.bodyId,
      });
    }
  }

  return artifactFindings;
}

function walksFiles(startPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!fs.existsSync(startPath)) {
    return [];
  }

  const files = [];
  for (const entry of fs.readdirSync(startPath, { withFileTypes: true })) {
    const entryPath = path.join(startPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walksFiles(entryPath));
    } else {
      files.push(entryPath);
    }
  }

  return files;
}

function buildsSprawlSummary(sourceFileEntries, artifactFindings) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const sprawlHotspotEntries = [];
  for (const entry of sourceFileEntries) {
    if (entry.classification !== 'focused' || entry.findingCodes.length > 0) {
      sprawlHotspotEntries.push(entry);
    }
  }

  sprawlHotspotEntries.sort(comparesSprawlHotspots);

  const topSprawlHotspots = [];
  for (const entry of sprawlHotspotEntries.slice(0, 5)) {
    topSprawlHotspots.push({
      filePath: entry.filePath,
      classification: entry.classification,
      lineCount: entry.lineCount,
      executableMethodCount: entry.executableMethodCount,
      responsibilityClusterCount: entry.responsibilityClusters.length,
      genericMechanicCount: entry.genericMechanicCandidates.length,
      sterilityFindingCount: countsSterilityFindings(entry.findingCodes),
      blockerCount: countsSevereSprawlBlockers(entry.findingCodes),
      findingCodes: entry.findingCodes,
      fixRoute: entry.fixRoute,
      recommendedOwnerAction: entry.fixRoute,
    });
  }

  return {
    totalSourceFilesScanned: sourceFileEntries.length,
    focusedFiles: countsClassification(sourceFileEntries, 'focused'),
    watchlistFiles: countsClassification(sourceFileEntries, 'watchlist'),
    godFileCandidates: countsClassification(sourceFileEntries, 'god-file candidate'),
    packageExtractionCandidates: countsClassification(sourceFileEntries, 'package extraction candidate'),
    mixedResponsibilityFiles: countsMixedResponsibilityFiles(sourceFileEntries),
    orphanArtifacts: artifactFindings.length,
    topSprawlHotspots,
  };
}

function countsSterilityFindings(findingCodes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const sterilityFindingCodes = new Set([
    'local-method-without-testimony',
    'anonymous-executable-method-detected',
    'local-method-name-outside-domain-vocabulary',
    'local-generic-utility-detected',
    'unimplemented-stub-detected',
  ]);
  let sterilityFindingCount = 0;

  for (const findingCode of findingCodes) {
    if (sterilityFindingCodes.has(findingCode)) {
      sterilityFindingCount += 1;
    }
  }

  return sterilityFindingCount;
}

function countsSevereSprawlBlockers(findingCodes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const blockerFindingCodes = new Set([
    'orphan-source-file',
    'mixed-responsibility-file',
    'undeclared-generated-artifact',
  ]);
  let blockerCount = 0;

  for (const findingCode of findingCodes) {
    if (blockerFindingCodes.has(findingCode)) {
      blockerCount += 1;
    }
  }

  return blockerCount;
}

function comparesSprawlHotspots(left, right) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return right.findingCodes.length - left.findingCodes.length || right.executableMethodCount - left.executableMethodCount;
}

function countsMixedResponsibilityFiles(sourceFileEntries) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let mixedResponsibilityFiles = 0;
  for (const entry of sourceFileEntries) {
    if (entry.findingCodes.includes('mixed-responsibility-file')) {
      mixedResponsibilityFiles += 1;
    }
  }

  return mixedResponsibilityFiles;
}

function countsClassification(sourceFileEntries, classification) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let classificationCount = 0;
  for (const entry of sourceFileEntries) {
    if (entry.classification === classification) {
      classificationCount += 1;
    }
  }

  return classificationCount;
}

function resolvesPackageOrDomainScope(relativePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (relativePath.startsWith('packages/')) {
    return relativePath.split('/').slice(0, 2).join('/');
  }

  return relativePath.startsWith('src/') ? 'domain body' : 'workspace body';
}

function countsLines(content) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return content.length === 0 ? 0 : content.split(/\r?\n/u).length;
}

function countsLocalNestedFunctions(fileMethods) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let nestedFunctionCount = 0;
  for (const method of fileMethods) {
    if (method.kind === 'arrow-function' || method.kind === 'function-expression') {
      nestedFunctionCount += 1;
    }
  }

  return nestedFunctionCount;
}

function extractsDomainVocabularyTokens(config, relativePath, fileMethods) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const vocabulary = new Set();
  for (const word of config.domainContract.domainVocabulary.nouns || []) {
    vocabulary.add(word.toLowerCase());
  }

  for (const word of config.domainContract.domainVocabulary.verbs || []) {
    vocabulary.add(word.toLowerCase());
  }

  const methodNames = [];
  for (const method of fileMethods) {
    methodNames.push(method.name);
  }

  const domainTokens = new Set();
  const words = [relativePath, ...methodNames].join(' ').toLowerCase().split(/[^a-z0-9]+/u);
  for (const word of words) {
    if (vocabulary.has(word)) {
      domainTokens.add(word);
    }
  }

  return Array.from(domainTokens).sort();
}

function extractsFirstDomainToken(config, methodName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return extractsDomainVocabularyTokens(config, '', [{ name: methodName }])[0] || null;
}

function isDeclaredSourceFile(declaredBody, relativePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return (declaredBody.requiredPaths.files || []).includes(relativePath);
}

module.exports = {
  DEFAULT_SPRAWL_THRESHOLDS,
  buildsDomainBodySprawlContract,
};
