# LLM User Experience Report: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: report-provenance-and-freshness-gate--render-report-provenance--live-gemini
- Feature id: report-provenance-and-freshness-gate
- Scenario id: render-report-provenance

## Executive User Experience Summary

As an AI, I do not have direct access to execute the report generator, inspect the generated `report.md` file, or access CLI evidence. Therefore, I cannot verify if the report provenance fields are rendered correctly or if the hashes are derived from the inputs as specified in the scenario criteria.

## Persona And Test Intent

live Gemini adversarial product owner tested Render report provenance.

## Seed Data Used

- Seed data status: approved
- Seed data path: quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/report-provenance-and-freshness-gate--render-report-provenance--live-gemini/seed-data

## User Journey Steps

- Step 1: Live Gemini reviewed Render report provenance on Markdown report review and CLI evidence review observed Unable to observe the `report.md` output or execute the report generator. No evidence could be collected to confirm the presence and correctness of the provenance fields or the derivation of the hashes.

## Acceptance Criteria Review

- Criteria met: 0
- Criteria not met or blocked: 2

## What Passed

_None._

## What Failed

- Then the report should show: (llm-end-user-surface-insufficient)
- And every hash should be derived from the inputs used for the rendered report. (llm-end-user-surface-insufficient)

## Confusing Or Risky Experience Points

_None recorded._

## Evidence Links

- docs/features/report-provenance-and-freshness-gate.feature.md
- report.md
- quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/report-provenance-and-freshness-gate--render-report-provenance--live-gemini/gemini-live-call.receipt.v1.json

## Screenshots Or Output Links

- quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/report-provenance-and-freshness-gate--render-report-provenance--live-gemini/gemini-live-call.receipt.v1.json

## Accessibility Or Readability Observations

_No accessibility or readability blockers recorded._

## Recommended Product Follow-Ups

Provide access to the generated `report.md` file and the CLI evidence (e.g., command output, relevant configuration files, source inventory) for manual or automated inspection. Alternatively, provide a mechanism for the AI to execute the report generator and inspect its output programmatically to verify the criteria.
