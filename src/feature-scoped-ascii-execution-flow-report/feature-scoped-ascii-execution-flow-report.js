const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { rendersAsciiExecutionFlow } = require('../../packages/logme-report-primitives/src/renders-ascii-execution-flow');
const { parsesExecutionSketchTemplate } = require('../../packages/logme-report-primitives/src/parses-execution-sketch-template');

const NOT_OBSERVED = 'not observed';
const MISSING = 'missing';
const DEFAULT_TEMPLATE_PATH = path.join(__dirname, '..', '..', 'contracts', 'templates', 'logme', 'execution-sketch.template.txt');

function formatsRepoRelativePath(rootDir, filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!filePath || filePath === NOT_OBSERVED || filePath === MISSING || filePath === 'not required') {
    return filePath || NOT_OBSERVED;
  }

  const withoutLineRange = String(filePath).match(/^(.+):(\d+-\d+)$/u);
  const pathOnly = withoutLineRange ? withoutLineRange[1] : String(filePath);
  const lineRange = withoutLineRange ? `:${withoutLineRange[2]}` : '';

  if (!path.isAbsolute(pathOnly)) {
    return `${pathOnly.replace(/\\/gu, '/')}${lineRange}`;
  }

  return `${path.relative(rootDir || process.cwd(), pathOnly).replace(/\\/gu, '/')}${lineRange}`;
}

function formatsRuntimePath(rootDir, node) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const runtimePath = formatsRepoRelativePath(rootDir, node.runtimePath);

  if (!node.sourceLineRange || node.sourceLineRange.start === NOT_OBSERVED || String(runtimePath).match(/:\d+-\d+$/u)) {
    return runtimePath;
  }

  return `${runtimePath}:${node.sourceLineRange.start}-${node.sourceLineRange.end}`;
}

function formatsFirstValue(values, fallback) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!Array.isArray(values) || values.length === 0) {
    return fallback;
  }

  return values[0];
}

function formatsRuntimeStep(node) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const firstTelemetryEventId = formatsFirstValue(node.telemetryEventIds, NOT_OBSERVED);

  if (firstTelemetryEventId === NOT_OBSERVED) {
    return NOT_OBSERVED;
  }

  return firstTelemetryEventId;
}

function formatsReceiptValue(rootDir, node) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (node.receiptStatus === MISSING) {
    return MISSING;
  }

  return formatsRepoRelativePath(rootDir, formatsFirstValue(node.receiptPaths, MISSING));
}

function formatsNodeStatus(node) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (node.status === 'observed') {
    return 'ok';
  }

  if (node.status === MISSING || node.status === NOT_OBSERVED) {
    return 'blocked';
  }

  return node.status || 'blocked';
}

function formatsBlockerValue(node) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return formatsFirstValue(node.blockerCodes, 'none');
}

function formatsFixRoute(blockerCode) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const fixRoutes = {
    'telemetry-not-observed': 'add runtime testimony tied to this body node',
    'required-receipt-missing': 'write the required receipt and link it to the node',
    'declared-but-silent': 'add runtime testimony and receipt proof',
    'runtime-duration-evidence-missing': 'emit start, end, or explicit duration evidence',
    'telemetry-observation-inferred-from-verdict': 'tie telemetry observation to raw runtime events',
    'product-method-name-not-observed': 'create a bounded Gemini testimony remediation packet',
    'executable-body-source-range-incomplete': 'propose an updated source range or decomposed body node',
  };

  return fixRoutes[blockerCode] || 'inspect the body node and rerun the feature proof';
}

function buildsAcceptanceSourceNode(proof, rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    nodeId: '00',
    label: 'ACCEPTANCE SOURCE',
    branches: [
      {
        label: 'gherkin',
        value: formatsRepoRelativePath(rootDir, proof.acceptanceSource && proof.acceptanceSource.path),
      },
      {
        label: 'acceptance criteria',
        value: 'feature-execution.contract.v1.json',
      },
      {
        label: 'proves',
        value: 'feature report opens with runtime body, evidence, and blockers first',
      },
    ],
  };
}

function buildsTelemetryChildren(node, rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    { label: `status        : ${node.callCount > 0 ? 'observed' : NOT_OBSERVED}` },
    { label: `runtime step  : ${formatsRuntimeStep(node)}` },
    { label: `first seen at : ${node.firstSeenAt || NOT_OBSERVED}` },
    { label: `last seen at  : ${node.lastSeenAt || NOT_OBSERVED}` },
    { label: `duration ms   : ${node.durationMs === undefined ? NOT_OBSERVED : node.durationMs}` },
    { label: `elapsed prev  : ${node.elapsedSincePreviousNodeMs === undefined ? NOT_OBSERVED : node.elapsedSincePreviousNodeMs}` },
    { label: `call count    : ${node.callCount > 0 ? node.callCount : NOT_OBSERVED}` },
    { label: `path          : ${formatsRepoRelativePath(rootDir, node.telemetryEventPath || NOT_OBSERVED)}` },
  ];
}

