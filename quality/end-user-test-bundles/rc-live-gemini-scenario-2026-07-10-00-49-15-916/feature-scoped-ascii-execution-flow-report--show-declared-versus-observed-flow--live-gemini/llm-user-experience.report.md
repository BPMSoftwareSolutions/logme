# LLM User Experience Report: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--show-declared-versus-observed-flow--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: show-declared-versus-observed-flow

## Executive User Experience Summary

The generated ASCII execution flow report successfully separates declared flow, observed telemetry, receipt proof, and blockers into distinct lanes. Runtime observations are clearly derived from telemetry events, and source inventory is not conflated with runtime execution.

## Persona And Test Intent

live Gemini adversarial product owner tested Show declared versus observed flow.

## Seed Data Used

- Seed data status: approved
- Seed data path: quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-scoped-ascii-execution-flow-report--show-declared-versus-observed-flow--live-gemini/seed-data

## User Journey Steps

- Step 1: Live Gemini reviewed Show declared versus observed flow on Markdown report review and CLI evidence review observed The report.md contains an ASCII execution sketch with four distinct, labeled lanes: "Declared Flow", "Observed Telemetry", "Receipt Proof", and "Blockers". The "Observed Telemetry" lane contains specific telemetry events, confirming runtime telemetry existence and its use for observations. The content of the "Observed Telemetry" lane is distinct from the "Declared Flow" lane, which contains the Gherkin steps, ensuring source inventory is not presented as runtime execution.

## Acceptance Criteria Review

- Criteria met: 4
- Criteria not met or blocked: 0

## What Passed

- And runtime telemetry exists for that feature run (docs/features/feature-scoped-ascii-execution-flow-report.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-scoped-ascii-execution-flow-report--show-declared-versus-observed-flow--live-gemini/gemini-live-call.receipt.v1.json)
- Then it should separate: (docs/features/feature-scoped-ascii-execution-flow-report.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-scoped-ascii-execution-flow-report--show-declared-versus-observed-flow--live-gemini/gemini-live-call.receipt.v1.json)
- And runtime observation should come only from telemetry events (docs/features/feature-scoped-ascii-execution-flow-report.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-scoped-ascii-execution-flow-report--show-declared-versus-observed-flow--live-gemini/gemini-live-call.receipt.v1.json)
- And source inventory should not be presented as runtime execution. (docs/features/feature-scoped-ascii-execution-flow-report.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-scoped-ascii-execution-flow-report--show-declared-versus-observed-flow--live-gemini/gemini-live-call.receipt.v1.json)

## What Failed

_None._

## Confusing Or Risky Experience Points

None. The separation of concerns within the report is clear and unambiguous.

## Evidence Links

- docs/features/feature-scoped-ascii-execution-flow-report.feature.md
- report.md
- quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-scoped-ascii-execution-flow-report--show-declared-versus-observed-flow--live-gemini/gemini-live-call.receipt.v1.json

## Screenshots Or Output Links

- quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-scoped-ascii-execution-flow-report--show-declared-versus-observed-flow--live-gemini/gemini-live-call.receipt.v1.json

## Accessibility Or Readability Observations

The ASCII art format is generally readable, and the distinct column headers enhance clarity for understanding the different flow types.

## Recommended Product Follow-Ups

None.
