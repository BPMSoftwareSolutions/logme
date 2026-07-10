const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { writesAdversarialReviewEvidence } = require('../src/writes-adversarial-review-evidence/writes-adversarial-review-evidence');

test('writesAdversarialReviewEvidence writes a review report at quality/domain-remediation/<run-id>/review/<packet-id>.review.md', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-adversarial-review-'));

  try {
    const runId = 'run-review-write-1';
    const packetReview = {
      packetId: 'domain-remediation-scenario-tieout',
      objections: [{ risk: 'scenario mapping without evidence', affectedPath: 'src/a/a.js', severity: 'high', reasoning: 'no citation' }],
      highRiskObjectionCount: 1,
      promotionVerdict: 'BLOCKED',
    };

    const receipt = writesAdversarialReviewEvidence({ rootDir: tempDir }, runId, packetReview);

    const expectedPath = path.join(tempDir, 'quality', 'domain-remediation', runId, 'review', 'domain-remediation-scenario-tieout.review.md');
    assert.equal(receipt.reportPath, expectedPath);
    assert.ok(fs.existsSync(expectedPath));

    const content = fs.readFileSync(expectedPath, 'utf8');
    assert.match(content, /# Adversarial Review: domain-remediation-scenario-tieout/u);
    assert.match(content, /BLOCKED/u);
    assert.match(content, /scenario mapping without evidence/u);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
