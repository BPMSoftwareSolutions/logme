const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

function clustersFunctionsByCallGraph(callGraphResult) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const adjacency = buildsUndirectedAdjacency(callGraphResult.functionNames, callGraphResult.callGraph);
  const visited = new Set();
  const clusters = [];

  for (const functionName of callGraphResult.functionNames) {
    if (visited.has(functionName)) {
      continue;
    }

    const clusterMembers = walksConnectedComponent(functionName, adjacency, visited);
    clusters.push(buildsCluster(clusterMembers, callGraphResult));
  }

  clusters.sort(comparesClustersByMemberCountDescending);
  return clusters;
}

function buildsUndirectedAdjacency(functionNames, callGraph) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const adjacency = new Map();
  for (const functionName of functionNames) {
    adjacency.set(functionName, new Set());
  }

  for (const [callerName, calleeNames] of callGraph) {
    for (const calleeName of calleeNames) {
      adjacency.get(callerName).add(calleeName);
      adjacency.get(calleeName).add(callerName);
    }
  }

  return adjacency;
}

function walksConnectedComponent(startName, adjacency, visited) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const componentMembers = [];
  const queue = [startName];
  visited.add(startName);

  while (queue.length > 0) {
    const currentName = queue.shift();
    componentMembers.push(currentName);

    for (const neighborName of adjacency.get(currentName)) {
      if (!visited.has(neighborName)) {
        visited.add(neighborName);
        queue.push(neighborName);
      }
    }
  }

  return componentMembers.sort();
}

function buildsCluster(clusterMembers, callGraphResult) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const freeIdentifiers = new Set();
  for (const memberName of clusterMembers) {
    for (const freeIdentifier of callGraphResult.freeIdentifiersByFunction.get(memberName) || []) {
      freeIdentifiers.add(freeIdentifier);
    }
  }

  return {
    memberNames: clusterMembers,
    freeIdentifiers: Array.from(freeIdentifiers).sort(),
  };
}

function comparesClustersByMemberCountDescending(firstCluster, secondCluster) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return secondCluster.memberNames.length - firstCluster.memberNames.length;
}

module.exports = {
  clustersFunctionsByCallGraph,
};
