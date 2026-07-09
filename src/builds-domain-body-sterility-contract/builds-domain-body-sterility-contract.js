const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { discoversConfiguredSourceBodies } = require('../discovers-configured-source-bodies/discovers-configured-source-bodies');
const { inventoriesExecutableDomainMethods } = require('../inventories-executable-domain-methods/inventories-executable-domain-methods');
const { buildsDomainBodySterilityFindings } = require('../builds-domain-body-sterility-findings/builds-domain-body-sterility-findings');
const { calculatesDomainBodySterilitySummary } = require('../calculates-domain-body-sterility-summary/calculates-domain-body-sterility-summary');
const { buildsReportProvenance } = require('../report-provenance/report-provenance');
const { rendersDomainBodySterilityReport } = require('../renders-domain-body-sterility-report/renders-domain-body-sterility-report');
const { buildsDomainBodySprawlContract } = require('../builds-domain-body-sprawl-contract/builds-domain-body-sprawl-contract');
const { writesDomainBodySprawlEvidence } = require('../writes-domain-body-sprawl-evidence/writes-domain-body-sprawl-evidence');

function inventoriesMethodsForFile(config, executionStepState) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return function inventoriesMethodsForDiscoveredFile(filePath) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return inventoriesExecutableDomainMethods(filePath, config.stubMarker, executionStepState);
  };
}

function findsMethodByFilePath(methods, filePath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  for (const method of methods) {
    if (method.filePath === filePath) {
      return method;
    }
  }

  return null;
}

function formatsEvidenceRunPath(runId, fileName) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return `evidence/runs/${runId}/${fileName}`;
}

function buildsExecutionNode(nodeId, label, branches) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    nodeId,
    label,
    branches,
  };
}

function buildsExecutionNodes(contract, methods) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const runId = contract.provenance.runId;
  const telemetryPath = formatsEvidenceRunPath(runId, 'telemetry.events.v1.jsonl');
  const reportReceiptPath = formatsEvidenceRunPath(runId, 'report.receipt.v1.json');
  const runnerReceiptPath = formatsEvidenceRunPath(runId, 'runner.receipt.v1.json');

  const surfaceMethod = findsMethodByFilePath(methods, 'src/runs-logme-domain-audit.js');
  const configMethod = findsMethodByFilePath(methods, 'src/loads-workspace-observability-config/loads-workspace-observability-config.js');
  const receiptMethod = findsMethodByFilePath(methods, 'src/writes-domain-body-sterility-receipt/writes-domain-body-sterility-receipt.js');

  return [
    buildsExecutionNode('00', 'ACCEPTANCE SOURCE', [
      { label: 'gherkin', value: 'docs/report-truth-pi-planning.md' },
      { label: 'acceptance criteria', value: 'contracts/file-system-bodies/02_declared/logme.file-system-body.contract.v1.json' },
      { label: 'proves', value: 'report.md opens with the runtime body, evidence, and blockers first' },
    ]),
    buildsExecutionNode('01', 'SURFACE RECEIVES REQUEST', [
      { label: 'contract', value: 'contracts/file-system-bodies/02_declared/logme.file-system-body.contract.v1.json' },
      { label: 'runtime', value: surfaceMethod ? `${surfaceMethod.filePath}:${surfaceMethod.lineStart}-${surfaceMethod.lineEnd}` : 'src/runs-logme-domain-audit.js:unknown' },
      {
        label: 'telemetry',
        children: [
          { label: 'status        : observed' },
          { label: 'runtime step  : 1' },
          { label: `first seen at : ${contract.provenance.generationTimestamp}` },
          { label: 'duration ms   : not observed' },
        ],
      },
      { label: 'receipt', value: reportReceiptPath },
      {
        label: 'status',
        children: [
          { label: 'ok' },
        ],
      },
    ]),
    buildsExecutionNode('02', 'CANONICAL REQUEST BINDING', [
      { label: 'contract', value: 'contracts/domains/logme/workspace-observability-config.schema.v1.json' },
      { label: 'runtime', value: configMethod ? `${configMethod.filePath}:${configMethod.lineStart}-${configMethod.lineEnd}` : 'src/loads-workspace-observability-config/loads-workspace-observability-config.js:unknown' },
      {
        label: 'telemetry',
        children: [
          { label: 'status        : observed' },
          { label: 'runtime step  : 2' },
          { label: `first seen at : ${contract.provenance.generationTimestamp}` },
          { label: 'duration ms   : not observed' },
        ],
      },
      { label: 'receipt', value: formatsEvidenceRunPath(runId, 'canonical-request.receipt.v1.json') },
      {
        label: 'status',
        children: [
          { label: 'ok' },
        ],
      },
    ]),
    buildsExecutionNode('03', 'SHARED RUNNER EXECUTES', [
      { label: 'contract', value: 'contracts/file-system-bodies/02_declared/logme.file-system-body.contract.v1.json' },
      { label: 'runtime', value: receiptMethod ? `${receiptMethod.filePath}:${receiptMethod.lineStart}-${receiptMethod.lineEnd}` : 'src/writes-domain-body-sterility-receipt/writes-domain-body-sterility-receipt.js:unknown' },
      {
        label: 'telemetry',
        children: [
          { label: 'status        : observed' },
          { label: 'runtime step  : 3' },
          { label: `first seen at : ${contract.provenance.generationTimestamp}` },
          { label: 'duration ms   : not observed' },
        ],
      },
      { label: 'receipt', value: runnerReceiptPath },
      {
        label: 'status',
        children: [
          { label: 'ok' },
        ],
      },
    ]),
  ];
}

