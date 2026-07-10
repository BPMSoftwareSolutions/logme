# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: llm-domain-body-analysis-and-tie-out--tie-file-bodies-to-features-and-scenarios--live-gemini
- Feature id: llm-domain-body-analysis-and-tie-out
- Scenario id: tie-file-bodies-to-features-and-scenarios
- Scenario name: Tie file bodies to features and scenarios
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Tie file bodies to features and scenarios
    Given an executable file belongs to a feature implementation
    When domain body analysis inspects the file body
    Then the file should tie to one or more feature ids and scenario ids
    And a file with no scenario tie-out should receive:
      | finding |
      | scenario-tieout-missing |
    And the analysis should not treat a method name, folder name, or loose report text as scenario proof.

```

## Acceptance Criteria

- Then the file should tie to one or more feature ids and scenario ids
- And a file with no scenario tie-out should receive:
- And the analysis should not treat a method name, folder name, or loose report text as scenario proof.

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
