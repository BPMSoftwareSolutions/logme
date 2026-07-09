const test = require('node:test');
const assert = require('node:assert/strict');

const { rendersMarkdownTable } = require('../packages/logme-report-primitives/src/renders-markdown-table');

test('rendersMarkdownTable returns literal string when methods array is empty', () => {
  const methods = [];
  const result = rendersMarkdownTable(methods);

  assert.equal(result, '_No methods found._');
});

test('rendersMarkdownTable renders header and separator for populated methods', () => {
  const methods = [
    {
      scanOrder: 1,
      name: 'methodOne',
      kind: 'function',
      hasLogMeCall: true,
      filePath: 'src/foo.js',
      lineStart: 10,
      lineEnd: 20,
    },
  ];

  const result = rendersMarkdownTable(methods);

  assert.match(result, /\| Scan Order \| Method \| Kind \| LogMe \| Location \|/);
  assert.match(result, /\| --- \| --- \| --- \| --- \| --- \|/);
});

test('rendersMarkdownTable formats rows with correct column values', () => {
  const methods = [
    {
      scanOrder: 1,
      name: 'methodOne',
      kind: 'function',
      hasLogMeCall: true,
      filePath: 'src/foo.js',
      lineStart: 10,
      lineEnd: 20,
    },
    {
      scanOrder: 2,
      name: 'methodTwo',
      kind: 'arrow',
      hasLogMeCall: false,
      filePath: 'src/bar.js',
      lineStart: 5,
      lineEnd: 15,
    },
  ];

  const result = rendersMarkdownTable(methods);

  assert.match(result, /\| 1 \| methodOne \| function \| yes \| src\/foo\.js:10-20 \|/);
  assert.match(result, /\| 2 \| methodTwo \| arrow \| no \| src\/bar\.js:5-15 \|/);
});

test('rendersMarkdownTable joins all rows with newlines', () => {
  const methods = [
    {
      scanOrder: 1,
      name: 'methodOne',
      kind: 'function',
      hasLogMeCall: true,
      filePath: 'src/foo.js',
      lineStart: 10,
      lineEnd: 20,
    },
    {
      scanOrder: 2,
      name: 'methodTwo',
      kind: 'arrow',
      hasLogMeCall: false,
      filePath: 'src/bar.js',
      lineStart: 5,
      lineEnd: 15,
    },
  ];

  const result = rendersMarkdownTable(methods);
  const lines = result.split('\n');

  assert.equal(lines[0], '| Scan Order | Method | Kind | LogMe | Location |');
  assert.equal(lines[1], '| --- | --- | --- | --- | --- |');
  assert(lines[2].includes('methodOne'));
  assert(lines[3].includes('methodTwo'));
});
