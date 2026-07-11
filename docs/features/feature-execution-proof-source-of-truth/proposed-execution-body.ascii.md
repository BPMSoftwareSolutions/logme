# Proposed Executable Body Tree: Feature Execution Proof Source Of Truth

- Feature id: feature-execution-proof-source-of-truth
- Body status: proposed
- Source truth role: product intent, not observed proof
- Runtime proof shape mirrored from: `evidence/runs/self-proof-run-2/features/feature-execution-proof-source-of-truth/scenarios/*/executable-body-tree.ascii.md`

```text
PROPOSED EXECUTABLE BODY CONTRACT - FILE-SYSTEM EXECUTION TREE
Feature : feature-execution-proof-source-of-truth
Run     : proposed-source-truth

[00] FEATURE ACCEPTANCE SOURCE
|-- gherkin
|   `-- docs/features/feature-execution-proof-source-of-truth/feature.feature.md
|
|-- status source truth
|   `-- docs/features/feature-execution-proof-source-of-truth/status.v1.json
|
|-- proposed body source truth
|   |-- docs/features/feature-execution-proof-source-of-truth/proposed-execution-body.ascii.md
|   `-- docs/features/feature-execution-proof-source-of-truth/proposed-execution-body.contract.v1.json
|
|-- service expectations
|   `-- docs/features/feature-execution-proof-source-of-truth/service-levels.v1.json
|
|-- method-name source truth
|   `-- every scenario node below declares the expected method names that must appear in observed proof or produce a blocker
|
`-- proves
    `-- execution proof facts are JSON-backed, telemetry-backed, receipt-backed, source-controlled, and compact enough for PI review

