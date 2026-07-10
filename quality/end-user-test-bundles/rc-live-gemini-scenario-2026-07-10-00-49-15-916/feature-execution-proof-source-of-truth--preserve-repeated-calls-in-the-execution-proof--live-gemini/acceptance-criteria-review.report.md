# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-execution-proof-source-of-truth--preserve-repeated-calls-in-the-execution-proof--live-gemini
- Feature id: feature-execution-proof-source-of-truth
- Scenario id: preserve-repeated-calls-in-the-execution-proof

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| Then the node should preserve each observed call in order | blocked | Cannot verify if the node preserves each observed call in order as the canonical JSON proof or a detailed report showing this is not provided. | not observed | MISSING_EVIDENCE | Provide the canonical JSON proof or a detailed report section demonstrating the preservation and order of observed calls. |
| And the node summary should include: | blocked | Cannot verify if the node summary includes the specified fields (call count, first call timestamp, last call timestamp, total duration ms, minimum call duration ms, maximum call duration ms, average call duration ms) as the canonical JSON proof or a detailed report is not provided. | not observed | MISSING_EVIDENCE | Provide the canonical JSON proof or a detailed report showing the node summary with all the required fields. |
| And the report should show the call count in the ASCII sketch | blocked | Cannot verify if the report shows the call count in the ASCII sketch as the 'report.md' file is not provided for review. | not observed | MISSING_EVIDENCE | Provide the 'report.md' file for review, specifically highlighting the ASCII sketch section. |
| And any dense table projection should allow the product owner to inspect every call without changing the source JSON. | blocked | Cannot verify if any dense table projection allows inspection of every call without changing the source JSON, as no such projection or UI is provided for review. | not observed | MISSING_EVIDENCE | Provide access to the dense table projection (e.g., screenshot, UI link, or detailed report section) for review. |
