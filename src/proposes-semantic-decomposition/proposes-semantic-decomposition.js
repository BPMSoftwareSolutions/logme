const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { callsDecompositionClusteringWorker } = require('../calls-decomposition-clustering-worker/calls-decomposition-clustering-worker');

const UNRESOLVED_CLUSTER_FINDING = 'decomposition-sub-cluster-unresolved';

async function proposesSemanticDecomposition(callGraphResult, clusters, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const callWorker = options.callWorker || callsDecompositionClusteringWorker;
  const minimumClusterSizeToSplit = options.minimumClusterSizeToSplit || 10;
  const resolvedGroups = [];

  for (const cluster of clusters) {
    if (cluster.memberNames.length < minimumClusterSizeToSplit) {
      resolvedGroups.push(buildsSingleGroupFromCluster(cluster));
      continue;
    }

    const request = buildsClusteringRequest(cluster, callGraphResult);
    const workerResult = await callWorker(request, options.callerOptions || {});
    resolvedGroups.push(...resolvesSubClustersFromWorkerResult(cluster, callGraphResult, workerResult));
  }

  return resolvedGroups;
}

function buildsSingleGroupFromCluster(cluster) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    memberNames: cluster.memberNames,
    freeIdentifiers: cluster.freeIdentifiers,
    proposedFileStem: null,
    responsibility: null,
    findingCodes: [],
    reasoningNote: `cluster has ${cluster.memberNames.length} members, below the semantic-split threshold; kept as one group`,
  };
}

function buildsClusteringRequest(cluster, callGraphResult) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const clusterMemberNames = new Set(cluster.memberNames);
  const callGraph = {};

  for (const memberName of cluster.memberNames) {
    const calledNamesWithinCluster = [];
    for (const calledName of callGraphResult.callGraph.get(memberName) || []) {
      if (clusterMemberNames.has(calledName)) {
        calledNamesWithinCluster.push(calledName);
      }
    }

    callGraph[memberName] = calledNamesWithinCluster;
  }

  return { memberNames: cluster.memberNames, callGraph };
}

function resolvesSubClustersFromWorkerResult(cluster, callGraphResult, workerResult) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (workerResult.callFailure) {
    return [buildsUnresolvedGroup(cluster, `worker call failed: ${workerResult.callFailure.type} - ${workerResult.callFailure.message}`)];
  }

  const parsed = parsesWorkerResponseText(workerResult.rawResponseText);
  if (!parsed) {
    const truncationNote = workerResult.finishReason === 'MAX_TOKENS' ? ' (response was truncated at the token limit)' : '';
    return [buildsUnresolvedGroup(cluster, `worker response was not valid JSON${truncationNote}`)];
  }

  const verification = verifiesSubClusters(cluster, parsed.subClusters);
  if (!verification.verified) {
    return [buildsUnresolvedGroup(cluster, verification.reason)];
  }

  const crossClusterCycle = findsCrossSubClusterCycle(parsed.subClusters, callGraphResult);
  if (crossClusterCycle) {
    return [buildsUnresolvedGroup(cluster, `proposed split creates a circular dependency between sub-clusters: ${crossClusterCycle}`)];
  }

  return buildsResolvedSubClusters(parsed.subClusters, cluster, callGraphResult);
}

function parsesWorkerResponseText(rawResponseText) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!rawResponseText) {
    return null;
  }

  try {
    return JSON.parse(rawResponseText);
  } catch {
    return null;
  }
}

function verifiesSubClusters(cluster, subClusters) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!Array.isArray(subClusters) || subClusters.length === 0) {
    return { verified: false, reason: 'worker returned no subClusters' };
  }

  const originalMembers = new Set(cluster.memberNames);
  const seenMembers = new Set();

  for (const subCluster of subClusters) {
    if (!subCluster.proposedFileStem || !/^[a-z][a-z0-9-]*$/u.test(subCluster.proposedFileStem)) {
      return { verified: false, reason: `sub-cluster has an invalid proposedFileStem "${subCluster.proposedFileStem}"` };
    }

    if (!Array.isArray(subCluster.memberNames) || subCluster.memberNames.length === 0) {
      return { verified: false, reason: `sub-cluster "${subCluster.proposedFileStem}" has no members` };
    }

    for (const memberName of subCluster.memberNames) {
      if (!originalMembers.has(memberName)) {
        return { verified: false, reason: `sub-cluster "${subCluster.proposedFileStem}" names invented member "${memberName}" that is not in the original cluster` };
      }

      if (seenMembers.has(memberName)) {
        return { verified: false, reason: `member "${memberName}" appears in more than one proposed sub-cluster` };
      }

      seenMembers.add(memberName);
    }
  }

  if (seenMembers.size !== originalMembers.size) {
    const missingMembers = [];
    for (const memberName of originalMembers) {
      if (!seenMembers.has(memberName)) {
        missingMembers.push(memberName);
      }
    }

    return { verified: false, reason: `proposal drops ${missingMembers.length} member(s) that must be placed: ${missingMembers.join(', ')}` };
  }

  return { verified: true, reason: null };
}

function findsCrossSubClusterCycle(subClusters, callGraphResult) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const subClusterByMember = new Map();
  for (const subCluster of subClusters) {
    for (const memberName of subCluster.memberNames) {
      subClusterByMember.set(memberName, subCluster.proposedFileStem);
    }
  }

  for (const subCluster of subClusters) {
    for (const memberName of subCluster.memberNames) {
      const calledNames = callGraphResult.callGraph.get(memberName) || [];
      for (const calledName of calledNames) {
        const calledStem = subClusterByMember.get(calledName);
        if (!calledStem || calledStem === subCluster.proposedFileStem) {
          continue;
        }

        const backCalledNames = callGraphResult.callGraph.get(calledName) || [];
        if (backCalledNames.includes(memberName)) {
          return `${subCluster.proposedFileStem} <-> ${calledStem} (${memberName} <-> ${calledName})`;
        }
      }
    }
  }

  return null;
}

function buildsResolvedSubClusters(subClusters, cluster, callGraphResult) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const resolvedGroups = [];
  for (const subCluster of subClusters) {
    const subClusterMembers = new Set(subCluster.memberNames);
    const freeIdentifiers = new Set();

    for (const memberName of subCluster.memberNames) {
      for (const freeIdentifier of callGraphResult.freeIdentifiersByFunction.get(memberName) || []) {
        freeIdentifiers.add(freeIdentifier);
      }

      for (const calledName of callGraphResult.callGraph.get(memberName) || []) {
        if (!subClusterMembers.has(calledName)) {
          freeIdentifiers.add(calledName);
        }
      }
    }

    resolvedGroups.push({
      memberNames: subCluster.memberNames,
      freeIdentifiers: Array.from(freeIdentifiers).sort(),
      proposedFileStem: subCluster.proposedFileStem,
      responsibility: subCluster.responsibility,
      findingCodes: [],
      reasoningNote: subCluster.responsibility,
    });
  }

  return resolvedGroups;
}

function buildsUnresolvedGroup(cluster, reason) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    memberNames: cluster.memberNames,
    freeIdentifiers: cluster.freeIdentifiers,
    proposedFileStem: null,
    responsibility: null,
    findingCodes: [UNRESOLVED_CLUSTER_FINDING],
    reasoningNote: reason,
  };
}

module.exports = {
  UNRESOLVED_CLUSTER_FINDING,
  proposesSemanticDecomposition,
};
