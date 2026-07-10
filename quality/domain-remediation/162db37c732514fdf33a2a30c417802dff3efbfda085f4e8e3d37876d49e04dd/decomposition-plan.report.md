# Decomposition Plan Report

Source run: 162db37c732514fdf33a2a30c417802dff3efbfda085f4e8e3d37876d49e04dd
Domain analysis contract: evidence/runs/162db37c732514fdf33a2a30c417802dff3efbfda085f4e8e3d37876d49e04dd/domain-analysis/domain-body-analysis.contract.v1.json
Rename plan: quality/domain-remediation/162db37c732514fdf33a2a30c417802dff3efbfda085f4e8e3d37876d49e04dd/rename-plan.v1.json

Total candidates in this pass: 9

Implementation files must not be changed until each section below is accepted by a product owner.

## packages/logme-method-inventory-primitives/src/extracts-executable-method-nodes.js

### Current Responsibilities

- unclear-action: isMethodLikeNode, extractsExecutableMethodNodes
- collect: collectsMethodLikeNode

### Proposed Action-Bearing Body Names

- packages/logme-method-inventory-primitives/src/is-method-like-node/is-method-like-node.js: isMethodLikeNode -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- packages/logme-method-inventory-primitives/src/extracts-executable-method-nodes/extracts-executable-method-nodes.js: extractsExecutableMethodNodes -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- packages/logme-method-inventory-primitives/src/collects-method-like-node/collects-method-like-node.js: collectsMethodLikeNode -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)

### Scenario Tie-Outs

not yet assigned; run the Scenario Tie-Out Worker against each proposed body after this plan is accepted

### Contract Updates

add one file-system body contract entry per proposed body; remove or narrow the entry for the current path

### Import Migration Plan

not yet determined; requires an import-site scan against the accepted proposed paths after promotion

### Behavior-Preserving Tests

existing tests for packages/logme-method-inventory-primitives/src/extracts-executable-method-nodes.js must continue to pass; add one test per proposed body covering its moved methods before promotion

### Rollback Notes

revert to packages/logme-method-inventory-primitives/src/extracts-executable-method-nodes.js and its original contract entry if any behavior-preserving test fails after the split

## src/end-user-quality-evidence-bundle/end-user-quality-evidence-bundle.js

### Current Responsibilities

- unclear-action: formatsRepoRelativePath, readsFeatureFiles, hashesFile, redactsSecretText, readsGitValue, readsBundleManifests, readsDirectoryPaths, indexesLatestQaByScenario, readsScenarioKey, linksHumanReports, readsLinkedReportSourcePaths, checksManifestHashes, mergesBlockerCodes, deduplicatesCodes, countsFailedQaScenarios, countsWaivedQaScenarios
- build: buildsQualityBundlePath, buildsMachineEnvironment, buildsQualityInventory, buildsRequiredReportCandidates, buildsQaGateDecision, buildsQaReadinessRows
- write: writesJsonArtifact, writesMarkdownArtifact, writesQualityEvidenceBundle
- run: sortsBundleManifestsByRunId, runsQualityPromotionGate
- classify: classifiesQaStatus
- detect: detectsFailedQaScenario, detectsUnapprovedQaWaiver, detectsUnpassedQaScenario
- render: rendersQaExecutionTimeline, rendersEndUserTestSession, rendersBlockerWorklist, rendersScreenshotsIndex, rendersHtmlPreviewIndex, rendersQualityEvidenceBundleReport, rendersBlockerCodeLines, rendersLinkedReportList, rendersQaReadinessSection, rendersGlobalReportWithQaReadiness

### Proposed Action-Bearing Body Names

- src/end-user-quality-evidence-bundle/formats-repo-relative-path/formats-repo-relative-path.js: formatsRepoRelativePath -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/builds-quality-bundle-path/builds-quality-bundle-path.js: buildsQualityBundlePath -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/reads-feature-files/reads-feature-files.js: readsFeatureFiles -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/hashes-file/hashes-file.js: hashesFile -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/writes-json-artifact/writes-json-artifact.js: writesJsonArtifact -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/writes-markdown-artifact/writes-markdown-artifact.js: writesMarkdownArtifact -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/redacts-secret-text/redacts-secret-text.js: redactsSecretText -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/reads-git-value/reads-git-value.js: readsGitValue -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/builds-machine-environment/builds-machine-environment.js: buildsMachineEnvironment -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/reads-bundle-manifests/reads-bundle-manifests.js: readsBundleManifests -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/sorts-bundle-manifests-by-run-id/sorts-bundle-manifests-by-run-id.js: sortsBundleManifestsByRunId -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/reads-directory-paths/reads-directory-paths.js: readsDirectoryPaths -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/indexes-latest-qa-by-scenario/indexes-latest-qa-by-scenario.js: indexesLatestQaByScenario -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/classifies-qa-status/classifies-qa-status.js: classifiesQaStatus -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/builds-quality-inventory/builds-quality-inventory.js: buildsQualityInventory -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/reads-scenario-key/reads-scenario-key.js: readsScenarioKey -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/builds-required-report-candidates/builds-required-report-candidates.js: buildsRequiredReportCandidates -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/links-human-reports/links-human-reports.js: linksHumanReports -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/builds-qa-gate-decision/builds-qa-gate-decision.js: buildsQaGateDecision -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/detects-failed-qa-scenario/detects-failed-qa-scenario.js: detectsFailedQaScenario -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/detects-unapproved-qa-waiver/detects-unapproved-qa-waiver.js: detectsUnapprovedQaWaiver -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/writes-quality-evidence-bundle/writes-quality-evidence-bundle.js: writesQualityEvidenceBundle -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/reads-linked-report-source-paths/reads-linked-report-source-paths.js: readsLinkedReportSourcePaths -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/renders-qa-execution-timeline/renders-qa-execution-timeline.js: rendersQaExecutionTimeline -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/renders-end-user-test-session/renders-end-user-test-session.js: rendersEndUserTestSession -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/renders-blocker-worklist/renders-blocker-worklist.js: rendersBlockerWorklist -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/renders-screenshots-index/renders-screenshots-index.js: rendersScreenshotsIndex -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/renders-html-preview-index/renders-html-preview-index.js: rendersHtmlPreviewIndex -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/renders-quality-evidence-bundle-report/renders-quality-evidence-bundle-report.js: rendersQualityEvidenceBundleReport -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/renders-blocker-code-lines/renders-blocker-code-lines.js: rendersBlockerCodeLines -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/renders-linked-report-list/renders-linked-report-list.js: rendersLinkedReportList -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/checks-manifest-hashes/checks-manifest-hashes.js: checksManifestHashes -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/runs-quality-promotion-gate/runs-quality-promotion-gate.js: runsQualityPromotionGate -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/merges-blocker-codes/merges-blocker-codes.js: mergesBlockerCodes -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/detects-unpassed-qa-scenario/detects-unpassed-qa-scenario.js: detectsUnpassedQaScenario -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/deduplicates-codes/deduplicates-codes.js: deduplicatesCodes -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/builds-qa-readiness-rows/builds-qa-readiness-rows.js: buildsQaReadinessRows -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/counts-failed-qa-scenarios/counts-failed-qa-scenarios.js: countsFailedQaScenarios -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/counts-waived-qa-scenarios/counts-waived-qa-scenarios.js: countsWaivedQaScenarios -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/renders-qa-readiness-section/renders-qa-readiness-section.js: rendersQaReadinessSection -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/end-user-quality-evidence-bundle/renders-global-report-with-qa-readiness/renders-global-report-with-qa-readiness.js: rendersGlobalReportWithQaReadiness -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)

