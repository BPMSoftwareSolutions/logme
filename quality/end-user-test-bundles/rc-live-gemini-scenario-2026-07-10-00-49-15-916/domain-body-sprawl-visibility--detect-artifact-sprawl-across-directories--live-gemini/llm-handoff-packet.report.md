# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-body-sprawl-visibility--detect-artifact-sprawl-across-directories--live-gemini
- Feature id: domain-body-sprawl-visibility
- Scenario id: detect-artifact-sprawl-across-directories
- Scenario name: Detect artifact sprawl across directories
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Detect artifact sprawl across directories
    Given feature code, contracts, tests, reports, receipts, or templates are introduced
    When the sprawl inventory runs
    Then it should verify that related artifacts follow the declared file-system body contract
    And it should report:
      | finding |
      | orphan-source-file |
      | orphan-test-file |
      | orphan-contract-file |
      | scattered-feature-artifact |
      | undeclared-generated-artifact |
    And each finding should include the expected home or declared owner.

```

## Acceptance Criteria

- Then it should verify that related artifacts follow the declared file-system body contract
- And it should report:
- And each finding should include the expected home or declared owner.

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
