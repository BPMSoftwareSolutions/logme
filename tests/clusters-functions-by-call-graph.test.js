const test = require('node:test');
const assert = require('node:assert/strict');

const { mapsFunctionCallGraph } = require('../packages/logme-method-inventory-primitives/src/maps-function-call-graph');
const { clustersFunctionsByCallGraph } = require('../packages/logme-method-inventory-primitives/src/clusters-functions-by-call-graph');

test('clustersFunctionsByCallGraph groups mutually-calling functions into one cluster', () => {
  const content = [
    'function a() { return b(); }',
    'function b() { return c(); }',
    'function c() { return 1; }',
    'function standAlone() { return 2; }',
  ].join('\n');

  const graph = mapsFunctionCallGraph(content, 'a.js');
  const clusters = clustersFunctionsByCallGraph(graph);

  assert.equal(clusters.length, 2);
  const bigCluster = clusters.find((cluster) => cluster.memberNames.length === 3);
  assert.deepEqual(bigCluster.memberNames, ['a', 'b', 'c']);
  const smallCluster = clusters.find((cluster) => cluster.memberNames.length === 1);
  assert.deepEqual(smallCluster.memberNames, ['standAlone']);
});

test('clustersFunctionsByCallGraph unions free identifiers across all members of a cluster', () => {
  const content = [
    "const SHARED = 'x';",
    'function a() { return b() + SHARED; }',
    'function b() { return OTHER; }',
  ].join('\n');

  const graph = mapsFunctionCallGraph(content, 'a.js');
  const clusters = clustersFunctionsByCallGraph(graph);

  assert.equal(clusters.length, 1);
  assert.deepEqual(clusters[0].freeIdentifiers, ['OTHER', 'SHARED']);
});

test('clustersFunctionsByCallGraph sorts clusters by member count descending', () => {
  const content = [
    'function bigOne() { return bigTwo(); }',
    'function bigTwo() { return bigThree(); }',
    'function bigThree() { return 1; }',
    'function loneWolf() { return 2; }',
  ].join('\n');

  const graph = mapsFunctionCallGraph(content, 'a.js');
  const clusters = clustersFunctionsByCallGraph(graph);

  assert.equal(clusters[0].memberNames.length, 3);
  assert.equal(clusters[1].memberNames.length, 1);
});

test('clustersFunctionsByCallGraph places every function into exactly one cluster', () => {
  const content = [
    'function a() { return b(); }',
    'function b() { return a(); }',
    'function c() { return 1; }',
  ].join('\n');

  const graph = mapsFunctionCallGraph(content, 'a.js');
  const clusters = clustersFunctionsByCallGraph(graph);

  const allMembers = [];
  for (const cluster of clusters) {
    allMembers.push(...cluster.memberNames);
  }

  assert.deepEqual(allMembers.sort(), ['a', 'b', 'c']);
});