[00A] METHOD NAME PROOF REQUIREMENT
|-- rule
|   `-- a proof body without actual method names is not a real execution proof
|
|-- required method fields
|   |-- method name
|   |-- method kind
|   |-- runtime path
|   |-- source line range
|   |-- owning scenario id
|   |-- audit boundary
|   |-- telemetry event ids
|   |-- receipt paths
|   `-- blocker code when not observed
|
|-- unacceptable values for product-domain-native calls
|   |-- not observed
|   |-- sampleMethod
|   |-- anonymous
|   |-- call only
|   `-- missing
|
`-- blocker policy
    `-- product-method-name-not-observed blocks proof promotion until the code body name is known

[00B] PROPOSED NATIVE METHOD NAME MAP
|-- rule
|   `-- this map is the source-domain feature whitelist, not a dependency inventory
|
|-- inventory-every-feature-scenario-and-proof-state
|   |-- buildsFeatureProofInventory
|   `-- writesFeatureProofInventory
|
|-- write-canonical-json-execution-proof-for-a-scenario
|   |-- buildsFeatureExecutionProof
|   `-- writesFeatureExecutionProof
|
|-- write-human-readable-scenario-proof-report-beside-json-proof
|   |-- rendersScenarioProofReport
|   |-- rendersScenarioProofAsciiSketch
|   |-- rendersScenarioProofOrderedTimeline
|   |-- rendersScenarioTimingMetrics
|   |-- rendersServiceLevelIndicatorSummary
|   |-- rendersServiceLevelObjectiveEvaluation
|   |-- rendersSlaSupportEvidence
|   |-- rendersBlockerWorklist
|   `-- rendersSourceEvidenceLinks
|
|-- promote-a-selected-proof-run-into-a-source-controlled-feature-proof-body
|   |-- runsFeatureProofPromotion
|   |-- buildsFeatureProofBody
|   `-- rendersFeatureProofBody
|
|-- publish-one-feature-level-proof-body-for-the-whole-feature
|   |-- buildsFeatureProofBody
|   `-- rendersFeatureProofBody
|
|-- block-proven-feature-status-without-a-committed-proof-body
|   `-- checksFeatureStatusClaimsProofBody
|
|-- mark-feature-proof-body-stale-when-source-or-selected-proof-changes
|   `-- checksFeatureProofBodyFreshness
|
|-- opt-out-of-routine-proof-evidence-when-source-controlled-proof-is-current
|   `-- checksFeatureProofOptOut
|
|-- re-enter-proof-execution-when-opt-out-is-invalidated
|   `-- checksFeatureProofOptOut
|
|-- block-opt-out-when-proof-body-does-not-cover-every-current-scenario
|   `-- checksFeatureProofBodyFreshness
|
|-- keep-raw-run-evidence-out-of-version-control
|   `-- no source-domain-native method; policy is proven through boundary receipts
|
|-- write-shareable-timing-table-projection
|   `-- rendersScenarioTimingTable
|
|-- tie-json-proof-to-raw-telemetry-and-receipts
|   `-- no source-domain-native method; telemetry mechanics are boundary-owned
|
|-- preserve-method-call-drill-down-inside-observed-body-nodes
|   `-- no source-domain-native method; drill-down mechanics are boundary-owned
|
|-- preserve-repeated-calls-in-the-execution-proof
|   `-- no source-domain-native method; call-count mechanics are boundary-owned
|
|-- calculate-product-timing-metrics-from-observed-evidence
|   `-- no source-domain-native method; timing mechanics are boundary-owned
|
|-- establish-service-level-indicators-from-execution-proof
|   `-- no source-domain-native method; SLI calculation mechanics are boundary-owned
|
|-- evaluate-service-level-objectives-from-scenario-evidence
|   `-- no source-domain-native method; SLO evaluation mechanics are boundary-owned
|
|-- preserve-sla-evidence-without-turning-reports-into-contracts
|   `-- checksUnsupportedSlaClaims
|
|-- render-human-report-from-canonical-json-proof
|   |-- rendersScenarioProofReport
|   |-- rendersScenarioProofExecutiveSummary
|   |-- rendersScenarioProofIdentity
|   |-- rendersScenarioProofPromotionDecision
|   |-- rendersScenarioProofAsciiSketch
|   |-- rendersBlockerWorklist
|   `-- rendersSourceEvidenceLinks
|
|-- reject-report-facts-not-backed-by-json-proof
|   `-- checksFeatureReportTruthGate
|
`-- keep-json-proof-portable-for-downstream-analysis
    `-- no source-domain-native method; downstream projection is boundary-owned

[00C] SUPPORT BOUNDARY METHOD MAP
|-- rule
|   `-- support methods required by the feature are classified outside the native feature body
|
|-- product-domain-boundary-case
|   |-- discoversFeatureFiles
|   |-- discoversFeatureScenarios
|   |-- selectsScenarioProofStatus
|   |-- buildsObservedExecutionTimeline
|   |-- buildsPromotionDecision
|   |-- rendersMethodCallEvidenceReport
|   |-- rendersScenarioMethodTimelineTable
|   |-- computesFeatureProofBodyHash
|   |-- buildsScenarioCoverageSection
|   |-- checksFeatureProofBodyFreshness
|   |-- findsScenariosMissingFromBody
|   |-- writesScenarioTimingTable
|   |-- readsTelemetrySourcePaths
|   |-- readsTelemetryEventIds
|   |-- readsTelemetryEventPaths
|   |-- findsReceiptPathsForNode
|   |-- readsReceiptPathsForMethod
|   |-- buildsMethodCall
|   |-- buildsMethodCalls
|   |-- readsMethodCalls
|   |-- stampsMethodCallOwnership
|   |-- countsObservedCalls
|   |-- calculatesTimingMetrics
|   |-- calculatesServiceLevelIndicators
|   |-- evaluatesServiceLevelObjectives
|   `-- projectsFeatureExecutionProofToCsv
|
|-- package-boundary-summarized
|   |-- readsScenarioProofsFromRun
|   |-- buildsArtifactHashesForScenario
|   |-- findsMissingScenarios
|   |-- collectsBlockerSummary
|   |-- readsProofBodyHashFromContent
|   |-- buildsFeatureProofBodyPath
|   |-- indexesSloEvaluationsById
|   |-- readsSupportingEvaluations
|   `-- detectsUnsupportedSupportingEvaluation
|
|-- pure-utility-extract
|   |-- normalizesDeclaredNodes
|   |-- sha256Hex
|   |-- escapesCsv
|   `-- formatsValue
|
`-- blocker policy
    `-- any observed support method not listed here is actual-execution-body-has-unclassified-support-method

[01] INVENTORY EVERY FEATURE SCENARIO AND PROOF STATE
|-- scenario id   : inventory-every-feature-scenario-and-proof-state
|-- classification: product-domain-native
|-- expected node : BUILDS AND WRITES FEATURE PROOF INVENTORY
|-- contract
|   `-- docs/features/feature-execution-proof-source-of-truth/feature.feature.md
|-- runtime boundary
|   `-- src/feature-execution-proof/discovers-feature-and-scenario-metadata
|-- expected telemetry
|   |-- status        : proposed
|   |-- runtime step  : to be observed
|   |-- first seen at : to be observed
|   |-- last seen at  : to be observed
|   |-- duration ms   : to be observed
|   |-- elapsed prev  : to be observed
|   |-- call count    : to be observed
|   `-- path          : evidence/runs/<run-id>/features/feature-execution-proof-source-of-truth/scenarios/inventory-every-feature-scenario-and-proof-state/telemetry.events.v1.jsonl
|-- method drill-down
|   |-- expected methods: buildsFeatureProofInventory, discoversFeatureFiles, discoversFeatureScenarios, selectsScenarioProofStatus, writesFeatureProofInventory
|   `-- expected participating methods classify as product-domain-native or package-boundary-summarized
|-- receipts
|   `-- run-scoped feature proof inventory
`-- blocker policy
    `-- no current scenario may be omitted because it has no implementation or proof yet

