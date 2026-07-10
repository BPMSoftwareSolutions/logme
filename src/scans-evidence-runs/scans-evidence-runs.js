const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const RUN_ID_PATTERN = /^[A-Za-z0-9._-]+$/u;

function scansEvidenceRuns(rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const runsDir = path.join(rootDir, 'evidence', 'runs');
  const runIds = listsEvidenceRunIds(runsDir);
  const runs = [];

  for (const runId of runIds) {
    runs.push(scansSingleEvidenceRun(rootDir, runsDir, runId));
  }

  return runs;
}

function listsEvidenceRunIds(runsDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!fs.existsSync(runsDir)) {
    return [];
  }

  const runIds = [];
  for (const entry of fs.readdirSync(runsDir, { withFileTypes: true })) {
    if (entry.isDirectory() && RUN_ID_PATTERN.test(entry.name)) {
      runIds.push(entry.name);
    }
  }

  return runIds.sort(comparesRunIdsAlphabetically);
}

function comparesRunIdsAlphabetically(left, right) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return left.localeCompare(right);
}

function scansSingleEvidenceRun(rootDir, runsDir, runId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const runDir = path.join(runsDir, runId);
  const artifactPaths = walksRunArtifactPaths(runDir);
  const timestamps = readsRunTimestamps(runDir, artifactPaths);
  const totalByteSize = sumsArtifactByteSizes(artifactPaths);
  const reportVerdict = readsReportVerdict(runDir, artifactPaths);
  const reportTruthStatus = readsReportTruthStatus(runDir, artifactPaths);

  return {
    runId,
    runDir: path.relative(rootDir, runDir).split(path.sep).join('/'),
    createdAt: timestamps.createdAt,
    lastModifiedAt: timestamps.lastModifiedAt,
    totalByteSize,
    artifactCount: artifactPaths.length,
    reportVerdict,
    reportTruthStatus,
    artifactPaths: relativizesArtifactPaths(rootDir, artifactPaths),
  };
}

function relativizesArtifactPaths(rootDir, artifactPaths) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const relativePaths = [];
  for (const artifactPath of artifactPaths) {
    relativePaths.push(path.relative(rootDir, artifactPath).split(path.sep).join('/'));
  }

  return relativePaths;
}

function walksRunArtifactPaths(runDir) {
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
  return artifactPaths.sort(comparesRunIdsAlphabetically);
}

function readsRunTimestamps(runDir, artifactPaths) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const paths = artifactPaths.length > 0 ? artifactPaths : [runDir];
  let createdAt = null;
  let lastModifiedAt = null;

  for (const artifactPath of paths) {
    const stats = fs.statSync(artifactPath);
    const birthTimeIso = stats.birthtime.toISOString();
    const modifiedTimeIso = stats.mtime.toISOString();

    if (createdAt === null || birthTimeIso < createdAt) {
      createdAt = birthTimeIso;
    }

    if (lastModifiedAt === null || modifiedTimeIso > lastModifiedAt) {
      lastModifiedAt = modifiedTimeIso;
    }
  }

  return { createdAt, lastModifiedAt };
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

function readsReportVerdict(runDir, artifactPaths) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const receiptPath = artifactPaths.find(isSterilityReceiptPath);
  if (receiptPath) {
    const receipt = readsJsonArtifactSafely(receiptPath);
    if (receipt && receipt.verdict) {
      return receipt.verdict;
    }
  }

  return readsDomainAnalysisVerdict(artifactPaths);
}

function isSterilityReceiptPath(artifactPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return artifactPath.endsWith('domain-body-sterility.receipt.v1.json');
}

function readsDomainAnalysisVerdict(artifactPaths) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const analysisPath = artifactPaths.find(isDomainAnalysisContractPath);
  if (!analysisPath) {
    return null;
  }

  const analysis = readsJsonArtifactSafely(analysisPath);
  if (!analysis || !analysis.summary || typeof analysis.summary.totalBlockers !== 'number') {
    return null;
  }

  return analysis.summary.totalBlockers === 0 ? 'domain analysis clean' : `domain analysis has ${analysis.summary.totalBlockers} blocker(s)`;
}

function isDomainAnalysisContractPath(artifactPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return artifactPath.endsWith('domain-body-analysis.contract.v1.json');
}

function readsReportTruthStatus(runDir, artifactPaths) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const truthPath = artifactPaths.find(isReportTruthPath);
  if (!truthPath) {
    return null;
  }

  const truth = readsJsonArtifactSafely(truthPath);
  return truth && truth.reportVerdict ? truth.reportVerdict : null;
}

function isReportTruthPath(artifactPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return artifactPath.endsWith('report-truth.v1.json');
}

function readsJsonArtifactSafely(artifactPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  try {
    return JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  } catch {
    return null;
  }
}

module.exports = {
  scansEvidenceRuns,
};
