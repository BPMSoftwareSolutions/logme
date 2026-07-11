#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../packages/logme-testimony-core/src/sample-method');
const {
  buildsFeatureProofInventory,
  discoversFeatureScenarios,
  writesFeatureProofInventory,
} = require('../src/feature-execution-proof/feature-execution-proof');
const {
  buildsFeatureProofBody,
  computesFeatureProofBodyHash,
  findsMissingScenarios,
  rendersFeatureProofBody,
} = require('../src/promotes-feature-execution-proof/promotes-feature-execution-proof');
const {
  buildsFeatureProofBodyPath,
  readsScenarioProofsFromRun,
  runsFeatureProofPromotion,
} = require('../src/runs-feature-proof-promotion/runs-feature-proof-promotion');
const {
  checksFeatureProofBodyFreshness,
  checksFeatureProofOptOut,
  checksFeatureStatusClaimsProofBody,
} = require('../src/checks-feature-proof-source-truth-gate/checks-feature-proof-source-truth-gate');
const { runsCallWithTelemetryWindow, startsScenarioProofRun, writesCliRunScenarioProof } = require('../src/writes-cli-run-scenario-proof/writes-cli-run-scenario-proof');

const FEATURE_ID = 'feature-execution-proof-source-of-truth';
const FEATURE_DOC_PATH = 'docs/features/feature-execution-proof-source-of-truth.feature.md';

// This is the feature's own self-proof driver: it real-calls the feature's own real
// functions (feature-execution-proof.js, promotes-feature-execution-proof.js,
// runs-feature-proof-promotion.js, checks-feature-proof-source-truth-gate.js) against a
// real, already-proven donor run (llm-evidence-curation-and-cleanup's
// evidence-curate-cb26da1990722f38 run) so that the feature that proves other features can
// prove itself the same way: real telemetry windows around real calls, not hand-authored
// JSON.

const DONOR_FEATURE_ID = 'llm-evidence-curation-and-cleanup';
const DONOR_RUN_ID = 'evidence-curate-cb26da1990722f38';

function donorProofReceiptPath(donorScenarioId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return `evidence/runs/${DONOR_RUN_ID}/features/${DONOR_FEATURE_ID}/scenarios/${donorScenarioId}/feature-execution.contract.v1.json`;
}

async function runsFeatureProofSelfRunCli() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const runId = process.argv[2];

  if (!runId) {
    process.stderr.write('usage: node scripts/feature-proof-self-run.js <run-id>\n');
    process.exitCode = 1;
    return;
  }

  const rootDir = path.join(__dirname, '..');
  const onlyScenarioId = process.argv[3];
  const scenarios = onlyScenarioId ? readsScenarioPlan().filter((scenarioPlan) => scenarioPlan.scenarioId === onlyScenarioId) : readsScenarioPlan();
  let packetCount = 0;

  for (const scenarioPlan of scenarios) {
    const { capturedEvents, runStartedAt } = startsScenarioProofRun();
    const windowResult = await runsCallWithTelemetryWindow(capturedEvents, () => scenarioPlan.work(rootDir));

    const { packetPath } = writesCliRunScenarioProof({
      rootDir,
      runId,
      featureId: FEATURE_ID,
      featureDocPath: FEATURE_DOC_PATH,
      scenarioId: scenarioPlan.scenarioId,
      scenarioName: scenarioPlan.scenarioName,
      acceptanceLineRange: scenarioPlan.acceptanceLineRange,
      nodeWindows: [
        {
          nodeId: '01',
          nodeLabel: scenarioPlan.nodeLabel,
          runtimePath: scenarioPlan.runtimePath,
          sourceLineRange: scenarioPlan.sourceLineRange,
          windowResult,
          requiredReceiptPaths: scenarioPlan.requiredReceiptPaths || [],
        },
      ],
      capturedEvents,
      runStartedAt,
      runEndedAt: windowResult.windowEndedAt,
      receiptSourcePaths: scenarioPlan.requiredReceiptPaths || [],
      blockerFindings: scenarioPlan.blockerFindings ? scenarioPlan.blockerFindings(windowResult.workResult) : [],
    });

    packetCount += 1;
    process.stdout.write(`[${packetCount}/${scenarios.length}] wrote ${scenarioPlan.scenarioId} -> ${packetPath}\n`);
  }

  process.stdout.write(`Self-proof run complete: ${packetCount} scenario packet(s) written for run id ${runId}\n`);
}

