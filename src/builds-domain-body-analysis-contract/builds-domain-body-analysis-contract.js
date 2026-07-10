const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const CONTRACT_SCHEMA_VERSION = 'domain-body-analysis.contract.v1';
const DEFAULT_RUN_ID = 'not-observed';
const ACTIONLESS_FILE_FINDING = 'executable-file-name-missing-action-verb';
const MISSING_BODY_CONTRACT_FINDING = 'file-body-contract-missing';
const MISSING_SCENARIO_TIEOUT_FINDING = 'scenario-tieout-missing';
const DECOMPOSITION_RECOMMENDED_FINDING = 'decomposition-recommended';

function buildsDomainBodyAnalysisContract(config, sourceFiles, methods, provenance = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = config.rootDir || process.cwd();
  const runId = provenance.runId || DEFAULT_RUN_ID;
  const bodyContracts = loadsDeclaredBodyContracts(rootDir);
  const executableFiles = filtersExecutableSourceFiles(sourceFiles, methods);
  const analyzedFiles = [];

  for (const filePath of executableFiles) {
    analyzedFiles.push(buildsSourceFileAnalysis(config, rootDir, bodyContracts, filePath, methods));
  }

  return {
    schemaVersion: CONTRACT_SCHEMA_VERSION,
    runId,
    evidencePath: `evidence/runs/${runId}/domain-analysis/domain-body-analysis.contract.v1.json`,
    reportPath: `evidence/runs/${runId}/domain-analysis/domain-body-analysis.report.md`,
    summary: buildsDomainBodyAnalysisSummary(analyzedFiles),
    sourceFiles: analyzedFiles,
    findingCodes: collectsFindingCodes(analyzedFiles),
  };
}

function loadsDeclaredBodyContracts(rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const contractsPath = path.join(rootDir, 'contracts', 'file-system-bodies', '02_declared');
  const contracts = [];

  if (!fs.existsSync(contractsPath)) {
    return contracts;
  }

  const entries = fs.readdirSync(contractsPath, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) {
      continue;
    }

    const contractPath = path.join(contractsPath, entry.name);
    const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
    contracts.push({
      contractPath: formatsRepoRelativePath(rootDir, contractPath),
      featureId: contract.featureId || 'not declared',
      bodyId: contract.bodyId || 'not declared',
      requiredFiles: readsRequiredFileList(contract),
      ownedRuntimePaths: readsOwnedRuntimePaths(contract),
    });
  }

  return contracts;
}

function readsRequiredFileList(contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!contract.requiredPaths || !Array.isArray(contract.requiredPaths.files)) {
    return [];
  }

  return contract.requiredPaths.files;
}

function readsOwnedRuntimePaths(contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!contract.owns || !Array.isArray(contract.owns.runtime)) {
    return [];
  }

  return contract.owns.runtime;
}

function filtersExecutableSourceFiles(sourceFiles, methods) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const executableFilePaths = new Set();
  for (const method of methods) {
    executableFilePaths.add(method.filePath);
  }

  const executableFiles = [];
  for (const filePath of sourceFiles) {
    if (executableFilePaths.has(filePath)) {
      executableFiles.push(filePath);
    }
  }

  return executableFiles;
}

function buildsSourceFileAnalysis(config, rootDir, bodyContracts, filePath, methods) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const relativePath = formatsRepoRelativePath(rootDir, filePath);
  const fileMethods = selectsMethodsForFile(filePath, methods);
  const content = readsOptionalTextFile(filePath);
  const fileNameGrammar = classifiesFileNameGrammar(config, relativePath, fileMethods);
  const owningBodyContracts = resolvesOwningBodyContracts(relativePath, bodyContracts);
  const featureScenarioTieOut = buildsFeatureScenarioTieOut(content);
  const responsibilityClusters = buildsResponsibilityClusters(config, fileMethods);
  const decomposition = buildsDecompositionRecommendation(relativePath, fileMethods, fileNameGrammar, responsibilityClusters);
  const findingCodes = buildsAnalysisFindingCodes(fileNameGrammar, owningBodyContracts, featureScenarioTieOut, decomposition);

  return {
    filePath: relativePath,
    executableMethodCount: fileMethods.length,
    fileNameGrammar,
    owningBodyContracts,
    featureScenarioTieOut,
    responsibilityClusters,
    decomposition,
    findingCodes,
  };
}

