# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-execution-proof-source-of-truth--write-shareable-timing-table-projection--live-gemini
- Feature id: feature-execution-proof-source-of-truth
- Scenario id: write-shareable-timing-table-projection
- Scenario name: Write shareable timing table projection
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Write shareable timing table projection
    Given canonical JSON proof exists for a feature scenario
    When scenario proof reporting completes
    Then it may write a Markdown timing table at:
      """
      evidence/runs/<run-id>/features/<feature-id>/scenarios/<scenario-id>/execution-timeline.table.md
      """
    And every timing table row should be generated from the JSON proof
    And each row should include:
      | field |
      | runtime step |
      | node id |
      | node label |
      | runtime path |
      | first seen at |
      | last seen at |
      | duration ms |
      | elapsed since previous node ms |
      | call count |
      | status |
      | blocker code |
    And the table should be safe to paste into PI planning notes, architecture review notes, decks, dashboards, or publications.

```

## Acceptance Criteria

- Then it may write a Markdown timing table at:
- And every timing table row should be generated from the JSON proof
- And each row should include:
- And the table should be safe to paste into PI planning notes, architecture review notes, decks, dashboards, or publications.

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
