# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: data-driven-report-layout--block-product-template-from-weakening-truth-gates--live-gemini
- Feature id: data-driven-report-layout
- Scenario id: block-product-template-from-weakening-truth-gates

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| Then the template should not be able to hide: | not testable from assigned surface | The 'report.md' file and the Gemini live-call receipt were not provided, preventing verification of whether the template hides any of the required truth fields (verdict, blocker count, stale provenance, silent local methods, anonymous executable methods, missing telemetry, missing receipt, promotion decision). | not observed | MISSING_EVIDENCE | Provide the generated 'report.md' and the Gemini live-call receipt for review. |
| And generation should fail if the layout omits required truth fields. | not testable from assigned surface | The 'report.md' file and the Gemini live-call receipt were not provided, making it impossible to verify if report generation correctly fails when the layout omits required truth fields. | not observed | MISSING_EVIDENCE | Provide the generated 'report.md' and the Gemini live-call receipt for review. |
