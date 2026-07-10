# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-quality-board-filesystem-body--write-a-machine-readable-board-contract--live-gemini
- Feature id: feature-quality-board-filesystem-body
- Scenario id: write-a-machine-readable-board-contract

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| Then the JSON board should contain: | not testable from assigned surface | The generated JSON board (`docs/features/_FEATURE-QUALITY-BOARD.v1.json`) was not provided for review, nor was its content summarized in `report.md`. Therefore, the presence of the specified fields could not be verified. | not observed | MISSING_EVIDENCE_REPORT_MD | Provide the `report.md` file, including the content or a detailed summary of the generated JSON board, to allow verification of its structure and fields. |
| And each board row should include the repo-relative path to its status sentinel | not testable from assigned surface | The content of the generated JSON board was not available. Without access to the `board rows` within the JSON, it's impossible to confirm if each row includes the repo-relative path to its status sentinel. | not observed | MISSING_EVIDENCE_REPORT_MD | Provide the `report.md` file, including the content or a detailed summary of the generated JSON board, to allow verification of board row structure. |
| And each board row should include the repo-relative path to its feature specification | not testable from assigned surface | The content of the generated JSON board was not available. Without access to the `board rows` within the JSON, it's impossible to confirm if each row includes the repo-relative path to its feature specification. | not observed | MISSING_EVIDENCE_REPORT_MD | Provide the `report.md` file, including the content or a detailed summary of the generated JSON board, to allow verification of board row structure. |
| And every count in the Markdown board should be derived from the JSON board. | not testable from assigned surface | Neither the generated JSON board nor the Markdown board content was provided. Without both outputs, it's impossible to verify if the counts in the Markdown board are correctly derived from the JSON board. | not observed | MISSING_EVIDENCE_REPORT_MD | Provide both the generated JSON board content (or a summary) and the Markdown board content (e.g., within `report.md`) to enable verification of count derivation. |
