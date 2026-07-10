const test = require('node:test');
const assert = require('node:assert/strict');

const {
  challengesScenarioTieOutProposal,
  challengesBodyContractPatch,
  challengesRenamePlan,
  challengesPackageExtractionPlan,
} = require('../src/challenges-worker-proposal/challenges-worker-proposal');

test('challengesScenarioTieOutProposal objects to a mapping with no evidence citation', () => {
  const tieOutProposal = {
    mappings: [
      { filePath: 'src/a/a.js', evidenceCitation: null, findingCodes: ['scenario-tieout-unsupported'] },
      { filePath: 'src/b/b.js', evidenceCitation: { source: 'test file', reference: 'tests/b.test.js' }, findingCodes: [] },
    ],
  };

  const review = challengesScenarioTieOutProposal(tieOutProposal);

  assert.equal(review.packetId, 'scenario-tieout-worker');
  assert.equal(review.objections.length, 1);
  assert.equal(review.objections[0].risk, 'scenario mapping without evidence');
  assert.equal(review.objections[0].affectedPath, 'src/a/a.js');
  assert.equal(review.objections[0].severity, 'high');
  assert.equal(review.highRiskObjectionCount, 1);
  assert.equal(review.promotionVerdict, 'BLOCKED');
});

test('challengesScenarioTieOutProposal is promotable when every mapping has a real evidence citation', () => {
  const tieOutProposal = {
    mappings: [
      { filePath: 'src/b/b.js', evidenceCitation: { source: 'test file', reference: 'tests/b.test.js' }, findingCodes: [] },
    ],
  };

  const review = challengesScenarioTieOutProposal(tieOutProposal);

  assert.equal(review.objections.length, 0);
  assert.equal(review.promotionVerdict, 'PROMOTABLE');
});

test('challengesBodyContractPatch objects to a path-only entry', () => {
  const bodyContractPatch = {
    entries: [
      { path: 'src/a/a.js', bodyKind: 'product-domain body', responsibility: null, verification: null },
    ],
  };

  const review = challengesBodyContractPatch(bodyContractPatch);

  assert.equal(review.objections[0].risk, 'contract patch that only lists paths');
  assert.equal(review.promotionVerdict, 'BLOCKED');
});

test('challengesBodyContractPatch objects to a waiver missing owner, reason, and expiry', () => {
  const bodyContractPatch = {
    entries: [
      { path: 'src/a/a.js', bodyKind: 'waiver', responsibility: 'unclear', verification: 'declared by worker', reasoningNote: null },
    ],
  };

  const review = challengesBodyContractPatch(bodyContractPatch);

  assert.equal(review.objections[0].risk, 'waiver without owner, reason, and expiry');
  assert.match(review.objections[0].reasoning, /owner/u);
  assert.match(review.objections[0].reasoning, /expiry/u);
});

test('challengesRenamePlan objects to a proposed name using a forbidden generic utility token', () => {
  const renamePlan = {
    entries: [
      { currentPath: 'src/a/a.js', classification: 'mechanical rename', proposedPath: 'src/utils/utils.js', affectedTests: ['tests/a.test.js'] },
    ],
  };

  const review = challengesRenamePlan(renamePlan);

  assert.equal(review.objections.length, 1);
  assert.equal(review.objections[0].risk, 'decomposition that creates generic names');
});

test('challengesRenamePlan objects to a rename with no affected tests on record', () => {
  const renamePlan = {
    entries: [
      { currentPath: 'src/a/a.js', classification: 'mechanical rename', proposedPath: 'src/reads-thing/reads-thing.js', affectedTests: [] },
    ],
  };

  const review = challengesRenamePlan(renamePlan);

  assert.equal(review.objections.length, 1);
  assert.equal(review.objections[0].risk, 'behavior change without test coverage');
});

test('challengesRenamePlan does not re-flag an entry that proposes-rename-plan already marked unresolved', () => {
  const renamePlan = {
    entries: [
      {
        currentPath: 'packages/x/reads-thing.js',
        classification: 'mechanical rename',
        proposedPath: null,
        affectedTests: [],
        findingCodes: ['rename-plan-unresolved'],
        reasoningNote: 'proposed path is itself noun-only',
      },
    ],
  };

  const review = challengesRenamePlan(renamePlan);

  assert.equal(review.objections.length, 0);
  assert.equal(review.promotionVerdict, 'PROMOTABLE');
});

test('challengesRenamePlan ignores entries that are not rename-eligible classifications', () => {
  const renamePlan = {
    entries: [
      { currentPath: 'src/a/a.js', classification: 'decompose before rename', proposedPath: null, affectedTests: [] },
    ],
  };

  const review = challengesRenamePlan(renamePlan);

  assert.equal(review.objections.length, 0);
  assert.equal(review.promotionVerdict, 'PROMOTABLE');
});

test('challengesPackageExtractionPlan objects to an extraction with no domain call-site guidance', () => {
  const packageExtractionPlan = {
    sections: [
      { filePath: 'src/a/a.js', classification: 'new package', domainCallSiteGuidance: '' },
    ],
  };

  const review = challengesPackageExtractionPlan(packageExtractionPlan);

  assert.equal(review.objections[0].risk, 'package extraction that hides domain meaning');
  assert.equal(review.promotionVerdict, 'BLOCKED');
});

test('challengesPackageExtractionPlan ignores retained/rejected classifications', () => {
  const packageExtractionPlan = {
    sections: [
      { filePath: 'src/a/a.js', classification: 'retained domain body', domainCallSiteGuidance: '' },
      { filePath: 'src/b/b.js', classification: 'rejected extraction', domainCallSiteGuidance: null },
    ],
  };

  const review = challengesPackageExtractionPlan(packageExtractionPlan);

  assert.equal(review.objections.length, 0);
});
