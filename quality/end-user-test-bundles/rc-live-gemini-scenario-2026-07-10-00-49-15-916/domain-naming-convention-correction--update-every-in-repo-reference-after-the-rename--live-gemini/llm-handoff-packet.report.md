# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-naming-convention-correction--update-every-in-repo-reference-after-the-rename--live-gemini
- Feature id: domain-naming-convention-correction
- Scenario id: update-every-in-repo-reference-after-the-rename
- Scenario name: Update every in-repo reference after the rename
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Update every in-repo reference after the rename
    Given source modules, tests, and documentation reference `logme2` paths or identifiers
    When the domain naming convention correction is applied
    Then every reference in `src/`, `packages/`, `tests/`, `contracts/`, and `docs/`
      should be updated to the corresponding `logme` path or identifier
    And the test suite should pass with no reference to `logme2` remaining anywhere in the repository
    And the report-truth gate should pass with the renamed contract in place.

```

## Acceptance Criteria

- Then every reference in `src/`, `packages/`, `tests/`, `contracts/`, and `docs/`
- And the test suite should pass with no reference to `logme2` remaining anywhere in the repository
- And the report-truth gate should pass with the renamed contract in place.

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
