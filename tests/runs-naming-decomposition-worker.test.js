const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { runsNamingDecompositionWorker } = require('../src/runs-naming-decomposition-worker/runs-naming-decomposition-worker');

function writesFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

test('runsNamingDecompositionWorker reads frozen analysis evidence and writes both the rename plan and decomposition plan', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-naming-decomposition-'));

  try {
    const runId = 'run-frozen-naming-decomposition';

    writesFile(
      path.join(tempDir, 'evidence/runs', runId, 'domain-analysis/domain-body-analysis.contract.v1.json'),
      JSON.stringify({
        runId,
        evidencePath: `evidence/runs/${runId}/domain-analysis/domain-body-analysis.contract.v1.json`,
        sourceFiles: [
          {
            filePath: 'src/big/big.js',
            executableMethodCount: 2,
            findingCodes: ['executable-file-name-missing-action-verb'],
            responsibilityClusters: [
              { name: 'build', methodNames: ['buildsThing'] },
              { name: 'validate', methodNames: ['validatesThing'] },
            ],
            decomposition: { proposedFiles: [{ proposedFilePath: 'src/builds-thing/builds-thing.js', sourceMethodNames: ['buildsThing'], reason: 'extract', contractActionRequired: 'declare contract' }] },
          },
        ],
      }),
    );

    async function fakeCallWorker() {
      return {
        rawResponseText: JSON.stringify({
          classification: 'decompose before rename',
          proposedActionVerb: '',
          proposedPath: '',
          responsibilityEvidence: 'two unrelated clusters',
          classificationReason: 'too many responsibilities',
        }),
        callFailure: null,
      };
    }

    const analysisPath = path.join(tempDir, 'evidence/runs', runId, 'domain-analysis/domain-body-analysis.contract.v1.json');
    const beforeAnalysis = fs.readFileSync(analysisPath, 'utf8');

    const config = { rootDir: tempDir, domainContract: { domainVocabulary: { verbs: ['build', 'validate'] } } };
    const result = await runsNamingDecompositionWorker(config, runId, { callWorker: fakeCallWorker });

    assert.equal(result.renamePlan.entries.length, 1);
    assert.equal(result.renamePlan.entries[0].classification, 'decompose before rename');
    assert.ok(fs.existsSync(result.renamePlanReceipt.evidencePath));

    assert.equal(result.decompositionPlan.sections.length, 1);
    assert.ok(fs.existsSync(result.decompositionPlanReceipt.reportPath));

    assert.equal(fs.readFileSync(analysisPath, 'utf8'), beforeAnalysis);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
