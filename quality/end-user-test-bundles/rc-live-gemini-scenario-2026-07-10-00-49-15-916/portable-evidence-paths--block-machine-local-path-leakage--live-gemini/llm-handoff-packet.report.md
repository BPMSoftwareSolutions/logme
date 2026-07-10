# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: portable-evidence-paths--block-machine-local-path-leakage--live-gemini
- Feature id: portable-evidence-paths
- Scenario id: block-machine-local-path-leakage
- Scenario name: Block machine-local path leakage
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Block machine-local path leakage
    Given report.md contains an absolute local workspace path in a method row or finding
    When the report portability gate runs
    Then the report should be BLOCKED
    And the finding code should be:
      | finding |
      | report-path-not-portable |
```

```

## Acceptance Criteria

- Then the report should be BLOCKED
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
