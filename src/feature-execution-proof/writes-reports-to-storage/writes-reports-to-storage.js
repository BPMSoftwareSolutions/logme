const { LogMe } = require('../../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../../packages/logme-testimony-core/src/sample-method');
const fs = require('node:fs');
const path = require('node:path');
const { buildsFeatureProofPath, buildsScenarioMethodEvidenceReportPath, buildsScenarioMethodTimelineTablePath, buildsScenarioProofReportPath, buildsScenarioTimingTablePath } = require('../manages-report-file-paths/manages-report-file-paths');
const { rendersScenarioProofReport } = require('../renders-scenario-proof-report/renders-scenario-proof-report');
const { rendersMethodCallEvidenceReport, rendersScenarioMethodTimelineTable, rendersScenarioTimingTable } = require('../renders-supplementary-reports-and-tables/renders-supplementary-reports-and-tables');

function writesFeatureExecutionProof(proof, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const evidenceRoot = options.evidenceRoot || path.join(process.cwd(), 'evidence');
  const proofPath = options.proofPath || buildsFeatureProofPath(evidenceRoot, proof.runId, proof.featureId, proof.scenarioId);
  const proofWithPath = {
    ...proof,
    proofPath,
  };

  fs.mkdirSync(path.dirname(proofPath), { recursive: true });
  fs.writeFileSync(proofPath, `${JSON.stringify(proofWithPath, null, 2)}\n`, 'utf8');

  return {
    proofPath,
    bytesWritten: Buffer.byteLength(JSON.stringify(proofWithPath, null, 2), 'utf8') + 1,
    proof: proofWithPath,
  };
}

function writesMethodCallEvidenceReport(proof, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const evidenceRoot = options.evidenceRoot || path.join(rootDir, 'evidence');
  const reportPath = options.reportPath || buildsScenarioMethodEvidenceReportPath(evidenceRoot, proof.runId, proof.featureId, proof.scenarioId);
  const reportContent = rendersMethodCallEvidenceReport(proof, rootDir);

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, reportContent.endsWith('\n') ? reportContent : `${reportContent}\n`, 'utf8');

  return {
    reportPath,
    reportContent: reportContent.endsWith('\n') ? reportContent : `${reportContent}\n`,
    bytesWritten: Buffer.byteLength(reportContent, 'utf8'),
  };
}

function writesScenarioMethodTimelineTable(proof, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const evidenceRoot = options.evidenceRoot || path.join(rootDir, 'evidence');
  const tablePath = options.tablePath || buildsScenarioMethodTimelineTablePath(evidenceRoot, proof.runId, proof.featureId, proof.scenarioId);
  const tableContent = [
    `# Method Execution Timeline: ${proof.scenarioName}`,
    '',
    rendersScenarioMethodTimelineTable(proof, rootDir),
    '',
  ].join('\n');

  fs.mkdirSync(path.dirname(tablePath), { recursive: true });
  fs.writeFileSync(tablePath, tableContent, 'utf8');

  return {
    tablePath,
    tableContent,
    bytesWritten: Buffer.byteLength(tableContent, 'utf8'),
  };
}

function writesScenarioProofReport(proof, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const evidenceRoot = options.evidenceRoot || path.join(rootDir, 'evidence');
  const reportPath = options.reportPath || buildsScenarioProofReportPath(evidenceRoot, proof.runId, proof.featureId, proof.scenarioId);
  const reportContent = rendersScenarioProofReport(proof, {
    ...options,
    reportPath,
    evidenceRoot,
    rootDir,
  });

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${reportContent}\n`, 'utf8');

  return {
    reportPath,
    reportContent: `${reportContent}\n`,
    bytesWritten: Buffer.byteLength(`${reportContent}\n`, 'utf8'),
  };
}

function writesScenarioTimingTable(proof, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const evidenceRoot = options.evidenceRoot || path.join(rootDir, 'evidence');
  const tablePath = options.tablePath || buildsScenarioTimingTablePath(evidenceRoot, proof.runId, proof.featureId, proof.scenarioId);
  const tableContent = [
    `# Execution Timeline: ${proof.scenarioName}`,
    '',
    rendersScenarioTimingTable(proof, rootDir),
    '',
  ].join('\n');

  fs.mkdirSync(path.dirname(tablePath), { recursive: true });
  fs.writeFileSync(tablePath, tableContent, 'utf8');

  return {
    tablePath,
    tableContent,
    bytesWritten: Buffer.byteLength(tableContent, 'utf8'),
  };
}

module.exports = { writesFeatureExecutionProof, writesMethodCallEvidenceReport, writesScenarioMethodTimelineTable, writesScenarioProofReport, writesScenarioTimingTable };
