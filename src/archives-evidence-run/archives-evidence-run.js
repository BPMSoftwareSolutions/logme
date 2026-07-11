const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const ARCHIVE_MANIFEST_SCHEMA_VERSION = 'archive-manifest.v1';
const ZIP_COMPRESSION_METHOD_DEFLATE = 8;

function archivesEvidenceRun(rootDir, runId, approvalId, now = new Date()) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const sourceDir = path.join(rootDir, 'evidence', 'runs', runId);
  const year = String((now instanceof Date ? now : new Date(now)).getUTCFullYear());
  const archiveDir = path.join(rootDir, 'evidence', 'archive', year);
  const archivePath = path.join(archiveDir, `${runId}.zip`);
  const manifestPath = path.join(archiveDir, `${runId}.archive-manifest.v1.json`);
  const fileEntries = readsRunArtifacts(sourceDir);
  const manifest = buildsArchiveManifest(rootDir, runId, sourceDir, archivePath, fileEntries, approvalId, now);
  manifest.manifestPath = path.relative(rootDir, manifestPath).split(path.sep).join('/');
  const zipEntries = buildsZipEntriesWithManifest(manifest, fileEntries);

  fs.mkdirSync(archiveDir, { recursive: true });
  fs.writeFileSync(archivePath, buildsZipArchive(zipEntries, now));

  manifest.compressedByteSize = fs.statSync(archivePath).size;
  manifest.compressionRatio = calculatesCompressionRatio(manifest.byteSize, manifest.compressedByteSize);
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  verifiesCompressedArchiveWasWritten(archivePath, manifestPath);
  fs.rmSync(sourceDir, { recursive: true, force: true });

  return { archivePath, manifestPath, manifest };
}

function readsRunArtifacts(sourceDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const fileEntries = [];

  function descendsIntoDirectory(currentSourceDir) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    for (const entry of fs.readdirSync(currentSourceDir, { withFileTypes: true })) {
      const sourcePath = path.join(currentSourceDir, entry.name);

      if (entry.isDirectory()) {
        descendsIntoDirectory(sourcePath);
        continue;
      }

      const contentHash = hashesFileContent(sourcePath);
      const byteSize = fs.statSync(sourcePath).size;
      const archiveEntryPath = path.relative(sourceDir, sourcePath).split(path.sep).join('/');
      fileEntries.push({
        sourcePath,
        archiveEntryPath,
        byteSize,
        contentHash,
        content: fs.readFileSync(sourcePath),
      });
    }
  }

  descendsIntoDirectory(sourceDir);
  return fileEntries;
}

function hashesFileContent(filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function buildsZipEntriesWithManifest(manifest, fileEntries) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    ...fileEntries.map(buildsZipEntryFromRunArtifact),
    {
      archiveEntryPath: 'archive-manifest.v1.json',
      content: Buffer.from(`${JSON.stringify({ ...manifest, compressedByteSize: null, compressionRatio: null }, null, 2)}\n`, 'utf8'),
    },
  ];
}

function buildsZipEntryFromRunArtifact(fileEntry) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    archiveEntryPath: fileEntry.archiveEntryPath,
    content: fileEntry.content,
  };
}

function buildsZipArchive(entries, now) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const localFileParts = [];
  const centralDirectoryParts = [];
  let offset = 0;

  for (const entry of entries) {
    const zipEntry = buildsZipEntry(entry, now, offset);
    localFileParts.push(zipEntry.localFileRecord);
    centralDirectoryParts.push(zipEntry.centralDirectoryRecord);
    offset += zipEntry.localFileRecord.length;
  }

  const centralDirectory = Buffer.concat(centralDirectoryParts);
  const endOfCentralDirectory = buildsEndOfCentralDirectory(entries.length, centralDirectory.length, offset);

  return Buffer.concat([...localFileParts, centralDirectory, endOfCentralDirectory]);
}

