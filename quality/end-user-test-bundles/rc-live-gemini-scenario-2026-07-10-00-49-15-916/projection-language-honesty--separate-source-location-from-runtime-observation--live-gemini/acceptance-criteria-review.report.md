# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: projection-language-honesty--separate-source-location-from-runtime-observation--live-gemini
- Feature id: projection-language-honesty
- Scenario id: separate-source-location-from-runtime-observation

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| Then the report should show source facts as: | blocked | The feature markdown specifies the expected source facts (declared path, method name, method kind, line start, line end, inventory step). However, no actual report was provided to verify if these facts are displayed as described. | not observed | MISSING_EVIDENCE | Provide actual `report.md` or `CLI evidence`. |
| And the report should show runtime facts only from telemetry as: | blocked | The feature markdown specifies the expected runtime facts (observed runtime step, first observed at, last observed at, duration ms, telemetry status) and states they should be from telemetry. No actual report was provided to verify this implementation. | not observed | MISSING_EVIDENCE | Provide actual `report.md` or `CLI evidence`. |
| And the report should not derive runtime facts from scan order, file order, or line numbers. | blocked | The feature markdown explicitly states that runtime facts should not be derived from static source information. Without an actual report and insight into its data derivation, it's impossible to verify this negative assertion. | not observed | MISSING_EVIDENCE | Provide actual `report.md` or `CLI evidence` and potentially details on data lineage. |
