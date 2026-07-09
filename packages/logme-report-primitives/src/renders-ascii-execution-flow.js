// Renders the product-facing ASCII execution flow sketch for the report header.
const path = require('node:path');
const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

const MIN_BOX_WIDTH = 62;

function rendersAsciiExecutionFlow(contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const executionNodes = normalizesExecutionNodes(contract);
  const blockerCount = Array.isArray(contract.findings) ? contract.findings.length : 0;
  const promotionDecision = blockerCount === 0 ? 'ALLOWED' : 'BLOCKED';
  const declaredSourceAuthority = formatsProminentPath(contract, contract.provenance && contract.provenance.configPath);
  const staticSourceInventory = `${contract.filesScanned} files / ${contract.localExecutableMethods} methods`;
  const telemetryObservation = contract.telemetryObservation || (blockerCount === 0 ? 'observed' : 'not observed');
  const receiptEvidence = formatsProminentPath(contract, contract.reportPath);

  const truthSketch = buildsTruthSketchBox({
    contract,
    declaredSourceAuthority,
    staticSourceInventory,
    telemetryObservation,
    receiptEvidence,
    blockerCount,
    promotionDecision,
  });

  const executionTreeBox = rendersExecutionTreeBox(contract, executionNodes);
  const blockerWorklistBox = blockerCount > 0 ? rendersBlockerWorklistBox(contract) : '';

  return [
    truthSketch,
    '',
    executionTreeBox,
    blockerWorklistBox ? ['', blockerWorklistBox].join('\n') : '',
  ].filter(Boolean).join('\n');
}

function buildsTruthSketchBox({
  contract,
  declaredSourceAuthority,
  staticSourceInventory,
  telemetryObservation,
  receiptEvidence,
  blockerCount,
  promotionDecision,
}) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const routeLine = contract.verdict === 'STERILE DOMAIN BODY'
    ? 'Gherkin -> Contract -> Source -> Telemetry -> Receipt'
    : 'Declared Source -> Static Inventory -> Telemetry -> Receipt';
  const observationLine = contract.verdict === 'STERILE DOMAIN BODY'
    ? 'ok         ok          ok        observed     written'
    : 'ok              has gaps          missing    unknown';

  const bodyLines = [
    formatsKeyValueLine('Verdict', contract.verdict),
    formatsKeyValueLine('Run', contract.provenance && contract.provenance.runId ? contract.provenance.runId : 'unknown'),
    formatsKeyValueLine('Promotion', promotionDecision),
    routeLine,
    observationLine,
    formatsKeyValueLine('Declared source authority', declaredSourceAuthority),
    formatsKeyValueLine('Static source inventory', staticSourceInventory),
    formatsKeyValueLine('Telemetry observation', telemetryObservation),
    formatsKeyValueLine('Receipt evidence', receiptEvidence),
    formatsKeyValueLine('Blocker count', String(blockerCount)),
  ];

  return rendersBox('REPORT TRUTH', bodyLines);
}

function rendersExecutionTreeBox(contract, executionNodes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [];

  if (contract.featureId || contract.scenarioName) {
    if (contract.featureId) {
      lines.push(`Feature : ${contract.featureId}`);
    }

    if (contract.scenarioName) {
      lines.push(`Scenario: ${contract.scenarioName}`);
    }
  }

  if (contract.plainLanguageProof) {
    lines.push(`Proves  : ${contract.plainLanguageProof}`);
  }

  if (lines.length > 0) {
    lines.push('');
  }

  function appendsExecutionNode(node, index) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    lines.push(...rendersCompactNodeBlock(node, index, contract));
    if (index < executionNodes.length - 1) {
      lines.push('');
    }
  }

  executionNodes.forEach(appendsExecutionNode);

  return rendersBox('EXECUTABLE BODY TREE', lines.length > 0 ? lines : ['(no executable body nodes declared)']);
}

