# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: llm-domain-body-analysis-and-tie-out--tie-every-executable-file-to-a-file-body-contract--live-gemini
- Feature id: llm-domain-body-analysis-and-tie-out
- Scenario id: tie-every-executable-file-to-a-file-body-contract
- Scenario name: Tie every executable file to a file-body contract
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Tie every executable file to a file-body contract
    Given a source file contains executable methods
    When domain body analysis compares the file to declared body contracts
    Then the analysis should list every owning body contract
    And a file with no declaring body contract should receive:
      | finding |
      | file-body-contract-missing |
    And the recommended fix should name the contract or owned package boundary that must authorize the file.

```

## Acceptance Criteria

- Then the analysis should list every owning body contract
- And a file with no declaring body contract should receive:
- And the recommended fix should name the contract or owned package boundary that must authorize the file.

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
