const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { pinsEvidenceRun, readsEvidencePins, isPinExpired, readsActivePinnedRunIds } = require('../src/pins-evidence-run/pins-evidence-run');

test('pinsEvidenceRun writes a pin record with the required fields', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-pin-'));

  try {
    const { pinPath, pin } = pinsEvidenceRun(tempDir, {
      runId: 'run-1',
      pinnedBy: 'product-owner@example.com',
      reason: 'reference evidence for Q3 retro',
      relatedFeatureIds: ['llm-evidence-curation-and-cleanup'],
      relatedPiIds: ['pi-42'],
    });

    assert.equal(pin.runId, 'run-1');
    assert.equal(pin.pinnedBy, 'product-owner@example.com');
    assert.ok(pin.pinnedAt);
    assert.equal(pin.reason, 'reference evidence for Q3 retro');
    assert.deepEqual(pin.relatedFeatureIds, ['llm-evidence-curation-and-cleanup']);
    assert.deepEqual(pin.relatedPiIds, ['pi-42']);
    assert.equal(fs.existsSync(path.join(tempDir, pinPath)), true);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('readsEvidencePins reads back all written pins', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-pin-'));

  try {
    pinsEvidenceRun(tempDir, { runId: 'run-1', pinnedBy: 'po', reason: 'keep' });
    pinsEvidenceRun(tempDir, { runId: 'run-2', pinnedBy: 'po', reason: 'keep' });

    const pins = readsEvidencePins(tempDir);

    assert.equal(pins.length, 2);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('isPinExpired returns true once now passes the expiry condition', () => {
  const pin = { expiryCondition: '2026-01-01T00:00:00.000Z' };

  assert.equal(isPinExpired(pin, new Date('2025-12-31T00:00:00.000Z')), false);
  assert.equal(isPinExpired(pin, new Date('2026-02-01T00:00:00.000Z')), true);
});

test('readsActivePinnedRunIds excludes expired pins', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-pin-'));

  try {
    pinsEvidenceRun(tempDir, { runId: 'run-active', pinnedBy: 'po', reason: 'keep' });
    pinsEvidenceRun(tempDir, { runId: 'run-expired', pinnedBy: 'po', reason: 'keep', expiryCondition: '2020-01-01T00:00:00.000Z' });

    const activeRunIds = readsActivePinnedRunIds(tempDir, new Date('2026-07-10T00:00:00.000Z'));

    assert.equal(activeRunIds.has('run-active'), true);
    assert.equal(activeRunIds.has('run-expired'), false);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
