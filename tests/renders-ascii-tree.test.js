const test = require('node:test');
const assert = require('node:assert/strict');

const { rendersAsciiTree } = require('../packages/logme-report-primitives/src/renders-ascii-tree');

test('rendersAsciiTree groups methods by filePath and renders indented tree', () => {
  const methods = [
    {
      name: 'methodOne',
      filePath: 'lab/foo.js',
    },
    {
      name: 'methodTwo',
      filePath: 'lab/foo.js',
    },
    {
      name: 'methodThree',
      filePath: 'lab/bar.js',
    },
  ];

  const result = rendersAsciiTree(methods);
  const lines = result.split('\n');

  assert.equal(lines[0], 'lab/foo.js');
  assert.equal(lines[1], '  - methodOne');
  assert.equal(lines[2], '  - methodTwo');
  assert.equal(lines[3], 'lab/bar.js');
  assert.equal(lines[4], '  - methodThree');
});

test('rendersAsciiTree preserves file order by first encounter', () => {
  const methods = [
    {
      name: 'methodA',
      filePath: 'src/module-a.js',
    },
    {
      name: 'methodB',
      filePath: 'src/module-b.js',
    },
    {
      name: 'methodC',
      filePath: 'src/module-a.js',
    },
  ];

  const result = rendersAsciiTree(methods);
  const lines = result.split('\n');

  assert.equal(lines[0], 'src/module-a.js');
  assert.equal(lines[1], '  - methodA');
  assert.equal(lines[2], '  - methodC');
  assert.equal(lines[3], 'src/module-b.js');
  assert.equal(lines[4], '  - methodB');
});

test('rendersAsciiTree handles empty methods array', () => {
  const methods = [];

  const result = rendersAsciiTree(methods);

  assert.equal(result, '');
});

test('rendersAsciiTree handles single file with single method', () => {
  const methods = [
    {
      name: 'onlyMethod',
      filePath: 'src/only.js',
    },
  ];

  const result = rendersAsciiTree(methods);
  const lines = result.split('\n');

  assert.equal(lines[0], 'src/only.js');
  assert.equal(lines[1], '  - onlyMethod');
  assert.equal(lines.length, 2);
});