function selectsMethodsForFile(filePath, methods) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const fileMethods = [];
  for (const method of methods) {
    if (method.filePath === filePath) {
      fileMethods.push(method);
    }
  }

  return fileMethods;
}

function readsOptionalTextFile(filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!fs.existsSync(filePath)) {
    return '';
  }

  return fs.readFileSync(filePath, 'utf8');
}

function classifiesFileNameGrammar(config, relativePath, fileMethods) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const tokens = extractsFileNameTokens(relativePath);
  const verbMatches = findsVerbMatches(config, tokens);
  let classification = 'non-executable';

  if (fileMethods.length > 0 && verbMatches.length === 0) {
    classification = 'noun-or-capability-label';
  } else if (fileMethods.length > 0 && verbMatches[0].index === 0) {
    classification = 'action-bearing';
  } else if (fileMethods.length > 0) {
    classification = 'action-bearing-with-late-verb';
  }

  return {
    stem: path.basename(relativePath, path.extname(relativePath)),
    tokens,
    classification,
    actionVerb: verbMatches.length === 0 ? 'missing' : verbMatches[0].verb,
    actionVerbPosition: verbMatches.length === 0 ? 'missing' : verbMatches[0].index,
  };
}

function extractsFileNameTokens(relativePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const stem = path.basename(relativePath, path.extname(relativePath));
  const rawTokens = stem.split(/[^a-zA-Z0-9]+/u);
  const tokens = [];

  for (const token of rawTokens) {
    if (token) {
      tokens.push(token.toLowerCase());
    }
  }

  return tokens;
}

function findsVerbMatches(config, tokens) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const verbs = buildsVerbSet(config);
  const matches = [];

  for (let index = 0; index < tokens.length; index += 1) {
    const verb = normalizesVerbToken(tokens[index], verbs);
    if (verb) {
      matches.push({ index, verb });
    }
  }

  return matches;
}

function buildsVerbSet(config) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const verbs = new Set();
  const configuredVerbs = config.domainContract && config.domainContract.domainVocabulary
    ? config.domainContract.domainVocabulary.verbs || []
    : [];

  for (const verb of configuredVerbs) {
    verbs.add(String(verb).toLowerCase());
  }

  return verbs;
}

function normalizesVerbToken(token, verbs) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (verbs.has(token)) {
    return token;
  }

  const candidates = [];
  if (token.endsWith('ies') && token.length > 3) {
    candidates.push(`${token.slice(0, -3)}y`);
  }
  if (token.endsWith('s') && token.length > 1) {
    candidates.push(token.slice(0, -1));
  }

  for (const candidate of candidates) {
    if (verbs.has(candidate)) {
      return candidate;
    }
  }

  return null;
}

function resolvesOwningBodyContracts(relativePath, bodyContracts) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const owners = [];
  for (const bodyContract of bodyContracts) {
    if (bodyContract.requiredFiles.includes(relativePath) || isOwnedByRuntimePath(relativePath, bodyContract.ownedRuntimePaths)) {
      owners.push({
        contractPath: bodyContract.contractPath,
        featureId: bodyContract.featureId,
        bodyId: bodyContract.bodyId,
      });
    }
  }

  return owners;
}

function isOwnedByRuntimePath(relativePath, runtimePaths) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  for (const runtimePath of runtimePaths) {
    const normalizedRuntimePath = String(runtimePath).replace(/\\/gu, '/');
    if (normalizedRuntimePath.endsWith('/') && relativePath.startsWith(normalizedRuntimePath)) {
      return true;
    }
    if (relativePath === normalizedRuntimePath) {
      return true;
    }
  }

  return false;
}

