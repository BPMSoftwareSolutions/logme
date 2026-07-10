const test = require('node:test');
const assert = require('node:assert/strict');

const { blocksUnsupportedScenarioTieOuts, UNSUPPORTED_FINDING } = require('../src/blocks-unsupported-scenario-tieouts/blocks-unsupported-scenario-tieouts');

test('blocksUnsupportedScenarioTieOuts blocks a mapping with no evidence citation', () => {
  const tieOutProposal = {
    mappings: [
      {
        filePath: 'src/a/a.js',
        evidenceCitation: null,
        findingCodes: [UNSUPPORTED_FINDING],
        reasoning: 'worker returned an empty evidence citation',
      },
    ],
  };

  const result = blocksUnsupportedScenarioTieOuts(tieOutProposal);

  assert.equal(result.verdict, 'BLOCKED');
  assert.equal(result.blockedMappings.length, 1);
  assert.equal(result.blockedMappings[0].filePath, 'src/a/a.js');
  assert.equal(result.blockedMappings[0].findingCode, UNSUPPORTED_FINDING);
  assert.match(result.blockedMappings[0].recommendedFix, /feature document, test, report section, or receipt artifact/u);
  assert.deepEqual(result.promotableMappings, []);
});

test('blocksUnsupportedScenarioTieOuts passes when every mapping has an evidence citation', () => {
  const tieOutProposal = {
    mappings: [
      {
        filePath: 'src/a/a.js',
        evidenceCitation: { source: 'feature document', reference: 'docs/features/example.feature.md' },
        findingCodes: [],
        reasoning: 'ok',
      },
    ],
  };

  const result = blocksUnsupportedScenarioTieOuts(tieOutProposal);

  assert.equal(result.verdict, 'PASS');
  assert.deepEqual(result.blockedMappings, []);
  assert.deepEqual(result.promotableMappings, ['src/a/a.js']);
});
