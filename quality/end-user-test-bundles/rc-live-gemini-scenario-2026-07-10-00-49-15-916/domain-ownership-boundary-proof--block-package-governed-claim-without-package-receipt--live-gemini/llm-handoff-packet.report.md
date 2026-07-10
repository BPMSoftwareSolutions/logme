# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-ownership-boundary-proof--block-package-governed-claim-without-package-receipt--live-gemini
- Feature id: domain-ownership-boundary-proof
- Scenario id: block-package-governed-claim-without-package-receipt
- Scenario name: Block package-governed claim without package receipt
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Block package-governed claim without package receipt
    Given the report says external package methods are ignored or package-governed
    But no package governance contract or receipt path is rendered
    When the report is validated
    Then the report should show the package scope as UNVERIFIED
    And the finding code should be:
      | finding |
      | package-governance-unproven |
```

```

## Acceptance Criteria

- But no package governance contract or receipt path is rendered
- Then the report should show the package scope as UNVERIFIED
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