function buildsFeatureScenarioTieOut(content) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const featureIds = extractsUniqueMatches(content, /featureId['"]?\s*[:=]\s*['"]([^'"]+)['"]/gu);
  const scenarioIds = extractsUniqueMatches(content, /scenarioId['"]?\s*[:=]\s*['"]([^'"]+)['"]/gu);
  const acceptancePaths = extractsUniqueMatches(content, /docs\/features\/([A-Za-z0-9_.-]+\.feature\.md)/gu);
  let status = 'missing scenario tie-out';

  if (scenarioIds.length > 0) {
    status = 'scenario tied out';
  } else if (featureIds.length > 0 || acceptancePaths.length > 0) {
    status = 'feature tied out only';
  }

  return {
    status,
    featureIds,
    scenarioIds,
    acceptanceSourcePaths: formatsAcceptancePaths(acceptancePaths),
  };
}

function extractsUniqueMatches(content, pattern) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const values = [];
  const seen = new Set();
  let match = pattern.exec(content);

  while (match) {
    if (!seen.has(match[1])) {
      values.push(match[1]);
      seen.add(match[1]);
    }
    match = pattern.exec(content);
  }

  return values;
}

function formatsAcceptancePaths(acceptancePaths) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const formattedPaths = [];
  for (const acceptancePath of acceptancePaths) {
    formattedPaths.push(`docs/features/${acceptancePath}`);
  }

  return formattedPaths;
}

function buildsResponsibilityClusters(config, fileMethods) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const clustersByAction = new Map();

  for (const method of fileMethods) {
    const action = resolvesMethodAction(config, method.name);
    if (!clustersByAction.has(action)) {
      clustersByAction.set(action, { name: action, methodNames: [] });
    }
    clustersByAction.get(action).methodNames.push(method.name);
  }

  return Array.from(clustersByAction.values());
}

function resolvesMethodAction(config, methodName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const words = splitsMethodNameWords(methodName);
  const verbs = buildsVerbSet(config);

  for (const word of words) {
    const verb = normalizesVerbToken(word, verbs);
    if (verb) {
      return verb;
    }
  }

  return 'unclear-action';
}

function splitsMethodNameWords(methodName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const roughSegments = String(methodName || '').split(/[^a-zA-Z0-9]+/u);
  const words = [];

  for (const segment of roughSegments) {
    const camelSegments = segment.split(/(?<=[a-z0-9])(?=[A-Z])/u);
    for (const camelSegment of camelSegments) {
      if (camelSegment) {
        words.push(camelSegment.toLowerCase());
      }
    }
  }

  return words;
}

function buildsDecompositionRecommendation(relativePath, fileMethods, fileNameGrammar, responsibilityClusters) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const proposedFiles = buildsProposedBoundaryFiles(relativePath, fileMethods);
  const shouldRecommend = fileNameGrammar.classification === 'noun-or-capability-label'
    || responsibilityClusters.length > 1
    || fileMethods.length > 8;

  return {
    status: shouldRecommend ? 'decomposition recommended' : 'cohesive',
    reason: buildsDecompositionReason(fileNameGrammar, responsibilityClusters, fileMethods),
    proposedFiles: shouldRecommend ? proposedFiles : [],
  };
}

function buildsProposedBoundaryFiles(relativePath, fileMethods) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const proposedFiles = [];
  const baseDirectory = path.dirname(relativePath).replace(/\\/gu, '/');
  const seen = new Set();

  for (const method of fileMethods) {
    if (method.isAnonymous) {
      continue;
    }

    const slug = kebabCasesMethodName(method.name);
    if (seen.has(slug)) {
      continue;
    }

    proposedFiles.push({
      proposedFilePath: `${baseDirectory}/${slug}/${slug}.js`,
      reason: 'extract an action-bearing executable body around this method responsibility',
      sourceMethodNames: [method.name],
      contractActionRequired: 'declare the proposed file path in a file-system body contract before promotion',
    });
    seen.add(slug);
  }

  return proposedFiles;
}

