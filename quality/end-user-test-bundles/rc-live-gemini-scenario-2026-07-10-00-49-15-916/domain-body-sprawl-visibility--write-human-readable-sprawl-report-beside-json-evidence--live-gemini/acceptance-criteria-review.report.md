# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-body-sprawl-visibility--write-human-readable-sprawl-report-beside-json-evidence--live-gemini
- Feature id: domain-body-sprawl-visibility
- Scenario id: write-human-readable-sprawl-report-beside-json-evidence

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| Then it should write a Markdown sprawl report at: | partially met | The prompt states `report.md` was generated, confirming a report was written. However, the exact path and confirmation of Markdown format cannot be verified without seeing the file or its metadata. | not observed | INSUFFICIENT_EVIDENCE_DETAIL | Provide the full path and content of the generated `report.md`. |
| And the report should be generated from `domain-body-sprawl.contract.v1.json` | not testable from assigned surface | Neither the `domain-body-sprawl.contract.v1.json` nor the content of `report.md` were provided, making it impossible to verify the generation source. | not observed | MISSING_EVIDENCE_SOURCE | Provide both the source JSON and the generated report content for comparison. |
| And the report should be suitable for product owners, architects, engineering leads, and PI planning review | not testable from assigned surface | The content of `report.md` was not provided, so its suitability for the target audience cannot be assessed. | not observed | MISSING_REPORT_CONTENT | Provide the content of `report.md` for review. |
| And the first product-facing section should be a compact sprawl risk summary | not testable from assigned surface | The content of `report.md` was not provided, so the presence and nature of its first section cannot be verified. | not observed | MISSING_REPORT_CONTENT | Provide the content of `report.md` for review. |
| And the report should include: | not testable from assigned surface | The content of `report.md` was not provided, so the inclusion of the specified sections cannot be verified. | not observed | MISSING_REPORT_CONTENT | Provide the content of `report.md` for review. |
| And the report should link back to the canonical JSON evidence using a repo-relative path. | not testable from assigned surface | The content of `report.md` was not provided, so the presence and correctness of the link to the JSON evidence cannot be verified. | not observed | MISSING_REPORT_CONTENT | Provide the content of `report.md` for review. |
