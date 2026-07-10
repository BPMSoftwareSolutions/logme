# LLM User Experience Report: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: data-driven-report-layout--block-template-variable-that-has-no-data-source--live-gemini
- Feature id: data-driven-report-layout
- Scenario id: block-template-variable-that-has-no-data-source

## Executive User Experience Summary

Cannot verify the scenario's expected outcomes as the `report.md` file and the Gemini live-call receipt, which would contain evidence of generation failure and specific finding codes, were not provided. All 'Then' conditions are blocked.

## Persona And Test Intent

live Gemini adversarial product owner tested Block template variable that has no data source.

## Seed Data Used

- Seed data status: approved
- Seed data path: quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/data-driven-report-layout--block-template-variable-that-has-no-data-source--live-gemini/seed-data

## User Journey Steps

- Step 1: Live Gemini reviewed Block template variable that has no data source on Markdown report review and CLI evidence review observed Not observable due to missing evidence.

## Acceptance Criteria Review

- Criteria met: 0
- Criteria not met or blocked: 4

## What Passed

_None._

## What Failed

- But the variable is not declared in the report data contract (EVIDENCE_MISSING)
- Then generation should fail (EVIDENCE_MISSING)
- And the finding code should be: (EVIDENCE_MISSING)
- And report.md should not be written with a blank, invented, or misleading value. (EVIDENCE_MISSING)

## Confusing Or Risky Experience Points

The lack of observable output means an end-user would not be able to confirm the expected failure or the specific error message, leading to a confusing debugging experience.

## Evidence Links

- docs/features/data-driven-report-layout.feature.md
- report.md
- quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/data-driven-report-layout--block-template-variable-that-has-no-data-source--live-gemini/gemini-live-call.receipt.v1.json

## Screenshots Or Output Links

- quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/data-driven-report-layout--block-template-variable-that-has-no-data-source--live-gemini/gemini-live-call.receipt.v1.json

## Accessibility Or Readability Observations

N/A - No output to evaluate for accessibility or readability.

## Recommended Product Follow-Ups

Provide the `report.md` file and the Gemini live-call receipt for this scenario to enable verification of the expected generation failure and finding code.