function buildsStatusChildren(node) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const status = formatsNodeStatus(node);
  const children = [{ label: status }];

  if (status !== 'ok') {
    const blocker = formatsBlockerValue(node);
    children.push({ label: `blocker : ${blocker}` });
    children.push({ label: `fix     : ${formatsFixRoute(blocker)}` });
  }

  return children;
}

function groupsMethodCallsByRuntimeFile(node, rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const groups = new Map();

  for (const methodCall of node.methodCalls || []) {
    const runtimeFile = formatsRepoRelativePath(rootDir, methodCall.runtimeFilePath || methodCall.runtimePath || node.runtimePath);

    if (!groups.has(runtimeFile)) {
      groups.set(runtimeFile, []);
    }

    groups.get(runtimeFile).push(methodCall);
  }

  return groups;
}

function formatsMethodSource(rootDir, methodCall) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const runtimePath = formatsRepoRelativePath(rootDir, methodCall.runtimeFilePath || methodCall.runtimePath);
  const lineRange = methodCall.sourceLineRange;

  if (!lineRange || lineRange.start === NOT_OBSERVED || String(runtimePath).match(/:\d+-\d+$/u)) {
    return runtimePath;
  }

  return `${runtimePath}:${lineRange.start}-${lineRange.end}`;
}

function buildsMethodCallChildren(methodCall, rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    { label: `method       : ${methodCall.methodName || NOT_OBSERVED}` },
    { label: `kind         : ${methodCall.methodKind || NOT_OBSERVED}` },
    { label: `source       : ${formatsMethodSource(rootDir, methodCall)}` },
    { label: `started at   : ${methodCall.startedAt || NOT_OBSERVED}` },
    { label: `completed at : ${methodCall.completedAt || NOT_OBSERVED}` },
    { label: `duration ms  : ${methodCall.durationMs === undefined ? NOT_OBSERVED : methodCall.durationMs}` },
    { label: `elapsed prev : ${methodCall.elapsedSincePreviousCallMs === undefined ? NOT_OBSERVED : methodCall.elapsedSincePreviousCallMs}` },
    { label: `telemetry    : ${formatsFirstValue(methodCall.telemetryEventIds, NOT_OBSERVED)}` },
    { label: `receipt      : ${formatsRepoRelativePath(rootDir, formatsFirstValue(methodCall.receiptPaths, MISSING))}` },
    { label: `status       : ${methodCall.status || NOT_OBSERVED}` },
  ];
}

function selectsMethodCallName(methodCall) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return methodCall.methodName;
}

function buildsRuntimeFileChildren(runtimeFile, methodCalls, rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const children = [
    { label: `participating method count : ${new Set(methodCalls.map(selectsMethodCallName)).size}` },
    { label: `observed call count        : ${methodCalls.length}` },
  ];

  for (const methodCall of methodCalls) {
    children.push({
      label: `call ${String(methodCall.callIndex).padStart(3, '0')}`,
      children: buildsMethodCallChildren(methodCall, rootDir),
    });
  }

  return [
    {
      label: runtimeFile,
      children,
    },
  ];
}

function buildsMethodDrillDownBranch(node, rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!Array.isArray(node.methodCalls) || node.methodCalls.length === 0) {
    return {
      label: 'method drill-down',
      children: [
        { label: 'method detail : missing' },
        { label: 'blocker       : observed-body-node-without-method-drilldown' },
        { label: 'fix           : add method-level telemetry and receipt tie-out' },
      ],
    };
  }

  const children = [];
  const groups = groupsMethodCallsByRuntimeFile(node, rootDir);

  for (const [runtimeFile, methodCalls] of groups.entries()) {
    children.push(...buildsRuntimeFileChildren(runtimeFile, methodCalls, rootDir));
  }

  return {
    label: 'method drill-down',
    children,
  };
}

function buildsPackageBoundaryBranch(node, rootDir) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsPackageBoundaryBranch);
  const children = [];
  for (const summary of node.packageBoundarySummaries || []) {
    children.push({
      label: `${formatsRepoRelativePath(rootDir, summary.packagePath)} (${summary.callCount} call(s): ${summary.methodNames.join(', ')})`,
    });
  }
  return {
    label: 'package-boundary summaries',
    children: children.length > 0 ? children : [{ label: 'none' }],
  };
}