### Scenario Tie-Outs

not yet assigned; run the Scenario Tie-Out Worker against each proposed body after this plan is accepted

### Contract Updates

add one file-system body contract entry per proposed body; remove or narrow the entry for the current path

### Import Migration Plan

not yet determined; requires an import-site scan against the accepted proposed paths after promotion

### Behavior-Preserving Tests

existing tests for src/end-user-quality-evidence-bundle/end-user-quality-evidence-bundle.js must continue to pass; add one test per proposed body covering its moved methods before promotion

### Rollback Notes

revert to src/end-user-quality-evidence-bundle/end-user-quality-evidence-bundle.js and its original contract entry if any behavior-preserving test fails after the split

## src/feature-execution-proof/feature-execution-proof.js

### Current Responsibilities

- unclear-action: slugifies, readsLines, selectsScenarioProofStatus, normalizesDeclaredNode, eventMatchesNode, sortsEventsByTimeAndStep, readsMilliseconds, readsEventTimestamp, formatsSourceLineRange, readsTelemetryEventIdsForMethod, readsReceiptPathsForMethod, sumsNumbers, findsReceiptPathsForNode, readsTelemetryEventIds, readsTelemetryEventPaths, readsElapsedBetweenNodes, findsSlowestNode, countsNodesWithObservedTelemetry, countsNodesWithObservedReceipts, indexesSlisByName, evaluatesSingleServiceLevelObjective, evaluatesServiceLevelObjectives, readsBlockerFindingCode, readsNodeBlockerCodes, normalizesDeclaredNodes, readsTelemetrySourcePaths, formatsValue, formatsRepoRelativePath, formatsProofPathForReport, readsFirstBlockerCode, readsRuntimeStep, formatsSourcePathWithLineRange, escapesCsv, projectsFeatureExecutionProofToCsv, indexesSloEvaluationsById, readsSupportingEvaluations, checksFeatureReportTruthGate, checksUnsupportedSlaClaims
- discover: discoversFeatureScenarios, discoversFeatureFiles
- build: buildsFeatureProofPath, buildsScenarioProofReportPath, buildsScenarioTimingTablePath, buildsScenarioMethodTimelineTablePath, buildsScenarioMethodEvidenceReportPath, buildsFeatureProofInventory, buildsObservedCall, buildsMethodCall, buildsMethodCalls, buildsObservedCalls, buildsObservedNode, buildsObservedExecutionTimeline, buildsNodeDurationMetric, buildsNodeDurationMetrics, buildsNodeCallCountMetric, buildsNodeCallCountMetrics, buildsSli, buildsPromotionDecision, buildsFeatureExecutionProof
- write: writesFeatureProofInventory, writesFeatureExecutionProof, writesScenarioProofReport, writesScenarioTimingTable, writesScenarioMethodTimelineTable, writesMethodCallEvidenceReport
- calculate: calculatesDurationMs, calculatesTotalObservedWaitTimeMs, calculatesMethodTimingMetrics, calculatesTimingMetrics, calculatesCallCountMetrics, calculatesServiceLevelIndicators
- call: summarizesCalls, readsObservedCalls, readsCallDurations, readsMethodCalls, findsSlowestMethodCall, countsObservedCalls, stampsMethodCallOwnership
- render: rendersFeatureExecutionReport, rendersScenarioProofExecutiveSummary, rendersScenarioProofIdentity, rendersScenarioProofPromotionDecision, rendersScenarioProofAsciiSketch, rendersScenarioProofOrderedTimeline, rendersScenarioTimingMetrics, rendersServiceLevelIndicatorSummary, rendersServiceLevelObjectiveEvaluation, rendersSlaSupportEvidence, rendersBlockerWorklist, rendersSourceEvidenceLinks, rendersDenseTelemetryAppendix, rendersScenarioProofReport, rendersScenarioTimingTable, rendersScenarioMethodTimelineTable, rendersMethodCallEvidenceReport
- detect: detectsUnsupportedSupportingEvaluation

### Proposed Action-Bearing Body Names

