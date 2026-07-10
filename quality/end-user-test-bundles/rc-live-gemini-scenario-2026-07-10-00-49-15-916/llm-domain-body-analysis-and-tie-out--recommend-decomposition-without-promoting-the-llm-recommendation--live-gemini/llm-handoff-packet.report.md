# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: llm-domain-body-analysis-and-tie-out--recommend-decomposition-without-promoting-the-llm-recommendation--live-gemini
- Feature id: llm-domain-body-analysis-and-tie-out
- Scenario id: recommend-decomposition-without-promoting-the-llm-recommendation
- Scenario name: Recommend decomposition without promoting the LLM recommendation
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Recommend decomposition without promoting the LLM recommendation
    Given an executable file has many responsibilities, multiple method-action clusters, or an actionless file name
    When domain body analysis builds decomposition guidance
    Then it should propose durable action-bearing boundaries
    And each proposed boundary should include:
      | field |
      | proposed file path |
      | reason |
      | source method names |
      | contract action required |
    And the finding code should be:
      | finding |
      | decomposition-recommended |
    And the LLM may narrate or challenge the recommendation
    But deterministic gates should decide whether the repository is promotable.

```

## Acceptance Criteria

- Then it should propose durable action-bearing boundaries
- And each proposed boundary should include:
- And the finding code should be:
- And the LLM may narrate or challenge the recommendation
- But deterministic gates should decide whether the repository is promotable.

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