[02] WRITE CANONICAL JSON EXECUTION PROOF FOR A SCENARIO
|-- scenario id   : write-canonical-json-execution-proof-for-a-scenario
|-- classification: product-domain-native
|-- expected node : READS SCENARIO PROOFS FROM A REAL RUN
|-- runtime boundary
|   `-- src/runs-feature-proof-promotion/runs-feature-proof-promotion.js
|-- expected telemetry
|   |-- status        : proposed
|   |-- runtime step  : to be observed
|   |-- duration ms   : to be measured
|   |-- elapsed prev  : to be measured
|   |-- call count    : to be counted
|   `-- path          : evidence/runs/<run-id>/features/feature-execution-proof-source-of-truth/scenarios/write-canonical-json-execution-proof-for-a-scenario/telemetry.events.v1.jsonl
|-- canonical proof
|   `-- evidence/runs/<run-id>/features/<feature-id>/scenarios/<scenario-id>/feature-execution.contract.v1.json
|-- method drill-down
|   |-- expected methods: buildsFeatureExecutionProof, normalizesDeclaredNodes, buildsObservedExecutionTimeline, buildsPromotionDecision, writesFeatureExecutionProof
|   |-- method name   : must be observed or blocked
|   |-- method kind   : native, boundary, or package summary
|   |-- source range  : required
|   |-- receipt paths : required when receipts are expected
|   `-- status        : ok, missing, or blocked
`-- blocker policy
    `-- report facts cannot be promoted unless backed by canonical JSON proof and named method bodies

