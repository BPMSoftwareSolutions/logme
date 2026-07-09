const test = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');

const { parsesJavascriptTypescriptSource } = require('../packages/logme-method-inventory-primitives/src/parses-javascript-typescript-source');

test('parsesJavascriptTypescriptSource parses JS file and returns SourceFile', () => {
  const source = 'function foo() { return 42; }';
  const result = parsesJavascriptTypescriptSource('test.js', source);

  assert.equal(result.kind, ts.SyntaxKind.SourceFile);
  assert.equal(typeof result.getLineAndCharacterOfPosition, 'function');
});

test('parsesJavascriptTypescriptSource parses TS file with TS ScriptKind', () => {
  const source = 'interface Foo { bar: string; }';
  const result = parsesJavascriptTypescriptSource('test.ts', source);

  assert.equal(result.kind, ts.SyntaxKind.SourceFile);
  assert.equal(typeof result.getLineAndCharacterOfPosition, 'function');
});

test('parsesJavascriptTypescriptSource handles empty source', () => {
  const result = parsesJavascriptTypescriptSource('empty.js', '');

  assert.equal(result.kind, ts.SyntaxKind.SourceFile);
});
