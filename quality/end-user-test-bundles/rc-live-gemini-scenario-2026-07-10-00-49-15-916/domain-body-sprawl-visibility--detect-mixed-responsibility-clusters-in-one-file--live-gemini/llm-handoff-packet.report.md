# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-body-sprawl-visibility--detect-mixed-responsibility-clusters-in-one-file--live-gemini
- Feature id: domain-body-sprawl-visibility
- Scenario id: detect-mixed-responsibility-clusters-in-one-file
- Scenario name: Detect mixed responsibility clusters in one file
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Detect mixed responsibility clusters in one file
    Given one source file contains methods from multiple product responsibilities
    When responsibility clustering runs
    Then the report should show each detected cluster
    And clusters should be derived from:
      | signal |
      | method name vocabulary |
      | imported modules |
      | referenced feature ids |
      | referenced contract paths |
      | receipt paths written |
      | rendering or projection responsibilities |
      | validation or gate responsibilities |
      | IO and side-effect lanes |
    And files with unrelated clusters should be reported with:
      | finding |
      | mixed-responsibility-file |
    And the fix route should suggest the next durable boundary, not a mechanical split.

```

## Acceptance Criteria

- Then the report should show each detected cluster
- And clusters should be derived from:
- And files with unrelated clusters should be reported with:
- And the fix route should suggest the next durable boundary, not a mechanical split.

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