[03] WRITE HUMAN-READABLE SCENARIO PROOF REPORT BESIDE JSON PROOF
|-- scenario id   : write-human-readable-scenario-proof-report-beside-json-proof
|-- classification: product-domain-native
|-- expected node : READS SCENARIO PROOF REPORTS FROM A REAL RUN
|-- runtime boundary
|   `-- src/feature-execution-proof/renders-scenario-proof-report
|-- projections
|   |-- executable-body-contract.report.md
|   |-- executable-body-tree.ascii.md
|   |-- execution-timeline.table.md
|   `-- method-call-evidence.report.md
|-- expected report sections
|   |-- executive proof summary
|   |-- ASCII executable body sketch
|   |-- ordered execution timeline
|   |-- timing and call-count metrics
|   |-- SLI summary
|   |-- SLO evaluation
|   |-- SLA support evidence
|   |-- blocker worklist
|   `-- method-by-method execution drill-down
`-- blocker policy
    `-- human report must be projection, not source truth

[04] PROMOTE A SELECTED PROOF RUN INTO A SOURCE-CONTROLLED FEATURE PROOF BODY
|-- scenario id   : promote-a-selected-proof-run-into-a-source-controlled-feature-proof-body
|-- classification: product-domain-native
|-- expected node : RUNS FEATURE PROOF PROMOTION (DRY RUN)
|-- contract
|   `-- docs/features/feature-execution-proof-source-of-truth/feature.feature.md
|
|-- runtime body
|   |-- src/runs-feature-proof-promotion/runs-feature-proof-promotion.js
|   `-- src/promotes-feature-execution-proof/promotes-feature-execution-proof.js
|
|-- source-controlled proof target
|   |-- proposed      : docs/features/feature-execution-proof-source-of-truth/proof.md
|   `-- compatibility : docs/feature-proofs/feature-execution-proof-source-of-truth.proof.md
|
|-- expected service level
|   |-- SLI              : method duration ms
|   |-- SLO target       : each product-domain method completes within 50 ms unless a stricter method budget is declared
|   |-- SLO warning      : method duration > target
|   |-- SLO breach       : method duration > breach threshold
|   |-- SLA expectation  : proof promotion completes within 500 ms for a normal feature proof body
|   `-- measurement     : observed method telemetry during selected proof run
|
|-- method drill-down
|   |-- call 001
|   |   |-- method       : runsFeatureProofPromotion
|   |   |-- kind         : product-domain-native
|   |   |-- source       : src/runs-feature-proof-promotion/runs-feature-proof-promotion.js:87-126
|   |   |-- expected started at   : <run-start + 0ms>
|   |   |-- expected completed at : <run-start + 40ms>
|   |   |-- expected duration ms  : <= 40
|   |   |-- expected elapsed prev : 0
|   |   |-- SLO target           : <= 50 ms
|   |   |-- SLO breach           : > 100 ms
|   |   |-- telemetry            : expected logme-step for runsFeatureProofPromotion
|   |   |-- receipt              : feature proof promotion result
|   |   `-- expected status     : ok
|   |
|   |-- call 002
|   |   |-- method       : readsScenarioProofsFromRun
|   |   |-- kind         : package-boundary-summarized
|   |   |-- source       : src/runs-feature-proof-promotion/runs-feature-proof-promotion.js:16-49
|   |   |-- expected started at   : <run-start + 40ms>
|   |   |-- expected completed at : <run-start + 100ms>
|   |   |-- expected duration ms  : <= 60
|   |   |-- expected elapsed prev : <= 5
|   |   |-- SLO target           : <= 75 ms
|   |   |-- SLO breach           : > 150 ms
|   |   |-- telemetry            : expected logme-step for readsScenarioProofsFromRun
|   |   |-- receipt              : selected scenario proof list
|   |   `-- expected status     : ok
|   |
|   |-- call 003
|   |   |-- method       : buildsArtifactHashesForScenario
|   |   |-- kind         : package-boundary-summarized
|   |   |-- source       : src/runs-feature-proof-promotion/runs-feature-proof-promotion.js:51-67
|   |   |-- expected started at   : <run-start + 100ms>
|   |   |-- expected completed at : <run-start + 150ms>
|   |   |-- expected duration ms  : <= 50
|   |   |-- expected elapsed prev : <= 5
|   |   |-- SLO target           : <= 75 ms
|   |   |-- SLO breach           : > 150 ms
|   |   |-- telemetry            : expected logme-step for buildsArtifactHashesForScenario
|   |   |-- receipt              : artifact hash map
|   |   `-- expected status     : ok
|   |
|   |-- call 004
|   |   |-- method       : buildsFeatureProofBody
|   |   |-- kind         : product-domain-native
|   |   |-- source       : src/promotes-feature-execution-proof/promotes-feature-execution-proof.js:94-134
|   |   |-- expected started at   : <run-start + 150ms>
|   |   |-- expected completed at : <run-start + 230ms>
|   |   |-- expected duration ms  : <= 80
|   |   |-- expected elapsed prev : <= 5
|   |   |-- SLO target           : <= 100 ms
|   |   |-- SLO breach           : > 200 ms
|   |   |-- telemetry            : expected logme-step for buildsFeatureProofBody
|   |   |-- receipt              : feature-proof-body.v1 object
|   |   `-- expected status     : ok
|   |
|   |-- call 005
|   |   |-- method       : computesFeatureProofBodyHash
|   |   |-- kind         : product-domain-boundary-case
|   |   |-- source       : src/promotes-feature-execution-proof/promotes-feature-execution-proof.js:160-175
|   |   |-- expected started at   : <run-start + 230ms>
|   |   |-- expected completed at : <run-start + 250ms>
|   |   |-- expected duration ms  : <= 20
|   |   |-- expected elapsed prev : <= 5
|   |   |-- SLO target           : <= 50 ms
|   |   |-- SLO breach           : > 100 ms
|   |   |-- telemetry            : expected logme-step for computesFeatureProofBodyHash
|   |   |-- receipt              : proof body hash
|   |   `-- expected status     : ok
|   |
|   `-- call 006
|       |-- method       : rendersFeatureProofBody
|       |-- kind         : product-domain-native
|       |-- source       : src/promotes-feature-execution-proof/promotes-feature-execution-proof.js:177-261
|       |-- expected started at   : <run-start + 250ms>
|       |-- expected completed at : <run-start + 400ms>
|       |-- expected duration ms  : <= 150
|       |-- expected elapsed prev : <= 5
|       |-- SLO target           : <= 200 ms
|       |-- SLO breach           : > 400 ms
|       |-- telemetry            : expected logme-step for rendersFeatureProofBody
|       |-- receipt              : docs/features/feature-execution-proof-source-of-truth/proof.md
|       `-- expected status     : ok
|
|-- expected scenario timing
|   |-- expected lead time ms        : <= 500
|   |-- expected cycle time ms       : <= 450
|   |-- expected active execution ms : <= 400
|   |-- expected waiting time ms     : <= 50
|   |-- expected native calls        : 3 named product-domain-native calls
|   |-- expected boundary calls      : 1 approved product-domain-boundary-case call
|   |-- expected package summaries   : 2 package-boundary-summarized calls
|   `-- expected blocker count      : 0
`-- blocker policy
    |-- product-method-name-not-observed
    |-- method-duration-slo-missed
    |-- scenario-lead-time-slo-missed
    |-- proof-body-receipt-missing
    |-- source-controlled-proof-body-not-written
    `-- raw telemetry, dense receipts, and run archives must not be copied into source control

[05] PUBLISH ONE FEATURE-LEVEL PROOF BODY FOR THE WHOLE FEATURE
|-- scenario id   : publish-one-feature-level-proof-body-for-the-whole-feature
|-- classification: product-domain-native
|-- expected node : BUILDS FEATURE PROOF BODY WITH ONE SECTION PER SCENARIO
|-- runtime boundary
|   `-- src/promotes-feature-execution-proof
|-- coverage rule
|   `-- each current scenario appears as proven, blocked, or not proven
|-- expected telemetry
|   `-- promotion body generation is timed and counted
`-- blocker policy
    `-- product owner must not inspect every run folder to understand whole-feature proof status

