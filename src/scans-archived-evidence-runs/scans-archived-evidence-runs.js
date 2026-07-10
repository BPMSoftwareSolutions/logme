const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const YEAR_DIRECTORY_PATTERN = /^[0-9]{4}$/u;
const RUN_ID_PATTERN = /^[A-Za-z0-9._-]+$/u;

function scansArchivedEvidenceRuns(rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const archiveDir = path.join(rootDir, 'evidence', 'archive');
  const archivedRuns = [];

  for (const yearDir of listsArchiveYearDirectories(archiveDir)) {
    for (const runId of listsArchivedRunIds(path.join(archiveDir, yearDir))) {
      archivedRuns.push(scansSingleArchivedRun(rootDir, archiveDir, yearDir, runId));
    }
  }

  return archivedRuns.sort(comparesArchivedRunsByRunId);
}

function listsArchiveYearDirectories(archiveDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!fs.existsSync(archiveDir)) {
    return [];
  }

  const yearDirs = [];
  for (const entry of fs.readdirSync(archiveDir, { withFileTypes: true })) {
    if (entry.isDirectory() && YEAR_DIRECTORY_PATTERN.test(entry.name)) {
      yearDirs.push(entry.name);
    }
  }

  return yearDirs.sort(comparesStringsAlphabetically);
}

function listsArchivedRunIds(yearDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const runIds = [];
  for (const entry of fs.readdirSync(yearDir, { withFileTypes: true })) {
    if (entry.isDirectory() && RUN_ID_PATTERN.test(entry.name)) {
      runIds.push(entry.name);
    }
  }

  return runIds.sort(comparesStringsAlphabetically);
}

function comparesStringsAlphabetically(left, right) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return left.localeCompare(right);
}

function comparesArchivedRunsByRunId(left, right) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return left.runId.localeCompare(right.runId);
}

function scansSingleArchivedRun(rootDir, archiveDir, yearDir, runId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const runDir = path.join(archiveDir, yearDir, runId);
  const manifest = readsArchiveManifest(runDir);
  const artifactPaths = walksArchivedRunArtifactPaths(runDir);
  const totalByteSize = manifest ? manifest.byteSize : sumsArtifactByteSizes(artifactPaths);

  return {
    runId,
    year: yearDir,
    runDir: path.relative(rootDir, runDir).split(path.sep).join('/'),
    archivedAt: manifest ? manifest.archivedAt : null,
    cleanupApprovalId: manifest ? manifest.cleanupApprovalId : null,
    artifactCount: manifest ? manifest.artifactCount : artifactPaths.length,
    totalByteSize,
    hasManifest: manifest !== null,
  };
}

function readsArchiveManifest(runDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const manifestPath = path.join(runDir, 'archive-manifest.v1.json');

  if (!fs.existsSync(manifestPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch {
    return null;
  }
}

function walksArchivedRunArtifactPaths(runDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const artifactPaths = [];

  function descendsIntoDirectory(currentDir) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        descendsIntoDirectory(fullPath);
        continue;
      }

      artifactPaths.push(fullPath);
    }
  }

  descendsIntoDirectory(runDir);
  return artifactPaths;
}

function sumsArtifactByteSizes(artifactPaths) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let totalByteSize = 0;
  for (const artifactPath of artifactPaths) {
    totalByteSize += fs.statSync(artifactPath).size;
  }

  return totalByteSize;
}

module.exports = {
  scansArchivedEvidenceRuns,
};
