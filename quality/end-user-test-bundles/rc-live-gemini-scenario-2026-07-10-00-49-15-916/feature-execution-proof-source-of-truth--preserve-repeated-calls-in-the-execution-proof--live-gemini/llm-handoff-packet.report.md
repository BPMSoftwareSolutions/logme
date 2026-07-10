# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-execution-proof-source-of-truth--preserve-repeated-calls-in-the-execution-proof--live-gemini
- Feature id: feature-execution-proof-source-of-truth
- Scenario id: preserve-repeated-calls-in-the-execution-proof
- Scenario name: Preserve repeated calls in the execution proof
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Preserve repeated calls in the execution proof
    Given the same runtime method or body node is observed more than once during a scenario
    When canonical JSON proof is built
    Then the node should preserve each observed call in order
    And the node summary should include:
      | field |
      | call count |
      | first call timestamp |
      | last call timestamp |
      | total duration ms |
      | minimum call duration ms |
      | maximum call duration ms |
      | average call duration ms |
    And the report should show the call count in the ASCII sketch
    And any dense table projection should allow the product owner to inspect every call without changing the source JSON.

```

## Acceptance Criteria

- Then the node should preserve each observed call in order
- And the node summary should include:
- And the report should show the call count in the ASCII sketch
- And any dense table projection should allow the product owner to inspect every call without changing the source JSON.

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