[06] BLOCK PROVEN FEATURE STATUS WITHOUT A COMMITTED PROOF BODY
|-- scenario id   : block-proven-feature-status-without-a-committed-proof-body
|-- classification: product-domain-native
|-- expected node : CHECKS FEATURE STATUS CLAIMS PROOF BODY
|-- runtime boundary
|   `-- src/checks-feature-proof-source-truth-gate
|-- gate inputs
|   |-- status.v1.json
|   |-- proof.md or compatibility proof body
|   `-- selected proof run id
`-- finding
    `-- feature-status-without-source-controlled-proof-body

[07] MARK FEATURE PROOF BODY STALE WHEN SOURCE OR SELECTED PROOF CHANGES
|-- scenario id   : mark-feature-proof-body-stale-when-source-or-selected-proof-changes
|-- classification: product-domain-native
|-- expected node : CHECKS FEATURE PROOF BODY FRESHNESS
|-- runtime boundary
|   `-- src/checks-feature-proof-source-truth-gate
|-- freshness inputs
|   |-- feature source hash
|   |-- scenario list hash
|   |-- selected proof artifact hashes
|   `-- promotion decision
`-- finding
    `-- source-controlled-feature-proof-stale

[08] OPT OUT OF ROUTINE PROOF EVIDENCE WHEN SOURCE-CONTROLLED PROOF IS CURRENT
|-- scenario id   : opt-out-of-routine-proof-evidence-when-source-controlled-proof-is-current
|-- classification: product-domain-native
|-- expected node : CHECKS FEATURE PROOF OPT-OUT
|-- runtime boundary
|   `-- src/checks-feature-proof-source-truth-gate
|-- opt-out receipt
|   |-- feature id
|   |-- proof body path
|   |-- selected proof run id
|   |-- proof body hash
|   `-- opt-out reason: source-controlled-feature-proof-current
`-- blocker policy
    `-- current run must not regenerate dense proof evidence for a satisfied feature

