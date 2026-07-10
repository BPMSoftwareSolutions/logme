const test = require('node:test');
const assert = require('node:assert/strict');

const { proposesBodyContractPatch, MISSING_RESPONSIBILITY_FINDING } = require('../src/proposes-body-contract-patch/proposes-body-contract-patch');

function buildsAnalysisContract(runId, sourceFiles) {
  return {
    runId,
    evidencePath: `evidence/runs/${runId}/domain-analysis/domain-body-analysis.contract.v1.json`,
    sourceFiles,
  };
}

test('proposesBodyContractPatch only calls the worker for files missing a body contract', async () => {
  const calledPaths = [];

  async function fakeCallWorker(request) {
    calledPaths.push(request.filePath);
    return {
      rawResponseText: JSON.stringify({
        bodyKind: 'product-domain body',
        bodyId: 'logme.example',
        actionVerb: 'build',
        responsibility: 'builds the example thing',
        allowedDependencies: [],
        decompositionStatus: 'single-responsibility',
        waiverReason: '',
      }),
      callFailure: null,
    };
  }

  const analysisContract = buildsAnalysisContract('run-1', [
    { filePath: 'src/a/a.js', findingCodes: ['file-body-contract-missing'], responsibilityClusters: [{ name: 'build', methodNames: ['buildsA'] }] },
    { filePath: 'src/b/b.js', findingCodes: [], responsibilityClusters: [{ name: 'build', methodNames: ['buildsB'] }] },
  ]);

  const patch = await proposesBodyContractPatch({}, analysisContract, { callWorker: fakeCallWorker });

  assert.deepEqual(calledPaths, ['src/a/a.js']);
  assert.equal(patch.entries.length, 1);
});

test('proposesBodyContractPatch accepts a fully-specified product-domain body entry grounded in real methods', async () => {
  async function fakeCallWorker() {
    return {
      rawResponseText: JSON.stringify({
        bodyKind: 'product-domain body',
        bodyId: 'logme.report-provenance',
        actionVerb: 'build',
        responsibility: 'builds and verifies report provenance metadata for a domain audit run',
        allowedDependencies: ['packages/logme-testimony-core/'],
        decompositionStatus: 'decomposition-recommended',
        waiverReason: '',
      }),
      callFailure: null,
    };
  }

  const analysisContract = buildsAnalysisContract('run-2', [
    {
      filePath: 'src/report-provenance/report-provenance.js',
      findingCodes: ['file-body-contract-missing'],
      responsibilityClusters: [{ name: 'build', methodNames: ['buildsReportProvenance'] }],
    },
  ]);

  const patch = await proposesBodyContractPatch({}, analysisContract, { callWorker: fakeCallWorker });

  const entry = patch.entries[0];
  assert.equal(entry.bodyId, 'logme.report-provenance');
  assert.equal(entry.bodyKind, 'product-domain body');
  assert.equal(entry.actionVerb, 'build');
  assert.deepEqual(entry.findingCodes, []);
  assert.equal(patch.summary.resolvedEntries, 1);
  assert.equal(patch.summary.unresolvedEntries, 0);
});

test('proposesBodyContractPatch rejects a product-domain body claim with no actionVerb', async () => {
  async function fakeCallWorker() {
    return {
      rawResponseText: JSON.stringify({
        bodyKind: 'product-domain body',
        bodyId: 'logme.example',
        actionVerb: '',
        responsibility: 'does something',
        allowedDependencies: [],
        decompositionStatus: 'single-responsibility',
        waiverReason: '',
      }),
      callFailure: null,
    };
  }

  const analysisContract = buildsAnalysisContract('run-3', [
    { filePath: 'src/a/a.js', findingCodes: ['file-body-contract-missing'], responsibilityClusters: [{ name: 'build', methodNames: ['buildsA'] }] },
  ]);

  const patch = await proposesBodyContractPatch({}, analysisContract, { callWorker: fakeCallWorker });

  const entry = patch.entries[0];
  assert.deepEqual(entry.findingCodes, [MISSING_RESPONSIBILITY_FINDING]);
  assert.match(entry.reasoningNote, /no actionVerb/u);
});

test('proposesBodyContractPatch rejects a waiver with no waiverReason', async () => {
  async function fakeCallWorker() {
    return {
      rawResponseText: JSON.stringify({
        bodyKind: 'waiver',
        bodyId: 'logme.example',
        actionVerb: '',
        responsibility: 'unclear',
        allowedDependencies: [],
        decompositionStatus: 'single-responsibility',
        waiverReason: '',
      }),
      callFailure: null,
    };
  }

  const analysisContract = buildsAnalysisContract('run-4', [
    { filePath: 'src/a/a.js', findingCodes: ['file-body-contract-missing'], responsibilityClusters: [] },
  ]);

  const patch = await proposesBodyContractPatch({}, analysisContract, { callWorker: fakeCallWorker });

  const entry = patch.entries[0];
  assert.deepEqual(entry.findingCodes, [MISSING_RESPONSIBILITY_FINDING]);
  assert.match(entry.reasoningNote, /no waiverReason/u);
});