function kebabCasesMethodName(methodName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return splitsMethodNameWords(methodName).join('-');
}

function buildsDecompositionReason(fileNameGrammar, responsibilityClusters, fileMethods) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (fileNameGrammar.classification === 'noun-or-capability-label') {
    return 'the executable file name is a noun or capability label instead of an action-bearing body';
  }

  if (responsibilityClusters.length > 1) {
    return 'the file contains multiple method-action responsibility clusters';
  }

  if (fileMethods.length > 8) {
    return 'the file has enough executable methods to require decomposition review';
  }

  return 'the file has one cohesive executable responsibility';
}

function buildsAnalysisFindingCodes(fileNameGrammar, owningBodyContracts, featureScenarioTieOut, decomposition) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const findingCodes = [];

  if (fileNameGrammar.classification === 'noun-or-capability-label') {
    findingCodes.push(ACTIONLESS_FILE_FINDING);
  }

  if (owningBodyContracts.length === 0) {
    findingCodes.push(MISSING_BODY_CONTRACT_FINDING);
  }

  if (featureScenarioTieOut.scenarioIds.length === 0) {
    findingCodes.push(MISSING_SCENARIO_TIEOUT_FINDING);
  }

  if (decomposition.status === 'decomposition recommended') {
    findingCodes.push(DECOMPOSITION_RECOMMENDED_FINDING);
  }

  return findingCodes;
}

function buildsDomainBodyAnalysisSummary(sourceFiles) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const summary = {
    totalExecutableFiles: sourceFiles.length,
    actionBearingExecutableFiles: 0,
    executableFileNamesMissingActionVerb: 0,
    filesMissingBodyContract: 0,
    filesMissingScenarioTieOut: 0,
    decompositionCandidates: 0,
    totalBlockers: 0,
  };

  for (const sourceFile of sourceFiles) {
    if (sourceFile.fileNameGrammar.classification === 'action-bearing') {
      summary.actionBearingExecutableFiles += 1;
    }
    if (sourceFile.findingCodes.includes(ACTIONLESS_FILE_FINDING)) {
      summary.executableFileNamesMissingActionVerb += 1;
    }
    if (sourceFile.findingCodes.includes(MISSING_BODY_CONTRACT_FINDING)) {
      summary.filesMissingBodyContract += 1;
    }
    if (sourceFile.findingCodes.includes(MISSING_SCENARIO_TIEOUT_FINDING)) {
      summary.filesMissingScenarioTieOut += 1;
    }
    if (sourceFile.findingCodes.includes(DECOMPOSITION_RECOMMENDED_FINDING)) {
      summary.decompositionCandidates += 1;
    }
    if (hasBlockingFinding(sourceFile.findingCodes)) {
      summary.totalBlockers += 1;
    }
  }

  return summary;
}

function hasBlockingFinding(findingCodes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return findingCodes.includes(ACTIONLESS_FILE_FINDING)
    || findingCodes.includes(MISSING_BODY_CONTRACT_FINDING)
    || findingCodes.includes(MISSING_SCENARIO_TIEOUT_FINDING);
}

function collectsFindingCodes(sourceFiles) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const findingCodes = new Set();
  for (const sourceFile of sourceFiles) {
    for (const findingCode of sourceFile.findingCodes) {
      findingCodes.add(findingCode);
    }
  }

  return Array.from(findingCodes).sort();
}

function formatsRepoRelativePath(rootDir, filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return path.relative(rootDir, filePath).replace(/\\/gu, '/');
}

module.exports = {
  ACTIONLESS_FILE_FINDING,
  CONTRACT_SCHEMA_VERSION,
  DECOMPOSITION_RECOMMENDED_FINDING,
  MISSING_BODY_CONTRACT_FINDING,
  MISSING_SCENARIO_TIEOUT_FINDING,
  buildsDomainBodyAnalysisContract,
};
