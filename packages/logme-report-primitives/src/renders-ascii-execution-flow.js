// Renders the product-facing ASCII execution flow sketch for the report header.
const path = require('node:path');
const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

const MIN_BOX_WIDTH = 62;

function resolvesTemplateVariable(contract, dottedPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const segments = dottedPath.split('.');
  let value = contract;

  for (const segment of segments) {
    if (value === null || value === undefined) {
      return undefined;
    }

    value = value[segment];
  }

  return value;
}

function substitutesTemplateVariables(line, values) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return line.replace(/\{\{\s*([^}\s]+)\s*\}\}/gu, substitutesSingleVariable);

  function substitutesSingleVariable(fullMatch, variable) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    const resolved = resolvesTemplateVariable(values, variable);
    return resolved === undefined || resolved === null ? '' : String(resolved);
  }
}

function rendersAsciiExecutionFlow(contract, template) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const sketchTemplate = template || contract.executionSketchTemplate;

  if (!sketchTemplate) {
    throw new Error('rendersAsciiExecutionFlow requires an execution sketch template (pass it explicitly or set contract.executionSketchTemplate)');
  }

  const blockerCount = contract.blockerCount !== undefined
    ? contract.blockerCount
    : (Array.isArray(contract.findings) ? contract.findings.length : 0);
  const promotionDecision = contract.promotionDecision || (blockerCount === 0 ? 'ALLOWED' : 'BLOCKED');
  const telemetryObservation = contract.telemetryObservation || (blockerCount === 0 ? 'observed' : 'not observed');

  const templateValues = {
    ...contract,
    configPath: formatsProminentPath(contract, contract.provenance && contract.provenance.configPath),
    reportPath: formatsProminentPath(contract, contract.reportPath),
    telemetryObservation,
    blockerCount,
    promotionDecision,
  };

  const truthSketch = buildsTruthSketchBox(sketchTemplate, contract, templateValues, blockerCount, promotionDecision);
  const executionTreeSection = rendersExecutionTreeSection(sketchTemplate, contract);
  const blockerWorklistBox = blockerCount > 0 ? rendersBlockerWorklistBox(sketchTemplate, contract) : '';

  return [
    truthSketch,
    '',
    executionTreeSection,
    blockerWorklistBox ? ['', blockerWorklistBox].join('\n') : '',
  ].filter(Boolean).join('\n');
}

function buildsTruthSketchBox(sketchTemplate, contract, templateValues, blockerCount, promotionDecision) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const routeLine = contract.verdict === 'STERILE DOMAIN BODY' ? sketchTemplate.routeSterile : sketchTemplate.routeBlocked;
  const observationLine = contract.verdict === 'STERILE DOMAIN BODY' ? sketchTemplate.routeSterileStatus : sketchTemplate.routeBlockedStatus;

  function rendersTemplateRow(row) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return formatsKeyValueLine(row.label, substitutesTemplateVariables(row.variable, templateValues));
  }

  const rows = sketchTemplate.boxRows.map(rendersTemplateRow);

  return rendersBox(sketchTemplate.boxTitle, [
    ...rows.slice(0, 3),
    routeLine,
    observationLine,
    ...rows.slice(3),
  ]);
}

function rendersExecutionTreeSection(sketchTemplate, contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!Array.isArray(contract.executionNodes) || contract.executionNodes.length === 0) {
    if (process.env.LOGME_EXECUTION_TREE_DIAGNOSTIC === '1') {
      return rendersDiagnosticExecutionTree(sketchTemplate, contract);
    }

    return sketchTemplate.missingTreeLabel;
  }

  function rendersTemplateHeaderRow(rowTemplate) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return substitutesTemplateVariables(rowTemplate, contract);
  }

  const headerLines = sketchTemplate.treeHeaderRows.map(rendersTemplateHeaderRow);

  const sections = [
    rendersBox(sketchTemplate.treeHeaderTitle, headerLines),
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

function rendersDiagnosticExecutionTree(sketchTemplate, contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    sketchTemplate.diagnosticFallbackLabel,
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

function rendersBlockerWorklistBox(sketchTemplate, contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const topFindings = Array.isArray(contract.findings) ? contract.findings.slice(0, 3) : [];
  const bodyLines = [];

  if (topFindings.length === 0) {
    bodyLines.push(sketchTemplate.worklistEmptyLabel);
  } else {
    for (let index = 0; index < topFindings.length; index += 1) {
      const finding = topFindings[index];
      const method = findsMethodForFinding(contract, finding);
      const sourcePath = method ? formatsProminentPath(contract, method.filePath) : formatsProminentPath(contract, finding.filePath);
      const lineRange = method ? `${method.lineStart}-${method.lineEnd}` : 'unknown';
      const telemetryStatus = method && method.hasLogMeCall ? 'observed' : 'missing';
      const fixRoute = formatsBlockerFixRoute(finding);

      const worklistValues = {
        code: finding.code,
        methodName: finding.methodName || 'unknown',
        sourcePath,
        lineRange,
        telemetryStatus,
        fixRoute,
      };

      function rendersWorklistRow(rowTemplate) {
        if (process.env.LOGME_AUDIT === '1') {
          LogMe(sampleMethod);
        }

        return substitutesTemplateVariables(rowTemplate, worklistValues);
      }

      bodyLines.push(...sketchTemplate.worklistRowTemplates.map(rendersWorklistRow));

      if (index < topFindings.length - 1) {
        bodyLines.push('');
      }
    }
  }

  return rendersBox(sketchTemplate.worklistBoxTitle, bodyLines);
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
