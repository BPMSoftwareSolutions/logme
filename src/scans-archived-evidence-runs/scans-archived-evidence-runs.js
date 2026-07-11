const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const YEAR_DIRECTORY_PATTERN = /^[0-9]{4}$/u;
const RUN_ID_PATTERN = /^[A-Za-z0-9._-]+$/u;
const ZIP_ARCHIVE_PATTERN = /^(.+)\.zip$/u;

function scansArchivedEvidenceRuns(rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const archiveDir = path.join(rootDir, 'evidence', 'archive');
  const archivedRuns = [];

  for (const yearDir of listsArchiveYearDirectories(archiveDir)) {
    for (const archivedRunRef of listsArchivedRunRefs(path.join(archiveDir, yearDir))) {
      archivedRuns.push(scansSingleArchivedRun(rootDir, archiveDir, yearDir, archivedRunRef));
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

function listsArchivedRunRefs(yearDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const runRefs = [];
  for (const entry of fs.readdirSync(yearDir, { withFileTypes: true })) {
    if (entry.isDirectory() && RUN_ID_PATTERN.test(entry.name)) {
      runRefs.push({ kind: 'folder', runId: entry.name });
      continue;
    }

    if (entry.isFile() && ZIP_ARCHIVE_PATTERN.test(entry.name)) {
      const match = entry.name.match(ZIP_ARCHIVE_PATTERN);
      if (match && RUN_ID_PATTERN.test(match[1])) {
        runRefs.push({ kind: 'zip', runId: match[1] });
      }
    }
  }

  return runRefs.sort(comparesArchivedRunRefs);
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

function comparesArchivedRunRefs(left, right) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return left.runId.localeCompare(right.runId) || left.kind.localeCompare(right.kind);
}

function scansSingleArchivedRun(rootDir, archiveDir, yearDir, archivedRunRef) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (archivedRunRef.kind === 'zip') {
    return scansZippedArchivedRun(rootDir, archiveDir, yearDir, archivedRunRef.runId);
  }

  return scansFolderArchivedRun(rootDir, archiveDir, yearDir, archivedRunRef.runId);
}

function scansZippedArchivedRun(rootDir, archiveDir, yearDir, runId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const zipPath = path.join(archiveDir, yearDir, `${runId}.zip`);
  const manifest = readsArchiveManifest(path.join(archiveDir, yearDir, `${runId}.archive-manifest.v1.json`));
  const zipByteSize = fs.statSync(zipPath).size;

  return {
    runId,
    year: yearDir,
    archiveKind: 'zip',
    archivePath: path.relative(rootDir, zipPath).split(path.sep).join('/'),
    runDir: null,
    archivedAt: manifest ? manifest.archivedAt : null,
    cleanupApprovalId: manifest ? manifest.cleanupApprovalId : null,
    artifactCount: manifest ? manifest.artifactCount : 1,
    totalByteSize: manifest ? manifest.byteSize : zipByteSize,
    compressedByteSize: manifest ? manifest.compressedByteSize : zipByteSize,
    compressionRatio: manifest ? manifest.compressionRatio : null,
    hasManifest: manifest !== null,
  };
}

function scansFolderArchivedRun(rootDir, archiveDir, yearDir, runId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const runDir = path.join(archiveDir, yearDir, runId);
  const manifest = readsArchiveManifest(path.join(runDir, 'archive-manifest.v1.json'));
  const artifactPaths = walksArchivedRunArtifactPaths(runDir);
  const totalByteSize = manifest ? manifest.byteSize : sumsArtifactByteSizes(artifactPaths);

  return {
    runId,
    year: yearDir,
    archiveKind: 'folder',
    archivePath: path.relative(rootDir, runDir).split(path.sep).join('/'),
    runDir: path.relative(rootDir, runDir).split(path.sep).join('/'),
    archivedAt: manifest ? manifest.archivedAt : null,
    cleanupApprovalId: manifest ? manifest.cleanupApprovalId : null,
    artifactCount: manifest ? manifest.artifactCount : artifactPaths.length,
    totalByteSize,
    compressedByteSize: null,
    compressionRatio: null,
    hasManifest: manifest !== null,
  };
}

function readsArchiveManifest(manifestPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

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
