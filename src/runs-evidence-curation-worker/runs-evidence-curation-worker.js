const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { writesEvidenceCatalog } = require('../writes-evidence-catalog/writes-evidence-catalog');
const { writesLatestEvidenceReport } = require('../writes-latest-evidence-report/writes-latest-evidence-report');
const { writesFeatureEvidenceIndex } = require('../writes-feature-evidence-index/writes-feature-evidence-index');
const { writesEvidenceCleanupPlan } = require('../writes-evidence-cleanup-plan/writes-evidence-cleanup-plan');
const { detectsNoisyEvidenceRuns } = require('../detects-noisy-evidence-runs/detects-noisy-evidence-runs');
const { selectsLatestMeaningfulEvidence } = require('../selects-latest-meaningful-evidence/selects-latest-meaningful-evidence');
const { gatesEvidenceSprawlBudget } = require('../gates-evidence-sprawl-budget/gates-evidence-sprawl-budget');

function runsEvidenceCurationWorker(rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const { catalog } = writesEvidenceCatalog(rootDir);
  const { reportPath: latestEvidenceReportPath, selection } = writesLatestEvidenceReport(rootDir, catalog);
  const { index: featureIndex, indexPath: featureIndexPath } = writesFeatureEvidenceIndex(rootDir, catalog);
  const { plan: cleanupPlan, planHash, planPath } = writesEvidenceCleanupPlan(rootDir, catalog);
  const noisyFindings = detectsNoisyEvidenceRuns(catalog.runs, buildsTieOutContext(featureIndex, selection));
  const receiptExists = fs.existsSync(path.join(rootDir, 'evidence', 'cleanup', 'evidence-cleanup.receipt.v1.json'));
  const sprawlGateResult = gatesEvidenceSprawlBudget(catalog, selection, cleanupPlan, receiptExists);

  return {
    catalog,
    latestEvidenceReportPath,
    selection,
    featureIndex,
    featureIndexPath,
    cleanupPlan,
    planHash,
    planPath,
    noisyFindings,
    sprawlGateResult,
  };
}

function buildsTieOutContext(featureIndex, selection) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const featureIndexedRunIds = new Set();
  for (const feature of featureIndex.features) {
    for (const runId of feature.latestEvidenceRunIds) {
      featureIndexedRunIds.add(runId);
    }
  }

  return {
    featureIndexedRunIds,
    piDigestRunIds: new Set(),
    latestEvidenceRunIds: new Set(Object.values(selection.latestQaBundleByFeature)),
  };
}

module.exports = {
  runsEvidenceCurationWorker,
};
