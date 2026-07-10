const test = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');

const { collectsReferencedIdentifiers } = require('../packages/logme-method-inventory-primitives/src/collects-referenced-identifiers');

function parsesBody(sourceText) {
  const wrapped = `function f() { ${sourceText} }`;
  const sourceFile = ts.createSourceFile('a.js', wrapped, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  let functionBody = null;

  function visit(node) {
    if (ts.isFunctionDeclaration(node) && node.name && node.name.text === 'f') {
      functionBody = node.body;
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return functionBody;
}

test('collectsReferencedIdentifiers finds a plain identifier reference', () => {
  const identifiers = collectsReferencedIdentifiers(parsesBody('return value;'));
  assert.ok(identifiers.has('value'));
});

test('collectsReferencedIdentifiers does not treat a property-access name as a free identifier', () => {
  const identifiers = collectsReferencedIdentifiers(parsesBody('return value.replace("a", "b");'));
  assert.ok(identifiers.has('value'));
  assert.ok(!identifiers.has('replace'));
});

test('collectsReferencedIdentifiers does not treat an object literal key as a free identifier', () => {
  const identifiers = collectsReferencedIdentifiers(parsesBody('return { rounded: value };'));
  assert.ok(identifiers.has('value'));
  assert.ok(!identifiers.has('rounded'));
});

test('collectsReferencedIdentifiers treats a shorthand property as a reference to its value', () => {
  const identifiers = collectsReferencedIdentifiers(parsesBody('return { shorthandValue };'));
  assert.ok(identifiers.has('shorthandValue'));
});