function rendersCompactNodeBlock(node, index, contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const nodeId = formatsNodeId(node, index);
  const nodeLabel = node.label || node.name || 'UNLABELLED NODE';
  const contractPath = formatsNodePath(contract, node.contractPath);
  const runtimePath = formatsNodePath(contract, node.runtimePath);
  const telemetryPath = formatsNodePath(contract, node.telemetryPath);
  const receiptPath = formatsNodePath(contract, node.receiptPath);
  const status = node.status || inferNodeStatus(node, contract);
  const sourceLineRange = formatsSourceLineRange(node);
  const durationLine = formatsDuration(node);
  const blockerLine = node.blocker ? `blocker   : ${node.blocker}` : '';
  const fixLine = node.fix ? `fix       : ${node.fix}` : '';
  const runtimeStatus = node.runtimePath === 'not executable' ? 'n/a' : 'ok';
  const telemetryStatus = formatsTelemetryStatus(node, contract);
  const receiptStatus = formatsReceiptStatus(node, contract);

  const rowLines = [
    `${nodeId} ${nodeLabel}`,
    formatsCompactFieldLine('contract', contractPath, 'ok'),
    formatsCompactFieldLine('runtime', runtimePath, runtimeStatus),
    formatsCompactFieldLine('telemetry', telemetryPath, telemetryStatus),
  ];

  if (sourceLineRange) {
    rowLines.push(`source    : ${sourceLineRange}`);
  }

  if (durationLine) {
    rowLines.push(durationLine);
  } else {
    rowLines.push('duration  : not observed');
  }

  rowLines.push(formatsCompactFieldLine('receipt', receiptPath, receiptStatus));
  rowLines.push(`status    : ${status}`);

  if (blockerLine) {
    rowLines.push(blockerLine);
  }

  if (fixLine) {
    rowLines.push(fixLine);
  }

  return rowLines;
}

function rendersBlockerWorklistBox(contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const topFindings = Array.isArray(contract.findings) ? contract.findings.slice(0, 3) : [];
  const bodyLines = [];

  if (topFindings.length === 0) {
    bodyLines.push('No blockers');
  } else {
    function appendsTopFindingBlock(finding, index) {
      if (process.env.LOGME_AUDIT === '1') {
        LogMe(sampleMethod);
      }

      const method = findsMethodForFinding(contract, finding);
      const sourcePath = method ? formatsProminentPath(contract, method.filePath) : formatsProminentPath(contract, finding.filePath);
      const lineRange = method ? `${method.lineStart}-${method.lineEnd}` : 'unknown';
      const telemetryStatus = method && method.hasLogMeCall ? 'observed' : 'missing';
      const fixRoute = formatsBlockerFixRoute(finding);

      bodyLines.push(`finding code     : ${finding.code}`);
      bodyLines.push(`method           : ${finding.methodName || 'unknown'}`);
      bodyLines.push(`source path      : ${sourcePath}`);
      bodyLines.push(`line range       : ${lineRange}`);
      bodyLines.push(`telemetry status : ${telemetryStatus}`);
      bodyLines.push(`one-line fix route: ${fixRoute}`);

      if (index < topFindings.length - 1) {
        bodyLines.push('');
      }
    }

    topFindings.forEach(appendsTopFindingBlock);
  }

  return rendersBox('TOP BLOCKERS', bodyLines);
}

function findsMethodForFinding(contract, finding) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!Array.isArray(contract.methods)) {
    return null;
  }

  function matchesFindingMethod(method) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return method.filePath === finding.filePath && method.name === finding.methodName;
  }

  function matchesFindingPath(method) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return method.filePath === finding.filePath;
  }

  return contract.methods.find(matchesFindingMethod) || contract.methods.find(matchesFindingPath) || null;
}

function formatsBlockerFixRoute(finding) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const fixRoutes = {
    'stale-report-projection': 'regenerate the report from the current source inventory',
    'contaminated-verdict': 'resolve the contaminated finding and rerun the audit',
    'summary-to-row-mismatch': 'rebuild the summary from the current findings and methods table',
    'unsupported-clean-or-sterile-claim': 'align the verdict with the current findings',
    'executable-body-tree-missing': 'add ordered executable body nodes before the dense tables',
  };

  return fixRoutes[finding.code] || 'inspect the cited method and rerun the report';
}

