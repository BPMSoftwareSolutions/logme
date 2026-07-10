# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-naming-convention-correction--rename-the-declared-file-system-body-contract--live-gemini
- Feature id: domain-naming-convention-correction
- Scenario id: rename-the-declared-file-system-body-contract
- Scenario name: Rename the declared file-system body contract
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Rename the declared file-system body contract
    Given the declared file-system body contract file is named
      `contracts/file-system-bodies/02_declared/logme2.file-system-body.contract.v1.json`
    When the domain naming convention correction is applied
    Then the file should be renamed to
      `contracts/file-system-bodies/02_declared/logme.file-system-body.contract.v1.json`
    And its `featureId` field should read `logme`
    And its `bodyId` field should read `logme.workspace-observability-domain`
    And no file named with `logme2` should remain declared as required.

```

## Acceptance Criteria

- Then the file should be renamed to
- And its `featureId` field should read `logme`
- And its `bodyId` field should read `logme.workspace-observability-domain`
- And no file named with `logme2` should remain declared as required.

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
