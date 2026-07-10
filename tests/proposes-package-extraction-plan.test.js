const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { proposesPackageExtractionPlan, UNGROUNDED_EXTRACTION_FINDING } = require('../src/proposes-package-extraction-plan/proposes-package-extraction-plan');

function writesDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function buildsSprawlContract(runId, sourceFiles) {
  return {
    runId,
    evidencePath: `evidence/runs/${runId}/sprawl/domain-body-sprawl.contract.v1.json`,
    sourceFiles,
  };
}

test('proposesPackageExtractionPlan skips the worker and rejects extraction when no mechanic has grounded method names', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-package-extraction-'));

  try {
    let callCount = 0;
    async function fakeCallWorker() {
      callCount += 1;
      return { rawResponseText: '{}', callFailure: null };
    }

    const sprawlContract = buildsSprawlContract('run-1', [
      {
        filePath: 'src/a/a.js',
        classification: 'package extraction candidate',
        genericMechanicCandidates: [
          { mechanic: 'sorting comparators', methodNames: [] },
          { mechanic: 'timestamp arithmetic', methodNames: [] },
        ],
      },
    ]);

    const plan = await proposesPackageExtractionPlan({ rootDir: tempDir }, sprawlContract, { callWorker: fakeCallWorker });

    assert.equal(callCount, 0);
    assert.equal(plan.sections.length, 1);
    assert.equal(plan.sections[0].classification, 'rejected extraction');
    assert.deepEqual(plan.sections[0].findingCodes, [UNGROUNDED_EXTRACTION_FINDING]);
    assert.match(plan.sections[0].reasoningNote, /no generic mechanic candidate/u);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('proposesPackageExtractionPlan calls the worker only with grounded mechanics and only for package-extraction-candidate files', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-package-extraction-'));

  try {
    const calledRequests = [];
    async function fakeCallWorker(request) {
      calledRequests.push(request);
      return {
        rawResponseText: JSON.stringify({
          classification: 'existing package',
          targetPackage: 'logme-config-primitives',
          extractedMethodNames: ['formatsPath'],
          domainCallSiteGuidance: 'call formatsPath from the package instead',
          classificationReason: 'grounded generic path mechanic',
        }),
        callFailure: null,
      };
    }

    writesDir(path.join(tempDir, 'packages/logme-config-primitives'));

    const sprawlContract = buildsSprawlContract('run-2', [
      {
        filePath: 'src/a/a.js',
        classification: 'package extraction candidate',
        genericMechanicCandidates: [{ mechanic: 'path joining or path normalization', methodNames: ['formatsPath'] }],
      },
      {
        filePath: 'src/b/b.js',
        classification: 'focused',
        genericMechanicCandidates: [],
      },
    ]);

    const plan = await proposesPackageExtractionPlan({ rootDir: tempDir }, sprawlContract, { callWorker: fakeCallWorker });

    assert.equal(calledRequests.length, 1);
    assert.equal(calledRequests[0].filePath, 'src/a/a.js');
    assert.deepEqual(calledRequests[0].existingPackages, ['logme-config-primitives']);
    assert.equal(plan.sections.length, 1);

    const section = plan.sections[0];
    assert.equal(section.classification, 'existing package');
    assert.equal(section.targetPackage, 'logme-config-primitives');
    assert.deepEqual(section.findingCodes, []);
    assert.equal(plan.summary.resolvedSections, 1);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('proposesPackageExtractionPlan rejects an existing-package classification that names a package that does not exist', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-package-extraction-'));

  try {
    async function fakeCallWorker() {
      return {
        rawResponseText: JSON.stringify({
          classification: 'existing package',
          targetPackage: 'logme-package-that-does-not-exist',
          extractedMethodNames: ['formatsPath'],
          domainCallSiteGuidance: 'call formatsPath from the package instead',
          classificationReason: 'claims a package that is not real',
        }),
        callFailure: null,
      };
    }

    writesDir(path.join(tempDir, 'packages/logme-config-primitives'));

    const sprawlContract = buildsSprawlContract('run-3', [
      {
        filePath: 'src/a/a.js',
        classification: 'package extraction candidate',
        genericMechanicCandidates: [{ mechanic: 'path joining or path normalization', methodNames: ['formatsPath'] }],
      },
    ]);

    const plan = await proposesPackageExtractionPlan({ rootDir: tempDir }, sprawlContract, { callWorker: fakeCallWorker });

    const section = plan.sections[0];
    assert.deepEqual(section.findingCodes, [UNGROUNDED_EXTRACTION_FINDING]);
    assert.match(section.reasoningNote, /no such package exists/u);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('proposesPackageExtractionPlan accepts retained domain body and rejected extraction classifications without a target package', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-package-extraction-'));

  try {
    async function fakeCallWorker() {
      return {
        rawResponseText: JSON.stringify({
          classification: 'retained domain body',
          targetPackage: '',
          extractedMethodNames: [],
          domainCallSiteGuidance: 'no change; the mechanic is domain-specific',
          classificationReason: 'the pattern match is a false positive; this is domain logic',
        }),
        callFailure: null,
      };
    }

    const sprawlContract = buildsSprawlContract('run-4', [
      {
        filePath: 'src/a/a.js',
        classification: 'package extraction candidate',
        genericMechanicCandidates: [{ mechanic: 'timestamp arithmetic', methodNames: ['computesRunAge'] }],
      },
    ]);

    const plan = await proposesPackageExtractionPlan({ rootDir: tempDir }, sprawlContract, { callWorker: fakeCallWorker });

    const section = plan.sections[0];
    assert.equal(section.classification, 'retained domain body');
    assert.equal(section.targetPackage, null);
    assert.deepEqual(section.findingCodes, []);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('proposesPackageExtractionPlan rejects an entry when the worker response is not valid JSON', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-package-extraction-'));

  try {
    async function fakeCallWorker() {
      return { rawResponseText: 'not json', callFailure: null };
    }

    const sprawlContract = buildsSprawlContract('run-5', [
      {
        filePath: 'src/a/a.js',
        classification: 'package extraction candidate',
        genericMechanicCandidates: [{ mechanic: 'sorting comparators', methodNames: ['comparesThings'] }],
      },
    ]);

    const plan = await proposesPackageExtractionPlan({ rootDir: tempDir }, sprawlContract, { callWorker: fakeCallWorker });

    assert.deepEqual(plan.sections[0].findingCodes, [UNGROUNDED_EXTRACTION_FINDING]);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('proposesPackageExtractionPlan does not mutate the source evidence contract', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-package-extraction-'));

  try {
    async function fakeCallWorker() {
      return { rawResponseText: null, callFailure: { type: 'authentication-error', message: 'no key' } };
    }

    const sprawlContract = buildsSprawlContract('run-6', [
      {
        filePath: 'src/a/a.js',
        classification: 'package extraction candidate',
        genericMechanicCandidates: [{ mechanic: 'sorting comparators', methodNames: ['comparesThings'] }],
      },
    ]);
    const frozen = JSON.stringify(sprawlContract);

    await proposesPackageExtractionPlan({ rootDir: tempDir }, sprawlContract, { callWorker: fakeCallWorker });

    assert.equal(JSON.stringify(sprawlContract), frozen);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
