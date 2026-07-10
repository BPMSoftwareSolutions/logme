# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: llm-domain-body-analysis-and-tie-out--produce-an-llm-handoff-artifact-from-deterministic-facts--live-gemini
- Feature id: llm-domain-body-analysis-and-tie-out
- Scenario id: produce-an-llm-handoff-artifact-from-deterministic-facts
- Scenario name: Produce an LLM handoff artifact from deterministic facts
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Produce an LLM handoff artifact from deterministic facts
    Given domain body analysis has completed
    When an LLM receives the analysis packet
    Then the packet should include only deterministic facts:
      | fact |
      | file path |
      | executable method count |
      | file-name grammar classification |
      | owning body contracts |
      | feature ids |
      | scenario ids |
      | responsibility clusters |
      | decomposition recommendations |
      | finding codes |
    And the LLM should not invent ownership, scenario proof, or promotion status.
```

```

## Acceptance Criteria

- Then the packet should include only deterministic facts:
- And the LLM should not invent ownership, scenario proof, or promotion status.

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
