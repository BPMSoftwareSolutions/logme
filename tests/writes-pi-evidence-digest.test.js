const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { writesPiEvidenceDigest } = require('../src/writes-pi-evidence-digest/writes-pi-evidence-digest');

test('writesPiEvidenceDigest writes the PI digest report so a product owner does not need to open raw run folders', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-pi-digest-'));

  try {
    const featureIndex = { features: [], unownedEvidence: { classification: 'unowned evidence', runIds: [] } };
    const catalog = { runs: [] };

    const { reportPath, reportContent } = writesPiEvidenceDigest(tempDir, 'pi-42', featureIndex, catalog);

    assert.equal(fs.existsSync(reportPath), true);
    assert.match(reportPath, /pi[\\/]pi-42[\\/]pi-evidence-digest\.report\.md$/);
    assert.match(reportContent, /PI Evidence Digest: pi-42/);
    assert.match(reportContent, /does not need to inspect every raw run folder manually/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
