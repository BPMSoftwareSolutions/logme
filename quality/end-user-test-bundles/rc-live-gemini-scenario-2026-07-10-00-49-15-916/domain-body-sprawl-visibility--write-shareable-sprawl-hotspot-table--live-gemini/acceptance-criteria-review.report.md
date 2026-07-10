# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-body-sprawl-visibility--write-shareable-sprawl-hotspot-table--live-gemini
- Feature id: domain-body-sprawl-visibility
- Scenario id: write-shareable-sprawl-hotspot-table

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| Then it may write a Markdown hotspot table at: | not testable from assigned surface | The Gherkin specifies the expected output file path for the Markdown table. Without `report.md` or CLI evidence, the existence and location of this file cannot be confirmed. | not observed | MISSING_EVIDENCE | Provide `report.md` or CLI output showing the generated file. |
| And every row should be generated from the JSON evidence | not testable from assigned surface | This criterion requires inspecting the generated table's content and comparing it against the source JSON evidence. Neither the table nor the JSON evidence was provided. | not observed | MISSING_EVIDENCE | Provide the generated table and relevant JSON evidence for comparison. |
| And each row should include: | not testable from assigned surface | The Gherkin lists specific fields that should be present in each row of the table. Without the generated table, it's impossible to verify the presence of these columns. | not observed | MISSING_EVIDENCE | Provide the generated Markdown table to verify its column structure. |
| And the table should be safe to paste into architecture review notes, PI planning notes, dashboards, decks, or publications. | not testable from assigned surface | This criterion assesses the formatting, readability, and general usability of the generated table. Without the table itself, this cannot be evaluated. | not observed | MISSING_EVIDENCE | Provide the generated Markdown table to assess its formatting and suitability for pasting into various documents. |