function buildsTelemetryInfrastructureBranch(node, rootDir) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsTelemetryInfrastructureBranch);
  const summary = node.telemetryInfrastructureSummary;
  if (!summary) {
    return { label: 'telemetry infrastructure summary', children: [{ label: 'none suppressed' }] };
  }
  return {
    label: 'telemetry infrastructure summary',
    children: [
      { label: `event count       : ${summary.eventCount}` },
      { label: `suppressed methods: ${summary.suppressedMethodNames.join(', ')}` },
      { label: `package path      : ${formatsRepoRelativePath(rootDir, summary.telemetryPackagePath)}` },
      { label: `reason            : ${summary.suppressionReason}` },
    ],
  };
}

function buildsExecutionNodeFromProofNode(node, rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    nodeId: node.nodeId,
    label: node.nodeLabel,
    branches: [
      { label: 'contract', value: formatsRepoRelativePath(rootDir, node.contractPath) },
      { label: 'runtime', value: formatsRuntimePath(rootDir, node) },
      {
        label: 'telemetry',
        children: buildsTelemetryChildren(node, rootDir),
      },
      buildsPackageBoundaryBranch(node, rootDir),
      buildsMethodDrillDownBranch(node, rootDir),
      buildsTelemetryInfrastructureBranch(node, rootDir),
      { label: 'receipt', value: formatsReceiptValue(rootDir, node) },
      {
        label: 'status',
        children: buildsStatusChildren(node),
      },
    ],
  };
}

function buildsExecutionNodesFromProof(proof, rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const executionNodes = [buildsAcceptanceSourceNode(proof, rootDir)];

  for (const node of proof.observedExecutionTimeline || []) {
    executionNodes.push(buildsExecutionNodeFromProofNode(node, rootDir));
  }

  return executionNodes;
}

function detectsMissingTelemetry(proof) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  for (const node of proof.observedExecutionTimeline || []) {
    if (node.callCount === 0 || node.status === NOT_OBSERVED) {
      return true;
    }
  }

  return false;
}

function detectsMissingReceipt(proof) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  for (const node of proof.observedExecutionTimeline || []) {
    if (node.receiptStatus === MISSING) {
      return true;
    }
  }

  return false;
}

function buildsFindingsFromProof(proof) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const findings = [];

  for (const node of proof.observedExecutionTimeline || []) {
    for (const blockerCode of node.blockerCodes || []) {
      findings.push({
        code: blockerCode,
        methodName: node.nodeLabel,
        filePath: node.runtimePath,
        reason: `feature execution node "${node.nodeId}" is not fully proven`,
      });
    }
  }

  for (const finding of proof.blockerFindings || []) {
    findings.push(finding);
  }

  return findings;
}

function countsBlockers(proof) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return buildsFindingsFromProof(proof).length;
}

function loadsExecutionSketchTemplate(templatePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return parsesExecutionSketchTemplate(fs.readFileSync(templatePath || DEFAULT_TEMPLATE_PATH, 'utf8'));
}

function buildsFeatureScopedAsciiReportContract(proof, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const blockerCount = countsBlockers(proof);
  const rootDir = options.rootDir || process.cwd();

  return {
    verdict: blockerCount === 0 ? 'STERILE DOMAIN BODY' : 'DOMAIN BODY CONTAMINATED',
    rootDir,
    configPath: proof.acceptanceSource ? proof.acceptanceSource.path : 'docs/features',
    reportPath: options.reportPath || buildsFeatureScopedAsciiReportPath(options.evidenceRoot || path.join(rootDir, 'evidence'), proof.runId, proof.featureId),
    filesScanned: (proof.declaredExecutableBody || []).length,
    localExecutableMethods: (proof.declaredExecutableBody || []).length,
    methods: [],
    findings: buildsFindingsFromProof(proof),
    blockerCount,
    promotionDecision: blockerCount === 0 ? 'ALLOWED' : 'BLOCKED',
    telemetryObservation: detectsMissingTelemetry(proof) ? NOT_OBSERVED : 'observed',
    missingTelemetry: detectsMissingTelemetry(proof),
    missingReceipt: detectsMissingReceipt(proof),
    featureId: proof.featureId,
    scenarioName: proof.scenarioName,
    plainLanguageProof: 'feature-scoped ASCII report is rendered from canonical JSON proof',
    executionNodes: buildsExecutionNodesFromProof(proof, rootDir),
    provenance: {
      runId: proof.runId,
      generationTimestamp: proof.generatedAt,
      configPath: proof.acceptanceSource ? proof.acceptanceSource.path : 'docs/features',
    },
    executionSketchTemplate: options.executionSketchTemplate || loadsExecutionSketchTemplate(options.templatePath),
  };
}

function buildsFeatureScopedAsciiReportPath(evidenceRoot, runId, featureId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return path.join(evidenceRoot, 'runs', runId, 'features', featureId, 'executable-body-contract.report.md');
}

