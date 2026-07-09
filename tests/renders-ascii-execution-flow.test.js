const test = require('node:test');
const assert = require('node:assert/strict');

const { rendersAsciiExecutionFlow } = require('../packages/logme-report-primitives/src/renders-ascii-execution-flow');

test('rendersAsciiExecutionFlow produces a clean ASCII sketch for a sterile report', () => {
  const sketch = rendersAsciiExecutionFlow({
    verdict: 'STERILE DOMAIN BODY',
    rootDir: '/test/root',
    reportPath: '/test/root/report.md',
    configPath: '/test/root/logme.config.json',
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
  assert.match(sketch, /Telemetry observation\s+: observed/);
  assert.match(sketch, /Receipt evidence\s+: report\.md/);
  assert.match(sketch, /EXECUTABLE BODY TREE/);
  assert.match(sketch, /ACCEPTANCE SOURCE/);
  assert.match(sketch, /SHARED RUNNER EXECUTES/);
  assert.doesNotMatch(sketch, /[^\x0A\x0D\x20-\x7E]/);
});

test('rendersAsciiExecutionFlow highlights a blocked report and blocker count', () => {
  const sketch = rendersAsciiExecutionFlow({
    verdict: 'DOMAIN BODY CONTAMINATED',
    rootDir: '/test/root',
    reportPath: '/test/root/report.md',
    configPath: '/test/root/logme.config.json',
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
  assert.match(sketch, /Blocker count\s+: 1/);
  assert.match(sketch, /TOP BLOCKERS/);
  assert.match(sketch, /finding code/i);
  assert.match(sketch, /unimplemented-stub-detected/);
  assert.match(sketch, /one-line fix/i);
  assert.doesNotMatch(sketch, /[^\x0A\x0D\x20-\x7E]/);
});

test('rendersAsciiExecutionFlow prefers explicit execution nodes when provided', () => {
  const sketch = rendersAsciiExecutionFlow({
    verdict: 'DOMAIN BODY CONTAMINATED',
    rootDir: '/test/root',
    reportPath: '/test/root/report.md',
    configPath: '/test/root/logme.config.json',
    filesScanned: 1,
    localExecutableMethods: 1,
    findings: [
      {
        code: 'executable-body-tree-missing',
        filePath: '/test/root/src/example.js',
        methodName: 'exampleMethod',
      },
    ],
    executionNodes: [
      {
        nodeId: '00',
        label: 'ACCEPTANCE SOURCE',
        contractPath: 'docs/features/example.feature.md',
        runtimePath: 'not executable',
        sourceLineRange: 'n/a',
        telemetryPath: 'not required',
        observedRuntimeStep: 'not observed',
        observedDurationMs: 'not observed',
        receiptPath: 'not required',
        status: 'ok',
      },
      {
        nodeId: '01',
        label: 'CANONICAL REQUEST BINDING',
        contractPath: 'contracts/example.json',
        runtimePath: 'src/example.js:1-9',
        sourceLineRange: '1-9',
        telemetryPath: 'not observed',
        observedRuntimeStep: 'not observed',
        observedDurationMs: 'not observed',
        receiptPath: 'missing',
        status: 'blocked',
        blocker: 'executable-body-tree-missing',
        fix: 'add ordered executable body nodes before the dense tables',
      },
    ],
    methods: [],
    provenance: {
      runId: 'run-999',
      configPath: '/test/root/logme.config.json',
    },
  });

  assert.match(sketch, /EXECUTABLE BODY TREE/);
  assert.match(sketch, /docs\/features\/example\.feature\.md/);
  assert.match(sketch, /CANONICAL REQUEST BINDING/);
  assert.match(sketch, /blocked/);
  assert.match(sketch, /executable-body-tree-missing/);
  assert.match(sketch, /add ordered executable body nodes before the dense tables/);
});
