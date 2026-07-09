// Renders the product-facing ASCII execution flow sketch for the report header.
const path = require('node:path');
const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

const MIN_BOX_WIDTH = 62;

function rendersAsciiExecutionFlow(contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

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

  const executionTreeSection = rendersExecutionTreeSection(contract);
  const blockerWorklistBox = blockerCount > 0 ? rendersBlockerWorklistBox(contract) : '';

  return [
    truthSketch,
    '',
    executionTreeSection,
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

  return rendersBox('REPORT TRUTH', [
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
  ]);
}

function rendersExecutionTreeSection(contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!Array.isArray(contract.executionNodes) || contract.executionNodes.length === 0) {
    if (process.env.LOGME_EXECUTION_TREE_DIAGNOSTIC === '1') {
      return rendersDiagnosticExecutionTree(contract);
    }

    return 'EXECUTABLE BODY TREE: missing';
  }

  const headerLines = [];
  headerLines.push(`Feature : ${contract.featureId || 'ASCII execution flow report'}`);
  headerLines.push(`Scenario: ${contract.scenarioName || 'Render executive execution flow first'}`);

  const sections = [
    rendersBox('EXECUTABLE BODY CONTRACT - FILE-SYSTEM EXECUTION TREE', headerLines),
    '',
  ];

  for (let index = 0; index < contract.executionNodes.length; index += 1) {
    const node = contract.executionNodes[index];
    sections.push(rendersExecutionNode(node, index));
    if (index < contract.executionNodes.length - 1) {
      sections.push('');
    }
  }

  return sections.join('\n');
}

function rendersDiagnosticExecutionTree(contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    'DIAGNOSTIC FALLBACK - NOT PROMOTION EVIDENCE',
    rendersBox('EXECUTABLE BODY TREE', [
      `feature : ${contract.featureId || 'unknown'}`,
      `scenario: ${contract.scenarioName || 'unknown'}`,
      'status  : missing',
    ]),
  ].join('\n');
}

function rendersExecutionNode(node, index) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [`[${formatsNodeId(node, index)}] ${node.label}`];
  lines.push(...rendersBranchLines(node.branches || [], '', true));
  return lines.join('\n');
}

function rendersBranchLines(branches, indent, showSiblingSeparators) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [];

  for (let index = 0; index < branches.length; index += 1) {
    const branch = branches[index];
    const isLast = index === branches.length - 1;
    lines.push(...rendersBranch(branch, indent, isLast));

    if (showSiblingSeparators && !isLast) {
      lines.push(`${indent}|`);
    }
  }

  return lines;
}

function rendersBranch(branch, indent, isLast) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const connector = isLast ? '`-- ' : '|-- ';
  const nextIndent = `${indent}${isLast ? '    ' : '|   '}`;
  const lines = [`${indent}${connector}${branch.label}`];

  if (Array.isArray(branch.children) && branch.children.length > 0) {
    lines.push(...rendersBranchLines(branch.children, nextIndent, false));
    return lines;
  }

  if (branch.value !== undefined) {
    lines.push(`${nextIndent}\`-- ${branch.value}`);
  }

  return lines;
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
    for (let index = 0; index < topFindings.length; index += 1) {
      const finding = topFindings[index];
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

  for (const method of contract.methods) {
    if (method.filePath === finding.filePath && method.name === finding.methodName) {
      return method;
    }
  }

  for (const method of contract.methods) {
    if (method.filePath === finding.filePath) {
      return method;
    }
  }

  return null;
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
    'executable-body-contract-missing': 'add explicit executable body nodes to the report contract',
    'executable-body-tree-shape-mismatch': 'rebuild the node branches so contract, runtime, telemetry, receipt, and status are nested',
  };

  return fixRoutes[finding.code] || 'inspect the cited method and rerun the report';
}

function formatsProminentPath(contract, filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!filePath) {
    return 'unknown';
  }

  if (!path.isAbsolute(filePath)) {
    return filePath;
  }

  const rootDir = contract.rootDir || process.cwd();
  const relativePath = path.relative(rootDir, filePath);
  return relativePath || path.basename(filePath);
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

function formatsKeyValueLine(label, value) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return `${label.padEnd(27)}: ${value}`;
}

function rendersBox(title, bodyLines) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const lines = [title, ...bodyLines];
  let width = MIN_BOX_WIDTH;

  for (const line of lines) {
    const lineWidth = line.length + 4;
    if (lineWidth > width) {
      width = lineWidth;
    }
  }

  const border = `+${'-'.repeat(width - 2)}+`;
  const titleLine = `| ${title.padEnd(width - 4)} |`;
  const contentLines = [];

  for (const line of bodyLines) {
    contentLines.push(`| ${line.padEnd(width - 4)} |`);
  }

  return [border, titleLine, border, ...contentLines, border].join('\n');
}

module.exports = { rendersAsciiExecutionFlow };
