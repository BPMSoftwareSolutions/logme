const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { appliesDomainSpecificMechanicAllowances, buildsDomainBodySprawlContract } = require('../src/builds-domain-body-sprawl-contract/builds-domain-body-sprawl-contract');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

test('buildsDomainBodySprawlContract inventories file responsibility signals and classifications', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-sprawl-'));

  try {
    writesFile(
      path.join(tempDir, 'contracts/file-system-bodies/02_declared/logme.file-system-body.contract.v1.json'),
      JSON.stringify({
        bodyId: 'logme.test-body',
        requiredPaths: {
          files: ['src/domain/report.js'],
          directories: [],
        },
      }),
    );
    writesFile(
      path.join(tempDir, 'src/domain/report.js'),
      [
        "const fs = require('node:fs');",
        "const path = require('node:path');",
        'function rendersReport() { return JSON.stringify({ ok: true }); }',
        'function validatesContract() { return path.join("a", "b"); }',
        'module.exports = { rendersReport, validatesContract };',
      ].join('\n'),
    );
    writesFile(path.join(tempDir, 'src/domain/orphan.js'), 'function detectsThing() { return true; }\nmodule.exports = { detectsThing };\n');

    const config = {
      rootDir: tempDir,
      sprawlThresholds: {
        maxLinesBeforeWatchlist: 2,
        maxExecutableMethodsBeforeWatchlist: 10,
        maxResponsibilityClustersBeforeGodFileCandidate: 1,
        maxGenericMechanicsBeforePackageExtractionCandidate: 0,
        maxSideEffectLanesBeforeOrchestratorReview: 3,
        authorizedDenseOrchestratorPaths: [],
      },
      domainContract: {
        domainVocabulary: {
          nouns: ['report', 'contract'],
          verbs: ['render', 'validate', 'detect'],
        },
      },
    };
    const reportPath = path.join(tempDir, 'src/domain/report.js');
    const orphanPath = path.join(tempDir, 'src/domain/orphan.js');
    const contract = buildsDomainBodySprawlContract(
      config,
      [reportPath, orphanPath],
      [
        { filePath: reportPath, name: 'rendersReport', kind: 'function-declaration' },
        { filePath: reportPath, name: 'validatesContract', kind: 'function-declaration' },
        { filePath: orphanPath, name: 'detectsThing', kind: 'function-declaration' },
      ],
      [],
      { runId: 'run-123' },
    );

    const reportEntry = contract.sourceFiles.find((entry) => entry.filePath === 'src/domain/report.js');
    assert.equal(contract.schemaVersion, 'domain-body-sprawl.contract.v1');
    assert.equal(contract.evidencePath, 'evidence/runs/run-123/sprawl/domain-body-sprawl.contract.v1.json');
    assert.equal(contract.reportPath, 'evidence/runs/run-123/sprawl/domain-body-sprawl.report.md');
    assert.equal(contract.hotspotTablePath, 'evidence/runs/run-123/sprawl/domain-body-sprawl-hotspots.table.md');
    assert.equal(reportEntry.lineCount, 5);
    assert.equal(reportEntry.executableMethodCount, 2);
    assert.equal(reportEntry.importedModuleCount, 2);
    assert.equal(reportEntry.exportedSymbolCount, 1);
    assert.ok(reportEntry.domainVocabularyTokens.includes('report'));
    assert.ok(reportEntry.genericMechanicCandidates.some((candidate) => candidate.mechanic === 'path joining or path normalization'));
    assert.ok(reportEntry.findingCodes.includes('package-worthy-mechanic-inside-domain-body'));
    assert.ok(reportEntry.findingCodes.includes('mixed-responsibility-file'));

    const orphanEntry = contract.sourceFiles.find((entry) => entry.filePath === 'src/domain/orphan.js');
    assert.ok(orphanEntry.findingCodes.includes('orphan-source-file'));
    assert.equal(contract.summary.totalSourceFilesScanned, 2);
    assert.equal(contract.summary.orphanArtifacts > 0, true);
    assert.equal(typeof contract.summary.topSprawlHotspots[0].sterilityFindingCount, 'number');
    assert.equal(typeof contract.summary.topSprawlHotspots[0].blockerCount, 'number');
    assert.equal(typeof contract.summary.topSprawlHotspots[0].recommendedOwnerAction, 'string');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('domain-specific mechanic allowances suppress only an exact documented mechanic match', () => {
  const result = appliesDomainSpecificMechanicAllowances({
    declaredBodies: [{
      path: 'src/plans-scan/plans-scan.js',
      domainSpecificMechanicAllowances: [{ mechanic: 'timestamp arithmetic', reason: 'scan duration is an acceptance metric' }],
    }],
  }, 'src/plans-scan/plans-scan.js', [
    { mechanic: 'timestamp arithmetic' },
    { mechanic: 'path joining or path normalization' },
  ]);

  assert.deepEqual(result.allowedMechanics, [{ mechanic: 'timestamp arithmetic', reason: 'scan duration is an acceptance metric' }]);
  assert.deepEqual(result.unallowedCandidates, [{ mechanic: 'path joining or path normalization' }]);
});
