const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { writesDomainBodySprawlEvidence } = require('../src/writes-domain-body-sprawl-evidence/writes-domain-body-sprawl-evidence');

test('writesDomainBodySprawlEvidence writes the versioned sprawl JSON artifact under the run evidence directory', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-sprawl-evidence-'));

  try {
    const sprawlContract = {
      schemaVersion: 'domain-body-sprawl.contract.v1',
      evidencePath: 'evidence/runs/run-456/sprawl/domain-body-sprawl.contract.v1.json',
      reportPath: 'evidence/runs/run-456/sprawl/domain-body-sprawl.report.md',
      hotspotTablePath: 'evidence/runs/run-456/sprawl/domain-body-sprawl-hotspots.table.md',
      summary: {
        totalSourceFilesScanned: 1,
        focusedFiles: 0,
        watchlistFiles: 0,
        godFileCandidates: 0,
        packageExtractionCandidates: 1,
        mixedResponsibilityFiles: 0,
        orphanArtifacts: 0,
        topSprawlHotspots: [
          {
            filePath: 'src/domain/report.js',
            classification: 'package extraction candidate',
            lineCount: 42,
            executableMethodCount: 5,
            responsibilityClusterCount: 2,
            genericMechanicCount: 1,
            sterilityFindingCount: 0,
            blockerCount: 1,
            findingCodes: ['orphan-source-file'],
            fixRoute: 'declare the file in the body contract',
            recommendedOwnerAction: 'declare the file in the body contract',
          },
        ],
      },
      artifactFindings: [],
      sourceFiles: [
        {
          filePath: 'src/domain/report.js',
          packageOrDomainScope: 'domain body',
          lineCount: 42,
          byteCount: 1000,
          executableMethodCount: 5,
          exportedSymbolCount: 1,
          importedModuleCount: 2,
          localNestedFunctionCount: 0,
          responsibilityClusters: [{ name: 'report', signals: ['method:rendersReport'] }],
          sideEffectLanes: ['filesystem'],
          findingCodes: ['orphan-source-file'],
          fixRoute: 'declare the file in the body contract',
          classification: 'package extraction candidate',
        },
      ],
    };

    const receipt = writesDomainBodySprawlEvidence({ rootDir: tempDir }, sprawlContract);
    const expectedPath = path.join(tempDir, sprawlContract.evidencePath);
    const expectedReportPath = path.join(tempDir, sprawlContract.reportPath);
    const expectedHotspotTablePath = path.join(tempDir, sprawlContract.hotspotTablePath);

    assert.equal(receipt.evidencePath, expectedPath);
    assert.equal(receipt.reportPath, expectedReportPath);
    assert.equal(receipt.hotspotTablePath, expectedHotspotTablePath);
    assert.equal(fs.existsSync(expectedPath), true);
    assert.equal(fs.existsSync(expectedReportPath), true);
    assert.equal(fs.existsSync(expectedHotspotTablePath), true);
    assert.deepEqual(JSON.parse(fs.readFileSync(expectedPath, 'utf8')), sprawlContract);
    assert.match(fs.readFileSync(expectedReportPath, 'utf8'), /Canonical JSON evidence: evidence\/runs\/run-456\/sprawl\/domain-body-sprawl\.contract\.v1\.json/);
    assert.match(fs.readFileSync(expectedReportPath, 'utf8'), /## Executive Sprawl Summary/);
    assert.match(fs.readFileSync(expectedReportPath, 'utf8'), /## Dense File Inventory Appendix/);
    assert.match(fs.readFileSync(expectedHotspotTablePath, 'utf8'), /\| Rank \| File Path \| Classification \| Line Count \| Executable Method Count \| Responsibility Cluster Count \| Generic Mechanic Count \| Sterility Finding Count \| Blocker Count \| Recommended Owner Action \|/);
    assert.match(fs.readFileSync(expectedHotspotTablePath, 'utf8'), /src\/domain\/report\.js/);
    assert.equal(receipt.bytesWritten > 0, true);
    assert.equal(receipt.reportBytesWritten > 0, true);
    assert.equal(receipt.hotspotTableBytesWritten > 0, true);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
