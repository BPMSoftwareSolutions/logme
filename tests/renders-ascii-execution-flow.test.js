const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { rendersAsciiExecutionFlow } = require('../packages/logme-report-primitives/src/renders-ascii-execution-flow');
const { parsesExecutionSketchTemplate } = require('../packages/logme-report-primitives/src/parses-execution-sketch-template');

const TEMPLATE_PATH = path.join(__dirname, '..', 'contracts', 'templates', 'logme2', 'execution-sketch.template.txt');
const executionSketchTemplate = parsesExecutionSketchTemplate(fs.readFileSync(TEMPLATE_PATH, 'utf8'));

test('rendersAsciiExecutionFlow renders the executable body tree as nested ASCII branches', () => {
  const sketch = rendersAsciiExecutionFlow({
    verdict: 'STERILE DOMAIN BODY',
    rootDir: '/test/root',
    reportPath: '/test/root/report.md',
    configPath: '/test/root/logme.config.json',
    filesScanned: 2,
    localExecutableMethods: 2,
    findings: [],
    executionNodes: [
      {
        nodeId: '00',
        label: 'ACCEPTANCE SOURCE',
        branches: [
          { label: 'gherkin', value: 'docs/report-truth-pi-planning.md' },
          { label: 'acceptance criteria', value: 'contracts/file-system-bodies/02_declared/logme2.file-system-body.contract.v1.json' },
          { label: 'proves', value: 'report.md opens with the runtime body, evidence, and blockers first' },
        ],
      },
      {
        nodeId: '01',
        label: 'SURFACE RECEIVES REQUEST',
        branches: [
          { label: 'contract', value: 'contracts/file-system-bodies/02_declared/logme2.file-system-body.contract.v1.json' },
          { label: 'runtime', value: 'src/runs-logme-domain-audit.js:7-16' },
          {
            label: 'telemetry',
            children: [
              { label: 'status        : observed' },
              { label: 'runtime step  : 1' },
              { label: 'first seen at : 2026-07-09T12:00:00.000Z' },
              { label: 'duration ms   : not observed' },
            ],
          },
          { label: 'receipt', value: 'evidence/runs/run-123/report.receipt.v1.json' },
          {
            label: 'status',
            children: [
              { label: 'ok' },
            ],
          },
        ],
      },
    ],
    methods: [],
    provenance: {
      runId: 'run-123',
      configPath: '/test/root/logme.config.json',
      generationTimestamp: '2026-07-09T12:00:00.000Z',
    },
  }, executionSketchTemplate);

  assert.match(sketch, /REPORT TRUTH/);
  assert.match(sketch, /Verdict\s+: STERILE DOMAIN BODY/);
  assert.match(sketch, /Promotion\s+: ALLOWED/);
  assert.match(sketch, /EXECUTABLE BODY CONTRACT - FILE-SYSTEM EXECUTION TREE/);
  assert.match(sketch, /\[00\] ACCEPTANCE SOURCE/);
  assert.match(sketch, /\|-- gherkin/);
  assert.match(sketch, /\|   `-- docs\/report-truth-pi-planning\.md/);
  assert.match(sketch, /\|-- telemetry/);
  assert.match(sketch, /\|   \|-- status        : observed/);
  assert.match(sketch, /\|   `-- duration ms   : not observed/);
  assert.match(sketch, /\|-- receipt/);
  assert.match(sketch, /\|   `-- evidence\/runs\/run-123\/report\.receipt\.v1\.json/);
  assert.match(sketch, /\|-- status/);
  assert.match(sketch, /    `-- ok/);
  assert.doesNotMatch(sketch, /[^\x0A\x0D\x20-\x7E]/);
});

test('rendersAsciiExecutionFlow fails closed when executable body nodes are missing', () => {
  const sketch = rendersAsciiExecutionFlow({
    verdict: 'DOMAIN BODY CONTAMINATED',
    rootDir: '/test/root',
    reportPath: '/test/root/report.md',
    configPath: '/test/root/logme.config.json',
    filesScanned: 1,
    localExecutableMethods: 1,
    findings: [
      {
        code: 'executable-body-contract-missing',
        filePath: '/test/root/report.md',
      },
    ],
    methods: [],
    provenance: {
      runId: 'run-999',
      configPath: '/test/root/logme.config.json',
    },
  }, executionSketchTemplate);

  assert.match(sketch, /EXECUTABLE BODY TREE: missing/);
  assert.match(sketch, /DOMAIN BODY CONTAMINATED/);
  assert.match(sketch, /Promotion\s+: BLOCKED/);
  assert.match(sketch, /executable-body-contract-missing/);
  assert.doesNotMatch(sketch, /DIAGNOSTIC FALLBACK - NOT PROMOTION EVIDENCE/);
});

test('rendersAsciiExecutionFlow throws when no template is supplied', () => {
  assert.throws(() => rendersAsciiExecutionFlow({ verdict: 'STERILE DOMAIN BODY' }));
});
