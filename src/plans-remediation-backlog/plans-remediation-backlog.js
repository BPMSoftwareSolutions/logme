const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const BACKLOG_SCHEMA_VERSION = 'remediation-backlog.v1';

const WORKER_ROUTES = [
  {
    packetId: 'domain-remediation-scenario-tieout',
    findingCode: 'scenario-tieout-missing',
    recommendedWorker: 'scenario-tieout-worker',
    allowedMutationPaths: [
      'docs/features/',
      'contracts/domains/logme/domain-body-analysis.schema.v1.json',
      'contracts/domains/logme/report-layout.schema.v1.json',
    ],
    requiredEvidenceOutputs: [
      'quality/domain-remediation/<run-id>/scenario-tieout.proposal.v1.json',
    ],
    promotionCriteria: [
      'Every proposed scenario tie-out cites a feature doc, test, executable method, report section, or receipt artifact.',
      'No unrelated code motion.',
    ],
  },
  {
    packetId: 'domain-remediation-body-contract',
    findingCode: 'file-body-contract-missing',
    recommendedWorker: 'contract-steward-worker',
    allowedMutationPaths: [
      'contracts/file-system-bodies/02_declared/logme.file-system-body.contract.v1.json',
      'docs/features/',
    ],
    requiredEvidenceOutputs: [
      'quality/domain-remediation/<run-id>/body-contract-patch.proposal.v1.json',
    ],
    promotionCriteria: [
      'Missing body contract count reaches 0, or each remaining file has an explicit waiver.',
      'New contract entries declare ownership and intent, not only a path.',
    ],
  },
  {
    packetId: 'domain-remediation-actionless-naming',
    findingCode: 'executable-file-name-missing-action-verb',
    recommendedWorker: 'naming-and-decomposition-worker',
    allowedMutationPaths: [
      'quality/domain-remediation/<run-id>/',
    ],
    requiredEvidenceOutputs: [
      'quality/domain-remediation/<run-id>/rename-plan.v1.json',
    ],
    promotionCriteria: [
      'No accepted executable file has a noun-only body name unless explicitly waived.',
      'Existing commands and tests continue to pass.',
    ],
  },
  {
    packetId: 'domain-remediation-decomposition',
    findingCode: 'decomposition-recommended',
    recommendedWorker: 'naming-and-decomposition-worker',
    allowedMutationPaths: [
      'quality/domain-remediation/<run-id>/',
    ],
    requiredEvidenceOutputs: [
      'quality/domain-remediation/<run-id>/decomposition-plan.report.md',
    ],
    promotionCriteria: [
      'Each decomposed body has one primary action.',
      'No new noun-named executable body is introduced.',
    ],
  },
  {
    packetId: 'domain-remediation-package-extraction',
    findingCode: 'package-worthy-mechanic-inside-domain-body',
    recommendedWorker: 'package-extraction-worker',
    allowedMutationPaths: [
      'quality/domain-remediation/<run-id>/',
    ],
    requiredEvidenceOutputs: [
      'quality/domain-remediation/<run-id>/package-extraction-plan.report.md',
    ],
    promotionCriteria: [
      'Extracted packages have declared ownership, allowed responsibilities, tests, and vocabulary boundaries.',
      'Domain call sites still read in domain language after extraction.',
    ],
  },
  {
    packetId: 'domain-remediation-god-file',
    findingCode: 'god-file-candidate',
    recommendedWorker: 'naming-and-decomposition-worker',
    allowedMutationPaths: [
      'quality/domain-remediation/<run-id>/',
    ],
    requiredEvidenceOutputs: [
      'quality/domain-remediation/<run-id>/decomposition-plan.report.md',
    ],
    promotionCriteria: [
      'Domain analysis and sprawl reports show measurable reduction or a documented reason for no change.',
    ],
  },
  {
    packetId: 'domain-remediation-mixed-responsibility',
    findingCode: 'mixed-responsibility-file',
    recommendedWorker: 'naming-and-decomposition-worker',
    allowedMutationPaths: [
      'quality/domain-remediation/<run-id>/',
    ],
    requiredEvidenceOutputs: [
      'quality/domain-remediation/<run-id>/decomposition-plan.report.md',
    ],
    promotionCriteria: [
      'Each decomposed body has one primary action.',
    ],
  },
  {
    packetId: 'domain-remediation-orphan-artifacts',
    findingCode: 'orphan-source-file',
    recommendedWorker: 'domain-cartographer-worker',
    allowedMutationPaths: [
      'quality/domain-remediation/<run-id>/',
    ],
    requiredEvidenceOutputs: [
      'quality/domain-remediation/<run-id>/domain-map.proposal.v1.json',
    ],
    promotionCriteria: [
      'Every executable file receives one proposed primary body responsibility.',
      'Ambiguous files remain visible for product-owner review instead of receiving forced weak mappings.',
    ],
  },
];

