const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { checksUnsupportedSlaClaims } = require('./checks-unsupported-sla-claims/checks-unsupported-sla-claims');
const { eventMatchesNode, findsReceiptPathsForNode, formatsSourceLineRange, readsCallDurations, readsElapsedBetweenNodes, readsEventTimestamp, readsMethodCalls, readsMilliseconds, readsObservedCalls, readsReceiptPathsForMethod, readsTelemetryEventIds, readsTelemetryEventIdsForMethod, readsTelemetryEventPaths, readsTelemetrySourcePaths, sortsEventsByTimeAndStep } = require('./acquires-and-processes-telemetry-data/acquires-and-processes-telemetry-data');
const { buildsNodeCallCountMetric, buildsNodeCallCountMetrics, calculatesCallCountMetrics, countsObservedCalls } = require('./calculates-call-count-metrics/calculates-call-count-metrics');
const { buildsNodeDurationMetric, buildsNodeDurationMetrics, calculatesDurationMs, calculatesMethodTimingMetrics, calculatesTimingMetrics, calculatesTotalObservedWaitTimeMs, findsSlowestMethodCall, findsSlowestNode } = require('./calculates-timing-and-performance-metrics/calculates-timing-and-performance-metrics');
const { buildsMethodCall, buildsMethodCalls, buildsObservedCall, buildsObservedCalls, buildsObservedExecutionTimeline, buildsObservedNode, normalizesDeclaredNode, normalizesDeclaredNodes, stampsMethodCallOwnership } = require('./constructs-observed-execution-model/constructs-observed-execution-model');
const { buildsPromotionDecision, readsBlockerFindingCode, readsNodeBlockerCodes } = require('./determines-promotion-eligibility/determines-promotion-eligibility');
const { buildsFeatureProofInventory, discoversFeatureFiles, discoversFeatureScenarios, selectsScenarioProofStatus } = require('./discovers-feature-and-scenario-metadata/discovers-feature-and-scenario-metadata');
const { buildsSli, calculatesServiceLevelIndicators, countsNodesWithObservedReceipts, countsNodesWithObservedTelemetry, evaluatesServiceLevelObjectives, evaluatesSingleServiceLevelObjective, indexesSlisByName } = require('./evaluates-service-level-indicators-objectives/evaluates-service-level-indicators-objectives');
const { escapesCsv, formatsProofPathForReport, formatsRepoRelativePath, formatsSourcePathWithLineRange, formatsValue, projectsFeatureExecutionProofToCsv, slugifies } = require('./formats-and-serializes-data/formats-and-serializes-data');
const { buildsFeatureProofPath, buildsScenarioMethodEvidenceReportPath, buildsScenarioMethodTimelineTablePath, buildsScenarioProofReportPath, buildsScenarioTimingTablePath } = require('./manages-report-file-paths/manages-report-file-paths');
const { buildsFeatureExecutionProof } = require('./orchestrates-feature-execution-proof/orchestrates-feature-execution-proof');
const { summarizesCalls, sumsNumbers } = require('./provides-general-utility-functions/provides-general-utility-functions');
const { readsFirstBlockerCode, readsLines, readsRuntimeStep } = require('./reads-runtime-and-source-data/reads-runtime-and-source-data');
const { rendersBlockerWorklist, rendersDenseTelemetryAppendix, rendersScenarioProofAsciiSketch, rendersScenarioProofExecutiveSummary, rendersScenarioProofIdentity, rendersScenarioProofOrderedTimeline, rendersScenarioProofPromotionDecision, rendersScenarioProofReport, rendersScenarioTimingMetrics, rendersServiceLevelIndicatorSummary, rendersServiceLevelObjectiveEvaluation, rendersSlaSupportEvidence, rendersSourceEvidenceLinks } = require('./renders-scenario-proof-report/renders-scenario-proof-report');
const { rendersFeatureExecutionReport, rendersMethodCallEvidenceReport, rendersScenarioMethodTimelineTable, rendersScenarioTimingTable } = require('./renders-supplementary-reports-and-tables/renders-supplementary-reports-and-tables');
const { writesFeatureExecutionProof, writesMethodCallEvidenceReport, writesScenarioMethodTimelineTable, writesScenarioProofReport, writesScenarioTimingTable } = require('./writes-reports-to-storage/writes-reports-to-storage');
const { FEATURE_PROOF_GENERATOR_NAME, FEATURE_PROOF_INVENTORY_SCHEMA_VERSION, FEATURE_PROOF_SCHEMA_VERSION, MISSING, NOT_OBSERVED } = require('./feature-execution-proof-shared-constants/feature-execution-proof-shared-constants');

