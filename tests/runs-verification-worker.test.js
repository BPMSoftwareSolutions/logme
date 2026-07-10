const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { runsVerificationWorker } = require('../src/runs-verification-worker/runs-verification-worker');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

test('runsVerificationWorker reads the named packet from the backlog, runs verification, and writes the report', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-verification-orchestrator-'));

  try {
    const runId = 'run-verification-orchestrator-1';

    writesFile(
      path.join(tempDir, 'quality/domain-remediation', runId, 'remediation-backlog.v1.json'),
      JSON.stringify({
        backlogItems: [
          { packetId: 'domain-remediation-scenario-tieout', verificationCommands: ['npm test'] },
          { packetId: 'domain-remediation-body-contract', verificationCommands: ['npm test', 'npm run report:truth:fast'] },
        ],
      }),
    );

    function fakeRunCommand(command) {
      return { command, exitCode: 0, timedOut: false, stdout: '', stderr: '' };
    }

    const { verificationReport, receipt } = runsVerificationWorker(
      { rootDir: tempDir },
      runId,
      'domain-remediation-body-contract',
      { runCommand: fakeRunCommand },
    );

    assert.equal(verificationReport.packetId, 'domain-remediation-body-contract');
    assert.equal(verificationReport.commandsRun.length, 2);
    assert.ok(fs.existsSync(receipt.reportPath));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('runsVerificationWorker throws when the packet id is not found in the backlog', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-verification-orchestrator-'));

  try {
    const runId = 'run-verification-orchestrator-2';

    writesFile(
      path.join(tempDir, 'quality/domain-remediation', runId, 'remediation-backlog.v1.json'),
      JSON.stringify({ backlogItems: [] }),
    );

    assert.throws(
      () => runsVerificationWorker({ rootDir: tempDir }, runId, 'domain-remediation-does-not-exist', {}),
      /no backlog item found/u,
    );
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
