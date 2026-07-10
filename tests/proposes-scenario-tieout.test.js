const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { proposesScenarioTieOut, UNSUPPORTED_FINDING } = require('../src/proposes-scenario-tieout/proposes-scenario-tieout');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function buildsDomainMap(runId, fileEntries) {
  return {
    sourceRunId: runId,
    evidencePath: `quality/domain-remediation/${runId}/domain-map.proposal.v1.json`,
    fileEntries,
  };
}

test('proposesScenarioTieOut only calls the worker for product-domain body files missing tie-out', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-tieout-'));

  try {
    const runId = 'run-tieout-1';
    const calledPaths = [];

    async function fakeCallWorker(request) {
      calledPaths.push(request.filePath);
      return {
        filePath: request.filePath,
        rawResponseText: JSON.stringify({
          featureId: 'example',
          scenarioId: 'feature:example#scenario:x',
          evidenceSource: 'none',
          evidenceCitation: '',
          confidence: 'low',
          reasoning: 'no evidence found',
        }),
        callFailure: null,
      };
    }

    const domainMap = buildsDomainMap(runId, [
      { filePath: 'src/a/a.js', classification: 'product-domain body', hasScenarioTieOut: false, primaryBodyResponsibility: 'do-a' },
      { filePath: 'src/b/b.js', classification: 'product-domain body', hasScenarioTieOut: true, primaryBodyResponsibility: 'do-b' },
      { filePath: 'packages/x/x.js', classification: 'package primitive', hasScenarioTieOut: false, primaryBodyResponsibility: 'do-x' },
      { filePath: 'src/c/c.js', classification: 'ambiguous', hasScenarioTieOut: false, primaryBodyResponsibility: 'do-c' },
    ]);

    const proposal = await proposesScenarioTieOut({ rootDir: tempDir }, domainMap, { callWorker: fakeCallWorker });

    assert.deepEqual(calledPaths, ['src/a/a.js']);
    assert.equal(proposal.mappings.length, 1);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('proposesScenarioTieOut accepts a mapping when the cited feature document exists on disk', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-tieout-'));

  try {
    const runId = 'run-tieout-2';
    writesFile(path.join(tempDir, 'docs/features/example.feature.md'), '# Example feature\n');

    async function fakeCallWorker() {
      return {
        rawResponseText: JSON.stringify({
          featureId: 'example',
          scenarioId: 'feature:example#scenario:x',
          evidenceSource: 'feature document',
          evidenceCitation: 'docs/features/example.feature.md',
          confidence: 'high',
          reasoning: 'the feature doc describes this exact behavior',
        }),
        callFailure: null,
      };
    }

    const domainMap = buildsDomainMap(runId, [
      { filePath: 'src/a/a.js', classification: 'product-domain body', hasScenarioTieOut: false, primaryBodyResponsibility: 'do-a' },
    ]);

    const proposal = await proposesScenarioTieOut({ rootDir: tempDir }, domainMap, { callWorker: fakeCallWorker });

    assert.equal(proposal.mappings.length, 1);
    const mapping = proposal.mappings[0];
    assert.equal(mapping.featureId, 'example');
    assert.equal(mapping.evidenceCitation.source, 'feature document');
    assert.equal(mapping.evidenceCitation.reference, 'docs/features/example.feature.md');
    assert.deepEqual(mapping.findingCodes, []);
    assert.equal(proposal.summary.supportedMappings, 1);
    assert.equal(proposal.summary.unsupportedMappings, 0);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('proposesScenarioTieOut rejects a citation to a feature document that does not exist on disk', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-tieout-'));

  try {
    const runId = 'run-tieout-3';

    async function fakeCallWorker() {
      return {
        rawResponseText: JSON.stringify({
          featureId: 'example',
          scenarioId: 'feature:example#scenario:x',
          evidenceSource: 'feature document',
          evidenceCitation: 'docs/features/does-not-exist.feature.md',
          confidence: 'high',
          reasoning: 'I am confident even though I made this up',
        }),
        callFailure: null,
      };
    }

    const domainMap = buildsDomainMap(runId, [
      { filePath: 'src/a/a.js', classification: 'product-domain body', hasScenarioTieOut: false, primaryBodyResponsibility: 'do-a' },
    ]);

    const proposal = await proposesScenarioTieOut({ rootDir: tempDir }, domainMap, { callWorker: fakeCallWorker });

    const mapping = proposal.mappings[0];
    assert.deepEqual(mapping.findingCodes, [UNSUPPORTED_FINDING]);
    assert.equal(mapping.evidenceCitation, null);
    assert.equal(mapping.reviewerAction, 'product-owner review required');
    assert.match(mapping.reasoning, /does not exist/u);
    assert.equal(proposal.summary.unsupportedMappings, 1);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('proposesScenarioTieOut rejects a mapping when the worker declares evidenceSource none', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-tieout-'));

  try {
    const runId = 'run-tieout-4';

    async function fakeCallWorker() {
      return {
        rawResponseText: JSON.stringify({
          featureId: '',
          scenarioId: '',
          evidenceSource: 'none',
          evidenceCitation: '',
          confidence: 'low',
          reasoning: 'no supporting evidence found',
        }),
        callFailure: null,
      };
    }

    const domainMap = buildsDomainMap(runId, [
      { filePath: 'src/a/a.js', classification: 'product-domain body', hasScenarioTieOut: false, primaryBodyResponsibility: 'do-a' },
    ]);

    const proposal = await proposesScenarioTieOut({ rootDir: tempDir }, domainMap, { callWorker: fakeCallWorker });

    const mapping = proposal.mappings[0];
    assert.deepEqual(mapping.findingCodes, [UNSUPPORTED_FINDING]);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('proposesScenarioTieOut notes truncation when the response is not valid JSON and finishReason is MAX_TOKENS', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-tieout-'));

  try {
    const runId = 'run-tieout-4b';

    async function fakeCallWorker() {
      return {
        rawResponseText: '{"featureId": "example", "scenarioId": "feature:example#scenario:x", "evidenceSource": "test',
        finishReason: 'MAX_TOKENS',
        callFailure: null,
      };
    }

    const domainMap = buildsDomainMap(runId, [
      { filePath: 'src/a/a.js', classification: 'product-domain body', hasScenarioTieOut: false, primaryBodyResponsibility: 'do-a' },
    ]);

    const proposal = await proposesScenarioTieOut({ rootDir: tempDir }, domainMap, { callWorker: fakeCallWorker });

    const mapping = proposal.mappings[0];
    assert.deepEqual(mapping.findingCodes, [UNSUPPORTED_FINDING]);
    assert.match(mapping.reasoning, /truncated at the token limit/u);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('proposesScenarioTieOut rejects a mapping when the worker call itself fails', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-tieout-'));

  try {
    const runId = 'run-tieout-5';

    async function fakeCallWorker() {
      return { rawResponseText: null, callFailure: { type: 'rate-limit-error', message: 'Gemini rate limited' } };
    }

    const domainMap = buildsDomainMap(runId, [
      { filePath: 'src/a/a.js', classification: 'product-domain body', hasScenarioTieOut: false, primaryBodyResponsibility: 'do-a' },
    ]);

    const proposal = await proposesScenarioTieOut({ rootDir: tempDir }, domainMap, { callWorker: fakeCallWorker });

    const mapping = proposal.mappings[0];
    assert.deepEqual(mapping.findingCodes, [UNSUPPORTED_FINDING]);
    assert.match(mapping.reasoning, /rate-limit-error/u);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
