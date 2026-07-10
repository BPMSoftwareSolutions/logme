# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-quality-board-filesystem-body--tie-board-status-to-immutable-qa-bundle-evidence--live-gemini
- Feature id: feature-quality-board-filesystem-body
- Scenario id: tie-board-status-to-immutable-qa-bundle-evidence

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| Then it should verify that the latest QA bundle exists | blocked | Cannot verify this criterion as the "report.md" and Gemini live-call receipt were not provided. | not observed | MISSING_EVIDENCE_REPORT | Provide the "report.md" and Gemini live-call receipt. |
| And it should verify that `qa-evidence-bundle.manifest.v1.json` exists | blocked | Cannot verify this criterion as the "report.md" and Gemini live-call receipt were not provided. | not observed | MISSING_EVIDENCE_REPORT | Provide the "report.md" and Gemini live-call receipt. |
| And it should verify that all required bundle artifact hashes match | blocked | Cannot verify this criterion as the "report.md" and Gemini live-call receipt were not provided. | not observed | MISSING_EVIDENCE_REPORT | Provide the "report.md" and Gemini live-call receipt. |
| And it should verify that `machine-environment.v1.json` exists | blocked | Cannot verify this criterion as the "report.md" and Gemini live-call receipt were not provided. | not observed | MISSING_EVIDENCE_REPORT | Provide the "report.md" and Gemini live-call receipt. |
| And it should verify that `qa-gate-decision.v1.json` supports the displayed QA status | blocked | Cannot verify this criterion as the "report.md" and Gemini live-call receipt were not provided. | not observed | MISSING_EVIDENCE_REPORT | Provide the "report.md" and Gemini live-call receipt. |
| And if any verification fails, the feature row should be marked `stale` | blocked | Cannot verify this criterion as the "report.md" and Gemini live-call receipt were not provided, which would show failure scenarios and resulting board status. | not observed | MISSING_EVIDENCE_REPORT | Provide the "report.md" and Gemini live-call receipt, ideally with a test case demonstrating a verification failure. |
| And the board should include the failing artifact path. | blocked | Cannot verify this criterion as the "report.md" and Gemini live-call receipt were not provided, which would show failure scenarios and the resulting board display. | not observed | MISSING_EVIDENCE_REPORT | Provide the "report.md" and Gemini live-call receipt, ideally with a test case demonstrating a verification failure. |
