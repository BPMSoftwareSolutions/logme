# LLM User Experience Report: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: report-provenance-and-freshness-gate--block-stale-report-projection--live-gemini
- Feature id: report-provenance-and-freshness-gate
- Scenario id: block-stale-report-projection

## Executive User Experience Summary

As an AI, I cannot directly execute the Gherkin scenario or access a live environment to verify the report's state, source inventory hash, or the output of the report truth gate. Therefore, I cannot provide CLI evidence for this test.

## Persona And Test Intent

live Gemini adversarial product owner tested Block stale report projection.

## Seed Data Used

- Seed data status: approved
- Seed data path: quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/report-provenance-and-freshness-gate--block-stale-report-projection--live-gemini/seed-data

## User Journey Steps

- Step 1: Live Gemini reviewed Block stale report projection on Markdown report review and CLI evidence review observed Unable to observe the actual result as I cannot execute the scenario or access the necessary files and CLI output. No evidence of the report truth gate running, its verdict, or finding codes could be gathered.

## Acceptance Criteria Review

- Criteria met: 0
- Criteria not met or blocked: 4

## What Passed

_None._

## What Failed

- And the current source inventory hash differs from the hash rendered in report.md (llm-end-user-surface-insufficient)
- Then the report verdict should be BLOCKED (llm-end-user-surface-insufficient)
- And the finding code should be: (llm-end-user-surface-insufficient)
- And the report should not claim a clean or sterile state. (llm-end-user-surface-insufficient)

## Confusing Or Risky Experience Points

_None recorded._

## Evidence Links

- docs/features/report-provenance-and-freshness-gate.feature.md
- report.md
- quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/report-provenance-and-freshness-gate--block-stale-report-projection--live-gemini/gemini-live-call.receipt.v1.json

## Screenshots Or Output Links

- quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/report-provenance-and-freshness-gate--block-stale-report-projection--live-gemini/gemini-live-call.receipt.v1.json

## Accessibility Or Readability Observations

_No accessibility or readability blockers recorded._

## Recommended Product Follow-Ups

To verify this scenario, a human tester or an automated testing framework with access to the file system and CLI execution capabilities must: 1. Create a 'report.md' file. 2. Ensure the current source inventory hash differs from the one rendered in 'report.md'. 3. Run the report truth gate. 4. Verify the output for a 'BLOCKED' verdict, the specified finding codes, and the absence of clean/sterile claims. Provide CLI evidence of these steps and their outputs.
