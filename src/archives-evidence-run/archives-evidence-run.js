const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const ARCHIVE_MANIFEST_SCHEMA_VERSION = 'archive-manifest.v1';

function archivesEvidenceRun(rootDir, runId, approvalId, now = new Date()) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const sourceDir = path.join(rootDir, 'evidence', 'runs', runId);
  const year = String((now instanceof Date ? now : new Date(now)).getUTCFullYear());
  const destinationDir = path.join(rootDir, 'evidence', 'archive', year, runId);

  const fileEntries = movesRunArtifacts(sourceDir, destinationDir);
  const manifest = buildsArchiveManifest(rootDir, runId, sourceDir, destinationDir, fileEntries, approvalId, now);
  const manifestPath = path.join(destinationDir, 'archive-manifest.v1.json');

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  removesEmptySourceDirectory(sourceDir);

  return { manifestPath, manifest };
}

function movesRunArtifacts(sourceDir, destinationDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  fs.mkdirSync(destinationDir, { recursive: true });
  const fileEntries = [];

  function descendsIntoDirectory(currentSourceDir, currentDestinationDir) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    fs.mkdirSync(currentDestinationDir, { recursive: true });

    for (const entry of fs.readdirSync(currentSourceDir, { withFileTypes: true })) {
      const sourcePath = path.join(currentSourceDir, entry.name);
      const destinationPath = path.join(currentDestinationDir, entry.name);

      if (entry.isDirectory()) {
        descendsIntoDirectory(sourcePath, destinationPath);
        continue;
      }

      const contentHash = hashesFileContent(sourcePath);
      const byteSize = fs.statSync(sourcePath).size;
      fs.renameSync(sourcePath, destinationPath);
      fileEntries.push({ sourcePath, destinationPath, byteSize, contentHash });
    }
  }

  descendsIntoDirectory(sourceDir, destinationDir);
  return fileEntries;
}

function hashesFileContent(filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function removesEmptySourceDirectory(sourceDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  removesEmptyDirectoriesRecursively(sourceDir);
}

function removesEmptyDirectoriesRecursively(currentDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!fs.existsSync(currentDir)) {
    return;
  }

  for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      removesEmptyDirectoriesRecursively(path.join(currentDir, entry.name));
    }
  }

  if (fs.readdirSync(currentDir).length === 0) {
    fs.rmdirSync(currentDir);
  }
}

function buildsArchiveManifest(rootDir, runId, sourceDir, destinationDir, fileEntries, approvalId, now) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    schemaVersion: ARCHIVE_MANIFEST_SCHEMA_VERSION,
    runId,
    archivedAt: (now instanceof Date ? now : new Date(now)).toISOString(),
    sourcePath: path.relative(rootDir, sourceDir).split(path.sep).join('/'),
    destinationPath: path.relative(rootDir, destinationDir).split(path.sep).join('/'),
    artifactCount: fileEntries.length,
    byteSize: sumsFileEntryByteSizes(fileEntries),
    contentHashes: fileEntries.map(buildsContentHashEntry(rootDir)),
    cleanupApprovalId: approvalId,
  };
}

function sumsFileEntryByteSizes(fileEntries) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let totalByteSize = 0;
  for (const entry of fileEntries) {
    totalByteSize += entry.byteSize;
  }

  return totalByteSize;
}

function buildsContentHashEntry(rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  function mapsFileEntryToContentHash(entry) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return {
      destinationPath: path.relative(rootDir, entry.destinationPath).split(path.sep).join('/'),
      contentHash: entry.contentHash,
    };
  }

  return mapsFileEntryToContentHash;
}

module.exports = {
  ARCHIVE_MANIFEST_SCHEMA_VERSION,
  archivesEvidenceRun,
};
