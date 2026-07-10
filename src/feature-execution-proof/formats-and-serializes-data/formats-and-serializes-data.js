const { LogMe } = require('../../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../../packages/logme-testimony-core/src/sample-method');
const path = require('node:path');
const { NOT_OBSERVED } = require('../feature-execution-proof-shared-constants/feature-execution-proof-shared-constants');
const { buildsFeatureProofPath } = require('../manages-report-file-paths/manages-report-file-paths');

function escapesCsv(value) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const text = formatsValue(value);

  if (/[",\r\n]/u.test(text)) {
    return `"${text.replace(/"/gu, '""')}"`;
  }

  return text;
}

function formatsProofPathForReport(proof, rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return formatsRepoRelativePath(rootDir, proof.proofPath || buildsFeatureProofPath('evidence', proof.runId, proof.featureId, proof.scenarioId));
}

function formatsRepoRelativePath(rootDir, filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!filePath) {
    return NOT_OBSERVED;
  }

  if (!path.isAbsolute(filePath)) {
    return String(filePath).replace(/\\/gu, '/');
  }

  return path.relative(rootDir || process.cwd(), filePath).replace(/\\/gu, '/');
}

function formatsSourcePathWithLineRange(rootDir, filePath, lineRange) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const formattedPath = formatsRepoRelativePath(rootDir, filePath);

  if (!lineRange || lineRange.start === NOT_OBSERVED || lineRange.end === NOT_OBSERVED || String(formattedPath).match(/:\d+-\d+$/u)) {
    return formattedPath;
  }

  return `${formattedPath}:${lineRange.start}-${lineRange.end}`;
}

function formatsValue(value) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (value === undefined || value === null) {
    return NOT_OBSERVED;
  }

  if (Array.isArray(value)) {
    return value.length === 0 ? NOT_OBSERVED : value.join(', ');
  }

  return String(value);
}

function slugifies(value) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return String(value || 'unknown')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '') || 'unknown';
}

function projectsFeatureExecutionProofToCsv(proofs) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const proofList = Array.isArray(proofs) ? proofs : [proofs];
  const rows = [[
    'run id',
    'feature id',
    'scenario id',
    'node id',
    'node label',
    'runtime path',
    'call index',
    'timestamp',
    'duration ms',
    'elapsed since previous node ms',
    'status',
    'blocker code',
  ]];

  for (const proof of proofList) {
    for (const node of proof.observedExecutionTimeline) {
      if (node.calls.length === 0) {
        rows.push([proof.runId, proof.featureId, proof.scenarioId, node.nodeId, node.nodeLabel, node.runtimePath, 0, NOT_OBSERVED, NOT_OBSERVED, NOT_OBSERVED, node.status, node.blockerCodes[0] || NOT_OBSERVED]);
      }

      for (const call of node.calls) {
        rows.push([proof.runId, proof.featureId, proof.scenarioId, node.nodeId, node.nodeLabel, node.runtimePath, call.callIndex, call.timestamp, call.durationMs, call.elapsedSincePreviousNodeMs, call.status, node.blockerCodes[0] || NOT_OBSERVED]);
      }
    }
  }

  const renderedRows = [];

  for (const row of rows) {
    const escapedCells = [];

    for (const cell of row) {
      escapedCells.push(escapesCsv(cell));
    }

    renderedRows.push(escapedCells.join(','));
  }

  return `${renderedRows.join('\n')}\n`;
}

module.exports = { escapesCsv, formatsProofPathForReport, formatsRepoRelativePath, formatsSourcePathWithLineRange, formatsValue, slugifies, projectsFeatureExecutionProofToCsv };
