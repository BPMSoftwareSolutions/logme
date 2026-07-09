const test = require('node:test');
const assert = require('node:assert/strict');

const { rendersMarkdownSummary } = require('../packages/logme-report-primitives/src/renders-markdown-summary');

test('rendersMarkdownSummary returns cleanFindingsLabel when findings array is empty', () => {
  const contract = {
    findings: [],
    domainContract: {
      cleanFindingsLabel: 'All checks passed!',
    },
  };

  const result = rendersMarkdownSummary(contract);

  assert.equal(result, 'All checks passed!');
});

test('rendersMarkdownSummary renders findings with code, file, and reason', () => {
  const contract = {
    findings: [
      {
        code: 'silent-method',
        filePath: 'src/foo.js',
        methodName: 'methodOne',
        reason: 'Missing LogMe call',
      },
    ],
    domainContract: {
      cleanFindingsLabel: 'All checks passed!',
    },
  };

  const result = rendersMarkdownSummary(contract);

  assert.match(result, /- silent-method/);
  assert.match(result, /file: src\/foo\.js/);
  assert.match(result, /method: methodOne/);
  assert.match(result, /reason: Missing LogMe call/);
});

test('rendersMarkdownSummary omits method line when methodName is falsy', () => {
  const contract = {
    findings: [
      {
        code: 'generic-utility',
        filePath: 'src/utils.js',
        methodName: null,
        reason: 'Utility path detected',
      },
    ],
    domainContract: {
      cleanFindingsLabel: 'All checks passed!',
    },
  };

  const result = rendersMarkdownSummary(contract);

  assert.match(result, /- generic-utility/);
  assert.match(result, /file: src\/utils\.js/);
  assert.match(result, /reason: Utility path detected/);
  assert(!result.includes('method:'));
});

test('rendersMarkdownSummary joins multiple findings with double newline', () => {
  const contract = {
    findings: [
      {
        code: 'silent-method',
        filePath: 'src/foo.js',
        methodName: 'methodOne',
        reason: 'Missing LogMe call',
      },
      {
        code: 'anonymous-method',
        filePath: 'src/bar.js',
        methodName: 'arrowFunc',
        reason: 'Anonymous function detected',
      },
    ],
    domainContract: {
      cleanFindingsLabel: 'All checks passed!',
    },
  };

  const result = rendersMarkdownSummary(contract);

  assert(result.includes('\n\n'));
  const parts = result.split('\n\n');
  assert.equal(parts.length, 2);
});
