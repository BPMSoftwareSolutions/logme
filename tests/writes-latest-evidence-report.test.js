const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { writesLatestEvidenceReport } = require('../src/writes-latest-evidence-report/writes-latest-evidence-report');

function buildsCatalog(runs) {
  return { schemaVersion: 'evidence-catalog.v1', generatedAt: new Date().toISOString(), runCount: runs.length, runs };
}

function buildsRun(overrides = {}) {
  return {
    runId: 'run-1',
    lastModifiedAt: '2026-01-01T00:00:00.000Z',
    reportVerdict: 'STERILE DOMAIN BODY',
    reportTruthStatus: 'tests pass, report truth gate passes',
    featureIds: [],
    scenarioIds: [],
    releaseCandidateIds: [],
    piIds: [],
    referencedBy: ['latest evidence report'],
    retentionClassification: 'protected-current',
    ...overrides,
  };
}

test('writesLatestEvidenceReport writes a markdown report linking to the latest report truth run', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-latest-'));

  try {
    const { reportPath, reportContent } = writesLatestEvidenceReport(tempDir, buildsCatalog([buildsRun()]));

    assert.equal(fs.existsSync(reportPath), true);
    assert.match(reportContent, /run-1/);
    assert.match(reportContent, /Latest Report Truth Run/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('writesLatestEvidenceReport links to the cleanup receipt when one exists', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-latest-'));

  try {
    fs.mkdirSync(path.join(tempDir, 'evidence/cleanup'), { recursive: true });
    fs.writeFileSync(path.join(tempDir, 'evidence/cleanup/evidence-cleanup.receipt.v1.json'), '{}', 'utf8');

    const { reportContent } = writesLatestEvidenceReport(tempDir, buildsCatalog([buildsRun()]));

    assert.match(reportContent, /evidence-cleanup\.receipt\.v1\.json/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('writesLatestEvidenceReport notes when there is no cleanup receipt yet', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-latest-'));

  try {
    const { reportContent } = writesLatestEvidenceReport(tempDir, buildsCatalog([buildsRun()]));

    assert.match(reportContent, /No cleanup has been executed yet/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