- src/feature-execution-proof/slugifies/slugifies.js: slugifies -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/reads-lines/reads-lines.js: readsLines -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/discovers-feature-scenarios/discovers-feature-scenarios.js: discoversFeatureScenarios -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/discovers-feature-files/discovers-feature-files.js: discoversFeatureFiles -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/builds-feature-proof-path/builds-feature-proof-path.js: buildsFeatureProofPath -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/builds-scenario-proof-report-path/builds-scenario-proof-report-path.js: buildsScenarioProofReportPath -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/builds-scenario-timing-table-path/builds-scenario-timing-table-path.js: buildsScenarioTimingTablePath -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/builds-scenario-method-timeline-table-path/builds-scenario-method-timeline-table-path.js: buildsScenarioMethodTimelineTablePath -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/builds-scenario-method-evidence-report-path/builds-scenario-method-evidence-report-path.js: buildsScenarioMethodEvidenceReportPath -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/selects-scenario-proof-status/selects-scenario-proof-status.js: selectsScenarioProofStatus -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/builds-feature-proof-inventory/builds-feature-proof-inventory.js: buildsFeatureProofInventory -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/writes-feature-proof-inventory/writes-feature-proof-inventory.js: writesFeatureProofInventory -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/normalizes-declared-node/normalizes-declared-node.js: normalizesDeclaredNode -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/event-matches-node/event-matches-node.js: eventMatchesNode -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/sorts-events-by-time-and-step/sorts-events-by-time-and-step.js: sortsEventsByTimeAndStep -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/reads-milliseconds/reads-milliseconds.js: readsMilliseconds -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/calculates-duration-ms/calculates-duration-ms.js: calculatesDurationMs -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/reads-event-timestamp/reads-event-timestamp.js: readsEventTimestamp -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/builds-observed-call/builds-observed-call.js: buildsObservedCall -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/formats-source-line-range/formats-source-line-range.js: formatsSourceLineRange -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/reads-telemetry-event-ids-for-method/reads-telemetry-event-ids-for-method.js: readsTelemetryEventIdsForMethod -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/reads-receipt-paths-for-method/reads-receipt-paths-for-method.js: readsReceiptPathsForMethod -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/builds-method-call/builds-method-call.js: buildsMethodCall -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/builds-method-calls/builds-method-calls.js: buildsMethodCalls -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/summarizes-calls/summarizes-calls.js: summarizesCalls -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/sums-numbers/sums-numbers.js: sumsNumbers -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/finds-receipt-paths-for-node/finds-receipt-paths-for-node.js: findsReceiptPathsForNode -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/builds-observed-calls/builds-observed-calls.js: buildsObservedCalls -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/reads-telemetry-event-ids/reads-telemetry-event-ids.js: readsTelemetryEventIds -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/reads-telemetry-event-paths/reads-telemetry-event-paths.js: readsTelemetryEventPaths -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/builds-observed-node/builds-observed-node.js: buildsObservedNode -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/builds-observed-execution-timeline/builds-observed-execution-timeline.js: buildsObservedExecutionTimeline -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/reads-observed-calls/reads-observed-calls.js: readsObservedCalls -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/reads-call-durations/reads-call-durations.js: readsCallDurations -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/reads-elapsed-between-nodes/reads-elapsed-between-nodes.js: readsElapsedBetweenNodes -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/finds-slowest-node/finds-slowest-node.js: findsSlowestNode -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/reads-method-calls/reads-method-calls.js: readsMethodCalls -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/finds-slowest-method-call/finds-slowest-method-call.js: findsSlowestMethodCall -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/calculates-total-observed-wait-time-ms/calculates-total-observed-wait-time-ms.js: calculatesTotalObservedWaitTimeMs -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/calculates-method-timing-metrics/calculates-method-timing-metrics.js: calculatesMethodTimingMetrics -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/builds-node-duration-metric/builds-node-duration-metric.js: buildsNodeDurationMetric -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/builds-node-duration-metrics/builds-node-duration-metrics.js: buildsNodeDurationMetrics -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/calculates-timing-metrics/calculates-timing-metrics.js: calculatesTimingMetrics -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/builds-node-call-count-metric/builds-node-call-count-metric.js: buildsNodeCallCountMetric -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/counts-observed-calls/counts-observed-calls.js: countsObservedCalls -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/builds-node-call-count-metrics/builds-node-call-count-metrics.js: buildsNodeCallCountMetrics -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/calculates-call-count-metrics/calculates-call-count-metrics.js: calculatesCallCountMetrics -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/builds-sli/builds-sli.js: buildsSli -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/calculates-service-level-indicators/calculates-service-level-indicators.js: calculatesServiceLevelIndicators -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/counts-nodes-with-observed-telemetry/counts-nodes-with-observed-telemetry.js: countsNodesWithObservedTelemetry -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/counts-nodes-with-observed-receipts/counts-nodes-with-observed-receipts.js: countsNodesWithObservedReceipts -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/indexes-slis-by-name/indexes-slis-by-name.js: indexesSlisByName -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/evaluates-single-service-level-objective/evaluates-single-service-level-objective.js: evaluatesSingleServiceLevelObjective -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/evaluates-service-level-objectives/evaluates-service-level-objectives.js: evaluatesServiceLevelObjectives -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/reads-blocker-finding-code/reads-blocker-finding-code.js: readsBlockerFindingCode -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/reads-node-blocker-codes/reads-node-blocker-codes.js: readsNodeBlockerCodes -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/builds-promotion-decision/builds-promotion-decision.js: buildsPromotionDecision -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/normalizes-declared-nodes/normalizes-declared-nodes.js: normalizesDeclaredNodes -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/reads-telemetry-source-paths/reads-telemetry-source-paths.js: readsTelemetrySourcePaths -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/stamps-method-call-ownership/stamps-method-call-ownership.js: stampsMethodCallOwnership -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/builds-feature-execution-proof/builds-feature-execution-proof.js: buildsFeatureExecutionProof -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/writes-feature-execution-proof/writes-feature-execution-proof.js: writesFeatureExecutionProof -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/formats-value/formats-value.js: formatsValue -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/renders-feature-execution-report/renders-feature-execution-report.js: rendersFeatureExecutionReport -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/formats-repo-relative-path/formats-repo-relative-path.js: formatsRepoRelativePath -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/formats-proof-path-for-report/formats-proof-path-for-report.js: formatsProofPathForReport -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/renders-scenario-proof-executive-summary/renders-scenario-proof-executive-summary.js: rendersScenarioProofExecutiveSummary -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/renders-scenario-proof-identity/renders-scenario-proof-identity.js: rendersScenarioProofIdentity -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/renders-scenario-proof-promotion-decision/renders-scenario-proof-promotion-decision.js: rendersScenarioProofPromotionDecision -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/renders-scenario-proof-ascii-sketch/renders-scenario-proof-ascii-sketch.js: rendersScenarioProofAsciiSketch -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/renders-scenario-proof-ordered-timeline/renders-scenario-proof-ordered-timeline.js: rendersScenarioProofOrderedTimeline -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/renders-scenario-timing-metrics/renders-scenario-timing-metrics.js: rendersScenarioTimingMetrics -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/renders-service-level-indicator-summary/renders-service-level-indicator-summary.js: rendersServiceLevelIndicatorSummary -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/renders-service-level-objective-evaluation/renders-service-level-objective-evaluation.js: rendersServiceLevelObjectiveEvaluation -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/renders-sla-support-evidence/renders-sla-support-evidence.js: rendersSlaSupportEvidence -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/renders-blocker-worklist/renders-blocker-worklist.js: rendersBlockerWorklist -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/renders-source-evidence-links/renders-source-evidence-links.js: rendersSourceEvidenceLinks -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/renders-dense-telemetry-appendix/renders-dense-telemetry-appendix.js: rendersDenseTelemetryAppendix -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/renders-scenario-proof-report/renders-scenario-proof-report.js: rendersScenarioProofReport -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/reads-first-blocker-code/reads-first-blocker-code.js: readsFirstBlockerCode -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/reads-runtime-step/reads-runtime-step.js: readsRuntimeStep -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/renders-scenario-timing-table/renders-scenario-timing-table.js: rendersScenarioTimingTable -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/formats-source-path-with-line-range/formats-source-path-with-line-range.js: formatsSourcePathWithLineRange -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/renders-scenario-method-timeline-table/renders-scenario-method-timeline-table.js: rendersScenarioMethodTimelineTable -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/renders-method-call-evidence-report/renders-method-call-evidence-report.js: rendersMethodCallEvidenceReport -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/writes-scenario-proof-report/writes-scenario-proof-report.js: writesScenarioProofReport -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/writes-scenario-timing-table/writes-scenario-timing-table.js: writesScenarioTimingTable -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/writes-scenario-method-timeline-table/writes-scenario-method-timeline-table.js: writesScenarioMethodTimelineTable -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/writes-method-call-evidence-report/writes-method-call-evidence-report.js: writesMethodCallEvidenceReport -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/escapes-csv/escapes-csv.js: escapesCsv -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/projects-feature-execution-proof-to-csv/projects-feature-execution-proof-to-csv.js: projectsFeatureExecutionProofToCsv -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/indexes-slo-evaluations-by-id/indexes-slo-evaluations-by-id.js: indexesSloEvaluationsById -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/reads-supporting-evaluations/reads-supporting-evaluations.js: readsSupportingEvaluations -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/detects-unsupported-supporting-evaluation/detects-unsupported-supporting-evaluation.js: detectsUnsupportedSupportingEvaluation -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/checks-feature-report-truth-gate/checks-feature-report-truth-gate.js: checksFeatureReportTruthGate -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-execution-proof/checks-unsupported-sla-claims/checks-unsupported-sla-claims.js: checksUnsupportedSlaClaims -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)

### Scenario Tie-Outs

not yet assigned; run the Scenario Tie-Out Worker against each proposed body after this plan is accepted

### Contract Updates

add one file-system body contract entry per proposed body; remove or narrow the entry for the current path

### Import Migration Plan

