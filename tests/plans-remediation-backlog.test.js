const test = require('node:test');
const assert = require('node:assert/strict');

const { plansRemediationBacklog } = require('../src/plans-remediation-backlog/plans-remediation-backlog');

function buildsAnalysisContract(runId) {
  return {
    schemaVersion: 'domain-body-analysis.contract.v1',
    runId,
    evidencePath: `evidence/runs/${runId}/domain-analysis/domain-body-analysis.contract.v1.json`,
    sourceFiles: [
      {
        filePath: 'src/example/example.js',
        findingCodes: ['executable-file-name-missing-action-verb', 'scenario-tieout-missing', 'decomposition-recommended'],
      },
      {
        filePath: 'src/other/other.js',
        findingCodes: ['file-body-contract-missing', 'scenario-tieout-missing'],
      },
    ],
  };
}

function buildsSprawlContract(runId) {
  return {
    schemaVersion: 'domain-body-sprawl.contract.v1',
    runId,
    evidencePath: `evidence/runs/${runId}/sprawl/domain-body-sprawl.contract.v1.json`,
    sourceFiles: [
      {
        filePath: 'src/example/example.js',
        findingCodes: ['god-file-candidate', 'package-worthy-mechanic-inside-domain-body'],
      },
    ],
    artifactFindings: [
      { code: 'orphan-source-file', filePath: 'src/orphan/orphan.js' },
    ],
  };
}

test('plansRemediationBacklog builds packets grouped by finding code with run-scoped paths', () => {
  const runId = 'run-abc123';
  const backlog = plansRemediationBacklog({}, buildsAnalysisContract(runId), buildsSprawlContract(runId));

  assert.equal(backlog.schemaVersion, 'remediation-backlog.v1');
  assert.equal(backlog.sourceRunId, runId);
  assert.equal(backlog.workspacePath, `quality/domain-remediation/${runId}/`);
  assert.equal(backlog.evidencePath, `quality/domain-remediation/${runId}/remediation-backlog.v1.json`);
  assert.equal(backlog.sourceArtifacts.domainAnalysisContractPath, `evidence/runs/${runId}/domain-analysis/domain-body-analysis.contract.v1.json`);
  assert.equal(backlog.sourceArtifacts.domainSprawlContractPath, `evidence/runs/${runId}/sprawl/domain-body-sprawl.contract.v1.json`);

  const packetIds = backlog.backlogItems.map((item) => item.packetId);
  assert.ok(packetIds.includes('domain-remediation-scenario-tieout'));
  assert.ok(packetIds.includes('domain-remediation-body-contract'));
  assert.ok(packetIds.includes('domain-remediation-actionless-naming'));
  assert.ok(packetIds.includes('domain-remediation-decomposition'));
  assert.ok(packetIds.includes('domain-remediation-package-extraction'));
  assert.ok(packetIds.includes('domain-remediation-god-file'));
  assert.ok(packetIds.includes('domain-remediation-orphan-artifacts'));
  assert.ok(!packetIds.includes('domain-remediation-mixed-responsibility'));

  const scenarioItem = backlog.backlogItems.find((item) => item.packetId === 'domain-remediation-scenario-tieout');
  assert.deepEqual(scenarioItem.findingCodes, ['scenario-tieout-missing']);
  assert.deepEqual(scenarioItem.affectedPaths, ['src/example/example.js', 'src/other/other.js']);
  assert.equal(scenarioItem.affectedFileCount, 2);
  assert.equal(scenarioItem.recommendedWorker, 'scenario-tieout-worker');
  assert.deepEqual(scenarioItem.blockedPaths, [`evidence/runs/${runId}/`]);
  assert.deepEqual(scenarioItem.verificationCommands, ['npm test', 'npm run report:truth:fast']);
  assert.ok(scenarioItem.requiredEvidenceOutputs[0].includes(runId));
  assert.ok(scenarioItem.allowedMutationPaths.every((allowedPath) => !allowedPath.includes('<run-id>')));

  const bodyContractItem = backlog.backlogItems.find((item) => item.packetId === 'domain-remediation-body-contract');
  assert.deepEqual(bodyContractItem.affectedPaths, ['src/other/other.js']);

  const orphanItem = backlog.backlogItems.find((item) => item.packetId === 'domain-remediation-orphan-artifacts');
  assert.deepEqual(orphanItem.affectedPaths, ['src/orphan/orphan.js']);
});

test('plansRemediationBacklog does not rewrite or reference source evidence files', () => {
  const runId = 'run-def456';
  const analysisContract = buildsAnalysisContract(runId);
  const sprawlContract = buildsSprawlContract(runId);
  const frozenAnalysis = JSON.stringify(analysisContract);
  const frozenSprawl = JSON.stringify(sprawlContract);

  plansRemediationBacklog({}, analysisContract, sprawlContract);

  assert.equal(JSON.stringify(analysisContract), frozenAnalysis);
  assert.equal(JSON.stringify(sprawlContract), frozenSprawl);
});

test('plansRemediationBacklog throws when analysis and sprawl contracts disagree on run id', () => {
  const analysisContract = buildsAnalysisContract('run-one');
  const sprawlContract = buildsSprawlContract('run-two');

  assert.throws(() => plansRemediationBacklog({}, analysisContract, sprawlContract), /same source run id/u);
});
