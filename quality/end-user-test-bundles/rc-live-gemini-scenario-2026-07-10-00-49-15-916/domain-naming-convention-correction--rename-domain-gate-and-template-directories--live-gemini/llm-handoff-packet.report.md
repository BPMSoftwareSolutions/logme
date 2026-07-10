# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-naming-convention-correction--rename-domain-gate-and-template-directories--live-gemini
- Feature id: domain-naming-convention-correction
- Scenario id: rename-domain-gate-and-template-directories
- Scenario name: Rename domain, gate, and template directories
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Rename domain, gate, and template directories
    Given domain contracts live under `contracts/domains/logme2/`
    And gate contracts live under `contracts/gates/logme2/`
    And templates live under `contracts/templates/logme2/`
    When the domain naming convention correction is applied
    Then the directories should be renamed to `contracts/domains/logme/`,
      `contracts/gates/logme/`, and `contracts/templates/logme/`
    And every path string inside contract JSON files, source modules, and tests
      that references the old directories should be updated to the renamed paths
    And no runtime read or write should target a `logme2` path.

```

## Acceptance Criteria

- And gate contracts live under `contracts/gates/logme2/`
- And templates live under `contracts/templates/logme2/`
- Then the directories should be renamed to `contracts/domains/logme/`,
- And every path string inside contract JSON files, source modules, and tests
- And no runtime read or write should target a `logme2` path.

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