not yet determined; requires an import-site scan against the accepted proposed paths after promotion

### Behavior-Preserving Tests

existing tests for src/feature-execution-proof/feature-execution-proof.js must continue to pass; add one test per proposed body covering its moved methods before promotion

### Rollback Notes

revert to src/feature-execution-proof/feature-execution-proof.js and its original contract entry if any behavior-preserving test fails after the split

## src/feature-quality-board/feature-quality-board.js

### Current Responsibilities

- unclear-action: recordsAuditTestimony, formatsRepoRelativePath, hashesText, hashesFile, readsJsonFile, readsGitValue, sortsFeatureSpecsById, readsDirectoryPaths, readsQaBundleRecords, indexesLatestQaBundleByFeature, readsExecutionProofRecords, readsQaStatus, readsFindingCode, selectsDisplayStatus, appliesStaleReasonsFromPreviousContract, isPassingDisplayStatus, readsPreviousStatusContract, formatsSentinelPathForFinding, removesObsoleteStatusSentinels, countsByDisplayStatus, readsTopBlockerCode, sortsBoardRowsByProductUrgency, sortsBlockerSummaryByFrequency
- discover: discoversFeatureSpecFiles, discoversFeatureSpecs, discoversStatusSentinels
- run: sortsQaBundlesByRunId, sortsProofRecordsByRunId
- collect: collectsBlockerCodes
- render: rendersStaleReason, rendersStatusSentinel, rendersBoardSummary, rendersBlockerSummary, rendersBoardRows, rendersFeatureQualityBoardMarkdown, rendersBoardFindings, rendersFeatureQualityTree
- recommend: recommendsNextAction
- build: buildsEvidenceHashes, buildsFeatureStatusContract, buildsProductOwnerSummary, buildsStatusContractPath, buildsStatusSentinelPath, buildsBoardRows, buildsBoardRow, buildsBlockerSummary, buildsBlockerSummaryEntry, buildsFeatureQualityBoard, buildsSourceStatusContractHashes
- detect: detectsBundleVerificationFindings, detectsPreviousPassingStatusDrift, detectsDuplicateStatusSentinels
- write: writesJsonArtifact, writesTextArtifact, writesFeatureStatusProjection, writesFeatureQualityBoardProjection
- verify: verifiesSentinelMatchesStatus

### Proposed Action-Bearing Body Names

- src/feature-quality-board/records-audit-testimony/records-audit-testimony.js: recordsAuditTestimony -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/formats-repo-relative-path/formats-repo-relative-path.js: formatsRepoRelativePath -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/hashes-text/hashes-text.js: hashesText -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/hashes-file/hashes-file.js: hashesFile -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/reads-json-file/reads-json-file.js: readsJsonFile -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/reads-git-value/reads-git-value.js: readsGitValue -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/discovers-feature-spec-files/discovers-feature-spec-files.js: discoversFeatureSpecFiles -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/discovers-feature-specs/discovers-feature-specs.js: discoversFeatureSpecs -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/sorts-feature-specs-by-id/sorts-feature-specs-by-id.js: sortsFeatureSpecsById -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/reads-directory-paths/reads-directory-paths.js: readsDirectoryPaths -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/reads-qa-bundle-records/reads-qa-bundle-records.js: readsQaBundleRecords -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/sorts-qa-bundles-by-run-id/sorts-qa-bundles-by-run-id.js: sortsQaBundlesByRunId -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/indexes-latest-qa-bundle-by-feature/indexes-latest-qa-bundle-by-feature.js: indexesLatestQaBundleByFeature -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/reads-execution-proof-records/reads-execution-proof-records.js: readsExecutionProofRecords -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/sorts-proof-records-by-run-id/sorts-proof-records-by-run-id.js: sortsProofRecordsByRunId -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/collects-blocker-codes/collects-blocker-codes.js: collectsBlockerCodes -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/reads-qa-status/reads-qa-status.js: readsQaStatus -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/reads-finding-code/reads-finding-code.js: readsFindingCode -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/renders-stale-reason/renders-stale-reason.js: rendersStaleReason -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/selects-display-status/selects-display-status.js: selectsDisplayStatus -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/recommends-next-action/recommends-next-action.js: recommendsNextAction -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/builds-evidence-hashes/builds-evidence-hashes.js: buildsEvidenceHashes -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/detects-bundle-verification-findings/detects-bundle-verification-findings.js: detectsBundleVerificationFindings -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/builds-feature-status-contract/builds-feature-status-contract.js: buildsFeatureStatusContract -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/applies-stale-reasons-from-previous-contract/applies-stale-reasons-from-previous-contract.js: appliesStaleReasonsFromPreviousContract -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/detects-previous-passing-status-drift/detects-previous-passing-status-drift.js: detectsPreviousPassingStatusDrift -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/is-passing-display-status/is-passing-display-status.js: isPassingDisplayStatus -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/builds-product-owner-summary/builds-product-owner-summary.js: buildsProductOwnerSummary -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/builds-status-contract-path/builds-status-contract-path.js: buildsStatusContractPath -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/builds-status-sentinel-path/builds-status-sentinel-path.js: buildsStatusSentinelPath -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/discovers-status-sentinels/discovers-status-sentinels.js: discoversStatusSentinels -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/reads-previous-status-contract/reads-previous-status-contract.js: readsPreviousStatusContract -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/formats-sentinel-path-for-finding/formats-sentinel-path-for-finding.js: formatsSentinelPathForFinding -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/detects-duplicate-status-sentinels/detects-duplicate-status-sentinels.js: detectsDuplicateStatusSentinels -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/removes-obsolete-status-sentinels/removes-obsolete-status-sentinels.js: removesObsoleteStatusSentinels -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/renders-status-sentinel/renders-status-sentinel.js: rendersStatusSentinel -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/writes-json-artifact/writes-json-artifact.js: writesJsonArtifact -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/writes-text-artifact/writes-text-artifact.js: writesTextArtifact -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/verifies-sentinel-matches-status/verifies-sentinel-matches-status.js: verifiesSentinelMatchesStatus -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/writes-feature-status-projection/writes-feature-status-projection.js: writesFeatureStatusProjection -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/counts-by-display-status/counts-by-display-status.js: countsByDisplayStatus -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/reads-top-blocker-code/reads-top-blocker-code.js: readsTopBlockerCode -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/builds-board-rows/builds-board-rows.js: buildsBoardRows -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/builds-board-row/builds-board-row.js: buildsBoardRow -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/sorts-board-rows-by-product-urgency/sorts-board-rows-by-product-urgency.js: sortsBoardRowsByProductUrgency -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/builds-blocker-summary/builds-blocker-summary.js: buildsBlockerSummary -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/builds-blocker-summary-entry/builds-blocker-summary-entry.js: buildsBlockerSummaryEntry -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/sorts-blocker-summary-by-frequency/sorts-blocker-summary-by-frequency.js: sortsBlockerSummaryByFrequency -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/builds-feature-quality-board/builds-feature-quality-board.js: buildsFeatureQualityBoard -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/builds-source-status-contract-hashes/builds-source-status-contract-hashes.js: buildsSourceStatusContractHashes -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/renders-board-summary/renders-board-summary.js: rendersBoardSummary -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/renders-blocker-summary/renders-blocker-summary.js: rendersBlockerSummary -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/renders-board-rows/renders-board-rows.js: rendersBoardRows -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/renders-feature-quality-board-markdown/renders-feature-quality-board-markdown.js: rendersFeatureQualityBoardMarkdown -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/renders-board-findings/renders-board-findings.js: rendersBoardFindings -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/renders-feature-quality-tree/renders-feature-quality-tree.js: rendersFeatureQualityTree -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-quality-board/writes-feature-quality-board-projection/writes-feature-quality-board-projection.js: writesFeatureQualityBoardProjection -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)

