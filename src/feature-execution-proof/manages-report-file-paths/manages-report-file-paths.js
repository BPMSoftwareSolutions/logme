const { LogMe } = require('../../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../../packages/logme-testimony-core/src/sample-method');
const path = require('node:path');

function buildsFeatureProofPath(evidenceRoot, runId, featureId, scenarioId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return path.join(
    evidenceRoot,
    'runs',
    runId,
    'features',
    featureId,
    'scenarios',
    scenarioId,
    'feature-execution.contract.v1.json',
  );
}

function buildsScenarioMethodEvidenceReportPath(evidenceRoot, runId, featureId, scenarioId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return path.join(
    evidenceRoot,
    'runs',
    runId,
    'features',
    featureId,
    'scenarios',
    scenarioId,
    'method-call-evidence.report.md',
  );
}

function buildsScenarioMethodTimelineTablePath(evidenceRoot, runId, featureId, scenarioId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return path.join(
    evidenceRoot,
    'runs',
    runId,
    'features',
    featureId,
    'scenarios',
    scenarioId,
    'method-execution-timeline.table.md',
  );
}

function buildsScenarioProofReportPath(evidenceRoot, runId, featureId, scenarioId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return path.join(
    evidenceRoot,
    'runs',
    runId,
    'features',
    featureId,
    'scenarios',
    scenarioId,
    'executable-body-contract.report.md',
  );
}

function buildsScenarioTimingTablePath(evidenceRoot, runId, featureId, scenarioId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return path.join(
    evidenceRoot,
    'runs',
    runId,
    'features',
    featureId,
    'scenarios',
    scenarioId,
    'execution-timeline.table.md',
  );
}

module.exports = { buildsFeatureProofPath, buildsScenarioMethodEvidenceReportPath, buildsScenarioMethodTimelineTablePath, buildsScenarioProofReportPath, buildsScenarioTimingTablePath };
