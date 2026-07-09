const test = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');

const { resolvesMethodName } = require('../packages/logme-method-inventory-primitives/src/resolves-method-name');

test('resolvesMethodName identifies named function declarations', () => {
  const source = 'function foo() { }';
  const sourceFile = ts.createSourceFile('test.js', source, ts.ScriptTarget.Latest, true);
  let node;
  ts.forEachChild(sourceFile, (child) => {
    if (ts.isFunctionDeclaration(child)) {
      node = child;
    }
  });

  const result = resolvesMethodName(node, sourceFile);
  assert.equal(result.name, 'foo');
  assert.equal(result.isAnonymous, false);
});

test('resolvesMethodName identifies arrow function assigned to const', () => {
  const source = 'const bar = () => { }';
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

  const result = resolvesMethodName(node, sourceFile);
  assert.equal(result.name, 'bar');
  assert.equal(result.isAnonymous, false);
});

test('resolvesMethodName marks anonymous arrow as anonymous with fallback', () => {
  const source = '[1, 2, 3].map(x => x + 1)';
  const sourceFile = ts.createSourceFile('test.js', source, ts.ScriptTarget.Latest, true);
  let node;
  ts.forEachChild(sourceFile, (child) => {
    if (ts.isExpressionStatement(child)) {
      const expr = child.expression;
      if (ts.isCallExpression(expr)) {
        const args = expr.arguments;
        if (args.length > 0 && ts.isArrowFunction(args[0])) {
          node = args[0];
        }
      }
    }
  });

  const result = resolvesMethodName(node, sourceFile);
  assert.equal(result.isAnonymous, true);
  assert.match(result.name, /arrow-function @ \d+:\d+/);
});

test('resolvesMethodName identifies method declaration in class', () => {
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

  const result = resolvesMethodName(node, sourceFile);
  assert.equal(result.name, 'bar');
  assert.equal(result.isAnonymous, false);
});

test('resolvesMethodName identifies function assigned to property', () => {
  const source = 'const obj = { foo: function() { } }';
  const sourceFile = ts.createSourceFile('test.js', source, ts.ScriptTarget.Latest, true);
  let node;
  ts.forEachChild(sourceFile, (child) => {
    if (ts.isVariableStatement(child)) {
      const decl = child.declarationList.declarations[0];
      const init = decl.initializer;
      if (ts.isObjectLiteralExpression(init)) {
        ts.forEachChild(init, (prop) => {
          if (ts.isPropertyAssignment(prop) && ts.isFunctionExpression(prop.initializer)) {
            node = prop.initializer;
          }
        });
      }
    }
  });

  const result = resolvesMethodName(node, sourceFile);
  assert.equal(result.name, 'foo');
  assert.equal(result.isAnonymous, false);
});