### Scenario Tie-Outs

not yet assigned; run the Scenario Tie-Out Worker against each proposed body after this plan is accepted

### Contract Updates

add one file-system body contract entry per proposed body; remove or narrow the entry for the current path

### Import Migration Plan

not yet determined; requires an import-site scan against the accepted proposed paths after promotion

### Behavior-Preserving Tests

existing tests for src/feature-quality-board/feature-quality-board.js must continue to pass; add one test per proposed body covering its moved methods before promotion

### Rollback Notes

revert to src/feature-quality-board/feature-quality-board.js and its original contract entry if any behavior-preserving test fails after the split

## src/feature-scoped-ascii-execution-flow-report/feature-scoped-ascii-execution-flow-report.js

### Current Responsibilities

- unclear-action: formatsRepoRelativePath, formatsRuntimePath, formatsFirstValue, formatsRuntimeStep, formatsReceiptValue, formatsNodeStatus, formatsBlockerValue, formatsFixRoute, formatsMethodSource, countsBlockers, checksPortableAscii, hasRequiredBranchLine, checksFeatureScopedAsciiReportPresentation
- build: buildsAcceptanceSourceNode, buildsTelemetryChildren, buildsStatusChildren, buildsMethodCallChildren, buildsRuntimeFileChildren, buildsMethodDrillDownBranch, buildsExecutionNodeFromProofNode, buildsExecutionNodesFromProof, buildsFindingsFromProof, buildsFeatureScopedAsciiReportContract, buildsFeatureScopedAsciiReportPath
- call: groupsMethodCallsByRuntimeFile, selectsMethodCallName
- detect: detectsMissingTelemetry, detectsMissingReceipt
- load: loadsExecutionSketchTemplate
- render: rendersFeatureScopedAsciiExecutionFlowReport, rendersDenseTimingRows
- write: writesFeatureScopedAsciiExecutionFlowReport

### Proposed Action-Bearing Body Names

- src/feature-scoped-ascii-execution-flow-report/formats-repo-relative-path/formats-repo-relative-path.js: formatsRepoRelativePath -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/formats-runtime-path/formats-runtime-path.js: formatsRuntimePath -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/formats-first-value/formats-first-value.js: formatsFirstValue -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/formats-runtime-step/formats-runtime-step.js: formatsRuntimeStep -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/formats-receipt-value/formats-receipt-value.js: formatsReceiptValue -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/formats-node-status/formats-node-status.js: formatsNodeStatus -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/formats-blocker-value/formats-blocker-value.js: formatsBlockerValue -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/formats-fix-route/formats-fix-route.js: formatsFixRoute -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/builds-acceptance-source-node/builds-acceptance-source-node.js: buildsAcceptanceSourceNode -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/builds-telemetry-children/builds-telemetry-children.js: buildsTelemetryChildren -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/builds-status-children/builds-status-children.js: buildsStatusChildren -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/groups-method-calls-by-runtime-file/groups-method-calls-by-runtime-file.js: groupsMethodCallsByRuntimeFile -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/formats-method-source/formats-method-source.js: formatsMethodSource -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/builds-method-call-children/builds-method-call-children.js: buildsMethodCallChildren -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/selects-method-call-name/selects-method-call-name.js: selectsMethodCallName -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/builds-runtime-file-children/builds-runtime-file-children.js: buildsRuntimeFileChildren -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/builds-method-drill-down-branch/builds-method-drill-down-branch.js: buildsMethodDrillDownBranch -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/builds-execution-node-from-proof-node/builds-execution-node-from-proof-node.js: buildsExecutionNodeFromProofNode -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/builds-execution-nodes-from-proof/builds-execution-nodes-from-proof.js: buildsExecutionNodesFromProof -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/detects-missing-telemetry/detects-missing-telemetry.js: detectsMissingTelemetry -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/detects-missing-receipt/detects-missing-receipt.js: detectsMissingReceipt -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/builds-findings-from-proof/builds-findings-from-proof.js: buildsFindingsFromProof -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/counts-blockers/counts-blockers.js: countsBlockers -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/loads-execution-sketch-template/loads-execution-sketch-template.js: loadsExecutionSketchTemplate -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/builds-feature-scoped-ascii-report-contract/builds-feature-scoped-ascii-report-contract.js: buildsFeatureScopedAsciiReportContract -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/builds-feature-scoped-ascii-report-path/builds-feature-scoped-ascii-report-path.js: buildsFeatureScopedAsciiReportPath -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/renders-feature-scoped-ascii-execution-flow-report/renders-feature-scoped-ascii-execution-flow-report.js: rendersFeatureScopedAsciiExecutionFlowReport -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/renders-dense-timing-rows/renders-dense-timing-rows.js: rendersDenseTimingRows -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/writes-feature-scoped-ascii-execution-flow-report/writes-feature-scoped-ascii-execution-flow-report.js: writesFeatureScopedAsciiExecutionFlowReport -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/checks-portable-ascii/checks-portable-ascii.js: checksPortableAscii -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/has-required-branch-line/has-required-branch-line.js: hasRequiredBranchLine -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/feature-scoped-ascii-execution-flow-report/checks-feature-scoped-ascii-report-presentation/checks-feature-scoped-ascii-report-presentation.js: checksFeatureScopedAsciiReportPresentation -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)

### Scenario Tie-Outs

not yet assigned; run the Scenario Tie-Out Worker against each proposed body after this plan is accepted

### Contract Updates

add one file-system body contract entry per proposed body; remove or narrow the entry for the current path

### Import Migration Plan

not yet determined; requires an import-site scan against the accepted proposed paths after promotion

### Behavior-Preserving Tests

existing tests for src/feature-scoped-ascii-execution-flow-report/feature-scoped-ascii-execution-flow-report.js must continue to pass; add one test per proposed body covering its moved methods before promotion

### Rollback Notes

revert to src/feature-scoped-ascii-execution-flow-report/feature-scoped-ascii-execution-flow-report.js and its original contract entry if any behavior-preserving test fails after the split

## src/llm-end-user-testing-conveyor/llm-end-user-testing-conveyor.js

### Current Responsibilities