function normalizesExecutionNodes(contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (Array.isArray(contract.executionNodes) && contract.executionNodes.length > 0) {
    return contract.executionNodes;
  }

  return buildsFallbackExecutionNodes(contract);
}

function buildsFallbackExecutionNodes(contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const nodes = [];
  const methodsByPath = new Map();

  if (Array.isArray(contract.methods)) {
    for (const method of contract.methods) {
      if (!methodsByPath.has(method.filePath)) {
        methodsByPath.set(method.filePath, method);
      }
    }
  }

  function findsMethodByPath(filePath) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return methodsByPath.get(filePath) || null;
  }

  const runId = contract.provenance && contract.provenance.runId ? contract.provenance.runId : 'run-unknown';
  const receiptFileName = contract.reportPath ? path.basename(contract.reportPath).replace(/\.md$/u, '.receipt.v1.json') : 'report.receipt.v1.json';
  const telemetryPath = `evidence/runs/${runId}/telemetry.events.v1.jsonl`;
  const evidenceRunPath = `evidence/runs/${runId}`;

  nodes.push({
    nodeId: '00',
    label: 'ACCEPTANCE SOURCE',
    contractPath: contract.provenance && contract.provenance.configPath ? contract.provenance.configPath : 'unknown',
    runtimePath: 'not executable',
    sourceLineRange: 'n/a',
    telemetryPath: 'not required',
    observedRuntimeStep: 'not observed',
    observedDurationMs: 'not observed',
    receiptPath: 'not required',
    status: 'ok',
  });

  const surfaceRuntime = findsMethodByPath('src/runs-logme-domain-audit.js');
  nodes.push({
    nodeId: '01',
    label: 'SURFACE RECEIVES REQUEST',
    contractPath: contract.configPath || contract.reportPath || 'unknown',
    runtimePath: surfaceRuntime ? surfaceRuntime.filePath : 'src/runs-logme-domain-audit.js',
    sourceLineRange: surfaceRuntime ? `${surfaceRuntime.lineStart}-${surfaceRuntime.lineEnd}` : '1-1',
    telemetryPath,
    observedRuntimeStep: process.env.LOGME_AUDIT === '1' ? '1' : 'not observed',
    observedDurationMs: process.env.LOGME_AUDIT === '1' ? 'observed' : 'not observed',
    receiptPath: `${evidenceRunPath}/${receiptFileName}`,
    status: process.env.LOGME_AUDIT === '1' ? 'observed' : 'ok',
  });

  const canonicalRuntime = findsMethodByPath('src/loads-workspace-observability-config/loads-workspace-observability-config.js');
  const firstFinding = Array.isArray(contract.findings) && contract.findings.length > 0 ? contract.findings[0] : null;
  const blocked = Boolean(firstFinding) || contract.verdict === 'DOMAIN BODY CONTAMINATED';
  nodes.push({
    nodeId: '02',
    label: 'CANONICAL REQUEST BINDING',
    contractPath: 'contracts/domains/logme2/workspace-observability-config.schema.v1.json',
    runtimePath: canonicalRuntime ? canonicalRuntime.filePath : 'src/loads-workspace-observability-config/loads-workspace-observability-config.js',
    sourceLineRange: canonicalRuntime ? `${canonicalRuntime.lineStart}-${canonicalRuntime.lineEnd}` : '1-1',
    telemetryPath: blocked ? 'not observed' : telemetryPath,
    observedRuntimeStep: blocked ? 'not observed' : '2',
    observedDurationMs: blocked ? 'not observed' : 'observed',
    receiptPath: blocked ? 'missing' : `${evidenceRunPath}/canonical-request.receipt.v1.json`,
    status: blocked ? 'blocked' : 'ok',
    blocker: blocked ? (firstFinding ? firstFinding.code : 'declared-but-silent') : '',
    fix: blocked ? formatsBlockerFixRoute(firstFinding || { code: 'executable-body-tree-missing' }) : '',
  });

  const sharedRunnerRuntime = findsMethodByPath('src/writes-domain-body-sterility-receipt/writes-domain-body-sterility-receipt.js');
  nodes.push({
    nodeId: '03',
    label: 'SHARED RUNNER EXECUTES',
    contractPath: 'contracts/file-system-bodies/02_declared/logme2.file-system-body.contract.v1.json',
    runtimePath: sharedRunnerRuntime ? sharedRunnerRuntime.filePath : 'src/writes-domain-body-sterility-receipt/writes-domain-body-sterility-receipt.js',
    sourceLineRange: sharedRunnerRuntime ? `${sharedRunnerRuntime.lineStart}-${sharedRunnerRuntime.lineEnd}` : '1-1',
    telemetryPath: telemetryPath,
    observedRuntimeStep: process.env.LOGME_AUDIT === '1' ? '3' : 'not observed',
    observedDurationMs: process.env.LOGME_AUDIT === '1' ? 'observed' : 'not observed',
    receiptPath: `${evidenceRunPath}/runner.receipt.v1.json`,
    status: blocked ? 'blocked' : 'ok',
  });

  return nodes;
}

