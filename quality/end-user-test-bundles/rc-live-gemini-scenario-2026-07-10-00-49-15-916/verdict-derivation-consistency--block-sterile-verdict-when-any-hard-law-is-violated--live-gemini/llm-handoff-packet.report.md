# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: verdict-derivation-consistency--block-sterile-verdict-when-any-hard-law-is-violated--live-gemini
- Feature id: verdict-derivation-consistency
- Scenario id: block-sterile-verdict-when-any-hard-law-is-violated
- Scenario name: Block sterile verdict when any hard law is violated
- Provider: Gemini
- Model: gemini-flash-lite-latest

## Feature Gherkin

```gherkin
  Scenario: Block sterile verdict when any hard law is violated
    Given the hard laws include "No local executable method without LogMe"
    And the report has one silent local method
    When the verdict is derived
    Then the verdict should be `DOMAIN BODY CONTAMINATED`
    And the report should show the silent method finding.

```

## Acceptance Criteria

- And the report has one silent local method
- Then the verdict should be `DOMAIN BODY CONTAMINATED`
- And the report should show the silent method finding.

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