- unclear-action: formatsRepoRelativePath, readsTextFile, redactsSensitiveText, hashesFile, requiresField, readsAcceptanceSourceSlice, readsBoundedReportContent, readsUserFacingMarkdownReportPaths, readsReviewedMarkdownReports, readsReviewedHtmlPreviewRecords, normalizesPathForComparison, isPathInsideAllowedPath, checksLlmTestingAction, readsAcceptanceCriteriaByStatus, readsAcceptanceCriteriaOutsideStatus, readsRequiredReportPaths, checksRequiredHumanReports, readsFormattedRequiredReportPaths, readsReportArtifactIndexMarkdownPaths, readsReviewedHtmlPreviewPaths, readsScreenshotIndexRecords, readsStakeholderNotificationDraftPath, readsSessionSurfaceSummary, readsArtifactsBeforeManifest
- build: buildsLlmQaBundlePath, buildsLlmQaAssignment, buildsLlmHandoffPacket, buildsSeedProposal, buildsLlmEndUserSession, buildsLlmEndUserSessionSteps, buildsAcceptanceCriteriaReview, buildsLlmQaGateDecision, buildsArtifactHashes
- write: writesJsonArtifact, writesMarkdownArtifact, writesLlmQaAssignment, writesLlmHandoffPacket, writesLlmEndUserSession, writesAcceptanceCriteriaReview, writesLlmUserExperienceReport, writesMachineEnvironment, writesLlmQaSupportArtifacts, shouldWriteStakeholderNotificationDraft, writesLlmQaBundleManifest, writesStakeholderNotificationDraft, writesLlmEndUserTestingConveyorRun
- render: rendersLlmHandoffPacketReport, rendersBulletLinesInto, rendersEndUserSessionNarrative, rendersAcceptanceCriteriaReview, rendersLlmUserExperienceReport, rendersPassedAcceptanceCriteria, rendersFailedAcceptanceCriteria, rendersSessionStepList, rendersEvidenceLinks, rendersSessionOutputs, rendersLinkLines, rendersScreenshotsIndex, rendersLlmBlockerWorklist, rendersLlmQaEvidenceBundleReport
- detect: detectsSensitiveSeedText
- validate: validatesSeedProposal
- materialize: materializesSeedProposal
- run: summarizesFeatureScenarioConveyorRuns

### Proposed Action-Bearing Body Names

- src/llm-end-user-testing-conveyor/formats-repo-relative-path/formats-repo-relative-path.js: formatsRepoRelativePath -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/builds-llm-qa-bundle-path/builds-llm-qa-bundle-path.js: buildsLlmQaBundlePath -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/reads-text-file/reads-text-file.js: readsTextFile -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/writes-json-artifact/writes-json-artifact.js: writesJsonArtifact -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/writes-markdown-artifact/writes-markdown-artifact.js: writesMarkdownArtifact -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/redacts-sensitive-text/redacts-sensitive-text.js: redactsSensitiveText -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/hashes-file/hashes-file.js: hashesFile -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/requires-field/requires-field.js: requiresField -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/builds-llm-qa-assignment/builds-llm-qa-assignment.js: buildsLlmQaAssignment -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/writes-llm-qa-assignment/writes-llm-qa-assignment.js: writesLlmQaAssignment -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/reads-acceptance-source-slice/reads-acceptance-source-slice.js: readsAcceptanceSourceSlice -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/reads-bounded-report-content/reads-bounded-report-content.js: readsBoundedReportContent -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/reads-user-facing-markdown-report-paths/reads-user-facing-markdown-report-paths.js: readsUserFacingMarkdownReportPaths -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/reads-reviewed-markdown-reports/reads-reviewed-markdown-reports.js: readsReviewedMarkdownReports -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/reads-reviewed-html-preview-records/reads-reviewed-html-preview-records.js: readsReviewedHtmlPreviewRecords -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/builds-llm-handoff-packet/builds-llm-handoff-packet.js: buildsLlmHandoffPacket -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/renders-llm-handoff-packet-report/renders-llm-handoff-packet-report.js: rendersLlmHandoffPacketReport -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/renders-bullet-lines-into/renders-bullet-lines-into.js: rendersBulletLinesInto -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/writes-llm-handoff-packet/writes-llm-handoff-packet.js: writesLlmHandoffPacket -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/builds-seed-proposal/builds-seed-proposal.js: buildsSeedProposal -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/detects-sensitive-seed-text/detects-sensitive-seed-text.js: detectsSensitiveSeedText -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/normalizes-path-for-comparison/normalizes-path-for-comparison.js: normalizesPathForComparison -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/is-path-inside-allowed-path/is-path-inside-allowed-path.js: isPathInsideAllowedPath -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/validates-seed-proposal/validates-seed-proposal.js: validatesSeedProposal -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/materializes-seed-proposal/materializes-seed-proposal.js: materializesSeedProposal -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/checks-llm-testing-action/checks-llm-testing-action.js: checksLlmTestingAction -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/builds-llm-end-user-session/builds-llm-end-user-session.js: buildsLlmEndUserSession -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/builds-llm-end-user-session-steps/builds-llm-end-user-session-steps.js: buildsLlmEndUserSessionSteps -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/renders-end-user-session-narrative/renders-end-user-session-narrative.js: rendersEndUserSessionNarrative -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/writes-llm-end-user-session/writes-llm-end-user-session.js: writesLlmEndUserSession -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/builds-acceptance-criteria-review/builds-acceptance-criteria-review.js: buildsAcceptanceCriteriaReview -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/renders-acceptance-criteria-review/renders-acceptance-criteria-review.js: rendersAcceptanceCriteriaReview -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/writes-acceptance-criteria-review/writes-acceptance-criteria-review.js: writesAcceptanceCriteriaReview -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/renders-llm-user-experience-report/renders-llm-user-experience-report.js: rendersLlmUserExperienceReport -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/reads-acceptance-criteria-by-status/reads-acceptance-criteria-by-status.js: readsAcceptanceCriteriaByStatus -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/reads-acceptance-criteria-outside-status/reads-acceptance-criteria-outside-status.js: readsAcceptanceCriteriaOutsideStatus -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/renders-passed-acceptance-criteria/renders-passed-acceptance-criteria.js: rendersPassedAcceptanceCriteria -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/renders-failed-acceptance-criteria/renders-failed-acceptance-criteria.js: rendersFailedAcceptanceCriteria -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/renders-session-step-list/renders-session-step-list.js: rendersSessionStepList -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/renders-evidence-links/renders-evidence-links.js: rendersEvidenceLinks -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/renders-session-outputs/renders-session-outputs.js: rendersSessionOutputs -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/renders-link-lines/renders-link-lines.js: rendersLinkLines -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/writes-llm-user-experience-report/writes-llm-user-experience-report.js: writesLlmUserExperienceReport -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/reads-required-report-paths/reads-required-report-paths.js: readsRequiredReportPaths -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/checks-required-human-reports/checks-required-human-reports.js: checksRequiredHumanReports -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/builds-llm-qa-gate-decision/builds-llm-qa-gate-decision.js: buildsLlmQaGateDecision -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/writes-machine-environment/writes-machine-environment.js: writesMachineEnvironment -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/writes-llm-qa-support-artifacts/writes-llm-qa-support-artifacts.js: writesLlmQaSupportArtifacts -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/reads-formatted-required-report-paths/reads-formatted-required-report-paths.js: readsFormattedRequiredReportPaths -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/reads-report-artifact-index-markdown-paths/reads-report-artifact-index-markdown-paths.js: readsReportArtifactIndexMarkdownPaths -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/reads-reviewed-html-preview-paths/reads-reviewed-html-preview-paths.js: readsReviewedHtmlPreviewPaths -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/reads-screenshot-index-records/reads-screenshot-index-records.js: readsScreenshotIndexRecords -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/renders-screenshots-index/renders-screenshots-index.js: rendersScreenshotsIndex -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/reads-stakeholder-notification-draft-path/reads-stakeholder-notification-draft-path.js: readsStakeholderNotificationDraftPath -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/should-write-stakeholder-notification-draft/should-write-stakeholder-notification-draft.js: shouldWriteStakeholderNotificationDraft -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/reads-session-surface-summary/reads-session-surface-summary.js: readsSessionSurfaceSummary -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/renders-llm-blocker-worklist/renders-llm-blocker-worklist.js: rendersLlmBlockerWorklist -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/renders-llm-qa-evidence-bundle-report/renders-llm-qa-evidence-bundle-report.js: rendersLlmQaEvidenceBundleReport -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/builds-artifact-hashes/builds-artifact-hashes.js: buildsArtifactHashes -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/writes-llm-qa-bundle-manifest/writes-llm-qa-bundle-manifest.js: writesLlmQaBundleManifest -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/reads-artifacts-before-manifest/reads-artifacts-before-manifest.js: readsArtifactsBeforeManifest -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/writes-stakeholder-notification-draft/writes-stakeholder-notification-draft.js: writesStakeholderNotificationDraft -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/writes-llm-end-user-testing-conveyor-run/writes-llm-end-user-testing-conveyor-run.js: writesLlmEndUserTestingConveyorRun -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/llm-end-user-testing-conveyor/summarizes-feature-scenario-conveyor-runs/summarizes-feature-scenario-conveyor-runs.js: summarizesFeatureScenarioConveyorRuns -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)

