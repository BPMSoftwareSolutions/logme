const test = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');

const { resolvesMethodKind } = require('../packages/logme-method-inventory-primitives/src/resolves-method-kind');

test('resolvesMethodKind identifies function declarations', () => {
  const source = 'function foo() { }';
  const sourceFile = ts.createSourceFile('test.js', source, ts.ScriptTarget.Latest, true);
  let node;
  ts.forEachChild(sourceFile, (child) => {
    if (ts.isFunctionDeclaration(child)) {
      node = child;
    }
  });

  assert.equal(resolvesMethodKind(node), 'function');
});

test('resolvesMethodKind identifies arrow functions', () => {
  const source = 'const foo = () => { }';
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

  assert.equal(resolvesMethodKind(node), 'arrow-function');
});

test('resolvesMethodKind identifies function expressions', () => {
  const source = 'const foo = function() { }';
  const sourceFile = ts.createSourceFile('test.js', source, ts.ScriptTarget.Latest, true);
  let node;
  ts.forEachChild(sourceFile, (child) => {
    if (ts.isVariableStatement(child)) {
      const decl = child.declarationList.declarations[0];
      if (ts.isFunctionExpression(decl.initializer)) {
        node = decl.initializer;
      }
    }
  });

  assert.equal(resolvesMethodKind(node), 'function-expression');
});

test('resolvesMethodKind identifies method declarations', () => {
  const source = 'class Foo { bar() { } }';
  const sourceFile = ts.createSourceFile('test.ts', source, ts.ScriptTarget.Latest, true);
  let node;
  ts.forEachChild(sourceFile, (child) => {
    if (ts.isClassDeclaration(child)) {
      ts.forEachChild(child, (member) => {
        if (ts.isMethodDeclaration(member)) {
          node = member;
        }
      });
    }
  });

  assert.equal(resolvesMethodKind(node), 'method');
});

test('resolvesMethodKind identifies getter accessors', () => {
  const source = 'class Foo { get bar() { return 1; } }';
  const sourceFile = ts.createSourceFile('test.ts', source, ts.ScriptTarget.Latest, true);
  let node;
  ts.forEachChild(sourceFile, (child) => {
    if (ts.isClassDeclaration(child)) {
      ts.forEachChild(child, (member) => {
        if (ts.isGetAccessorDeclaration(member)) {
          node = member;
        }
      });
    }
  });

  assert.equal(resolvesMethodKind(node), 'getter');
});

test('resolvesMethodKind identifies setter accessors', () => {
  const source = 'class Foo { set bar(v) { } }';
  const sourceFile = ts.createSourceFile('test.ts', source, ts.ScriptTarget.Latest, true);
  let node;
  ts.forEachChild(sourceFile, (child) => {
    if (ts.isClassDeclaration(child)) {
      ts.forEachChild(child, (member) => {
        if (ts.isSetAccessorDeclaration(member)) {
          node = member;
        }
      });
    }
  });

  assert.equal(resolvesMethodKind(node), 'setter');
});
