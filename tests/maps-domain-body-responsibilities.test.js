const test = require('node:test');
const assert = require('node:assert/strict');

const { mapsDomainBodyResponsibilities } = require('../src/maps-domain-body-responsibilities/maps-domain-body-responsibilities');

function buildsAnalysisContract(runId) {
  return {
    schemaVersion: 'domain-body-analysis.contract.v1',
    runId,
    evidencePath: `evidence/runs/${runId}/domain-analysis/domain-body-analysis.contract.v1.json`,
    sourceFiles: [
      {
        filePath: 'src/renders-report/renders-report.js',
        responsibilityClusters: [{ name: 'render-report', methodNames: ['rendersReport'] }],
        featureScenarioTieOut: { status: 'missing scenario tie-out' },
        findingCodes: ['scenario-tieout-missing'],
      },
      {
        filePath: 'src/mixed-body/mixed-body.js',
        responsibilityClusters: [
          { name: 'validate-thing', methodNames: ['validatesThing'] },
          { name: 'render-thing', methodNames: ['rendersThing'] },
        ],
        featureScenarioTieOut: { status: 'missing scenario tie-out' },
        findingCodes: ['scenario-tieout-missing'],
      },
      {
        filePath: 'src/package-worthy/package-worthy.js',
        responsibilityClusters: [{ name: 'format-string', methodNames: ['formatsString'] }],
        featureScenarioTieOut: { status: 'tied out', featureIds: ['logme'], scenarioIds: ['scenario:x'] },
        findingCodes: [],
      },
      {
        filePath: 'packages/logme-config-primitives/src/lowercases-string-list.js',
        responsibilityClusters: [{ name: 'unclear-action', methodNames: ['lowercasesStringList'] }],
        featureScenarioTieOut: { status: 'missing scenario tie-out' },
        findingCodes: ['scenario-tieout-missing'],
      },
      {
        filePath: 'scaffold.js',
        responsibilityClusters: [{ name: 'unclear-action', methodNames: ['scaffold'] }],
        featureScenarioTieOut: { status: 'missing scenario tie-out' },
        findingCodes: ['scenario-tieout-missing'],
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
      { filePath: 'src/mixed-body/mixed-body.js', findingCodes: ['mixed-responsibility-file'] },
      { filePath: 'src/package-worthy/package-worthy.js', findingCodes: ['package-worthy-mechanic-inside-domain-body'] },
    ],
  };
}

test('mapsDomainBodyResponsibilities classifies every file with exactly one primary responsibility', () => {
  const runId = 'run-cartography-1';
  const domainMap = mapsDomainBodyResponsibilities({}, buildsAnalysisContract(runId), buildsSprawlContract(runId));

  assert.equal(domainMap.schemaVersion, 'domain-map.proposal.v1');
  assert.equal(domainMap.sourceRunId, runId);
  assert.equal(domainMap.evidencePath, `quality/domain-remediation/${runId}/domain-map.proposal.v1.json`);
  assert.equal(domainMap.reportPath, `quality/domain-remediation/${runId}/domain-map.report.md`);
  assert.equal(domainMap.fileEntries.length, 5);

  for (const entry of domainMap.fileEntries) {
    assert.ok(typeof entry.primaryBodyResponsibility === 'string' && entry.primaryBodyResponsibility.length > 0);
  }

  const byPath = new Map(domainMap.fileEntries.map((entry) => [entry.filePath, entry]));

  assert.equal(byPath.get('src/renders-report/renders-report.js').classification, 'product-domain body');
  assert.equal(byPath.get('src/mixed-body/mixed-body.js').classification, 'ambiguous');
  assert.equal(byPath.get('src/mixed-body/mixed-body.js').waiverClassCandidate, true);
  assert.equal(byPath.get('src/package-worthy/package-worthy.js').classification, 'ambiguous');
  assert.equal(byPath.get('packages/logme-config-primitives/src/lowercases-string-list.js').classification, 'package primitive');
  assert.equal(byPath.get('scaffold.js').classification, 'scaffold or entrypoint');

  assert.equal(domainMap.summary.totalFilesMapped, 5);
  assert.equal(domainMap.summary.ambiguousFileCount, 2);
  assert.deepEqual(domainMap.summary.ambiguousFilePaths, ['src/mixed-body/mixed-body.js', 'src/package-worthy/package-worthy.js']);
  assert.equal(domainMap.summary.classificationCounts['product-domain body'], 1);
  assert.equal(domainMap.summary.classificationCounts['package primitive'], 1);
  assert.equal(domainMap.summary.classificationCounts['scaffold or entrypoint'], 1);
});

test('mapsDomainBodyResponsibilities leaves ambiguous files visible instead of forcing a weak mapping', () => {
  const runId = 'run-cartography-2';
  const domainMap = mapsDomainBodyResponsibilities({}, buildsAnalysisContract(runId), buildsSprawlContract(runId));

  const mixedEntry = domainMap.fileEntries.find((entry) => entry.filePath === 'src/mixed-body/mixed-body.js');
  assert.match(mixedEntry.classificationReason, /mixed-responsibility-file/u);

  const packageWorthyEntry = domainMap.fileEntries.find((entry) => entry.filePath === 'src/package-worthy/package-worthy.js');
  assert.match(packageWorthyEntry.classificationReason, /package-worthy generic mechanic/u);
});

test('mapsDomainBodyResponsibilities does not mutate the source evidence contracts', () => {
  const runId = 'run-cartography-3';
  const analysisContract = buildsAnalysisContract(runId);
  const sprawlContract = buildsSprawlContract(runId);
  const frozenAnalysis = JSON.stringify(analysisContract);
  const frozenSprawl = JSON.stringify(sprawlContract);

  mapsDomainBodyResponsibilities({}, analysisContract, sprawlContract);

  assert.equal(JSON.stringify(analysisContract), frozenAnalysis);
  assert.equal(JSON.stringify(sprawlContract), frozenSprawl);
});

test('mapsDomainBodyResponsibilities throws when analysis and sprawl contracts disagree on run id', () => {
  const analysisContract = buildsAnalysisContract('run-one');
  const sprawlContract = buildsSprawlContract('run-two');

  assert.throws(() => mapsDomainBodyResponsibilities({}, analysisContract, sprawlContract), /same source run id/u);
});