### Scenario Tie-Outs

not yet assigned; run the Scenario Tie-Out Worker against each proposed body after this plan is accepted

### Contract Updates

add one file-system body contract entry per proposed body; remove or narrow the entry for the current path

### Import Migration Plan

not yet determined; requires an import-site scan against the accepted proposed paths after promotion

### Behavior-Preserving Tests

existing tests for src/llm-end-user-testing-conveyor/llm-end-user-testing-conveyor.js must continue to pass; add one test per proposed body covering its moved methods before promotion

### Rollback Notes

revert to src/llm-end-user-testing-conveyor/llm-end-user-testing-conveyor.js and its original contract entry if any behavior-preserving test fails after the split

## src/per-feature-executable-body-evidence-reports/per-feature-executable-body-evidence-reports.js

### Current Responsibilities

- build: buildsFeatureScenarioEvidencePacketPath, buildsPacketArtifactPath, buildsTelemetryTieout, buildsReceiptCoverage, buildsPromotionDecisionArtifact, buildsFeatureExecutionReceipt, buildsPacketPaths, buildsFeatureEvidenceIndexRow, buildsNotExecutedFeatureEvidenceIndexRow
- write: writesJsonArtifact, writesMarkdownArtifact, writesFeatureScenarioEvidencePacket
- unclear-action: formatsRepoRelativePath, checksFeatureScenarioPromotionEvidence
- render: rendersBranchLines, rendersExecutionNode, rendersExecutableBodyTree, rendersExecutableBodyTreeArtifact, rendersExecutableBodyContractReport, rendersReportTemplate, rendersFeatureEvidenceIndex

### Proposed Action-Bearing Body Names

- src/per-feature-executable-body-evidence-reports/builds-feature-scenario-evidence-packet-path/builds-feature-scenario-evidence-packet-path.js: buildsFeatureScenarioEvidencePacketPath -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/per-feature-executable-body-evidence-reports/builds-packet-artifact-path/builds-packet-artifact-path.js: buildsPacketArtifactPath -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/per-feature-executable-body-evidence-reports/writes-json-artifact/writes-json-artifact.js: writesJsonArtifact -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/per-feature-executable-body-evidence-reports/writes-markdown-artifact/writes-markdown-artifact.js: writesMarkdownArtifact -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/per-feature-executable-body-evidence-reports/formats-repo-relative-path/formats-repo-relative-path.js: formatsRepoRelativePath -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/per-feature-executable-body-evidence-reports/renders-branch-lines/renders-branch-lines.js: rendersBranchLines -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/per-feature-executable-body-evidence-reports/renders-execution-node/renders-execution-node.js: rendersExecutionNode -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/per-feature-executable-body-evidence-reports/renders-executable-body-tree/renders-executable-body-tree.js: rendersExecutableBodyTree -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/per-feature-executable-body-evidence-reports/renders-executable-body-tree-artifact/renders-executable-body-tree-artifact.js: rendersExecutableBodyTreeArtifact -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/per-feature-executable-body-evidence-reports/renders-executable-body-contract-report/renders-executable-body-contract-report.js: rendersExecutableBodyContractReport -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/per-feature-executable-body-evidence-reports/renders-report-template/renders-report-template.js: rendersReportTemplate -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/per-feature-executable-body-evidence-reports/builds-telemetry-tieout/builds-telemetry-tieout.js: buildsTelemetryTieout -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/per-feature-executable-body-evidence-reports/builds-receipt-coverage/builds-receipt-coverage.js: buildsReceiptCoverage -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/per-feature-executable-body-evidence-reports/builds-promotion-decision-artifact/builds-promotion-decision-artifact.js: buildsPromotionDecisionArtifact -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/per-feature-executable-body-evidence-reports/builds-feature-execution-receipt/builds-feature-execution-receipt.js: buildsFeatureExecutionReceipt -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/per-feature-executable-body-evidence-reports/builds-packet-paths/builds-packet-paths.js: buildsPacketPaths -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/per-feature-executable-body-evidence-reports/writes-feature-scenario-evidence-packet/writes-feature-scenario-evidence-packet.js: writesFeatureScenarioEvidencePacket -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/per-feature-executable-body-evidence-reports/checks-feature-scenario-promotion-evidence/checks-feature-scenario-promotion-evidence.js: checksFeatureScenarioPromotionEvidence -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/per-feature-executable-body-evidence-reports/builds-feature-evidence-index-row/builds-feature-evidence-index-row.js: buildsFeatureEvidenceIndexRow -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/per-feature-executable-body-evidence-reports/builds-not-executed-feature-evidence-index-row/builds-not-executed-feature-evidence-index-row.js: buildsNotExecutedFeatureEvidenceIndexRow -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/per-feature-executable-body-evidence-reports/renders-feature-evidence-index/renders-feature-evidence-index.js: rendersFeatureEvidenceIndex -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)

### Scenario Tie-Outs

not yet assigned; run the Scenario Tie-Out Worker against each proposed body after this plan is accepted

### Contract Updates

add one file-system body contract entry per proposed body; remove or narrow the entry for the current path

### Import Migration Plan

not yet determined; requires an import-site scan against the accepted proposed paths after promotion

### Behavior-Preserving Tests

existing tests for src/per-feature-executable-body-evidence-reports/per-feature-executable-body-evidence-reports.js must continue to pass; add one test per proposed body covering its moved methods before promotion

### Rollback Notes

revert to src/per-feature-executable-body-evidence-reports/per-feature-executable-body-evidence-reports.js and its original contract entry if any behavior-preserving test fails after the split

## src/report-provenance/report-provenance.js

### Current Responsibilities

