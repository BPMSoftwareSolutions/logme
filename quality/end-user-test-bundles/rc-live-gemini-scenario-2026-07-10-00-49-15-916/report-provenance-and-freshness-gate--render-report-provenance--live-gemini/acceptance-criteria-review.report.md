# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: report-provenance-and-freshness-gate--render-report-provenance--live-gemini
- Feature id: report-provenance-and-freshness-gate
- Scenario id: render-report-provenance

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| Then the report should show: | FAIL | As an AI, I do not have direct access to execute the report generator, inspect the generated `report.md` file, or access CLI evidence. Therefore, I cannot verify if the report provenance fields are rendered correctly or if the hashes are derived from the inputs as specified in the scenario criteria. | not observed | llm-end-user-surface-insufficient | Provide access to the generated `report.md` file and the CLI evidence (e.g., command output, relevant configuration files, source inventory) for manual or automated inspection. Alternatively, provide a mechanism for the AI to execute the report generator and inspect its output programmatically to verify the criteria. |
| And every hash should be derived from the inputs used for the rendered report. | FAIL | As an AI, I do not have direct access to execute the report generator, inspect the generated `report.md` file, or access CLI evidence. Therefore, I cannot verify if the report provenance fields are rendered correctly or if the hashes are derived from the inputs as specified in the scenario criteria. | not observed | llm-end-user-surface-insufficient | Provide access to the generated `report.md` file and the CLI evidence (e.g., command output, relevant configuration files, source inventory) for manual or automated inspection. Alternatively, provide a mechanism for the AI to execute the report generator and inspect its output programmatically to verify the criteria. |
