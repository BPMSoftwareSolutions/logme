# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: development-time-report-truth-guardrails--provide-one-command-for-local-report-truth--live-gemini
- Feature id: development-time-report-truth-guardrails
- Scenario id: provide-one-command-for-local-report-truth
- Scenario name: Provide one command for local report truth
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Provide one command for local report truth
    Given the developer is working locally
    When they run the report truth command
    Then it should regenerate the report contract from current source
    And it should validate report freshness
    And it should validate summary-to-row consistency
    And it should validate verdict derivation
    And it should print a bounded, human-readable failure summary
    And it should exit nonzero when the report is contaminated.

```

## Acceptance Criteria

- Then it should regenerate the report contract from current source
- And it should validate report freshness
- And it should validate summary-to-row consistency
- And it should validate verdict derivation
- And it should print a bounded, human-readable failure summary
- And it should exit nonzero when the report is contaminated.

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
