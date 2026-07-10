# LLM User Experience Report: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: end-user-quality-evidence-bundle--keep-transient-run-evidence-separate-from-promoted-qa-evidence--live-gemini
- Feature id: end-user-quality-evidence-bundle
- Scenario id: keep-transient-run-evidence-separate-from-promoted-qa-evidence

## Executive User Experience Summary

The scenario's core claims regarding QA bundle promotion, its location, content, and authority cannot be fully verified from the provided Gherkin and the description of future evidence. While the prompt indicates a Gemini live-call receipt will be included, direct observation of the promoted bundle, its structure, and its properties is missing from the assigned end-user surfaces.

## Persona And Test Intent

live Gemini adversarial product owner tested Keep transient run evidence separate from promoted QA evidence.

## Seed Data Used

- Seed data status: approved
- Seed data path: quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/end-user-quality-evidence-bundle--keep-transient-run-evidence-separate-from-promoted-qa-evidence--live-gemini/seed-data

## User Journey Steps

- Step 1: Live Gemini reviewed Keep transient run evidence separate from promoted QA evidence on Markdown report review and CLI evidence review observed The `report.md` is stated to have passed locally, and a Gemini live-call receipt is promised to be included in the QA bundle. However, the actual promoted bundle, its location, its full contents, its source control status, and its durability are not directly observable or verifiable from the provided end-user surfaces.

## Acceptance Criteria Review

- Criteria met: 0
- Criteria not met or blocked: 5

## What Passed

_None._

## What Failed

- And a QA bundle is promoted (EVIDENCE_INSUFFICIENT_DETAIL)
- Then the promoted bundle should live under `quality/end-user-test-bundles/` (EVIDENCE_INSUFFICIENT_DETAIL)
- And it should include hashes or copied snapshots of the evidence needed for human review (EVIDENCE_INSUFFICIENT_DETAIL)
- And transient `evidence/runs/` paths alone should not be release authority (EVIDENCE_INSUFFICIENT_DETAIL)
- And the source-controlled QA bundle should be the durable promotion record. (EVIDENCE_INSUFFICIENT_DETAIL)

## Confusing Or Risky Experience Points

The reliance on a promise of future evidence ('will be written') rather than actual, present evidence makes verification difficult and introduces ambiguity. As an end-user QA tester, I need to see the *result* of the promotion, not just be told it *will happen*.

## Evidence Links

- docs/features/end-user-quality-evidence-bundle.feature.md
- report.md
- quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/end-user-quality-evidence-bundle--keep-transient-run-evidence-separate-from-promoted-qa-evidence--live-gemini/gemini-live-call.receipt.v1.json

## Screenshots Or Output Links

- quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/end-user-quality-evidence-bundle--keep-transient-run-evidence-separate-from-promoted-qa-evidence--live-gemini/gemini-live-call.receipt.v1.json

## Accessibility Or Readability Observations

The Gherkin is clear and readable. The lack of concrete evidence (e.g., actual file system output, a detailed report of the promoted bundle) makes it hard to 'read' the system's behavior and verify the criteria.

## Recommended Product Follow-Ups

Provide the actual `report.md` content. More importantly, provide concrete evidence of the promoted QA bundle, such as a file system listing of `quality/end-user-test-bundles/` after promotion, a manifest of the bundle's contents, and confirmation of its source control status and durability.
