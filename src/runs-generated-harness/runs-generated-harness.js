const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const DEFAULT_TIMEOUT_MS = 30000;

function detectsTimeout(spawnResult) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return Boolean(spawnResult.error && spawnResult.error.code === 'ETIMEDOUT') || spawnResult.signal === 'SIGTERM';
}

function runsGeneratedHarness(materializationResult, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;
  const startedAt = new Date().toISOString();

  const spawnResult = spawnSync(process.execPath, [materializationResult.entryFilePath], {
    cwd: path.dirname(materializationResult.entryFilePath),
    timeout: timeoutMs,
    env: { ...process.env, ...options.env, LOGME_AUDIT: '1' },
    encoding: 'utf8',
  });

  return {
    harnessId: materializationResult.harnessId,
    exitCode: spawnResult.status,
    timedOut: detectsTimeout(spawnResult),
    stdout: spawnResult.stdout || '',
    stderr: spawnResult.stderr || '',
    startedAt,
    finishedAt: new Date().toISOString(),
    entryFilePath: materializationResult.entryFilePath,
  };
}

module.exports = { runsGeneratedHarness };