test('proposesBodyContractPatch accepts a non-product-domain classification such as package primitive', async () => {
  async function fakeCallWorker() {
    return {
      rawResponseText: JSON.stringify({
        bodyKind: 'package primitive',
        bodyId: 'logme-config-primitives.example',
        actionVerb: '',
        responsibility: 'a generic reusable mechanic that does not belong in the domain body',
        allowedDependencies: [],
        decompositionStatus: 'decomposition-not-needed',
        waiverReason: '',
      }),
      callFailure: null,
    };
  }

  const analysisContract = buildsAnalysisContract('run-5', [
    { filePath: 'packages/x/x.js', findingCodes: ['file-body-contract-missing'], responsibilityClusters: [] },
  ]);

  const patch = await proposesBodyContractPatch({}, analysisContract, { callWorker: fakeCallWorker });

  const entry = patch.entries[0];
  assert.equal(entry.bodyKind, 'package primitive');
  assert.deepEqual(entry.findingCodes, []);
});

test('proposesBodyContractPatch retries a provider-overloaded failure and succeeds on a later attempt', async () => {
  let callCount = 0;
  const sleptDurations = [];

  async function fakeCallWorker() {
    callCount += 1;
    if (callCount < 3) {
      return { rawResponseText: null, callFailure: { type: 'provider-overloaded', message: 'Gemini provider error 503' } };
    }

    return {
      rawResponseText: JSON.stringify({
        bodyKind: 'product-domain body',
        bodyId: 'logme.example',
        actionVerb: 'build',
        responsibility: 'builds the example thing',
        allowedDependencies: [],
        decompositionStatus: 'single-responsibility',
        waiverReason: '',
      }),
      callFailure: null,
    };
  }

  async function fakeSleep(milliseconds) {
    sleptDurations.push(milliseconds);
  }

  const analysisContract = buildsAnalysisContract('run-retry', [
    { filePath: 'src/a/a.js', findingCodes: ['file-body-contract-missing'], responsibilityClusters: [{ name: 'build', methodNames: ['buildsA'] }] },
  ]);

  const patch = await proposesBodyContractPatch({}, analysisContract, { callWorker: fakeCallWorker, sleepImpl: fakeSleep });

  assert.equal(callCount, 3);
  assert.equal(sleptDurations.length, 2);
  assert.deepEqual(patch.entries[0].findingCodes, []);
  assert.equal(patch.summary.resolvedEntries, 1);
});

test('proposesBodyContractPatch gives up after the max attempts and reports the last failure', async () => {
  let callCount = 0;

  async function fakeCallWorker() {
    callCount += 1;
    return { rawResponseText: null, callFailure: { type: 'provider-overloaded', message: 'Gemini provider error 503' } };
  }

  async function fakeSleep() {}

  const analysisContract = buildsAnalysisContract('run-retry-exhausted', [
    { filePath: 'src/a/a.js', findingCodes: ['file-body-contract-missing'], responsibilityClusters: [] },
  ]);

  const patch = await proposesBodyContractPatch({}, analysisContract, { callWorker: fakeCallWorker, sleepImpl: fakeSleep });

  assert.equal(callCount, 3);
  assert.deepEqual(patch.entries[0].findingCodes, [MISSING_RESPONSIBILITY_FINDING]);
  assert.match(patch.entries[0].reasoningNote, /provider-overloaded/u);
});

test('proposesBodyContractPatch does not retry a non-retryable failure such as authentication-error', async () => {
  let callCount = 0;

  async function fakeCallWorker() {
    callCount += 1;
    return { rawResponseText: null, callFailure: { type: 'authentication-error', message: 'LOC_GEMINI_API_KEY is not set' } };
  }

  async function fakeSleep() {}

  const analysisContract = buildsAnalysisContract('run-no-retry', [
    { filePath: 'src/a/a.js', findingCodes: ['file-body-contract-missing'], responsibilityClusters: [] },
  ]);

  const patch = await proposesBodyContractPatch({}, analysisContract, { callWorker: fakeCallWorker, sleepImpl: fakeSleep });

  assert.equal(callCount, 1);
  assert.deepEqual(patch.entries[0].findingCodes, [MISSING_RESPONSIBILITY_FINDING]);
});

test('proposesBodyContractPatch rejects an entry when the worker response is not valid JSON', async () => {
  async function fakeCallWorker() {
    return { rawResponseText: 'not json', finishReason: 'STOP', callFailure: null };
  }

  const analysisContract = buildsAnalysisContract('run-6', [
    { filePath: 'src/a/a.js', findingCodes: ['file-body-contract-missing'], responsibilityClusters: [] },
  ]);

  const patch = await proposesBodyContractPatch({}, analysisContract, { callWorker: fakeCallWorker });

  const entry = patch.entries[0];
  assert.deepEqual(entry.findingCodes, [MISSING_RESPONSIBILITY_FINDING]);
  assert.match(entry.reasoningNote, /not valid JSON/u);
});