const VERIFICATION_COMMANDS = ['npm test', 'npm run report:truth:fast'];
const BLOCKED_PATH_TEMPLATE = 'evidence/runs/<run-id>/';

function plansRemediationBacklog(config, analysisContract, sprawlContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const runId = resolvesSourceRunId(analysisContract, sprawlContract);
  const findingsByCode = collectsFindingPathsByCode(analysisContract, sprawlContract);
  const backlogItems = [];

  for (const route of WORKER_ROUTES) {
    const affectedPaths = findingsByCode.get(route.findingCode) || [];
    if (affectedPaths.length === 0) {
      continue;
    }

    backlogItems.push(buildsBacklogItem(runId, route, affectedPaths));
  }

  return {
    schemaVersion: BACKLOG_SCHEMA_VERSION,
    sourceRunId: runId,
    workspacePath: `quality/domain-remediation/${runId}/`,
    evidencePath: `quality/domain-remediation/${runId}/remediation-backlog.v1.json`,
    sourceArtifacts: {
      domainAnalysisContractPath: analysisContract.evidencePath,
      domainSprawlContractPath: sprawlContract.evidencePath,
    },
    backlogItems,
  };
}

function resolvesSourceRunId(analysisContract, sprawlContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (analysisContract.runId !== sprawlContract.runId) {
    throw new Error('domain analysis and sprawl contracts must share the same source run id');
  }

  return analysisContract.runId;
}

function collectsFindingPathsByCode(analysisContract, sprawlContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const findingsByCode = new Map();

  for (const sourceFile of analysisContract.sourceFiles || []) {
    for (const findingCode of sourceFile.findingCodes || []) {
      recordsFindingPath(findingsByCode, findingCode, sourceFile.filePath);
    }
  }

  for (const sourceFile of sprawlContract.sourceFiles || []) {
    for (const findingCode of sourceFile.findingCodes || []) {
      recordsFindingPath(findingsByCode, findingCode, sourceFile.filePath);
    }
  }

  for (const artifactFinding of sprawlContract.artifactFindings || []) {
    recordsFindingPath(findingsByCode, artifactFinding.code, artifactFinding.filePath);
  }

  return findingsByCode;
}

function recordsFindingPath(findingsByCode, findingCode, filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!findingsByCode.has(findingCode)) {
    findingsByCode.set(findingCode, []);
  }

  const affectedPaths = findingsByCode.get(findingCode);
  if (!affectedPaths.includes(filePath)) {
    affectedPaths.push(filePath);
  }
}

function buildsBacklogItem(runId, route, affectedPaths) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const sortedPaths = [...affectedPaths].sort();

  return {
    packetId: route.packetId,
    sourceRunId: runId,
    findingCodes: [route.findingCode],
    affectedPaths: sortedPaths,
    recommendedWorker: route.recommendedWorker,
    allowedMutationPaths: resolvesRunScopedPaths(route.allowedMutationPaths, runId),
    blockedPaths: [resolvesRunScopedPath(BLOCKED_PATH_TEMPLATE, runId)],
    requiredEvidenceOutputs: resolvesRunScopedPaths(route.requiredEvidenceOutputs, runId),
    verificationCommands: [...VERIFICATION_COMMANDS],
    promotionCriteria: [...route.promotionCriteria],
    affectedFileCount: sortedPaths.length,
  };
}

function resolvesRunScopedPaths(pathTemplates, runId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const runScopedPaths = [];
  for (const pathTemplate of pathTemplates) {
    runScopedPaths.push(resolvesRunScopedPath(pathTemplate, runId));
  }

  return runScopedPaths;
}

function resolvesRunScopedPath(pathTemplate, runId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return pathTemplate.replace('<run-id>', runId);
}

module.exports = {
  BACKLOG_SCHEMA_VERSION,
  VERIFICATION_COMMANDS,
  WORKER_ROUTES,
  plansRemediationBacklog,
};
