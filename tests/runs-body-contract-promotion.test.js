const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { runsBodyContractPromotion } = require('../src/runs-body-contract-promotion/runs-body-contract-promotion');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function seedsDeclaredContract(tempDir) {
  writesFile(
    path.join(tempDir, 'contracts/file-system-bodies/02_declared/logme.file-system-body.contract.v1.json'),
    JSON.stringify({
      requiredPaths: { files: ['README.md'], directories: [] },
      owns: { runtime: [] },
    }),
  );
}

function seedsBodyContractPatch(tempDir, runId) {
  writesFile(
    path.join(tempDir, 'quality/domain-remediation', runId, 'body-contract-patch.proposal.v1.json'),
    JSON.stringify({
      entries: [
        { bodyId: 'logme.example', path: 'src/example/example.js', bodyKind: 'product-domain body', actionVerb: 'build', responsibility: 'builds it', verification: 'declared', decompositionStatus: 'single-responsibility', findingCodes: [] },
      ],
    }),
  );
}

test('runsBodyContractPromotion performs a dry run by default and does not write the contract file', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-promote-contract-'));

  try {
    const runId = 'run-promote-1';
    seedsDeclaredContract(tempDir);
    seedsBodyContractPatch(tempDir, runId);

    const contractPath = path.join(tempDir, 'contracts/file-system-bodies/02_declared/logme.file-system-body.contract.v1.json');
    const before = fs.readFileSync(contractPath, 'utf8');

    const result = runsBodyContractPromotion({ rootDir: tempDir }, runId);

    assert.equal(result.written, false);
    assert.deepEqual(result.promotedPaths, ['src/example/example.js']);
    assert.equal(fs.readFileSync(contractPath, 'utf8'), before);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('runsBodyContractPromotion writes the updated contract file when write is true', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-promote-contract-'));

  try {
    const runId = 'run-promote-2';
    seedsDeclaredContract(tempDir);
    seedsBodyContractPatch(tempDir, runId);

    const contractPath = path.join(tempDir, 'contracts/file-system-bodies/02_declared/logme.file-system-body.contract.v1.json');

    const result = runsBodyContractPromotion({ rootDir: tempDir }, runId, { write: true });

    assert.equal(result.written, true);
    const written = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
    assert.ok(written.requiredPaths.files.includes('src/example/example.js'));
    assert.ok(written.owns.runtime.includes('src/example/example.js'));
    assert.equal(written.declaredBodies.length, 1);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
