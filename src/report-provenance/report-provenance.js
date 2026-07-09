const crypto = require('node:crypto');
const path = require('node:path');
const { execSync } = require('node:child_process');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const REPORT_SCHEMA_VERSION = 'report-provenance.v1';
const GENERATOR_NAME = 'LogMe domain audit';

function stableStringify(value) {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  const keys = Object.keys(value).sort();
  const entries = keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`);
  return `{${entries.join(',')}}`;
}

function sha256Hex(value) {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

function canonicalizeConfig(config) {
  return {
    configPath: config.configPath,
    rootDir: config.rootDir,
    reportPath: config.reportPath,
    includeExtensions: config.includeExtensions,
    excludeDirectories: config.excludeDirectories,
    excludeFiles: config.excludeFiles,
    includeTestFiles: config.includeTestFiles,
    stubMarker: config.stubMarker,
    forbiddenLocalUtilityNames: config.forbiddenLocalUtilityNames,
    forbiddenMethodNames: config.forbiddenMethodNames,
    domainContract: config.domainContract,
  };
}

function canonicalizeMethods(methods) {
  return methods.map((method) => ({
    scanOrder: method.scanOrder,
    executionStep: method.executionStep,
    name: method.name,
    kind: method.kind,
    hasLogMeCall: method.hasLogMeCall,
    isAnonymous: method.isAnonymous,
    isUnimplementedStub: method.isUnimplementedStub,
    filePath: method.filePath,
    lineStart: method.lineStart,
    lineEnd: method.lineEnd,
  }));
}

function computesConfigHash(config) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return sha256Hex(stableStringify(canonicalizeConfig(config)));
}

function computesSourceInventoryHash(sourceFiles, methods) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return sha256Hex(stableStringify({
    sourceFiles: [...sourceFiles].sort(),
    methods: canonicalizeMethods(methods),
  }));
}

function readsGitWorkingTreeMarker(repositoryRoot) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  try {
    const commitHash = execSync('git rev-parse HEAD', {
      cwd: repositoryRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const status = execSync('git status --porcelain', {
      cwd: repositoryRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();

    return status.length > 0
      ? `working-tree:${commitHash}-dirty`
      : `commit:${commitHash}`;
  } catch {
    return 'working-tree:unavailable';
  }
}

function formatsCommandLine(argv) {
  return argv
    .map((segment) => {
      if (segment.length === 0) {
        return '""';
      }

      if (/[\s"]/u.test(segment)) {
        return `"${segment.replace(/"/gu, '\\"')}"`;
      }

      return segment;
    })
    .join(' ');
}

function buildsReportProvenance(config, sourceFiles, methods, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const generationTimestamp = options.generationTimestamp || new Date().toISOString();
  const generationCommand = options.generationCommand || formatsCommandLine(process.argv);
  const gitWorkingTreeMarker = options.gitWorkingTreeMarker || readsGitWorkingTreeMarker(config.rootDir);
  const configHash = computesConfigHash(config);
  const sourceInventoryHash = computesSourceInventoryHash(sourceFiles, methods);
  const evidenceDirectory = options.evidenceDirectory || path.resolve(config.rootDir, 'evidence');

  const runId = options.runId || sha256Hex(stableStringify({
    reportSchemaVersion: REPORT_SCHEMA_VERSION,
    generatorName: GENERATOR_NAME,
    generationTimestamp,
    generationCommand,
    gitWorkingTreeMarker,
    configHash,
    sourceInventoryHash,
    configPath: config.configPath,
    evidenceDirectory,
  }));

  return {
    reportSchemaVersion: REPORT_SCHEMA_VERSION,
    generatorName: GENERATOR_NAME,
    generationTimestamp,
    generationCommand,
    gitWorkingTreeMarker,
    configPath: config.configPath,
    configHash,
    sourceInventoryHash,
    runId,
    evidenceDirectory,
  };
}

function readsReportProvenance(reportContent) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const provenanceBlock = reportContent.match(/## Provenance\s+([\s\S]*?)\n## /u);

  if (!provenanceBlock) {
    return null;
  }

  const lines = provenanceBlock[1].trim().split('\n').map((line) => line.trim()).filter(Boolean);
  const fields = {};

  for (const line of lines) {
    const match = line.match(/^-\s+([^:]+):\s+(.*)$/u);
    if (match) {
      fields[match[1]] = match[2];
    }
  }

  return {
    reportSchemaVersion: fields['Report schema version'],
    generatorName: fields['Generator name'],
    generationTimestamp: fields['Generation timestamp'],
    generationCommand: fields['Generation command'],
    gitWorkingTreeMarker: fields['Git commit or working tree marker'],
    configPath: fields['Config path'],
    configHash: fields['Config hash'],
    sourceInventoryHash: fields['Source inventory hash'],
    runId: fields['Run id'],
    evidenceDirectory: fields['Evidence directory'],
  };
}

function checksReportTruthGate(reportContent, currentSourceInventoryHash) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const provenance = readsReportProvenance(reportContent);

  if (!provenance) {
    return {
      verdict: 'BLOCKED',
      findings: [
        {
          code: 'stale-report-projection',
          reason: 'report provenance is missing, so the projection cannot be trusted',
        },
        {
          code: 'report-source-hash-mismatch',
          reason: 'the report source hash could not be verified against the current inventory',
        },
      ],
    };
  }

  if (provenance.sourceInventoryHash !== currentSourceInventoryHash) {
    return {
      verdict: 'BLOCKED',
      findings: [
        {
          code: 'stale-report-projection',
          reason: 'the rendered report inventory hash does not match the current inventory',
        },
        {
          code: 'report-source-hash-mismatch',
          reason: 'the report source inventory hash differs from the current source inventory hash',
        },
      ],
      provenance,
    };
  }

  return {
    verdict: 'PASS',
    findings: [],
    provenance,
  };
}

module.exports = {
  REPORT_SCHEMA_VERSION,
  GENERATOR_NAME,
  buildsReportProvenance,
  checksReportTruthGate,
  computesConfigHash,
  computesSourceInventoryHash,
  readsGitWorkingTreeMarker,
  readsReportProvenance,
};
