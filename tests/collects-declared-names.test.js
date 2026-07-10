const test = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');

const { collectsDeclaredNames } = require('../packages/logme-method-inventory-primitives/src/collects-declared-names');

function parsesFunctionDeclaration(sourceText) {
  const sourceFile = ts.createSourceFile('a.js', sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  let functionNode = null;

  function visit(node) {
    if (ts.isFunctionDeclaration(node) && node.name && node.name.text === 'f') {
      functionNode = node;
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return functionNode;
}

test('collectsDeclaredNames includes function parameters', () => {
  const declaredNames = collectsDeclaredNames(parsesFunctionDeclaration('function f(first, second) { return first; }'));
  assert.ok(declaredNames.has('first'));
  assert.ok(declaredNames.has('second'));
});

test('collectsDeclaredNames includes local variable declarations', () => {
  const declaredNames = collectsDeclaredNames(parsesFunctionDeclaration('function f() { const localValue = 1; return localValue; }'));
  assert.ok(declaredNames.has('localValue'));
});

test('collectsDeclaredNames includes nested function declaration names', () => {
  const declaredNames = collectsDeclaredNames(parsesFunctionDeclaration('function f() { function nested() { return 1; } return nested(); }'));
  assert.ok(declaredNames.has('nested'));
});
