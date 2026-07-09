const test = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');

const { extractsExecutableMethodNodes } = require('../packages/logme-method-inventory-primitives/src/extracts-executable-method-nodes');

test('extractsExecutableMethodNodes extracts function declarations', () => {
  const source = 'function foo() { } function bar() { }';
  const sourceFile = ts.createSourceFile('test.js', source, ts.ScriptTarget.Latest, true);

  const nodes = extractsExecutableMethodNodes(sourceFile);

  assert.equal(nodes.length, 2);
  assert.equal(ts.isFunctionDeclaration(nodes[0]), true);
  assert.equal(ts.isFunctionDeclaration(nodes[1]), true);
});

test('extractsExecutableMethodNodes extracts arrow functions assigned to const', () => {
  const source = 'const foo = () => { } const bar = () => { }';
  const sourceFile = ts.createSourceFile('test.js', source, ts.ScriptTarget.Latest, true);

  const nodes = extractsExecutableMethodNodes(sourceFile);

  assert.equal(nodes.length, 2);
  assert.equal(ts.isArrowFunction(nodes[0]), true);
  assert.equal(ts.isArrowFunction(nodes[1]), true);
});

test('extractsExecutableMethodNodes extracts function expressions', () => {
  const source = 'const foo = function() { }';
  const sourceFile = ts.createSourceFile('test.js', source, ts.ScriptTarget.Latest, true);

  const nodes = extractsExecutableMethodNodes(sourceFile);

  assert.equal(nodes.length, 1);
  assert.equal(ts.isFunctionExpression(nodes[0]), true);
});

test('extractsExecutableMethodNodes extracts method declarations from classes', () => {
  const source = 'class Foo { bar() { } baz() { } }';
  const sourceFile = ts.createSourceFile('test.ts', source, ts.ScriptTarget.Latest, true);

  const nodes = extractsExecutableMethodNodes(sourceFile);

  assert.equal(nodes.length, 2);
  assert.equal(ts.isMethodDeclaration(nodes[0]), true);
  assert.equal(ts.isMethodDeclaration(nodes[1]), true);
});

test('extractsExecutableMethodNodes extracts getter and setter accessors', () => {
  const source = 'class Foo { get bar() { return 1; } set bar(v) { } }';
  const sourceFile = ts.createSourceFile('test.ts', source, ts.ScriptTarget.Latest, true);

  const nodes = extractsExecutableMethodNodes(sourceFile);

  assert.equal(nodes.length, 2);
  assert.equal(ts.isGetAccessorDeclaration(nodes[0]), true);
  assert.equal(ts.isSetAccessorDeclaration(nodes[1]), true);
});

test('extractsExecutableMethodNodes returns empty array for source with no methods', () => {
  const source = 'const x = 42; const str = "hello";';
  const sourceFile = ts.createSourceFile('test.js', source, ts.ScriptTarget.Latest, true);

  const nodes = extractsExecutableMethodNodes(sourceFile);

  assert.equal(nodes.length, 0);
});
