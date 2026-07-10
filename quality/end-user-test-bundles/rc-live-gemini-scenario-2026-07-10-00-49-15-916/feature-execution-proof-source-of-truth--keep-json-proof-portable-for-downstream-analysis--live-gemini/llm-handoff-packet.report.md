# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-execution-proof-source-of-truth--keep-json-proof-portable-for-downstream-analysis--live-gemini
- Feature id: feature-execution-proof-source-of-truth
- Scenario id: keep-json-proof-portable-for-downstream-analysis
- Scenario name: Keep JSON proof portable for downstream analysis
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Keep JSON proof portable for downstream analysis
    Given canonical JSON proof exists for one or more scenario runs
    When a product owner, analyst, or CI job needs tabular analysis
    Then the JSON proof should be convertible to CSV without reading the human report
    And every row projection should preserve:
      | field |
      | run id |
      | feature id |
      | scenario id |
      | node id |
      | node label |
      | runtime path |
      | call index |
      | timestamp |
      | duration ms |
      | elapsed since previous node ms |
      | status |
      | blocker code |
    And CSV, Markdown, and ASCII projections should be treated as projections, not source truth.
```

```

## Acceptance Criteria

- Then the JSON proof should be convertible to CSV without reading the human report
- And every row projection should preserve:
- And CSV, Markdown, and ASCII projections should be treated as projections, not source truth.

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
