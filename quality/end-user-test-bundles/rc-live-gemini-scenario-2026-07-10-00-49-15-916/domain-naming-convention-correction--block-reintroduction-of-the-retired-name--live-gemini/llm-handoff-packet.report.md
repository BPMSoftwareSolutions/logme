# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-naming-convention-correction--block-reintroduction-of-the-retired-name--live-gemini
- Feature id: domain-naming-convention-correction
- Scenario id: block-reintroduction-of-the-retired-name
- Scenario name: Block reintroduction of the retired name
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Block reintroduction of the retired name
    Given the domain naming convention correction has been applied
    When a future change adds a new file, directory, or identifier containing `logme2`
    When the report generator or test suite runs
    Then the change should be treated as a naming regression
    And the finding code should be:
      | finding |
      | retired-domain-name-reintroduced |
    And the report should not promote a verdict while the retired name is present.
```

```

## Acceptance Criteria

- Then the change should be treated as a naming regression
- And the finding code should be:
- And the report should not promote a verdict while the retired name is present.

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
