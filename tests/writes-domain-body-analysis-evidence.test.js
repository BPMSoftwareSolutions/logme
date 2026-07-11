const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  writesDomainBodyAnalysisEvidence,
} = require('../src/writes-domain-body-analysis-evidence/writes-domain-body-analysis-evidence');

test('writesDomainBodyAnalysisEvidence writes JSON and LLM-ready Markdown analysis artifacts', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-domain-analysis-evidence-'));

  try {
    const analysisContract = {
      schemaVersion: 'domain-body-analysis.contract.v1',
      runId: 'run-analysis-1',
      evidencePath: 'evidence/runs/run-analysis-1/domain-analysis/domain-body-analysis.contract.v1.json',
      reportPath: 'evidence/runs/run-analysis-1/domain-analysis/domain-body-analysis.report.md',
      summary: {
        totalExecutableFiles: 1,
        actionBearingExecutableFiles: 0,
        executableFileNamesMissingActionVerb: 1,
        filesMissingBodyContract: 1,
        filesMissingScenarioTieOut: 1,
        decompositionCandidates: 1,
        totalBlockers: 1,
      },
      sourceFiles: [
        {
          filePath: 'src/session.js',
          executableMethodCount: 2,
          fileNameGrammar: {
            classification: 'noun-or-capability-label',
          },
          owningBodyContracts: [],
          featureScenarioTieOut: {
            featureIds: [],
            scenarioIds: [],
          },
          decomposition: {
            status: 'decomposition recommended',
            reason: 'the executable file name is a noun or capability label instead of an action-bearing body',
            proposedFiles: [
              {
                proposedFilePath: 'src/builds-session/builds-session.js',
                contractActionRequired: 'declare the proposed file path in a file-system body contract before promotion',
              },
            ],
          },
          findingCodes: [
            'executable-file-name-missing-action-verb',
            'file-body-contract-missing',
            'scenario-tieout-missing',
            'decomposition-recommended',
          ],
        },
      ],
      findingCodes: [
        'decomposition-recommended',
        'executable-file-name-missing-action-verb',
        'file-body-contract-missing',
        'scenario-tieout-missing',
      ],
    };

    const receipt = writesDomainBodyAnalysisEvidence({ rootDir: tempDir }, analysisContract);
    const expectedPath = path.join(tempDir, analysisContract.evidencePath);
    const expectedHandoffPath = path.join(tempDir, 'evidence/runs/run-analysis-1/domain-analysis/domain-body-analysis.handoff.v1.json');
    const expectedReportPath = path.join(tempDir, analysisContract.reportPath);

    assert.equal(receipt.evidencePath, expectedPath);
    assert.equal(receipt.handoffPath, expectedHandoffPath);
    assert.equal(receipt.reportPath, expectedReportPath);
    assert.equal(fs.existsSync(expectedPath), true);
    assert.equal(fs.existsSync(expectedHandoffPath), true);
    assert.equal(fs.existsSync(expectedReportPath), true);
    assert.deepEqual(JSON.parse(fs.readFileSync(expectedPath, 'utf8')), analysisContract);

    const handoff = JSON.parse(fs.readFileSync(expectedHandoffPath, 'utf8'));
    assert.equal(handoff.schemaVersion, 'domain-body-analysis-handoff.v1');
    assert.equal(handoff.sourceContractPath, analysisContract.evidencePath);
    assert.equal(handoff.workQueues.contractRepair.length, 1);
    assert.equal(handoff.workQueues.scenarioTieOut.length, 1);
    assert.equal(handoff.workQueues.namingReview.length, 1);
    assert.equal(handoff.workQueues.decompositionReview.length, 1);
    assert.equal(handoff.topRisks[0].recommendedWorker, 'Contract Steward Worker');

    const report = fs.readFileSync(expectedReportPath, 'utf8');
    assert.match(report, /Canonical JSON evidence: evidence\/runs\/run-analysis-1\/domain-analysis\/domain-body-analysis\.contract\.v1\.json/);
    assert.match(report, /LLM handoff JSON: evidence\/runs\/run-analysis-1\/domain-analysis\/domain-body-analysis\.handoff\.v1\.json/);
    assert.match(report, /## Executive Domain Analysis Summary/);
    assert.match(report, /Analysis blocker candidates: 1/);
    assert.match(report, /## Priority Work Queues/);
    assert.match(report, /## Top Domain Body Risks/);
    assert.doesNotMatch(report, /## LLM Handoff Facts/);
    assert.match(report, /src\/session\.js/);
    assert.doesNotMatch(report, /declare the proposed file path/);
    assert.equal(receipt.bytesWritten > 0, true);
    assert.equal(receipt.handoffBytesWritten > 0, true);
    assert.equal(receipt.reportBytesWritten > 0, true);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