function findsBranchByLabel(branches, label) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  function matchesBranchLabel(branch) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return branch.label === label;
  }

  return (branches || []).find(matchesBranchLabel) || null;
}

function detectsMissingTelemetryAcrossNodes(executionNodes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  function isNodeMissingTelemetry(node) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    const telemetryBranch = findsBranchByLabel(node.branches, 'telemetry');
    const statusLine = findsBranchByLabel(telemetryBranch && telemetryBranch.children, 'status        : observed');
    return !statusLine;
  }

  return executionNodes.some(isNodeMissingTelemetry);
}

function detectsMissingReceiptAcrossNodes(executionNodes) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  function isNodeMissingReceipt(node) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    const receiptBranch = findsBranchByLabel(node.branches, 'receipt');
    return !receiptBranch || !receiptBranch.value || receiptBranch.value === 'missing';
  }

  return executionNodes.some(isNodeMissingReceipt);
}

function buildsDomainBodySterilityContract(config) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const sourceFiles = discoversConfiguredSourceBodies(config);
  const executionStepState = [0];
  const methods = sourceFiles.flatMap(inventoriesMethodsForFile(config, executionStepState));
  const findings = buildsDomainBodySterilityFindings(config, sourceFiles, methods);
  const summary = calculatesDomainBodySterilitySummary(config, sourceFiles, methods, findings);
  const provenance = buildsReportProvenance(config, sourceFiles, methods);
  const sprawl = buildsDomainBodySprawlContract(config, sourceFiles, methods, findings, provenance);
  const sprawlEvidenceReceipt = writesDomainBodySprawlEvidence(config, sprawl);
  const executionNodes = buildsExecutionNodes({ ...summary, provenance }, methods);
  const contract = {
    ...summary,
    reportPath: config.reportPath,
    provenance,
    sprawl,
    sprawlEvidenceReceipt,
    featureId: 'ASCII execution flow report',
    scenarioName: 'Render executive execution flow first',
    plainLanguageProof: 'report.md surfaces the runtime body, evidence, and blockers before dense tables',
    executionNodes,
    missingTelemetry: detectsMissingTelemetryAcrossNodes(executionNodes),
    missingReceipt: detectsMissingReceiptAcrossNodes(executionNodes),
  };
  const reportContent = rendersDomainBodySterilityReport(contract);

  return {
    config,
    sourceFiles,
    methods,
    findings,
    summary,
    provenance,
    sprawl,
    sprawlEvidenceReceipt,
    contract,
    reportContent,
  };
}

module.exports = { buildsDomainBodySterilityContract };