- unclear-action: stableStringify, stringifiesStableValue, stringifiesObjectEntry, sha256Hex, canonicalizeConfig, canonicalizeMethods, canonicalizesMethod, computesConfigHash, readsGitWorkingTreeMarker, formatsCommandLine, formatsCommandLineSegment, readsReportProvenance, trimsProvenanceLine, isTruthyLine, checksReportTruthGate
- inventory: computesSourceInventoryHash
- build: buildsReportProvenance

### Proposed Action-Bearing Body Names

- src/report-provenance/stable-stringify/stable-stringify.js: stableStringify -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-provenance/stringifies-stable-value/stringifies-stable-value.js: stringifiesStableValue -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-provenance/stringifies-object-entry/stringifies-object-entry.js: stringifiesObjectEntry -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-provenance/sha256-hex/sha256-hex.js: sha256Hex -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-provenance/canonicalize-config/canonicalize-config.js: canonicalizeConfig -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-provenance/canonicalize-methods/canonicalize-methods.js: canonicalizeMethods -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-provenance/canonicalizes-method/canonicalizes-method.js: canonicalizesMethod -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-provenance/computes-config-hash/computes-config-hash.js: computesConfigHash -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-provenance/computes-source-inventory-hash/computes-source-inventory-hash.js: computesSourceInventoryHash -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-provenance/reads-git-working-tree-marker/reads-git-working-tree-marker.js: readsGitWorkingTreeMarker -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-provenance/formats-command-line/formats-command-line.js: formatsCommandLine -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-provenance/formats-command-line-segment/formats-command-line-segment.js: formatsCommandLineSegment -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-provenance/builds-report-provenance/builds-report-provenance.js: buildsReportProvenance -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-provenance/reads-report-provenance/reads-report-provenance.js: readsReportProvenance -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-provenance/trims-provenance-line/trims-provenance-line.js: trimsProvenanceLine -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-provenance/is-truthy-line/is-truthy-line.js: isTruthyLine -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-provenance/checks-report-truth-gate/checks-report-truth-gate.js: checksReportTruthGate -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)

### Scenario Tie-Outs

not yet assigned; run the Scenario Tie-Out Worker against each proposed body after this plan is accepted

### Contract Updates

add one file-system body contract entry per proposed body; remove or narrow the entry for the current path

### Import Migration Plan

not yet determined; requires an import-site scan against the accepted proposed paths after promotion

### Behavior-Preserving Tests

existing tests for src/report-provenance/report-provenance.js must continue to pass; add one test per proposed body covering its moved methods before promotion

### Rollback Notes

revert to src/report-provenance/report-provenance.js and its original contract entry if any behavior-preserving test fails after the split

## src/report-truth/report-truth.js

### Current Responsibilities

- unclear-action: sha256Hex, suppressTelemetryDuring, readsMarkdownSection, readsReportSummary, trimsLine, filtersLanguageFinding, derivesExpectedVerdict, readsMarkdownFindings, readsMarkdownMethodTable, readsFirstMarkdownSectionBody, isMarkdownTableRow, isMarkdownHeaderRow, isMarkdownSeparatorRow, splitsMarkdownTableRow, addsBlocker, formatsReportTruthSummary
- parse: parsesSummaryLine, parsesIntegerField, parsesCoverageField, parsesFindingBlock
- validate: validatesReportFreshness, validatesSummaryToRowConsistency
- build: buildsDomainBodySterilityContractSafely, buildsReportTruthSnapshotCore, buildsReportTruthSnapshot, buildsFailureBlockers, buildsReportTruthHookMessage
- collect: collectsTopFindingCodes, collectsTopFindingPaths
- write: writesReportTruthEvidence
- run: runsReportTruthCommand

### Proposed Action-Bearing Body Names

- src/report-truth/sha256-hex/sha256-hex.js: sha256Hex -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/suppress-telemetry-during/suppress-telemetry-during.js: suppressTelemetryDuring -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/reads-markdown-section/reads-markdown-section.js: readsMarkdownSection -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/reads-report-summary/reads-report-summary.js: readsReportSummary -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/trims-line/trims-line.js: trimsLine -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/parses-summary-line/parses-summary-line.js: parsesSummaryLine -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/parses-integer-field/parses-integer-field.js: parsesIntegerField -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/parses-coverage-field/parses-coverage-field.js: parsesCoverageField -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/filters-language-finding/filters-language-finding.js: filtersLanguageFinding -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/derives-expected-verdict/derives-expected-verdict.js: derivesExpectedVerdict -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/reads-markdown-findings/reads-markdown-findings.js: readsMarkdownFindings -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/parses-finding-block/parses-finding-block.js: parsesFindingBlock -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/reads-markdown-method-table/reads-markdown-method-table.js: readsMarkdownMethodTable -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/reads-first-markdown-section-body/reads-first-markdown-section-body.js: readsFirstMarkdownSectionBody -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/is-markdown-table-row/is-markdown-table-row.js: isMarkdownTableRow -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/is-markdown-header-row/is-markdown-header-row.js: isMarkdownHeaderRow -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/is-markdown-separator-row/is-markdown-separator-row.js: isMarkdownSeparatorRow -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/splits-markdown-table-row/splits-markdown-table-row.js: splitsMarkdownTableRow -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/validates-report-freshness/validates-report-freshness.js: validatesReportFreshness -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/validates-summary-to-row-consistency/validates-summary-to-row-consistency.js: validatesSummaryToRowConsistency -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/builds-domain-body-sterility-contract-safely/builds-domain-body-sterility-contract-safely.js: buildsDomainBodySterilityContractSafely -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/builds-report-truth-snapshot-core/builds-report-truth-snapshot-core.js: buildsReportTruthSnapshotCore -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/builds-report-truth-snapshot/builds-report-truth-snapshot.js: buildsReportTruthSnapshot -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/collects-top-finding-codes/collects-top-finding-codes.js: collectsTopFindingCodes -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/collects-top-finding-paths/collects-top-finding-paths.js: collectsTopFindingPaths -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/builds-failure-blockers/builds-failure-blockers.js: buildsFailureBlockers -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/adds-blocker/adds-blocker.js: addsBlocker -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/formats-report-truth-summary/formats-report-truth-summary.js: formatsReportTruthSummary -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/writes-report-truth-evidence/writes-report-truth-evidence.js: writesReportTruthEvidence -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/runs-report-truth-command/runs-report-truth-command.js: runsReportTruthCommand -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)
- src/report-truth/builds-report-truth-hook-message/builds-report-truth-hook-message.js: buildsReportTruthHookMessage -- extract an action-bearing executable body around this method responsibility (declare the proposed file path in a file-system body contract before promotion)

### Scenario Tie-Outs

not yet assigned; run the Scenario Tie-Out Worker against each proposed body after this plan is accepted

### Contract Updates

add one file-system body contract entry per proposed body; remove or narrow the entry for the current path

### Import Migration Plan

not yet determined; requires an import-site scan against the accepted proposed paths after promotion

### Behavior-Preserving Tests

existing tests for src/report-truth/report-truth.js must continue to pass; add one test per proposed body covering its moved methods before promotion

### Rollback Notes

revert to src/report-truth/report-truth.js and its original contract entry if any behavior-preserving test fails after the split
