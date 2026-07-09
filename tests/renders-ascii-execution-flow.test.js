const test = require('node:test');
const assert = require('node:assert/strict');

const { rendersAsciiExecutionFlow } = require('../packages/logme-report-primitives/src/renders-ascii-execution-flow');

test('rendersAsciiExecutionFlow produces a clean ASCII sketch for a sterile report', () => {
  const sketch = rendersAsciiExecutionFlow({
    verdict: 'STERILE DOMAIN BODY',
    rootDir: '/test/root',
    reportPath: '/test/root/report.md',
    filesScanned: 2,
    localExecutableMethods: 2,
    findings: [],
    methods: [
      {
        hasLogMeCall: true,
      },
      {
        hasLogMeCall: true,
      },
    ],
    provenance: {
      runId: 'run-123',
      configPath: '/test/root/logme.config.json',
    },
  });

  assert.match(sketch, /REPORT TRUTH/);
  assert.match(sketch, /Verdict\s+: STERILE DOMAIN BODY/);
  assert.match(sketch, /Promotion\s+: ALLOWED/);
  assert.match(sketch, /Gherkin -> Contract -> Source -> Telemetry -> Receipt/);
  assert.match(sketch, /Telemetry observation\s+: not observed/);
  assert.match(sketch, /Receipt evidence\s+: report\.md/);
  assert.doesNotMatch(sketch, /[^\x0A\x0D\x20-\x7E]/);
});

test('rendersAsciiExecutionFlow highlights a blocked report and blocker count', () => {
  const sketch = rendersAsciiExecutionFlow({
    verdict: 'DOMAIN BODY CONTAMINATED',
    rootDir: '/test/root',
    reportPath: '/test/root/report.md',
    filesScanned: 2,
    localExecutableMethods: 2,
    findings: [
      {
        code: 'unimplemented-stub-detected',
      },
    ],
    methods: [
      {
        hasLogMeCall: true,
      },
      {
        hasLogMeCall: false,
      },
    ],
    provenance: {
      runId: 'run-456',
      configPath: '/test/root/logme.config.json',
    },
  });

  assert.match(sketch, /Promotion\s+: BLOCKED/);
  assert.match(sketch, /Declared Source -> Static Inventory -> Telemetry -> Receipt/);
  assert.match(sketch, /Telemetry observation\s+: not observed/);
  assert.match(sketch, /Blockers\s+: 1/);
  assert.doesNotMatch(sketch, /[^\x0A\x0D\x20-\x7E]/);
});
