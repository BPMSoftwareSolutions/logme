const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { writesFeatureEvidenceIndex } = require('../src/writes-feature-evidence-index/writes-feature-evidence-index');

function buildsCatalog(runs) {
  return { schemaVersion: 'evidence-catalog.v1', generatedAt: new Date().toISOString(), runCount: runs.length, runs };
}

test('writesFeatureEvidenceIndex writes feature-evidence-index.v1.json to disk', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-feature-index-'));

  try {
    const run = {
      runId: 'run-1',
      lastModifiedAt: '2026-07-01T00:00:00.000Z',
      reportTruthStatus: 'tests pass, report truth gate passes',
      featureIds: ['feature-x'],
      scenarioIds: ['scenario-a'],
    };

    const { indexPath, index } = writesFeatureEvidenceIndex(tempDir, buildsCatalog([run]));

    assert.equal(fs.existsSync(indexPath), true);
    assert.equal(path.basename(indexPath), 'feature-evidence-index.v1.json');
    assert.equal(index.features[0].featureId, 'feature-x');

    const persisted = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    assert.equal(persisted.schemaVersion, 'feature-evidence-index.v1');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
