# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-body-sprawl-visibility--write-human-readable-sprawl-report-beside-json-evidence--live-gemini
- Feature id: domain-body-sprawl-visibility
- Scenario id: write-human-readable-sprawl-report-beside-json-evidence
- Scenario name: Write human-readable sprawl report beside JSON evidence
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Write human-readable sprawl report beside JSON evidence
    Given `domain-body-sprawl.contract.v1.json` has been written for a run
    When sprawl reporting completes
    Then it should write a Markdown sprawl report at:
      """
      evidence/runs/<run-id>/sprawl/domain-body-sprawl.report.md
      """
    And the report should be generated from `domain-body-sprawl.contract.v1.json`
    And the report should be suitable for product owners, architects, engineering leads, and PI planning review
    And the first product-facing section should be a compact sprawl risk summary
    And the report should include:
      | section |
      | executive sprawl summary |
      | top hotspots |
      | god-file candidates |
      | package extraction candidates |
      | mixed responsibility files |
      | orphan and scattered artifacts |
      | severe promotion blockers |
      | watchlist files |
      | one-line fix routes |
      | source evidence links |
      | dense file inventory appendix |
    And the report should link back to the canonical JSON evidence using a repo-relative path.

```

## Acceptance Criteria

- Then it should write a Markdown sprawl report at:
- And the report should be generated from `domain-body-sprawl.contract.v1.json`
- And the report should be suitable for product owners, architects, engineering leads, and PI planning review
- And the first product-facing section should be a compact sprawl risk summary
- And the report should include:
- And the report should link back to the canonical JSON evidence using a repo-relative path.

## Current Proof Reports


## Current Domain Body Analysis

- not attached
## Target User Surface Instructions

- Markdown report review
- CLI evidence review

## Seed Data Rules

- seed data must be synthetic unless fixture data is explicitly allowed
- seed data writes must stay inside allowed seed data paths

## Forbidden Actions

- mutate outside allowed paths
- use secrets or personal data in seed data
- claim acceptance without evidence
- mark this LLM run as QA passed
- send external notifications

## Pass And Fail Reporting

report user-visible observations and link every pass or fail claim to evidence
