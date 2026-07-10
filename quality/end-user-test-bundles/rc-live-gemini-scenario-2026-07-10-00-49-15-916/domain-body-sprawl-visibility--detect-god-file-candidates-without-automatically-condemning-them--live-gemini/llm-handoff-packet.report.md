# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-body-sprawl-visibility--detect-god-file-candidates-without-automatically-condemning-them--live-gemini
- Feature id: domain-body-sprawl-visibility
- Scenario id: detect-god-file-candidates-without-automatically-condemning-them
- Scenario name: Detect god-file candidates without automatically condemning them
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Detect god-file candidates without automatically condemning them
    Given a source file has many executable methods, many lines, or many responsibility clusters
    When the sprawl classifier runs
    Then the file should be classified as one of:
      | classification |
      | focused |
      | watchlist |
      | god-file candidate |
      | package extraction candidate |
      | authorized dense orchestrator |
    And a `god-file candidate` should include the signals that triggered it
    And the report should not require a product owner to infer risk from line count alone
    And the finding code should be:
      | finding |
      | god-file-candidate |

```

## Acceptance Criteria

- Then the file should be classified as one of:
- And a `god-file candidate` should include the signals that triggered it
- And the report should not require a product owner to infer risk from line count alone
- And the finding code should be:

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
