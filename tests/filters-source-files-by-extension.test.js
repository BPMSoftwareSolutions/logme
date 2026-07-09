const test = require('node:test');
const assert = require('node:assert/strict');

const { filtersSourceFilesByExtension } = require('../packages/logme-source-body-primitives/src/filters-source-files-by-extension');

test('filtersSourceFilesByExtension returns true when file has included extension', () => {
  const includeList = ['.js', '.ts'];
  assert.equal(filtersSourceFilesByExtension('index.js', includeList), true);
});

test('filtersSourceFilesByExtension returns false when file has excluded extension', () => {
  const includeList = ['.js', '.ts'];
  assert.equal(filtersSourceFilesByExtension('README.md', includeList), false);
});

test('filtersSourceFilesByExtension returns true when file extension matches case-insensitively', () => {
  const includeList = ['.js', '.ts'];
  assert.equal(filtersSourceFilesByExtension('FILE.JS', includeList), true);
});

test('filtersSourceFilesByExtension returns false when file has no extension', () => {
  const includeList = ['.js', '.ts'];
  assert.equal(filtersSourceFilesByExtension('Makefile', includeList), false);
});