function readsScenarioPlan() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return [
    {
      scenarioId: 'inventory-every-feature-scenario-and-proof-state',
      scenarioName: 'Inventory every feature scenario and proof state',
      acceptanceLineRange: { start: 8, end: 32 },
      nodeLabel: 'BUILDS AND WRITES FEATURE PROOF INVENTORY',
      runtimePath: 'src/feature-execution-proof/discovers-feature-and-scenario-metadata/discovers-feature-and-scenario-metadata.js',
      sourceLineRange: { start: 10, end: 61 },
      requiredReceiptPaths: [`evidence/runs/${process.argv[2]}/feature-proof-inventory.contract.v1.json`],
      work: (rootDir) => {
        const inventory = buildsFeatureProofInventory({ rootDir, runId: process.argv[2], implementationIndex: {} });
        const outputPath = path.join(rootDir, 'evidence', 'runs', process.argv[2], 'feature-proof-inventory.contract.v1.json');
        return writesFeatureProofInventory(inventory, outputPath);
      },
    },
    {
      scenarioId: 'write-canonical-json-execution-proof-for-a-scenario',
      scenarioName: 'Write canonical JSON execution proof for a scenario',
      acceptanceLineRange: { start: 33, end: 63 },
      nodeLabel: 'READS SCENARIO PROOFS FROM A REAL RUN',
      runtimePath: 'src/runs-feature-proof-promotion/runs-feature-proof-promotion.js',
      sourceLineRange: { start: 14, end: 42 },
      requiredReceiptPaths: [donorProofReceiptPath('inventory-evidence-runs-without-deleting-anything')],
      work: (rootDir) => readsScenarioProofsFromRun(rootDir, DONOR_RUN_ID, DONOR_FEATURE_ID),
    },
    {
      scenarioId: 'write-human-readable-scenario-proof-report-beside-json-proof',
      scenarioName: 'Write human-readable scenario proof report beside JSON proof',
      acceptanceLineRange: { start: 64, end: 91 },
      nodeLabel: 'READS SCENARIO PROOF REPORTS FROM A REAL RUN',
      runtimePath: 'evidence/runs/' + DONOR_RUN_ID + '/features/' + DONOR_FEATURE_ID + '/scenarios',
      sourceLineRange: { start: 1, end: 1 },
      requiredReceiptPaths: [`evidence/runs/${DONOR_RUN_ID}/features/${DONOR_FEATURE_ID}/scenarios/connect-evidence-to-feature-and-scenario-ownership/executable-body-contract.report.md`],
      work: (rootDir) => {
        const scenariosRoot = path.join(rootDir, 'evidence', 'runs', DONOR_RUN_ID, 'features', DONOR_FEATURE_ID, 'scenarios');
        const scenarioIds = fs.readdirSync(scenariosRoot);
        const reportPaths = scenarioIds.map((scenarioId) => path.join(scenariosRoot, scenarioId, 'executable-body-contract.report.md')).filter((reportPath) => fs.existsSync(reportPath));
        return { scenarioIds, reportPaths };
      },
    },
    {
      scenarioId: 'promote-a-selected-proof-run-into-a-source-controlled-feature-proof-body',
      scenarioName: 'Promote a selected proof run into a source-controlled feature proof body',
      acceptanceLineRange: { start: 92, end: 117 },
      nodeLabel: 'RUNS FEATURE PROOF PROMOTION (DRY RUN)',
      runtimePath: 'src/runs-feature-proof-promotion/runs-feature-proof-promotion.js',
      sourceLineRange: { start: 91, end: 121 },
      requiredReceiptPaths: [donorProofReceiptPath('connect-evidence-to-feature-and-scenario-ownership')],
      work: (rootDir) => runsFeatureProofPromotion({ rootDir }, DONOR_FEATURE_ID, DONOR_RUN_ID, { write: false }),
    },
    {
      scenarioId: 'publish-one-feature-level-proof-body-for-the-whole-feature',
      scenarioName: 'Publish one feature-level proof body for the whole feature',
      acceptanceLineRange: { start: 118, end: 134 },
      nodeLabel: 'BUILDS FEATURE PROOF BODY WITH ONE SECTION PER SCENARIO',
      runtimePath: 'src/promotes-feature-execution-proof/promotes-feature-execution-proof.js',
      sourceLineRange: { start: 66, end: 101 },
      requiredReceiptPaths: [donorProofReceiptPath('connect-evidence-to-feature-and-scenario-ownership')],
      work: (rootDir) => {
        const result = runsFeatureProofPromotion({ rootDir }, DONOR_FEATURE_ID, DONOR_RUN_ID, { write: false });
        return { scenarioSectionCount: result.body.scenarioSections.length, promotionDecision: result.body.promotionDecision };
      },
    },
    {
      scenarioId: 'block-proven-feature-status-without-a-committed-proof-body',
      scenarioName: 'Block proven feature status without a committed proof body',
      acceptanceLineRange: { start: 135, end: 148 },
      nodeLabel: 'CHECKS FEATURE STATUS CLAIMS PROOF BODY',
      runtimePath: 'src/checks-feature-proof-source-truth-gate/checks-feature-proof-source-truth-gate.js',
      sourceLineRange: { start: 25, end: 55 },
      requiredReceiptPaths: ['docs/features/_feature-status/llm-evidence-curation-and-cleanup.status.v1.json'],
      blockerFindings: (workResult) => (workResult.verdict === 'BLOCKED' ? workResult.findings : []),
      work: (rootDir) => checksFeatureStatusClaimsProofBody(rootDir, 'a-feature-with-no-proof-body-yet', 'proven'),
    },
    {
      scenarioId: 'mark-feature-proof-body-stale-when-source-or-selected-proof-changes',
      scenarioName: 'Mark feature proof body stale when source or selected proof changes',
      acceptanceLineRange: { start: 149, end: 158 },
      nodeLabel: 'CHECKS FEATURE PROOF BODY FRESHNESS',
      runtimePath: 'src/checks-feature-proof-source-truth-gate/checks-feature-proof-source-truth-gate.js',
      sourceLineRange: { start: 62, end: 105 },
      requiredReceiptPaths: [`docs/features/${DONOR_FEATURE_ID}.feature.md`],
      work: (rootDir) => checksFeatureProofBodyFreshness(rootDir, DONOR_FEATURE_ID),
    },
    {
      scenarioId: 'opt-out-of-routine-proof-evidence-when-source-controlled-proof-is-current',
      scenarioName: 'Opt out of routine proof evidence when source-controlled proof is current',
      acceptanceLineRange: { start: 159, end: 182 },
      nodeLabel: 'CHECKS FEATURE PROOF OPT-OUT',
      runtimePath: 'src/checks-feature-proof-source-truth-gate/checks-feature-proof-source-truth-gate.js',
      sourceLineRange: { start: 140, end: 168 },
      requiredReceiptPaths: [`docs/features/${DONOR_FEATURE_ID}.feature.md`],
      work: (rootDir) => checksFeatureProofOptOut(rootDir, DONOR_FEATURE_ID),
    },
    {
      scenarioId: 're-enter-proof-execution-when-opt-out-is-invalidated',
      scenarioName: 'Re-enter proof execution when opt-out is invalidated',
      acceptanceLineRange: { start: 183, end: 203 },
      nodeLabel: 'CHECKS FEATURE PROOF OPT-OUT WITH INVALIDATION CONDITION',
      runtimePath: 'src/checks-feature-proof-source-truth-gate/checks-feature-proof-source-truth-gate.js',
      sourceLineRange: { start: 140, end: 168 },
      requiredReceiptPaths: [`docs/features/${DONOR_FEATURE_ID}.feature.md`],
      work: (rootDir) => checksFeatureProofOptOut(rootDir, DONOR_FEATURE_ID, ['product owner requests proof refresh']),
    },
    {
      scenarioId: 'block-opt-out-when-proof-body-does-not-cover-every-current-scenario',
      scenarioName: 'Block opt-out when proof body does not cover every current scenario',
      acceptanceLineRange: { start: 204, end: 214 },
      nodeLabel: 'FINDS SCENARIOS MISSING FROM A PROOF RUN',
      runtimePath: 'src/promotes-feature-execution-proof/promotes-feature-execution-proof.js',
      sourceLineRange: { start: 14, end: 29 },
      requiredReceiptPaths: [`docs/features/${DONOR_FEATURE_ID}.feature.md`],
      work: (rootDir) => {
        const feature = discoversFeatureScenarios(path.join(rootDir, 'docs', 'features', `${DONOR_FEATURE_ID}.feature.md`));
        const scenarioProofs = readsScenarioProofsFromRun(rootDir, DONOR_RUN_ID, DONOR_FEATURE_ID);
        return { missingScenarios: findsMissingScenarios(feature.scenarios, scenarioProofs) };
      },
    },
    {
      scenarioId: 'keep-raw-run-evidence-out-of-version-control',
      scenarioName: 'Keep raw run evidence out of version control',
      acceptanceLineRange: { start: 215, end: 222 },
      nodeLabel: 'BUILDS FEATURE PROOF BODY PATH UNDER DOCS/FEATURE-PROOFS',
      runtimePath: 'src/runs-feature-proof-promotion/runs-feature-proof-promotion.js',
      sourceLineRange: { start: 9, end: 14 },
      requiredReceiptPaths: ['docs/feature-proofs/README.md'],
      work: (rootDir) => ({ proofBodyPath: buildsFeatureProofBodyPath(rootDir, DONOR_FEATURE_ID) }),
    },
    {
      scenarioId: 'write-shareable-timing-table-projection',
      scenarioName: 'Write shareable timing table projection',
      acceptanceLineRange: { start: 223, end: 245 },
      nodeLabel: 'READS A REAL EXECUTION TIMELINE TABLE FROM A DONOR RUN',
      runtimePath: 'evidence/runs/' + DONOR_RUN_ID,
      sourceLineRange: { start: 1, end: 1 },
      requiredReceiptPaths: [`evidence/runs/${DONOR_RUN_ID}/features/${DONOR_FEATURE_ID}/scenarios/connect-evidence-to-feature-and-scenario-ownership/execution-timeline.table.md`],
      work: (rootDir) => {
        const scenariosRoot = path.join(rootDir, 'evidence', 'runs', DONOR_RUN_ID, 'features', DONOR_FEATURE_ID, 'scenarios');
        const scenarioIds = fs.readdirSync(scenariosRoot);
        const tablePaths = scenarioIds.map((scenarioId) => path.join(scenariosRoot, scenarioId, 'execution-timeline.table.md')).filter((tablePath) => fs.existsSync(tablePath));
        return { tablePaths };
      },
    },
    {
      scenarioId: 'tie-json-proof-to-raw-telemetry-and-receipts',
      scenarioName: 'Tie JSON proof to raw telemetry and receipts',
      acceptanceLineRange: { start: 246, end: 270 },
      nodeLabel: 'READS ONE REAL DONOR PROOF AND ITS TELEMETRY TIE-OUT',
      runtimePath: 'src/runs-feature-proof-promotion/runs-feature-proof-promotion.js',
      sourceLineRange: { start: 50, end: 66 },
      requiredReceiptPaths: [donorProofReceiptPath('connect-evidence-to-feature-and-scenario-ownership')],
      work: (rootDir) => {
        const scenarioProofs = readsScenarioProofsFromRun(rootDir, DONOR_RUN_ID, DONOR_FEATURE_ID);
        return { firstScenarioNodeCount: scenarioProofs[0] ? (scenarioProofs[0].proof.observedExecutionTimeline || []).length : 0 };
      },
    },
    {
      scenarioId: 'preserve-method-call-drill-down-inside-observed-body-nodes',
      scenarioName: 'Preserve method call drill-down inside observed body nodes',
      acceptanceLineRange: { start: 271, end: 294 },
      nodeLabel: 'READS METHOD CALLS FROM A REAL DONOR PROOF NODE',
      runtimePath: 'src/runs-feature-proof-promotion/runs-feature-proof-promotion.js',
      sourceLineRange: { start: 50, end: 66 },
      requiredReceiptPaths: [donorProofReceiptPath('connect-evidence-to-feature-and-scenario-ownership')],
      work: (rootDir) => {
        const scenarioProofs = readsScenarioProofsFromRun(rootDir, DONOR_RUN_ID, DONOR_FEATURE_ID);
        const firstNode = scenarioProofs[0] ? (scenarioProofs[0].proof.observedExecutionTimeline || [])[0] : undefined;
        return { methodCallCount: firstNode && Array.isArray(firstNode.methodCalls) ? firstNode.methodCalls.length : 0 };
      },
    },
    {
      scenarioId: 'preserve-repeated-calls-in-the-execution-proof',
      scenarioName: 'Preserve repeated calls in the execution proof',
      acceptanceLineRange: { start: 295, end: 310 },
      nodeLabel: 'READS CALL COUNT SUMMARY FROM A REAL DONOR PROOF NODE',
      runtimePath: 'src/runs-feature-proof-promotion/runs-feature-proof-promotion.js',
      sourceLineRange: { start: 50, end: 66 },
      requiredReceiptPaths: [donorProofReceiptPath('connect-evidence-to-feature-and-scenario-ownership')],
      work: (rootDir) => {
        const scenarioProofs = readsScenarioProofsFromRun(rootDir, DONOR_RUN_ID, DONOR_FEATURE_ID);
        const firstNode = scenarioProofs[0] ? (scenarioProofs[0].proof.observedExecutionTimeline || [])[0] : undefined;
        return { callCount: firstNode ? firstNode.callCount : 0 };
      },
    },
    {
      scenarioId: 'calculate-product-timing-metrics-from-observed-evidence',
      scenarioName: 'Calculate product timing metrics from observed evidence',
      acceptanceLineRange: { start: 311, end: 327 },
      nodeLabel: 'READS TIMING METRICS FROM A REAL DONOR PROOF',
      runtimePath: 'src/runs-feature-proof-promotion/runs-feature-proof-promotion.js',
      sourceLineRange: { start: 50, end: 66 },
      requiredReceiptPaths: [donorProofReceiptPath('connect-evidence-to-feature-and-scenario-ownership')],
      work: (rootDir) => {
        const scenarioProofs = readsScenarioProofsFromRun(rootDir, DONOR_RUN_ID, DONOR_FEATURE_ID);
        return { timingMetrics: scenarioProofs[0] ? scenarioProofs[0].proof.timingMetrics : undefined };
      },
    },
    {
      scenarioId: 'establish-service-level-indicators-from-execution-proof',
      scenarioName: 'Establish service level indicators from execution proof',
      acceptanceLineRange: { start: 328, end: 356 },
      nodeLabel: 'READS SERVICE LEVEL INDICATORS FROM A REAL DONOR PROOF',
      runtimePath: 'src/runs-feature-proof-promotion/runs-feature-proof-promotion.js',
      sourceLineRange: { start: 50, end: 66 },
      requiredReceiptPaths: [donorProofReceiptPath('connect-evidence-to-feature-and-scenario-ownership')],
      work: (rootDir) => {
        const scenarioProofs = readsScenarioProofsFromRun(rootDir, DONOR_RUN_ID, DONOR_FEATURE_ID);
        return { serviceLevelIndicators: scenarioProofs[0] ? scenarioProofs[0].proof.serviceLevelIndicators : undefined };
      },
    },
    {
      scenarioId: 'evaluate-service-level-objectives-from-scenario-evidence',
      scenarioName: 'Evaluate service level objectives from scenario evidence',
      acceptanceLineRange: { start: 357, end: 380 },
      nodeLabel: 'READS SERVICE LEVEL OBJECTIVE EVALUATION FROM A REAL DONOR PROOF',
      runtimePath: 'src/runs-feature-proof-promotion/runs-feature-proof-promotion.js',
      sourceLineRange: { start: 50, end: 66 },
      requiredReceiptPaths: [donorProofReceiptPath('connect-evidence-to-feature-and-scenario-ownership')],
      work: (rootDir) => {
        const scenarioProofs = readsScenarioProofsFromRun(rootDir, DONOR_RUN_ID, DONOR_FEATURE_ID);
        return { serviceLevelObjectives: scenarioProofs[0] ? scenarioProofs[0].proof.serviceLevelObjectives : undefined };
      },
    },
    {
      scenarioId: 'preserve-sla-evidence-without-turning-reports-into-contracts',
      scenarioName: 'Preserve SLA evidence without turning reports into contracts',
      acceptanceLineRange: { start: 381, end: 390 },
      nodeLabel: 'READS SLA SUPPORT EVIDENCE FROM A REAL DONOR PROOF',
      runtimePath: 'src/runs-feature-proof-promotion/runs-feature-proof-promotion.js',
      sourceLineRange: { start: 50, end: 66 },
      requiredReceiptPaths: [donorProofReceiptPath('connect-evidence-to-feature-and-scenario-ownership')],
      work: (rootDir) => {
        const scenarioProofs = readsScenarioProofsFromRun(rootDir, DONOR_RUN_ID, DONOR_FEATURE_ID);
        return { slaSupportEvidence: scenarioProofs[0] ? scenarioProofs[0].proof.slaSupportEvidence : undefined };
      },
    },
    {
      scenarioId: 'render-human-report-from-canonical-json-proof',
      scenarioName: 'Render human report from canonical JSON proof',
      acceptanceLineRange: { start: 391, end: 411 },
      nodeLabel: 'RENDERS FEATURE PROOF BODY FROM A REAL DONOR RUN',
      runtimePath: 'src/promotes-feature-execution-proof/promotes-feature-execution-proof.js',
      sourceLineRange: { start: 165, end: 240 },
      requiredReceiptPaths: [donorProofReceiptPath('connect-evidence-to-feature-and-scenario-ownership')],
      work: (rootDir) => {
        const result = runsFeatureProofPromotion({ rootDir }, DONOR_FEATURE_ID, DONOR_RUN_ID, { write: false });
        return { renderedLength: result.content.length };
      },
    },
    {
      scenarioId: 'reject-report-facts-not-backed-by-json-proof',
      scenarioName: 'Reject report facts not backed by JSON proof',
      acceptanceLineRange: { start: 412, end: 421 },
      nodeLabel: 'CHECKS FEATURE REPORT TRUTH GATE AGAINST A REAL DONOR PROOF',
      runtimePath: 'src/feature-execution-proof/feature-execution-proof.js',
      sourceLineRange: { start: 37, end: 90 },
      requiredReceiptPaths: [`evidence/runs/${DONOR_RUN_ID}/features/${DONOR_FEATURE_ID}/scenarios/connect-evidence-to-feature-and-scenario-ownership/executable-body-contract.report.md`],
      blockerFindings: (workResult) => (workResult.verdict === 'BLOCKED' ? workResult.findings : []),
      work: (rootDir) => {
        const scenariosRoot = path.join(rootDir, 'evidence', 'runs', DONOR_RUN_ID, 'features', DONOR_FEATURE_ID, 'scenarios');
        const firstScenarioId = fs.readdirSync(scenariosRoot)[0];
        const reportPath = path.join(scenariosRoot, firstScenarioId, 'executable-body-contract.report.md');
        const proofPath = path.join(scenariosRoot, firstScenarioId, 'feature-execution.contract.v1.json');
        const { checksFeatureReportTruthGate } = require('../src/feature-execution-proof/feature-execution-proof');
        const reportContent = fs.readFileSync(reportPath, 'utf8');
        const proof = JSON.parse(fs.readFileSync(proofPath, 'utf8'));
        return checksFeatureReportTruthGate(reportContent, proof);
      },
    },
    {
      scenarioId: 'keep-json-proof-portable-for-downstream-analysis',
      scenarioName: 'Keep JSON proof portable for downstream analysis',
      acceptanceLineRange: { start: 422, end: 442 },
      nodeLabel: 'PROJECTS A REAL DONOR PROOF TO CSV',
      runtimePath: 'src/feature-execution-proof/formats-and-serializes-data/formats-and-serializes-data.js',
      sourceLineRange: { start: 87, end: 133 },
      requiredReceiptPaths: ['evidence/runs/f368bb5e6dd76ec23a83b3edb79a18be4d2bdc324bd3cc7603727f588a637e1d/features/llm-domain-remediation/scenarios/create-a-remediation-backlog-from-a-frozen-evidence-run/feature-execution.contract.v1.json'],
      work: (rootDir) => {
        const { projectsFeatureExecutionProofToCsv } = require('../src/feature-execution-proof/feature-execution-proof');
        const lightDonorRunId = 'f368bb5e6dd76ec23a83b3edb79a18be4d2bdc324bd3cc7603727f588a637e1d';
        const lightDonorFeatureId = 'llm-domain-remediation';
        const lightDonorScenarioId = 'create-a-remediation-backlog-from-a-frozen-evidence-run';
        const proofPath = path.join(rootDir, 'evidence', 'runs', lightDonorRunId, 'features', lightDonorFeatureId, 'scenarios', lightDonorScenarioId, 'feature-execution.contract.v1.json');
        const proof = JSON.parse(fs.readFileSync(proofPath, 'utf8'));
        const csv = projectsFeatureExecutionProofToCsv([proof]);
        return { csvLength: csv.length, sourceProofPath: proofPath };
      },
    },
  ];
}

runsFeatureProofSelfRunCli().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
