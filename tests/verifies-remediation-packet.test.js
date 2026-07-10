const test = require('node:test');
const assert = require('node:assert/strict');

const { verifiesRemediationPacket } = require('../src/verifies-remediation-packet/verifies-remediation-packet');

function buildsPacket(overrides = {}) {
  return {
    packetId: 'domain-remediation-scenario-tieout',
    verificationCommands: ['npm test', 'npm run report:truth:fast'],
    ...overrides,
  };
}

test('verifiesRemediationPacket runs every verification command and reports PROMOTABLE when all pass', () => {
  const calledCommands = [];
  function fakeRunCommand(command) {
    calledCommands.push(command);
    return { command, exitCode: 0, timedOut: false, stdout: 'ok', stderr: '' };
  }

  const report = verifiesRemediationPacket({ rootDir: '/repo' }, buildsPacket(), { runCommand: fakeRunCommand, afterMetrics: { filesMissingBodyContract: 0 } });

  assert.deepEqual(calledCommands, ['npm test', 'npm run report:truth:fast']);
  assert.equal(report.commandsRun.length, 2);
  assert.equal(report.testResults.ran, true);
  assert.equal(report.testResults.passed, true);
  assert.equal(report.promotionDecision, 'PROMOTABLE');
});

test('verifiesRemediationPacket blocks promotion when a verification command fails', () => {
  function fakeRunCommand(command) {
    if (command === 'npm test') {
      return { command, exitCode: 1, timedOut: false, stdout: '', stderr: 'test failed' };
    }

    return { command, exitCode: 0, timedOut: false, stdout: '', stderr: '' };
  }

  const report = verifiesRemediationPacket({ rootDir: '/repo' }, buildsPacket(), { runCommand: fakeRunCommand });

  assert.equal(report.testResults.passed, false);
  assert.equal(report.promotionDecision, 'BLOCKED');
  assert.ok(report.unresolvedRisks.some((risk) => risk.includes('npm test')));
});

test('verifiesRemediationPacket blocks promotion and reports a spawn failure distinctly from a test failure', () => {
  function fakeRunCommand(command) {
    if (command === 'npm test') {
      return { command, exitCode: null, timedOut: false, spawnError: 'ENOBUFS', stdout: '', stderr: '' };
    }

    return { command, exitCode: 0, timedOut: false, spawnError: null, stdout: '', stderr: '' };
  }

  const report = verifiesRemediationPacket({ rootDir: '/repo' }, buildsPacket(), { runCommand: fakeRunCommand });

  assert.equal(report.testResults.passed, false);
  assert.match(report.testResults.summary, /failed to spawn: ENOBUFS/u);
  assert.equal(report.promotionDecision, 'BLOCKED');
  assert.ok(report.unresolvedRisks.some((risk) => risk.includes('failed to spawn: ENOBUFS')));
});

test('verifiesRemediationPacket blocks promotion when a command times out', () => {
  function fakeRunCommand(command) {
    return { command, exitCode: null, timedOut: true, stdout: '', stderr: '' };
  }

  const report = verifiesRemediationPacket({ rootDir: '/repo' }, buildsPacket(), { runCommand: fakeRunCommand });

  assert.equal(report.promotionDecision, 'BLOCKED');
  assert.ok(report.unresolvedRisks.some((risk) => risk.includes('timed out')));
});

test('verifiesRemediationPacket flags missing after metrics as an unresolved risk without blocking on that alone', () => {
  function fakeRunCommand(command) {
    return { command, exitCode: 0, timedOut: false, stdout: '', stderr: '' };
  }

  const report = verifiesRemediationPacket({ rootDir: '/repo' }, buildsPacket(), { runCommand: fakeRunCommand });

  assert.equal(report.promotionDecision, 'PROMOTABLE');
  assert.ok(report.unresolvedRisks.some((risk) => risk.includes('after metrics were not supplied')));
});

test('verifiesRemediationPacket blocks promotion when a metric got worse after the packet', () => {
  function fakeRunCommand(command) {
    return { command, exitCode: 0, timedOut: false, stdout: '', stderr: '' };
  }

  const report = verifiesRemediationPacket(
    { rootDir: '/repo' },
    buildsPacket(),
    {
      runCommand: fakeRunCommand,
      beforeMetrics: { filesMissingBodyContract: 2 },
      afterMetrics: { filesMissingBodyContract: 5 },
    },
  );

  assert.equal(report.promotionDecision, 'BLOCKED');
  assert.ok(report.unresolvedRisks.some((risk) => risk.includes('got worse')));
});

test('verifiesRemediationPacket includes changedFiles in the report', () => {
  function fakeRunCommand(command) {
    return { command, exitCode: 0, timedOut: false, stdout: '', stderr: '' };
  }

  const report = verifiesRemediationPacket(
    { rootDir: '/repo' },
    buildsPacket(),
    { runCommand: fakeRunCommand, changedFiles: ['src/a/a.js'], afterMetrics: {} },
  );

  assert.deepEqual(report.changedFiles, ['src/a/a.js']);
});
