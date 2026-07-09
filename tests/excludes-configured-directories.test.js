const test = require('node:test');
const assert = require('node:assert/strict');

const { excludesConfiguredDirectories } = require('../packages/logme-source-body-primitives/src/excludes-configured-directories');

test('excludesConfiguredDirectories returns true when directory name is in the exclude list (case-insensitive)', () => {
  const excludeList = ['node_modules', '.git', 'dist'];
  assert.equal(excludesConfiguredDirectories('node_modules', excludeList), true);
});

test('excludesConfiguredDirectories returns true when directory name matches with different case', () => {
  const excludeList = ['node_modules', '.git', 'dist'];
  assert.equal(excludesConfiguredDirectories('Node_Modules', excludeList), true);
});

test('excludesConfiguredDirectories returns false when directory name is not in the exclude list', () => {
  const excludeList = ['node_modules', '.git', 'dist'];
  assert.equal(excludesConfiguredDirectories('src', excludeList), false);
});

test('excludesConfiguredDirectories returns false when exclude list is empty', () => {
  const excludeList = [];
  assert.equal(excludesConfiguredDirectories('node_modules', excludeList), false);
});
