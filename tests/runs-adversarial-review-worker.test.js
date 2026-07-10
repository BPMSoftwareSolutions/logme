const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { runsAdversarialReviewWorker } = require('../src/runs-adversarial-review-worker/runs-adversarial-review-worker');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

test('runsAdversarialReviewWorker reviews every present proposal artifact and writes one review file per packet', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-adversarial-review-orchestrator-'));

  try {
    const runId = 'run-adversarial-review-1';

    writesFile(
      path.join(tempDir, 'quality/domain-remediation', runId, 'scenario-tieout.proposal.v1.json'),
      JSON.stringify({ mappings: [{ filePath: 'src/a/a.js', evidenceCitation: null, findingCodes: ['scenario-tieout-unsupported'] }] }),
    );
    writesFile(
      path.join(tempDir, 'quality/domain-remediation', runId, 'body-contract-patch.proposal.v1.json'),
      JSON.stringify({ entries: [{ path: 'src/b/b.js', bodyKind: 'product-domain body', responsibility: 'builds b', verification: 'declared by worker' }] }),
    );
    // rename-plan.v1.json intentionally omitted to exercise the missing-artifact skip path

    const { packetReviews } = runsAdversarialReviewWorker({ rootDir: tempDir }, runId);

    assert.equal(packetReviews.length, 2);

    const scenarioReview = packetReviews.find((entry) => entry.packetReview.packetId === 'domain-remediation-scenario-tieout');
    assert.equal(scenarioReview.packetReview.promotionVerdict, 'BLOCKED');
    assert.ok(fs.existsSync(scenarioReview.receipt.reportPath));

    const contractReview = packetReviews.find((entry) => entry.packetReview.packetId === 'domain-remediation-body-contract');
    assert.equal(contractReview.packetReview.promotionVerdict, 'PROMOTABLE');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
