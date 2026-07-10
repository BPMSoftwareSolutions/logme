# LLM User Experience Report: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: data-driven-report-layout--validate-report-layout-contract-before-rendering--live-gemini
- Feature id: data-driven-report-layout
- Scenario id: validate-report-layout-contract-before-rendering

## Executive User Experience Summary

The `report.md` file was generated, confirming rendering after successful validation. However, the specific fields of the report layout contract are not visible through the provided end-user surfaces, and the behavior of `report.md` rendering when validation fails could not be verified.

## Persona And Test Intent

live Gemini adversarial product owner tested Validate report layout contract before rendering.

## Seed Data Used

- Seed data status: approved
- Seed data path: quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/data-driven-report-layout--validate-report-layout-contract-before-rendering--live-gemini/seed-data

## User Journey Steps

- Step 1: Live Gemini reviewed Validate report layout contract before rendering on Markdown report review and CLI evidence review observed The `report.md` file was generated. The definition of the report layout contract fields was not observable. It was not possible to observe if `report.md` is not rendered when validation fails.

## Acceptance Criteria Review

- Criteria met: 0
- Criteria not met or blocked: 2

## What Passed

_None._

## What Failed

- Then the contract should define: (EVIDENCE_MISSING)
- And report.md should be rendered only after layout validation passes. (NEGATIVE_CASE_MISSING)

## Confusing Or Risky Experience Points

The lack of visibility into the report layout contract definition makes it difficult for an end-user to understand or debug report structure issues. The critical 'only after' condition for rendering, which prevents malformed reports, is not verifiable from the provided evidence.

## Evidence Links

- docs/features/data-driven-report-layout.feature.md
- report.md
- quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/data-driven-report-layout--validate-report-layout-contract-before-rendering--live-gemini/gemini-live-call.receipt.v1.json

## Screenshots Or Output Links

- quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/data-driven-report-layout--validate-report-layout-contract-before-rendering--live-gemini/gemini-live-call.receipt.v1.json

## Accessibility Or Readability Observations

The Gherkin is clear and `report.md` is a standard readable markdown file. However, the absence of contract visibility impacts the readability and understanding of the report generation logic.

## Recommended Product Follow-Ups

Provide a mechanism (e.g., CLI command, debug log, or a section in the generated report) to inspect the loaded report layout contract and its defined fields. Include evidence from a test case where layout validation fails to demonstrate that `report.md` is not rendered in such scenarios.