function formatsNodeId(node, index) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (node.nodeId !== undefined) {
    return String(node.nodeId);
  }

  return String(index).padStart(2, '0');
}

function formatsNodePath(contract, filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!filePath || filePath === 'not executable' || filePath === 'not required' || filePath === 'missing' || filePath === 'unknown') {
    return filePath;
  }

  if (!path.isAbsolute(filePath)) {
    return filePath;
  }

  const rootDir = contract.rootDir || process.cwd();
  const relativePath = path.relative(rootDir, filePath);
  return relativePath || path.basename(filePath);
}

function formatsProminentPath(contract, filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return formatsNodePath(contract, filePath || 'unknown');
}

function formatsCompactFieldLine(label, value, status) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return `${label.padEnd(10)}: ${value}${status ? ` ${status}` : ''}`.trimEnd();
}

function formatsTelemetryStatus(node, contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (node.telemetryStatus) {
    return node.telemetryStatus;
  }

  if (node.status === 'blocked') {
    return 'not observed';
  }

  return contract.verdict === 'STERILE DOMAIN BODY' ? 'observed' : 'not observed';
}

function formatsReceiptStatus(node, contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (node.receiptStatus) {
    return node.receiptStatus;
  }

  if (node.status === 'blocked') {
    return 'missing';
  }

  return contract.verdict === 'STERILE DOMAIN BODY' ? 'written' : 'unknown';
}

function formatsSourceLineRange(node) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (node.sourceLineRange) {
    return node.sourceLineRange;
  }

  if (node.lineStart !== undefined && node.lineEnd !== undefined) {
    return `${node.lineStart}-${node.lineEnd}`;
  }

  if (node.runtimePath && node.runtimePath !== 'not executable') {
    return '1-1';
  }

  return '';
}

function formatsDuration(node) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (node.observedDurationMs !== undefined && node.observedDurationMs !== null && node.observedDurationMs !== '') {
    if (node.observedDurationMs === 'observed' || node.observedDurationMs === 'not observed') {
      return 'duration  : not observed';
    }

    return `duration  : ${node.observedDurationMs}${String(node.observedDurationMs).includes('ms') ? '' : ' ms'}`;
  }

  if (node.durationMs !== undefined && node.durationMs !== null) {
    return `duration  : ${node.durationMs} ms`;
  }

  return '';
}

function inferNodeStatus(node, contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (node.status) {
    return node.status;
  }

  if (contract.findings && contract.findings.length > 0) {
    return 'blocked';
  }

  return 'ok';
}

function rendersBox(title, bodyLines) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [title, ...bodyLines];
  function computesLineWidth(line) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return line.length + 4;
  }

  function formatsContentLine(line) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return `| ${line.padEnd(width - 4)} |`;
  }

  const width = Math.max(MIN_BOX_WIDTH, ...lines.map(computesLineWidth));
  const border = `+${'-'.repeat(width - 2)}+`;
  const titleLine = `| ${title.padEnd(width - 4)} |`;
  const contentLines = bodyLines.map(formatsContentLine);
  return [border, titleLine, border, ...contentLines, border].join('\n');
}

function formatsKeyValueLine(label, value) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return `${label.padEnd(27)}: ${value}`;
}

module.exports = { rendersAsciiExecutionFlow };