function writesFeatureProofInventory(inventory, outputPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(inventory, null, 2)}\n`, 'utf8');

  return {
    inventoryPath: outputPath,
    bytesWritten: Buffer.byteLength(JSON.stringify(inventory, null, 2), 'utf8') + 1,
  };
}

function checksFeatureReportTruthGate(reportContent, proof) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const findings = [];

  if (!reportContent.includes(proof.proofPath || 'feature-execution.contract.v1.json')) {
    findings.push({
      code: 'feature-report-fact-without-json-proof',
      reason: 'the report does not cite the canonical feature execution proof JSON',
    });
  }

  const claimMatches = reportContent.matchAll(/\b(duration ms|call count|promotion decision|receipt status):\s*([^\n|]+)/giu);

  for (const match of claimMatches) {
    const claimedValue = match[2].trim();

    if (claimedValue !== NOT_OBSERVED && !JSON.stringify(proof).includes(claimedValue)) {
      findings.push({
        code: 'feature-report-fact-without-json-proof',
        reason: `report claim "${match[0].trim()}" is absent from feature-execution.contract.v1.json`,
      });
    }
  }

  if (/method drill-down|method execution timeline|method call evidence/iu.test(reportContent)) {
    for (const methodMatch of reportContent.matchAll(/\b(method name|method|runtime file|started at|completed at|telemetry event ids|receipt paths|blocker code):\s*([^\n|]+)/giu)) {
      const claimedValue = methodMatch[2].trim();

      if (claimedValue !== NOT_OBSERVED && claimedValue !== MISSING && claimedValue !== 'none' && !JSON.stringify(proof).includes(claimedValue)) {
        findings.push({
          code: 'method-drilldown-fact-without-json-proof',
          reason: `method report claim "${methodMatch[0].trim()}" is absent from feature-execution.contract.v1.json`,
        });
      }
    }
  }

  for (const node of proof.observedExecutionTimeline || []) {
    if (node.status === 'observed' && (!Array.isArray(node.methodCalls) || node.methodCalls.length === 0)) {
      findings.push({
        code: 'observed-body-node-without-method-drilldown',
        reason: `observed body node "${node.nodeId}" has no methodCalls in feature-execution.contract.v1.json`,
      });
    }
  }

  return {
    verdict: findings.length === 0 ? 'PASS' : 'BLOCKED',
    findings,
  };
}

module.exports = {
  FEATURE_PROOF_GENERATOR_NAME,
  FEATURE_PROOF_INVENTORY_SCHEMA_VERSION,
  FEATURE_PROOF_SCHEMA_VERSION,
  buildsFeatureExecutionProof,
  buildsFeatureProofInventory,
  buildsFeatureProofPath,
  buildsScenarioMethodEvidenceReportPath,
  buildsScenarioMethodTimelineTablePath,
  buildsScenarioProofReportPath,
  buildsScenarioTimingTablePath,
  calculatesServiceLevelIndicators,
  checksFeatureReportTruthGate,
  checksUnsupportedSlaClaims,
  discoversFeatureScenarios,
  evaluatesServiceLevelObjectives,
  projectsFeatureExecutionProofToCsv,
  rendersMethodCallEvidenceReport,
  rendersFeatureExecutionReport,
  rendersScenarioMethodTimelineTable,
  rendersScenarioProofReport,
  rendersScenarioTimingTable,
  slugifies,
  writesFeatureExecutionProof,
  writesFeatureProofInventory,
  writesMethodCallEvidenceReport,
  writesScenarioMethodTimelineTable,
  writesScenarioProofReport,
  writesScenarioTimingTable,
};
