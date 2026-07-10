const test = require('node:test');
const assert = require('node:assert/strict');

const { mapsFunctionCallGraph } = require('../packages/logme-method-inventory-primitives/src/maps-function-call-graph');

test('mapsFunctionCallGraph records which top-level functions call which other top-level functions', () => {
  const content = [
    'function readsValue(x) { return x; }',
    'function buildsThing(x) { return readsValue(x); }',
    'function standsAlone() { return 1; }',
  ].join('\n');

  const result = mapsFunctionCallGraph(content, 'a.js');

  assert.deepEqual(result.functionNames.sort(), ['buildsThing', 'readsValue', 'standsAlone']);
  assert.deepEqual(result.callGraph.get('buildsThing'), ['readsValue']);
  assert.deepEqual(result.callGraph.get('readsValue'), []);
  assert.deepEqual(result.callGraph.get('standsAlone'), []);
});

test('mapsFunctionCallGraph reports module-level free identifiers separately from calls', () => {
  const content = [
    "const CONSTANT = 'x';",
    'function usesConstant() { return CONSTANT; }',
  ].join('\n');

  const result = mapsFunctionCallGraph(content, 'a.js');

  assert.deepEqual(result.callGraph.get('usesConstant'), []);
  assert.deepEqual(result.freeIdentifiersByFunction.get('usesConstant'), ['CONSTANT']);
});

test('mapsFunctionCallGraph does not treat a locally declared variable as a free identifier or a call', () => {
  const content = [
    'function buildsThing() {',
    '  const readsValue = 5;',
    '  return readsValue;',
    '}',
    'function readsValue() { return 1; }',
  ].join('\n');

  const result = mapsFunctionCallGraph(content, 'a.js');

  assert.deepEqual(result.callGraph.get('buildsThing'), []);
  assert.deepEqual(result.freeIdentifiersByFunction.get('buildsThing'), []);
});

test('mapsFunctionCallGraph does not flag global built-ins or LogMe testimony calls as free identifiers', () => {
  const content = [
    "const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');",
    "const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');",
    '',
    'function buildsPayload(value) {',
    "  if (process.env.LOGME_AUDIT === '1') {",
    '    LogMe(sampleMethod);',
    '  }',
    '',
    '  return JSON.stringify(value);',
    '}',
  ].join('\n');

  const result = mapsFunctionCallGraph(content, 'a.js');

  assert.deepEqual(result.freeIdentifiersByFunction.get('buildsPayload'), []);
});
