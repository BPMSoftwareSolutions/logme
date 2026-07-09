const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const {
  buildsFeatureExecutionProof,
  buildsFeatureProofPath,
  rendersScenarioTimingTable,
} = require('../feature-execution-proof/feature-execution-proof');
const {
  buildsExecutionNodesFromProof,
} = require('../feature-scoped-ascii-execution-flow-report/feature-scoped-ascii-execution-flow-report');

const NOT_EXECUTED = 'not executed';
const MISSING = 'missing';

function buildsFeatureScenarioEvidencePacketPath(evidenceRoot, runId, featureId, scenarioId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return path.join(evidenceRoot, 'runs', runId, 'features', featureId, 'scenarios', scenarioId);
}

function buildsPacketArtifactPath(packetPath, artifactName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return path.join(packetPath, artifactName);
}

function writesJsonArtifact(artifactPath, content) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  fs.mkdirSync(path.dirname(artifactPath), { recursive: true });
  fs.writeFileSync(artifactPath, `${JSON.stringify(content, null, 2)}\n`, 'utf8');

  return artifactPath;
}

function writesMarkdownArtifact(artifactPath, content) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  fs.mkdirSync(path.dirname(artifactPath), { recursive: true });
  fs.writeFileSync(artifactPath, content.endsWith('\n') ? content : `${content}\n`, 'utf8');

  return artifactPath;
}

function formatsRepoRelativePath(rootDir, filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!filePath) {
    return MISSING;
  }

  if (!path.isAbsolute(filePath)) {
    return String(filePath).replace(/\\/gu, '/');
  }

  return path.relative(rootDir || process.cwd(), filePath).replace(/\\/gu, '/');
}

function rendersBranchLines(branches, indent, showSiblingSeparators) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [];

  for (let index = 0; index < branches.length; index += 1) {
    const branch = branches[index];
    const isLast = index === branches.length - 1;
    const connector = isLast ? '`-- ' : '|-- ';
    const nextIndent = `${indent}${isLast ? '    ' : '|   '}`;
    lines.push(`${indent}${connector}${branch.label}`);

    if (Array.isArray(branch.children) && branch.children.length > 0) {
      const childLines = rendersBranchLines(branch.children, nextIndent, false);

      for (const childLine of childLines) {
        lines.push(childLine);
      }
    } else if (branch.value !== undefined) {
      lines.push(`${nextIndent}\`-- ${branch.value}`);
    }

    if (showSiblingSeparators && !isLast) {
      lines.push(`${indent}|`);
    }
  }

  return lines;
}

function rendersExecutionNode(node) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [`[${node.nodeId}] ${node.label}`];
  const branchLines = rendersBranchLines(node.branches || [], '', true);

  for (const branchLine of branchLines) {
    lines.push(branchLine);
  }

  return lines.join('\n');
}

function rendersExecutableBodyTree(proof, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const nodes = buildsExecutionNodesFromProof(proof, rootDir);
  const lines = [
    '```text',
    'EXECUTABLE BODY CONTRACT - FILE-SYSTEM EXECUTION TREE',
    `Feature : ${proof.featureId}`,
    `Scenario: ${proof.scenarioName}`,
    `Run     : ${proof.runId}`,
    '',
  ];

  for (let index = 0; index < nodes.length; index += 1) {
    lines.push(rendersExecutionNode(nodes[index]));

    if (index < nodes.length - 1) {
      lines.push('');
    }
  }

  lines.push('```');
  return lines.join('\n');
}

function rendersExecutableBodyTreeArtifact(proof, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    `# Executable Body Tree: ${proof.scenarioName}`,
    '',
    `- Run id: ${proof.runId}`,
    `- Feature id: ${proof.featureId}`,
    `- Scenario id: ${proof.scenarioId}`,
    '',
    rendersExecutableBodyTree(proof, options),
    '',
  ].join('\n');
}

function rendersExecutableBodyContractReport(proof, paths, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const executableBodyTree = rendersExecutableBodyTree(proof, options);
  const timingTable = rendersScenarioTimingTable(proof, rootDir);

  if (options.reportTemplatePath) {
    return rendersReportTemplate(fs.readFileSync(options.reportTemplatePath, 'utf8'), {
      title: proof.scenarioName,
      runId: proof.runId,
      featureId: proof.featureId,
      scenarioId: proof.scenarioId,
      evidencePacketPath: formatsRepoRelativePath(rootDir, paths.packetPath),
      canonicalJsonProofPath: formatsRepoRelativePath(rootDir, paths.proofPath),
      executionTimelineTablePath: formatsRepoRelativePath(rootDir, paths.timelineTablePath),
      executableBodyTree,
      timingTable,
    });
  }

  return [
    `# ${proof.scenarioName}`,
    '',
    '## Executable Body Tree',
    '',
    executableBodyTree,
    '',
    '## Evidence Packet',
    '',
    `- Run id: ${proof.runId}`,
    `- Feature id: ${proof.featureId}`,
    `- Scenario id: ${proof.scenarioId}`,
    `- Evidence packet path: ${formatsRepoRelativePath(rootDir, paths.packetPath)}`,
    `- Canonical JSON proof: ${formatsRepoRelativePath(rootDir, paths.proofPath)}`,
    `- Execution timeline table: ${formatsRepoRelativePath(rootDir, paths.timelineTablePath)}`,
    '',
    '## Dense Timing Detail',
    '',
    timingTable,
    '',
  ].join('\n');
}