[09] RE-ENTER PROOF EXECUTION WHEN OPT-OUT IS INVALIDATED
|-- scenario id   : re-enter-proof-execution-when-opt-out-is-invalidated
|-- classification: product-domain-native
|-- expected node : CHECKS FEATURE PROOF OPT-OUT WITH INVALIDATION CONDITION
|-- invalidation inputs
|   |-- feature source hash changed
|   |-- scenario acceptance text changed
|   |-- selected proof artifact hash changed
|   |-- product owner refresh request
|   `-- PI or release validation requirement
`-- expected result
    `-- new run-scoped proof may be written, but proof.md changes only after selected promotion

[10] BLOCK OPT-OUT WHEN PROOF BODY DOES NOT COVER EVERY CURRENT SCENARIO
|-- scenario id   : block-opt-out-when-proof-body-does-not-cover-every-current-scenario
|-- classification: product-domain-native
|-- expected node : FINDS SCENARIOS MISSING FROM A PROOF RUN
|-- runtime boundary
|   `-- src/checks-feature-proof-source-truth-gate
`-- finding
    `-- source-controlled-feature-proof-missing-scenario

[11] KEEP RAW RUN EVIDENCE OUT OF VERSION CONTROL
|-- scenario id   : keep-raw-run-evidence-out-of-version-control
|-- classification: external-service-boundary
|-- expected node : BUILDS FEATURE PROOF BODY PATH UNDER DOCS/FEATURE-PROOFS
|-- source-controlled summary
|   `-- proof.md
|-- untracked evidence boundary
|   |-- evidence/runs/<run-id>/
|   `-- evidence/archive/<year>/<run-id>.zip
`-- blocker policy
    `-- pull requests that add raw run evidence are blocked unless policy is explicitly waived

[12] WRITE SHAREABLE TIMING TABLE PROJECTION
|-- scenario id   : write-shareable-timing-table-projection
|-- classification: product-domain-native
|-- expected node : READS A REAL EXECUTION TIMELINE TABLE FROM A DONOR RUN
|-- projection
|   `-- execution-timeline.table.md
|-- required columns
|   |-- runtime step
|   |-- node id
|   |-- node label
|   |-- runtime path
|   |-- first seen at
|   |-- last seen at
|   |-- duration ms
|   |-- elapsed since previous node ms
|   |-- call count
|   |-- status
|   `-- blocker code
`-- blocker policy
    `-- table values derive from canonical JSON proof only

[13] TIE JSON PROOF TO RAW TELEMETRY AND RECEIPTS
|-- scenario id   : tie-json-proof-to-raw-telemetry-and-receipts
|-- classification: product-domain-boundary-case
|-- expected node : READS ONE REAL DONOR PROOF AND ITS TELEMETRY TIE-OUT
|-- evidence inputs
|   |-- telemetry.events.v1.jsonl
|   |-- telemetry.tieout.v1.json
|   |-- receipt-coverage.v1.json
|   `-- feature-execution.receipt.v1.json
`-- blocker policy
    `-- timing, call counts, and receipt status cannot be inferred from static source inventory

[14] PRESERVE METHOD CALL DRILL-DOWN INSIDE OBSERVED BODY NODES
|-- scenario id   : preserve-method-call-drill-down-inside-observed-body-nodes
|-- classification: product-domain-boundary-case
|-- expected node : READS METHOD CALLS FROM A REAL DONOR PROOF NODE
|-- projection
|   `-- method-call-evidence.report.md
|-- method drill-down shape
|   |-- call index
|   |-- method name
|   |-- method kind
|   |-- runtime path
|   |-- source line range
|   |-- started at
|   |-- completed at
|   |-- duration ms
|   |-- elapsed since previous call ms
|   |-- telemetry event ids
|   |-- receipt paths
|   |-- status
|   `-- blocker code
`-- blocker policy
    `-- method names must be observed or classified as blockers, not left as anonymous call numbers

[15] PRESERVE REPEATED CALLS IN THE EXECUTION PROOF
|-- scenario id   : preserve-repeated-calls-in-the-execution-proof
|-- classification: product-domain-boundary-case
|-- expected node : READS CALL COUNT SUMMARY FROM A REAL DONOR PROOF NODE
|-- repeated-call summary
|   |-- call count
|   |-- first call timestamp
|   |-- last call timestamp
|   |-- total duration ms
|   |-- minimum call duration ms
|   |-- maximum call duration ms
|   `-- average call duration ms
`-- blocker policy
    `-- repeated calls remain ordered and inspectable without changing source JSON

