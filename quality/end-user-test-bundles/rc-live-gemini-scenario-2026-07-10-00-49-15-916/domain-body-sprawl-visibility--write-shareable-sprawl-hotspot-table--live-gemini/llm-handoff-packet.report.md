# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-body-sprawl-visibility--write-shareable-sprawl-hotspot-table--live-gemini
- Feature id: domain-body-sprawl-visibility
- Scenario id: write-shareable-sprawl-hotspot-table
- Scenario name: Write shareable sprawl hotspot table
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Write shareable sprawl hotspot table
    Given `domain-body-sprawl.contract.v1.json` exists for a run
    When sprawl reporting completes
    Then it may write a Markdown hotspot table at:
      """
      evidence/runs/<run-id>/sprawl/domain-body-sprawl-hotspots.table.md
      """
    And every row should be generated from the JSON evidence
    And each row should include:
      | field |
      | rank |
      | file path |
      | classification |
      | line count |
      | executable method count |
      | responsibility cluster count |
      | generic mechanic count |
      | sterility finding count |
      | blocker count |
      | recommended owner action |
    And the table should be safe to paste into architecture review notes, PI planning notes, dashboards, decks, or publications.

```

## Acceptance Criteria

- Then it may write a Markdown hotspot table at:
- And every row should be generated from the JSON evidence
- And each row should include:
- And the table should be safe to paste into architecture review notes, PI planning notes, dashboards, decks, or publications.

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