function rendersReportTemplate(templateContent, values) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  let rendered = templateContent;

  for (const key of Object.keys(values)) {
    rendered = rendered.split(`{{${key}}}`).join(String(values[key]));
  }

  return rendered;
}

function buildsTelemetryTieout(proof) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const nodes = [];

  for (const node of proof.observedExecutionTimeline || []) {
    nodes.push({
      nodeId: node.nodeId,
      nodeLabel: node.nodeLabel,
      runtimePath: node.runtimePath,
      telemetryEventIds: node.telemetryEventIds,
      telemetryEventPath: node.telemetryEventPath,
      status: node.callCount > 0 ? 'tied out' : 'missing',
    });
  }

  return {
    schemaVersion: 'telemetry.tieout.v1',
    runId: proof.runId,
    featureId: proof.featureId,
    scenarioId: proof.scenarioId,
    telemetrySourcePaths: proof.telemetrySourcePaths,
    nodes,
  };
}

function buildsReceiptCoverage(proof) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const nodes = [];

  for (const node of proof.observedExecutionTimeline || []) {
    nodes.push({
      nodeId: node.nodeId,
      nodeLabel: node.nodeLabel,
      requiredReceiptStatus: node.receiptStatus,
      receiptPaths: node.receiptPaths,
      status: node.receiptStatus === 'observed' ? 'covered' : 'missing',
    });
  }

  return {
    schemaVersion: 'receipt-coverage.v1',
    runId: proof.runId,
    featureId: proof.featureId,
    scenarioId: proof.scenarioId,
    receiptSourcePaths: proof.receiptSourcePaths,
    nodes,
  };
}

function buildsPromotionDecisionArtifact(proof) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    schemaVersion: 'promotion-decision.v1',
    runId: proof.runId,
    featureId: proof.featureId,
    scenarioId: proof.scenarioId,
    decision: proof.promotionDecision.status === 'proven' ? 'PROMOTED' : 'BLOCKED',
    promotionDecision: proof.promotionDecision,
    blockerFindings: proof.blockerFindings,
  };
}

function buildsFeatureExecutionReceipt(proof, paths) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    schemaVersion: 'feature-execution.receipt.v1',
    runId: proof.runId,
    featureId: proof.featureId,
    scenarioId: proof.scenarioId,
    generatedAt: proof.generatedAt,
    artifacts: {
      executableBodyContractReport: paths.reportPath,
      executableBodyTree: paths.treePath,
      executionTimelineTable: paths.timelineTablePath,
      featureExecutionContract: paths.proofPath,
      telemetryTieout: paths.telemetryTieoutPath,
      receiptCoverage: paths.receiptCoveragePath,
      promotionDecision: paths.promotionDecisionPath,
      featureExecutionReceipt: paths.receiptPath,
    },
  };
}

function buildsPacketPaths(packetPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    packetPath,
    reportPath: buildsPacketArtifactPath(packetPath, 'executable-body-contract.report.md'),
    treePath: buildsPacketArtifactPath(packetPath, 'executable-body-tree.ascii.md'),
    timelineTablePath: buildsPacketArtifactPath(packetPath, 'execution-timeline.table.md'),
    proofPath: buildsPacketArtifactPath(packetPath, 'feature-execution.contract.v1.json'),
    telemetryTieoutPath: buildsPacketArtifactPath(packetPath, 'telemetry.tieout.v1.json'),
    receiptCoveragePath: buildsPacketArtifactPath(packetPath, 'receipt-coverage.v1.json'),
    promotionDecisionPath: buildsPacketArtifactPath(packetPath, 'promotion-decision.v1.json'),
    receiptPath: buildsPacketArtifactPath(packetPath, 'feature-execution.receipt.v1.json'),
  };
}

