const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { scansArchivedEvidenceRuns } = require('../scans-archived-evidence-runs/scans-archived-evidence-runs');
const { writesArchivePurgePlan } = require('../writes-archive-purge-plan/writes-archive-purge-plan');
const { readsActivePinnedRunIds } = require('../pins-evidence-run/pins-evidence-run');

function runsArchivePurgeWorker(rootDir, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const archivedRuns = scansArchivedEvidenceRuns(rootDir);
  const referenceContext = buildsArchiveReferenceContext(rootDir, options);
  const { planPath, reportPath, plan, planHash } = writesArchivePurgePlan(rootDir, archivedRuns, referenceContext);

  return { archivedRuns, planPath, reportPath, plan, planHash };
}

function buildsArchiveReferenceContext(rootDir, options) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    manualPinRunIds: options.manualPinRunIds || readsActivePinnedRunIds(rootDir),
    now: options.now || new Date(),
    archiveRetentionWindowMilliseconds: options.archiveRetentionWindowMilliseconds,
  };
}

module.exports = {
  runsArchivePurgeWorker,
};
