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
      summary: { totalSourceFilesScanned: 1 },
      sourceFiles: [],
    };

    const receipt = writesDomainBodySprawlEvidence({ rootDir: tempDir }, sprawlContract);
    const expectedPath = path.join(tempDir, sprawlContract.evidencePath);

    assert.equal(receipt.evidencePath, expectedPath);
    assert.equal(fs.existsSync(expectedPath), true);
    assert.deepEqual(JSON.parse(fs.readFileSync(expectedPath, 'utf8')), sprawlContract);
    assert.equal(receipt.bytesWritten > 0, true);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
