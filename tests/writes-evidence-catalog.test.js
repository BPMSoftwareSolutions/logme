const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { writesEvidenceCatalog, extractsEvidenceIds } = require('../src/writes-evidence-catalog/writes-evidence-catalog');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

test('extractsEvidenceIds pulls feature, scenario, release-candidate, and PI ids out of artifact paths', () => {
  const ids = extractsEvidenceIds([
    'evidence/runs/run-1/features/llm-evidence-curation-and-cleanup/scenarios/pin-evidence/proof.json',
    'quality/end-user-test-bundles/rc-7/qa-run-3/manifest.json',
    'evidence/index/pi/pi-42/pi-evidence-digest.report.md',
  ]);

  assert.deepEqual(ids.featureIds, ['llm-evidence-curation-and-cleanup']);
  assert.deepEqual(ids.scenarioIds, ['pin-evidence']);
  assert.deepEqual(ids.releaseCandidateIds, ['rc-7']);
  assert.deepEqual(ids.piIds, ['pi-42']);
});

test('writesEvidenceCatalog writes the catalog JSON and report without deleting run artifacts', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-catalog-'));

  try {
    writesFile(path.join(tempDir, 'evidence/runs/run-1/report-truth.v1.json'), JSON.stringify({ reportVerdict: 'tests pass, report truth gate passes' }));

    const { catalogPath, reportPath, catalog } = writesEvidenceCatalog(tempDir);

    assert.equal(fs.existsSync(catalogPath), true);
    assert.equal(fs.existsSync(reportPath), true);
    assert.equal(fs.existsSync(path.join(tempDir, 'evidence/runs/run-1/report-truth.v1.json')), true);
    assert.equal(catalog.runCount, 1);
    assert.equal(catalog.runs[0].runId, 'run-1');
    assert.ok(catalog.runs[0].retentionClassification);

    const persisted = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    assert.equal(persisted.schemaVersion, 'evidence-catalog.v1');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('writesEvidenceCatalog marks a run referenced by a manual pin as protected-pinned', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-catalog-'));

  try {
    writesFile(path.join(tempDir, 'evidence/runs/run-1/notes.md'), '# notes\n');
    writesFile(path.join(tempDir, 'evidence/index/pins/run-1.pin.v1.json'), JSON.stringify({ runId: 'run-1', reason: 'keep' }));

    const { catalog } = writesEvidenceCatalog(tempDir);

    assert.equal(catalog.runs[0].retentionClassification, 'protected-pinned');
    assert.deepEqual(catalog.runs[0].referencedBy, ['manual pin']);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