function buildsZipEntry(entry, now, localHeaderOffset) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const fileName = Buffer.from(entry.archiveEntryPath, 'utf8');
  const content = Buffer.isBuffer(entry.content) ? entry.content : Buffer.from(entry.content);
  const compressedContent = zlib.deflateRawSync(content);
  const crc32 = calculatesCrc32(content);
  const dosDateTime = convertsDateToDosDateTime(now);
  const localFileHeader = Buffer.alloc(30);

  localFileHeader.writeUInt32LE(0x04034b50, 0);
  localFileHeader.writeUInt16LE(20, 4);
  localFileHeader.writeUInt16LE(0, 6);
  localFileHeader.writeUInt16LE(ZIP_COMPRESSION_METHOD_DEFLATE, 8);
  localFileHeader.writeUInt16LE(dosDateTime.time, 10);
  localFileHeader.writeUInt16LE(dosDateTime.date, 12);
  localFileHeader.writeUInt32LE(crc32, 14);
  localFileHeader.writeUInt32LE(compressedContent.length, 18);
  localFileHeader.writeUInt32LE(content.length, 22);
  localFileHeader.writeUInt16LE(fileName.length, 26);
  localFileHeader.writeUInt16LE(0, 28);

  const localFileRecord = Buffer.concat([localFileHeader, fileName, compressedContent]);
  const centralDirectoryHeader = Buffer.alloc(46);

  centralDirectoryHeader.writeUInt32LE(0x02014b50, 0);
  centralDirectoryHeader.writeUInt16LE(20, 4);
  centralDirectoryHeader.writeUInt16LE(20, 6);
  centralDirectoryHeader.writeUInt16LE(0, 8);
  centralDirectoryHeader.writeUInt16LE(ZIP_COMPRESSION_METHOD_DEFLATE, 10);
  centralDirectoryHeader.writeUInt16LE(dosDateTime.time, 12);
  centralDirectoryHeader.writeUInt16LE(dosDateTime.date, 14);
  centralDirectoryHeader.writeUInt32LE(crc32, 16);
  centralDirectoryHeader.writeUInt32LE(compressedContent.length, 20);
  centralDirectoryHeader.writeUInt32LE(content.length, 24);
  centralDirectoryHeader.writeUInt16LE(fileName.length, 28);
  centralDirectoryHeader.writeUInt16LE(0, 30);
  centralDirectoryHeader.writeUInt16LE(0, 32);
  centralDirectoryHeader.writeUInt16LE(0, 34);
  centralDirectoryHeader.writeUInt16LE(0, 36);
  centralDirectoryHeader.writeUInt32LE(0, 38);
  centralDirectoryHeader.writeUInt32LE(localHeaderOffset, 42);

  return {
    localFileRecord,
    centralDirectoryRecord: Buffer.concat([centralDirectoryHeader, fileName]),
  };
}

function buildsEndOfCentralDirectory(entryCount, centralDirectoryByteSize, centralDirectoryOffset) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const endOfCentralDirectory = Buffer.alloc(22);

  endOfCentralDirectory.writeUInt32LE(0x06054b50, 0);
  endOfCentralDirectory.writeUInt16LE(0, 4);
  endOfCentralDirectory.writeUInt16LE(0, 6);
  endOfCentralDirectory.writeUInt16LE(entryCount, 8);
  endOfCentralDirectory.writeUInt16LE(entryCount, 10);
  endOfCentralDirectory.writeUInt32LE(centralDirectoryByteSize, 12);
  endOfCentralDirectory.writeUInt32LE(centralDirectoryOffset, 16);
  endOfCentralDirectory.writeUInt16LE(0, 20);

  return endOfCentralDirectory;
}

function convertsDateToDosDateTime(now) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const date = now instanceof Date ? now : new Date(now);
  const year = Math.max(date.getUTCFullYear(), 1980);

  return {
    time: (date.getUTCHours() << 11) | (date.getUTCMinutes() << 5) | Math.floor(date.getUTCSeconds() / 2),
    date: ((year - 1980) << 9) | ((date.getUTCMonth() + 1) << 5) | date.getUTCDate(),
  };
}

function calculatesCrc32(content) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let crc = 0xffffffff;
  for (const byte of content) {
    crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ byte) & 0xff];
  }

  return (crc ^ 0xffffffff) >>> 0;
}

const CRC32_TABLE = buildsCrc32Table();

function buildsCrc32Table() {
  const table = [];

  for (let index = 0; index < 256; index += 1) {
    let crc = index;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
    table[index] = crc >>> 0;
  }

  return table;
}

function buildsArchiveManifest(rootDir, runId, sourceDir, archivePath, fileEntries, approvalId, now) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    schemaVersion: ARCHIVE_MANIFEST_SCHEMA_VERSION,
    runId,
    archivedAt: (now instanceof Date ? now : new Date(now)).toISOString(),
    sourcePath: path.relative(rootDir, sourceDir).split(path.sep).join('/'),
    destinationPath: path.relative(rootDir, archivePath).split(path.sep).join('/'),
    archivePath: path.relative(rootDir, archivePath).split(path.sep).join('/'),
    compressionFormat: 'zip',
    artifactCount: fileEntries.length,
    byteSize: sumsFileEntryByteSizes(fileEntries),
    uncompressedByteSize: sumsFileEntryByteSizes(fileEntries),
    compressedByteSize: null,
    compressionRatio: null,
    contentHashes: fileEntries.map(buildsContentHashEntry(rootDir)),
    cleanupApprovalId: approvalId,
  };
}

function calculatesCompressionRatio(uncompressedByteSize, compressedByteSize) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (uncompressedByteSize === 0) {
    return 0;
  }

  return Number((compressedByteSize / uncompressedByteSize).toFixed(4));
}

function verifiesCompressedArchiveWasWritten(archivePath, manifestPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!fs.existsSync(archivePath) || fs.statSync(archivePath).size === 0) {
    throw new Error(`compressed archive was not written: ${archivePath}`);
  }

  if (!fs.existsSync(manifestPath) || fs.statSync(manifestPath).size === 0) {
    throw new Error(`archive manifest was not written: ${manifestPath}`);
  }
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
      archiveEntryPath: entry.archiveEntryPath,
      contentHash: entry.contentHash,
    };
  }

  return mapsFileEntryToContentHash;
}

module.exports = {
  ARCHIVE_MANIFEST_SCHEMA_VERSION,
  archivesEvidenceRun,
};