function rendersFeatureScopedAsciiExecutionFlowReport(proof, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const contract = buildsFeatureScopedAsciiReportContract(proof, options);

  return [
    `# ${proof.scenarioName}`,
    '',
    '## Execution Flow Sketch',
    '',
    '```text',
    rendersAsciiExecutionFlow(contract, contract.executionSketchTemplate),
    '```',
    '',
    '## Dense Timing Projection',
    '',
    '| node id | node label | first seen at | last seen at | duration ms | elapsed prev ms | call count | status |',
    '| --- | --- | --- | --- | ---: | ---: | ---: | --- |',
    rendersDenseTimingRows(proof),
  ].join('\n');
}

function rendersDenseTimingRows(proof) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rows = [];

  for (const node of proof.observedExecutionTimeline || []) {
    rows.push(`| ${node.nodeId} | ${node.nodeLabel} | ${node.firstSeenAt || NOT_OBSERVED} | ${node.lastSeenAt || NOT_OBSERVED} | ${node.durationMs === undefined ? NOT_OBSERVED : node.durationMs} | ${node.elapsedSincePreviousNodeMs === undefined ? NOT_OBSERVED : node.elapsedSincePreviousNodeMs} | ${node.callCount || 0} | ${node.status || NOT_OBSERVED} |`);
  }

  return rows.join('\n');
}

function writesFeatureScopedAsciiExecutionFlowReport(proof, options = {}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rootDir = options.rootDir || process.cwd();
  const evidenceRoot = options.evidenceRoot || path.join(rootDir, 'evidence');
  const reportPath = options.reportPath || buildsFeatureScopedAsciiReportPath(evidenceRoot, proof.runId, proof.featureId);
  const reportContent = rendersFeatureScopedAsciiExecutionFlowReport(proof, {
    ...options,
    reportPath,
    evidenceRoot,
    rootDir,
  });

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${reportContent}\n`, 'utf8');

  return {
    reportPath,
    reportContent: `${reportContent}\n`,
    bytesWritten: Buffer.byteLength(`${reportContent}\n`, 'utf8'),
  };
}

function checksPortableAscii(reportContent) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return /^[\x09\x0A\x0D\x20-\x7E]*$/u.test(reportContent);
}

function hasRequiredBranchLine(reportContent, pattern) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return pattern.test(reportContent);
}

function checksFeatureScopedAsciiReportPresentation(reportContent) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const findings = [];

  if (!checksPortableAscii(reportContent)) {
    findings.push({
      code: 'feature-report-non-portable-ascii',
      reason: 'the execution sketch contains characters outside portable ASCII',
    });
  }

  if (!reportContent.includes('[00] ACCEPTANCE SOURCE') || !reportContent.includes('[01] ')) {
    findings.push({
      code: 'executable-body-tree-missing',
      reason: 'the report does not render ordered executable body nodes before dense details',
    });
  }

  const requiredBranches = [
    /\|-- contract/u,
    /\|-- runtime/u,
    /\|-- telemetry/u,
    /\|   \|-- status/u,
    /\|   \|-- runtime step/u,
    /\|   `-- .*path/u,
    /\|-- receipt/u,
    /`-- status/u,
  ];

  for (const requiredBranch of requiredBranches) {
    if (!hasRequiredBranchLine(reportContent, requiredBranch)) {
      findings.push({
        code: 'executable-body-tree-shape-mismatch',
        reason: 'each executable body node must contain nested contract, runtime, telemetry, receipt, and status branch groups',
      });
      break;
    }
  }

  if (/\|\s+\d+\s+.+\n\|\s+contract\s+:/u.test(reportContent)) {
    findings.push({
      code: 'executable-body-tree-shape-mismatch',
      reason: 'flat boxed node rows are not accepted when a hierarchical body tree is required',
    });
  }

  if (/status\s+: observed/u.test(reportContent) && !/runtime step\s+: (?!not observed)/u.test(reportContent)) {
    findings.push({
      code: 'telemetry-observation-inferred-from-verdict',
      reason: 'observed telemetry must be tied to a runtime telemetry event id or step',
    });
  }

  if (/duration ms\s+:\s*(0ms|0|observed)?\s*$/mu.test(reportContent)) {
    findings.push({
      code: 'runtime-duration-evidence-missing',
      reason: 'duration must be copied from timing evidence or rendered as not observed',
    });
  }

  return {
    verdict: findings.length === 0 ? 'PASS' : 'BLOCKED',
    findings,
  };
}

module.exports = {
  buildsExecutionNodesFromProof,
  buildsFeatureScopedAsciiReportContract,
  buildsFeatureScopedAsciiReportPath,
  checksFeatureScopedAsciiReportPresentation,
  rendersFeatureScopedAsciiExecutionFlowReport,
  writesFeatureScopedAsciiExecutionFlowReport,
};
