const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  ACTIONLESS_FILE_FINDING,
  DECOMPOSITION_RECOMMENDED_FINDING,
  MISSING_BODY_CONTRACT_FINDING,
  MISSING_SCENARIO_TIEOUT_FINDING,
  buildsDomainBodyAnalysisContract,
} = require('../src/builds-domain-body-analysis-contract/builds-domain-body-analysis-contract');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function buildsTestConfig(rootDir) {
  return {
    rootDir,
    domainContract: {
      domainVocabulary: {
        nouns: ['body', 'contract', 'feature', 'scenario', 'session', 'report'],
        verbs: ['build', 'validate', 'render', 'write'],
      },
    },
  };
}

test('buildsDomainBodyAnalysisContract flags noun executable files and recommends action-bearing decomposition', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-domain-analysis-'));

  try {
    writesFile(
      path.join(tempDir, 'contracts/file-system-bodies/02_declared/logme.file-system-body.contract.v1.json'),
      JSON.stringify({
        featureId: 'logme',
        bodyId: 'logme.domain-analysis-test',
        requiredPaths: {
          files: ['src/builds-session-report/builds-session-report.js'],
        },
        owns: {
          runtime: ['src/builds-session-report/'],
        },
      }),
    );

    const nounFile = path.join(tempDir, 'src/session.js');
    const declaredFile = path.join(tempDir, 'src/builds-session-report/builds-session-report.js');

    writesFile(nounFile, [
      'function buildsSessionAssignment() { return true; }',
      'function validatesSessionSeed() { return true; }',
      'function rendersSessionReport() { return true; }',
      'module.exports = { buildsSessionAssignment, validatesSessionSeed, rendersSessionReport };',
    ].join('\n'));

    writesFile(declaredFile, [
      "const featureId = 'llm-domain-body-analysis-and-tie-out';",
      "const scenarioId = 'tie-file-bodies-to-features-and-scenarios';",
      'function buildsSessionReport() { return true; }',
      'module.exports = { buildsSessionReport };',
    ].join('\n'));

    const contract = buildsDomainBodyAnalysisContract(
      buildsTestConfig(tempDir),
      [nounFile, declaredFile],
      [
        { filePath: nounFile, name: 'buildsSessionAssignment', isAnonymous: false },
        { filePath: nounFile, name: 'validatesSessionSeed', isAnonymous: false },
        { filePath: nounFile, name: 'rendersSessionReport', isAnonymous: false },
        { filePath: declaredFile, name: 'buildsSessionReport', isAnonymous: false },
      ],
      { runId: 'run-domain-analysis-1' },
    );

    const nounEntry = contract.sourceFiles.find((sourceFile) => sourceFile.filePath === 'src/session.js');
    const declaredEntry = contract.sourceFiles.find((sourceFile) => sourceFile.filePath === 'src/builds-session-report/builds-session-report.js');

    assert.equal(contract.schemaVersion, 'domain-body-analysis.contract.v1');
    assert.equal(contract.evidencePath, 'evidence/runs/run-domain-analysis-1/domain-analysis/domain-body-analysis.contract.v1.json');
    assert.equal(contract.summary.totalExecutableFiles, 2);
    assert.equal(contract.summary.executableFileNamesMissingActionVerb, 1);
    assert.equal(contract.summary.filesMissingBodyContract, 1);
    assert.equal(contract.summary.filesMissingScenarioTieOut, 1);
    assert.equal(contract.summary.decompositionCandidates, 1);
    assert.ok(contract.findingCodes.includes(ACTIONLESS_FILE_FINDING));

    assert.equal(nounEntry.fileNameGrammar.classification, 'noun-or-capability-label');
    assert.ok(nounEntry.findingCodes.includes(ACTIONLESS_FILE_FINDING));
    assert.ok(nounEntry.findingCodes.includes(MISSING_BODY_CONTRACT_FINDING));
    assert.ok(nounEntry.findingCodes.includes(MISSING_SCENARIO_TIEOUT_FINDING));
    assert.ok(nounEntry.findingCodes.includes(DECOMPOSITION_RECOMMENDED_FINDING));
    assert.equal(nounEntry.decomposition.status, 'decomposition recommended');
    assert.deepEqual(
      nounEntry.decomposition.proposedFiles.map((proposedFile) => proposedFile.proposedFilePath),
      [
        'src/builds-session-assignment/builds-session-assignment.js',
        'src/validates-session-seed/validates-session-seed.js',
        'src/renders-session-report/renders-session-report.js',
      ],
    );

    assert.equal(declaredEntry.fileNameGrammar.classification, 'action-bearing');
    assert.equal(declaredEntry.owningBodyContracts.length, 1);
    assert.equal(declaredEntry.featureScenarioTieOut.status, 'scenario tied out');
    assert.deepEqual(declaredEntry.findingCodes, []);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('buildsDomainBodyAnalysisContract recognizes directory ownership from body contracts', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-domain-analysis-'));

  try {
    writesFile(
      path.join(tempDir, 'contracts/file-system-bodies/02_declared/logme.file-system-body.contract.v1.json'),
      JSON.stringify({
        featureId: 'logme',
        bodyId: 'logme.runtime-directory-owner',
        requiredPaths: {
          files: [],
        },
        owns: {
          runtime: ['src/renders-owned-report/'],
        },
      }),
    );

    const ownedFile = path.join(tempDir, 'src/renders-owned-report/renders-owned-report.js');
    writesFile(ownedFile, [
      "const featureId = 'owned-report';",
      "const scenarioId = 'render-owned-report';",
      'function rendersOwnedReport() { return true; }',
      'module.exports = { rendersOwnedReport };',
    ].join('\n'));

    const contract = buildsDomainBodyAnalysisContract(
      buildsTestConfig(tempDir),
      [ownedFile],
      [{ filePath: ownedFile, name: 'rendersOwnedReport', isAnonymous: false }],
      { runId: 'run-domain-analysis-2' },
    );

    assert.equal(contract.sourceFiles[0].owningBodyContracts[0].bodyId, 'logme.runtime-directory-owner');
    assert.equal(contract.sourceFiles[0].findingCodes.includes(MISSING_BODY_CONTRACT_FINDING), false);
    assert.equal(contract.summary.totalBlockers, 0);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