[16] CALCULATE PRODUCT TIMING METRICS FROM OBSERVED EVIDENCE
|-- scenario id   : calculate-product-timing-metrics-from-observed-evidence
|-- classification: product-domain-boundary-case
|-- expected node : READS TIMING METRICS FROM A REAL DONOR PROOF
|-- metrics
|   |-- scenario lead time ms
|   |-- scenario cycle time ms
|   |-- active execution time ms
|   |-- waiting time ms
|   |-- node duration ms
|   |-- elapsed between nodes ms
|   |-- slowest node id
|   `-- total observed calls
`-- blocker policy
    `-- missing telemetry is not observed, not zero

[17] ESTABLISH SERVICE LEVEL INDICATORS FROM EXECUTION PROOF
|-- scenario id   : establish-service-level-indicators-from-execution-proof
|-- classification: product-domain-boundary-case
|-- expected node : READS SERVICE LEVEL INDICATORS FROM A REAL DONOR PROOF
|-- SLI evidence
|   |-- scenario success rate
|   |-- lead time ms
|   |-- cycle time ms
|   |-- telemetry completeness percentage
|   |-- receipt coverage percentage
|   |-- blocker rate
|   |-- retry count
|   `-- total observed calls
`-- blocker policy
    `-- no SLI may come from report labels or manual claims

[18] EVALUATE SERVICE LEVEL OBJECTIVES FROM SCENARIO EVIDENCE
|-- scenario id   : evaluate-service-level-objectives-from-scenario-evidence
|-- classification: product-domain-boundary-case
|-- expected node : READS SERVICE LEVEL OBJECTIVE EVALUATION FROM A REAL DONOR PROOF
|-- SLO evaluation
|   |-- SLO id
|   |-- SLI name
|   |-- target
|   |-- observed value
|   |-- measurement window
|   |-- status: met, missed, or not enough evidence
|   `-- evidence packet paths
`-- blocker policy
    `-- missing telemetry produces not enough evidence

[19] PRESERVE SLA EVIDENCE WITHOUT TURNING REPORTS INTO CONTRACTS
|-- scenario id   : preserve-sla-evidence-without-turning-reports-into-contracts
|-- classification: product-domain-boundary-case
|-- expected node : READS SLA SUPPORT EVIDENCE FROM A REAL DONOR PROOF
|-- SLA support
|   |-- supporting SLO evaluations
|   |-- met or missed status
|   |-- not enough evidence status
|   `-- unsupported SLA finding
`-- finding
    `-- sla-claim-without-slo-evidence

[20] RENDER HUMAN REPORT FROM CANONICAL JSON PROOF
|-- scenario id   : render-human-report-from-canonical-json-proof
|-- classification: product-domain-native
|-- expected node : RENDERS FEATURE PROOF BODY FROM A REAL DONOR RUN
|-- projection source
|   `-- feature-execution.contract.v1.json
|-- rendered body includes
|   |-- node label
|   |-- runtime path
|   |-- observed runtime step
|   |-- first seen at
|   |-- last seen at
|   |-- duration ms
|   |-- elapsed since previous node ms
|   |-- call count
|   |-- receipt status
|   `-- blocker status
`-- blocker policy
    `-- product owner should not need to open JSON to understand what happened

[21] REJECT REPORT FACTS NOT BACKED BY JSON PROOF
|-- scenario id   : reject-report-facts-not-backed-by-json-proof
|-- classification: product-domain-native
|-- expected node : CHECKS FEATURE REPORT TRUTH GATE AGAINST A REAL DONOR PROOF
|-- gate
|   |-- report fact
|   |-- JSON proof fact
|   `-- raw telemetry or receipt evidence
`-- finding
    `-- feature-report-fact-without-json-proof

[22] KEEP JSON PROOF PORTABLE FOR DOWNSTREAM ANALYSIS
|-- scenario id   : keep-json-proof-portable-for-downstream-analysis
|-- classification: product-domain-native
|-- expected node : PROJECTS A REAL DONOR PROOF TO CSV
|-- projection row fields
|   |-- run id
|   |-- feature id
|   |-- scenario id
|   |-- node id
|   |-- node label
|   |-- runtime path
|   |-- call index
|   |-- timestamp
|   |-- duration ms
|   |-- elapsed since previous node ms
|   |-- status
|   `-- blocker code
`-- blocker policy
    `-- CSV, Markdown, and ASCII projections are projections, not source truth
```
