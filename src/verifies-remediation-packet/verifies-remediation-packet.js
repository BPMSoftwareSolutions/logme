const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const VERIFICATION_REPORT_SCHEMA_VERSION = 'verification.report.v1';
const DEFAULT_COMMAND_TIMEOUT_MS = 600000;
const CAPTURED_OUTPUT_TAIL_BYTES = 8192;

function verifiesRemediationPacket(config, packet, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const runCommand = options.runCommand || runsShellCommand;
  const commandResults = [];

  for (const command of packet.verificationCommands || []) {
    commandResults.push(runCommand(command, config.rootDir, options.timeoutMs || DEFAULT_COMMAND_TIMEOUT_MS));
  }

  const testResults = summarizesTestResults(commandResults);
  const unresolvedRisks = collectsUnresolvedRisks(commandResults, options.beforeMetrics, options.afterMetrics);
  const promotionDecision = decidesPromotion(commandResults, unresolvedRisks);

  return {
    schemaVersion: VERIFICATION_REPORT_SCHEMA_VERSION,
    packetId: packet.packetId,
    commandsRun: commandResults,
    testResults,
    beforeMetrics: options.beforeMetrics || null,
    afterMetrics: options.afterMetrics || null,
    changedFiles: options.changedFiles || [],
    unresolvedRisks,
    promotionDecision,
  };
}

function runsShellCommand(command, cwd, timeoutMs) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const captureFiles = createsCaptureFiles();

  try {
    const commandParts = command.split(' ');
    const spawnResult = spawnSync(commandParts[0], commandParts.slice(1), {
      cwd,
      timeout: timeoutMs,
      shell: true,
      stdio: ['ignore', captureFiles.stdoutFd, captureFiles.stderrFd],
    });

    return {
      command,
      exitCode: spawnResult.status,
      timedOut: Boolean(spawnResult.error && spawnResult.error.code === 'ETIMEDOUT'),
      spawnError: spawnResult.error ? spawnResult.error.code : null,
      stdout: readsCaptureTail(captureFiles.stdoutPath),
      stderr: readsCaptureTail(captureFiles.stderrPath),
    };
  } finally {
    closesAndRemovesCaptureFiles(captureFiles);
  }
}

function createsCaptureFiles() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const capturePrefix = path.join(os.tmpdir(), `logme-verify-${crypto.randomBytes(8).toString('hex')}`);
  const stdoutPath = `${capturePrefix}.stdout.log`;
  const stderrPath = `${capturePrefix}.stderr.log`;

  return {
    stdoutPath,
    stderrPath,
    stdoutFd: fs.openSync(stdoutPath, 'w'),
    stderrFd: fs.openSync(stderrPath, 'w'),
  };
}

function readsCaptureTail(capturePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const content = fs.readFileSync(capturePath, 'utf8');
  return content.length > CAPTURED_OUTPUT_TAIL_BYTES ? content.slice(-CAPTURED_OUTPUT_TAIL_BYTES) : content;
}

function closesAndRemovesCaptureFiles(captureFiles) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  fs.closeSync(captureFiles.stdoutFd);
  fs.closeSync(captureFiles.stderrFd);
  fs.rmSync(captureFiles.stdoutPath, { force: true });
  fs.rmSync(captureFiles.stderrPath, { force: true });
}

function summarizesTestResults(commandResults) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const testCommandResult = findsTestCommandResult(commandResults);
  if (!testCommandResult) {
    return { ran: false, passed: null, summary: 'no test command was included in this packet verification' };
  }

  if (testCommandResult.spawnError) {
    return { ran: true, passed: false, summary: `the test command failed to spawn: ${testCommandResult.spawnError}` };
  }

  return {
    ran: true,
    passed: testCommandResult.exitCode === 0,
    summary: testCommandResult.exitCode === 0 ? 'tests passed' : `tests failed with exit code ${testCommandResult.exitCode}`,
  };
}

function findsTestCommandResult(commandResults) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  for (const commandResult of commandResults) {
    if (commandResult.command.includes('test')) {
      return commandResult;
    }
  }

  return null;
}

function collectsUnresolvedRisks(commandResults, beforeMetrics, afterMetrics) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const risks = [];

  for (const commandResult of commandResults) {
    if (commandResult.spawnError) {
      risks.push(`command "${commandResult.command}" failed to spawn: ${commandResult.spawnError}`);
      continue;
    }

    if (commandResult.exitCode !== 0) {
      risks.push(`command "${commandResult.command}" exited with code ${commandResult.exitCode}`);
    }

    if (commandResult.timedOut) {
      risks.push(`command "${commandResult.command}" timed out`);
    }
  }

  if (!afterMetrics) {
    risks.push('after metrics were not supplied; domain analysis and sprawl were not regenerated for this verification');
  } else if (beforeMetrics) {
    risks.push(...collectsNonImprovingMetricRisks(beforeMetrics, afterMetrics));
  }

  return risks;
}

function collectsNonImprovingMetricRisks(beforeMetrics, afterMetrics) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const risks = [];
  for (const metricName of Object.keys(beforeMetrics)) {
    if (!(metricName in afterMetrics)) {
      continue;
    }

    if (afterMetrics[metricName] > beforeMetrics[metricName]) {
      risks.push(`metric "${metricName}" got worse: ${beforeMetrics[metricName]} -> ${afterMetrics[metricName]}`);
    }
  }

  return risks;
}

function decidesPromotion(commandResults, unresolvedRisks) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  for (const commandResult of commandResults) {
    if (commandResult.exitCode !== 0 || commandResult.timedOut) {
      return 'BLOCKED';
    }
  }

  const blockingRisks = [];
  for (const risk of unresolvedRisks) {
    if (risk.includes('got worse')) {
      blockingRisks.push(risk);
    }
  }

  return blockingRisks.length === 0 ? 'PROMOTABLE' : 'BLOCKED';
}

module.exports = {
  VERIFICATION_REPORT_SCHEMA_VERSION,
  verifiesRemediationPacket,
};
