const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { proposesRenamePlan, UNRESOLVED_CLASSIFICATION_FINDING } = require('../src/proposes-rename-plan/proposes-rename-plan');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function buildsConfig(rootDir) {
  return {
    rootDir,
    domainContract: {
      domainVocabulary: {
        verbs: ['build', 'read', 'write', 'resolve'],
      },
    },
  };
}

function buildsAnalysisContract(runId, sourceFiles) {
  return {
    runId,
    evidencePath: `evidence/runs/${runId}/domain-analysis/domain-body-analysis.contract.v1.json`,
    sourceFiles,
  };
}

test('proposesRenamePlan only calls the worker for actionless files', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-rename-plan-'));

  try {
    const calledPaths = [];
    async function fakeCallWorker(request) {
      calledPaths.push(request.filePath);
      return {
        rawResponseText: JSON.stringify({
          classification: 'mechanical rename',
          proposedActionVerb: 'read',
          proposedPath: 'packages/x/reads-thing/reads-thing.js',
          responsibilityEvidence: 'readsThing method',
          classificationReason: 'single responsibility cluster',
        }),
        callFailure: null,
      };
    }

    const analysisContract = buildsAnalysisContract('run-1', [
      { filePath: 'packages/x/reads-thing.js', findingCodes: ['executable-file-name-missing-action-verb'], responsibilityClusters: [{ name: 'unclear-action', methodNames: ['readsThing'] }] },
      { filePath: 'src/b/b.js', findingCodes: [], responsibilityClusters: [] },
    ]);

    const plan = await proposesRenamePlan(buildsConfig(tempDir), analysisContract, { callWorker: fakeCallWorker });

    assert.deepEqual(calledPaths, ['packages/x/reads-thing.js']);
    assert.equal(plan.entries.length, 1);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('proposesRenamePlan accepts a mechanical rename with one cluster and grounds import migration in real call sites', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-rename-plan-'));

  try {
    writesFile(path.join(tempDir, 'packages/x/reads-thing.js'), "function readsThing() { return 1; }\nmodule.exports = { readsThing };\n");
    writesFile(path.join(tempDir, 'src/caller/caller.js'), "const { readsThing } = require('../../packages/x/reads-thing');\n");
    writesFile(path.join(tempDir, 'tests/reads-thing.test.js'), "// test\n");

    async function fakeCallWorker() {
      return {
        rawResponseText: JSON.stringify({
          classification: 'mechanical rename',
          proposedActionVerb: 'read',
          proposedPath: 'packages/x/reads-thing/reads-thing.js',
          responsibilityEvidence: 'readsThing is the only method',
          classificationReason: 'single responsibility cluster, cohesive purpose',
        }),
        callFailure: null,
      };
    }

    const analysisContract = buildsAnalysisContract('run-2', [
      { filePath: 'packages/x/reads-thing.js', findingCodes: ['executable-file-name-missing-action-verb'], responsibilityClusters: [{ name: 'unclear-action', methodNames: ['readsThing'] }] },
    ]);

    const plan = await proposesRenamePlan(buildsConfig(tempDir), analysisContract, { callWorker: fakeCallWorker });

    const entry = plan.entries[0];
    assert.equal(entry.classification, 'mechanical rename');
    assert.equal(entry.proposedPath, 'packages/x/reads-thing/reads-thing.js');
    assert.equal(entry.actionVerb, 'read');
    assert.deepEqual(entry.findingCodes, []);
    assert.deepEqual(entry.affectedTests, ['tests/reads-thing.test.js']);
    assert.deepEqual(entry.importMigrationPlan, ['src/caller/caller.js']);
    assert.equal(plan.summary.resolvedEntries, 1);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('proposesRenamePlan rejects a mechanical rename when the file has more than one responsibility cluster', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-rename-plan-'));

  try {
    async function fakeCallWorker() {
      return {
        rawResponseText: JSON.stringify({
          classification: 'mechanical rename',
          proposedActionVerb: 'build',
          proposedPath: 'src/x/builds-thing/builds-thing.js',
          responsibilityEvidence: 'buildsThing method',
          classificationReason: 'incorrectly claims single responsibility',
        }),
        callFailure: null,
      };
    }

    const analysisContract = buildsAnalysisContract('run-3', [
      {
        filePath: 'src/x/thing.js',
        findingCodes: ['executable-file-name-missing-action-verb'],
        responsibilityClusters: [
          { name: 'build', methodNames: ['buildsThing'] },
          { name: 'validate', methodNames: ['validatesThing'] },
        ],
      },
    ]);

    const plan = await proposesRenamePlan(buildsConfig(tempDir), analysisContract, { callWorker: fakeCallWorker });

    const entry = plan.entries[0];
    assert.deepEqual(entry.findingCodes, [UNRESOLVED_CLASSIFICATION_FINDING]);
    assert.match(entry.reasoningNote, /2 responsibility clusters/u);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('proposesRenamePlan rejects a proposed rename that is itself noun-only', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-rename-plan-'));

  try {
    async function fakeCallWorker() {
      return {
        rawResponseText: JSON.stringify({
          classification: 'mechanical rename',
          proposedActionVerb: 'read',
          proposedPath: 'packages/x/thing-reader/thing-reader.js',
          responsibilityEvidence: 'readsThing method',
          classificationReason: 'proposes a noun-only name by mistake',
        }),
        callFailure: null,
      };
    }

    const analysisContract = buildsAnalysisContract('run-4', [
      { filePath: 'packages/x/reads-thing.js', findingCodes: ['executable-file-name-missing-action-verb'], responsibilityClusters: [{ name: 'unclear-action', methodNames: ['readsThing'] }] },
    ]);

    const plan = await proposesRenamePlan(buildsConfig(tempDir), analysisContract, { callWorker: fakeCallWorker });

    const entry = plan.entries[0];
    assert.deepEqual(entry.findingCodes, [UNRESOLVED_CLASSIFICATION_FINDING]);
    assert.match(entry.reasoningNote, /noun-only/u);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('proposesRenamePlan accepts decompose-before-rename and package-contract-exception classifications without a proposedPath', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-rename-plan-'));

  try {
    async function fakeCallWorker(request) {
      if (request.filePath === 'src/big/big.js') {
        return {
          rawResponseText: JSON.stringify({
            classification: 'decompose before rename',
            proposedActionVerb: '',
            proposedPath: '',
            responsibilityEvidence: 'multiple unrelated method clusters',
            classificationReason: 'too many responsibilities for a single rename',
          }),
          callFailure: null,
        };
      }

      return {
        rawResponseText: JSON.stringify({
          classification: 'package-contract exception',
          proposedActionVerb: '',
          proposedPath: '',
          responsibilityEvidence: 'foundational testimony primitive',
          classificationReason: 'core infrastructure name is intentional',
        }),
        callFailure: null,
      };
    }

    const analysisContract = buildsAnalysisContract('run-5', [
      {
        filePath: 'src/big/big.js',
        findingCodes: ['executable-file-name-missing-action-verb'],
        responsibilityClusters: [
          { name: 'build', methodNames: ['buildsThing'] },
          { name: 'validate', methodNames: ['validatesThing'] },
        ],
      },
      { filePath: 'packages/logme-testimony-core/src/LogMe.js', findingCodes: ['executable-file-name-missing-action-verb'], responsibilityClusters: [{ name: 'unclear-action', methodNames: ['LogMe'] }] },
    ]);

    const plan = await proposesRenamePlan(buildsConfig(tempDir), analysisContract, { callWorker: fakeCallWorker });

    const decomposeEntry = plan.entries.find((entry) => entry.currentPath === 'src/big/big.js');
    const exceptionEntry = plan.entries.find((entry) => entry.currentPath === 'packages/logme-testimony-core/src/LogMe.js');

    assert.equal(decomposeEntry.classification, 'decompose before rename');
    assert.deepEqual(decomposeEntry.findingCodes, []);
    assert.equal(decomposeEntry.proposedPath, null);

    assert.equal(exceptionEntry.classification, 'package-contract exception');
    assert.deepEqual(exceptionEntry.findingCodes, []);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('proposesRenamePlan rejects an entry when the worker response is not valid JSON', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-rename-plan-'));

  try {
    async function fakeCallWorker() {
      return { rawResponseText: 'not json', callFailure: null };
    }

    const analysisContract = buildsAnalysisContract('run-6', [
      { filePath: 'src/a/a.js', findingCodes: ['executable-file-name-missing-action-verb'], responsibilityClusters: [] },
    ]);

    const plan = await proposesRenamePlan(buildsConfig(tempDir), analysisContract, { callWorker: fakeCallWorker });

    assert.deepEqual(plan.entries[0].findingCodes, [UNRESOLVED_CLASSIFICATION_FINDING]);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('proposesRenamePlan does not mutate the source evidence contract', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-rename-plan-'));

  try {
    async function fakeCallWorker() {
      return { rawResponseText: null, callFailure: { type: 'authentication-error', message: 'no key' } };
    }

    const analysisContract = buildsAnalysisContract('run-7', [
      { filePath: 'src/a/a.js', findingCodes: ['executable-file-name-missing-action-verb'], responsibilityClusters: [] },
    ]);
    const frozen = JSON.stringify(analysisContract);

    await proposesRenamePlan(buildsConfig(tempDir), analysisContract, { callWorker: fakeCallWorker });

    assert.equal(JSON.stringify(analysisContract), frozen);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