function writesFeatureScenarioEvidencePacket(proofInput, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const evidenceRoot = options.evidenceRoot || path.join(rootDir, 'evidence');
  const proof = proofInput.schemaVersion === 'feature-execution.contract.v1'
    ? proofInput
    : buildsFeatureExecutionProof(proofInput);
  const packetPath = options.packetPath || buildsFeatureScenarioEvidencePacketPath(evidenceRoot, proof.runId, proof.featureId, proof.scenarioId);
  const paths = buildsPacketPaths(packetPath);
  const proofWithPath = {
    ...proof,
    proofPath: formatsRepoRelativePath(rootDir, paths.proofPath),
  };

  writesJsonArtifact(paths.proofPath, proofWithPath);
  writesMarkdownArtifact(paths.treePath, rendersExecutableBodyTreeArtifact(proofWithPath, { rootDir }));
  writesMarkdownArtifact(paths.timelineTablePath, [
    `# Execution Timeline: ${proof.scenarioName}`,
    '',
    `- Run id: ${proof.runId}`,
    `- Feature id: ${proof.featureId}`,
    `- Scenario id: ${proof.scenarioId}`,
    '',
    rendersScenarioTimingTable(proofWithPath, rootDir),
    '',
  ].join('\n'));
  writesJsonArtifact(paths.telemetryTieoutPath, buildsTelemetryTieout(proofWithPath));
  writesJsonArtifact(paths.receiptCoveragePath, buildsReceiptCoverage(proofWithPath));
  writesJsonArtifact(paths.promotionDecisionPath, buildsPromotionDecisionArtifact(proofWithPath));
  writesJsonArtifact(paths.receiptPath, buildsFeatureExecutionReceipt(proofWithPath, paths));
  writesMarkdownArtifact(paths.reportPath, rendersExecutableBodyContractReport(proofWithPath, paths, {
    rootDir,
    reportTemplatePath: options.reportTemplatePath,
  }));

  return {
    packetPath,
    paths,
    proof: proofWithPath,
  };
}

function checksFeatureScenarioPromotionEvidence(evidenceRoot, runId, featureId, scenarioId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const packetPath = buildsFeatureScenarioEvidencePacketPath(evidenceRoot, runId, featureId, scenarioId);
  const reportPath = buildsPacketArtifactPath(packetPath, 'executable-body-contract.report.md');
  const proofPath = buildsFeatureProofPath(evidenceRoot, runId, featureId, scenarioId);

  if (!fs.existsSync(packetPath) || !fs.existsSync(reportPath) || !fs.existsSync(proofPath)) {
    return {
      verdict: 'BLOCKED',
      findings: [
        {
          code: 'feature-executable-body-report-missing',
          reason: 'the executed feature scenario is missing its scenario evidence packet, report, or canonical JSON proof',
          packetPath,
        },
      ],
    };
  }

  return {
    verdict: 'PASS',
    findings: [],
    packetPath,
  };
}

function buildsFeatureEvidenceIndexRow(proof, packetPath, rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const paths = buildsPacketPaths(packetPath);
  const blockerCount = proof.promotionDecision.blockerCodes.length;

  return {
    featureId: proof.featureId,
    scenarioId: proof.scenarioId,
    featureVerdict: proof.promotionDecision.status === 'proven' ? 'proven' : 'blocked',
    blockerCount,
    evidencePacketPath: formatsRepoRelativePath(rootDir, packetPath),
    executableBodyReportPath: formatsRepoRelativePath(rootDir, paths.reportPath),
    executionTimelineTablePath: formatsRepoRelativePath(rootDir, paths.timelineTablePath),
  };
}

function buildsNotExecutedFeatureEvidenceIndexRow(featureId, scenarioId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    featureId,
    scenarioId,
    featureVerdict: NOT_EXECUTED,
    blockerCount: NOT_EXECUTED,
    evidencePacketPath: NOT_EXECUTED,
    executableBodyReportPath: NOT_EXECUTED,
    executionTimelineTablePath: NOT_EXECUTED,
  };
}

function rendersFeatureEvidenceIndex(rows) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [
    '| feature id | scenario id | feature verdict | blocker count | evidence packet path | executable body report path | execution timeline table path |',
    '| --- | --- | --- | ---: | --- | --- | --- |',
  ];

  for (const row of rows) {
    lines.push(`| ${row.featureId} | ${row.scenarioId} | ${row.featureVerdict} | ${row.blockerCount} | ${row.evidencePacketPath} | ${row.executableBodyReportPath} | ${row.executionTimelineTablePath} |`);
  }

  return `${lines.join('\n')}\n`;
}

module.exports = {
  buildsFeatureEvidenceIndexRow,
  buildsFeatureScenarioEvidencePacketPath,
  buildsNotExecutedFeatureEvidenceIndexRow,
  checksFeatureScenarioPromotionEvidence,
  rendersExecutableBodyTree,
  rendersFeatureEvidenceIndex,
  writesFeatureScenarioEvidencePacket,
};
