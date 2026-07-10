const test = require('node:test');
const assert = require('node:assert/strict');

const { extractsSelfContainedMethodSource } = require('../packages/logme-method-inventory-primitives/src/extracts-self-contained-method-source');

test('extractsSelfContainedMethodSource extracts a method with no free identifiers', () => {
  const content = [
    "const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');",
    "const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');",
    '',
    'function formatsMarkdownCell(value) {',
    "  if (process.env.LOGME_AUDIT === '1') {",
    '    LogMe(sampleMethod);',
    '  }',
    '',
    "  return String(value).replace(/\\|/gu, '\\\\|');",
    '}',
    '',
    'module.exports = { formatsMarkdownCell };',
  ].join('\n');

  const result = extractsSelfContainedMethodSource(content, 'a.js', 'formatsMarkdownCell');

  assert.equal(result.extracted, true);
  assert.match(result.sourceText, /function formatsMarkdownCell\(value\)/u);
  assert.match(result.sourceText, /LogMe\(sampleMethod\)/u);
});

test('extractsSelfContainedMethodSource refuses a method that references a module-level constant', () => {
  const content = [
    "const FIELDS = ['a', 'b'];",
    '',
    'function buildsSchema() {',
    '  return { fields: FIELDS };',
    '}',
  ].join('\n');

  const result = extractsSelfContainedMethodSource(content, 'a.js', 'buildsSchema');

  assert.equal(result.extracted, false);
  assert.match(result.reason, /FIELDS/u);
});

test('extractsSelfContainedMethodSource allows references to declared parameters and local variables', () => {
  const content = [
    'function addsNumbers(first, second) {',
    '  const sum = first + second;',
    '  return sum;',
    '}',
  ].join('\n');

  const result = extractsSelfContainedMethodSource(content, 'a.js', 'addsNumbers');

  assert.equal(result.extracted, true);
});

test('extractsSelfContainedMethodSource returns extracted:false when the method is not found', () => {
  const content = 'function somethingElse() { return 1; }';

  const result = extractsSelfContainedMethodSource(content, 'a.js', 'doesNotExist');

  assert.equal(result.extracted, false);
  assert.match(result.reason, /no top-level function declaration/u);
});

test('extractsSelfContainedMethodSource allows global built-ins like JSON and Math', () => {
  const content = [
    'function buildsPayload(value) {',
    '  return JSON.stringify({ rounded: Math.round(value) });',
    '}',
  ].join('\n');

  const result = extractsSelfContainedMethodSource(content, 'a.js', 'buildsPayload');

  assert.equal(result.extracted, true);
});
