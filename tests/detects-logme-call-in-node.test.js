const test = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');

const { detectsLogmeCallInNode } = require('../packages/logme-method-inventory-primitives/src/detects-logme-call-in-node');

test('detectsLogmeCallInNode finds direct LogMe call', () => {
  const source = 'function foo() { LogMe(x); }';
  const sourceFile = ts.createSourceFile('test.js', source, ts.ScriptTarget.Latest, true);
  let node;
  ts.forEachChild(sourceFile, (child) => {
    if (ts.isFunctionDeclaration(child)) {
      node = child;
    }
  });

  assert.equal(detectsLogmeCallInNode(node), true);
});

test('detectsLogmeCallInNode finds LogMe via property access', () => {
  const source = 'function foo() { this.LogMe(x); }';
  const sourceFile = ts.createSourceFile('test.js', source, ts.ScriptTarget.Latest, true);
  let node;
  ts.forEachChild(sourceFile, (child) => {
    if (ts.isFunctionDeclaration(child)) {
      node = child;
    }
  });

  assert.equal(detectsLogmeCallInNode(node), true);
});

test('detectsLogmeCallInNode returns false when no LogMe call', () => {
  const source = 'function foo() { bar(x); }';
  const sourceFile = ts.createSourceFile('test.js', source, ts.ScriptTarget.Latest, true);
  let node;
  ts.forEachChild(sourceFile, (child) => {
    if (ts.isFunctionDeclaration(child)) {
      node = child;
    }
  });

  assert.equal(detectsLogmeCallInNode(node), false);
});

test('detectsLogmeCallInNode does not descend into nested functions', () => {
  const source = `
    function foo() {
      function inner() {
        LogMe(x);
      }
    }
  `;
  const sourceFile = ts.createSourceFile('test.js', source, ts.ScriptTarget.Latest, true);
  let node;
  ts.forEachChild(sourceFile, (child) => {
    if (ts.isFunctionDeclaration(child)) {
      node = child;
    }
  });

  assert.equal(detectsLogmeCallInNode(node), false);
});

test('detectsLogmeCallInNode finds LogMe in arrow function body', () => {
  const source = 'const foo = () => { LogMe(x); }';
  const sourceFile = ts.createSourceFile('test.js', source, ts.ScriptTarget.Latest, true);
  let node;
  ts.forEachChild(sourceFile, (child) => {
    if (ts.isVariableStatement(child)) {
      const decl = child.declarationList.declarations[0];
      if (ts.isArrowFunction(decl.initializer)) {
        node = decl.initializer;
      }
    }
  });

  assert.equal(detectsLogmeCallInNode(node), true);
});
