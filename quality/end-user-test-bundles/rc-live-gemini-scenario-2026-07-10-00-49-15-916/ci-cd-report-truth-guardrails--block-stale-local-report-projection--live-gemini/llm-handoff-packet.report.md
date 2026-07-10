# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: ci-cd-report-truth-guardrails--block-stale-local-report-projection--live-gemini
- Feature id: ci-cd-report-truth-guardrails
- Scenario id: block-stale-local-report-projection
- Scenario name: Block stale local report projection
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Block stale local report projection
    Given `report.md` is ignored by Git
    And a developer has a locally generated report
    When CI regenerates the report contract from the pull request source
    Then CI should ignore the developer's local `report.md`
    And CI should compare only freshly generated evidence
    And any stale local projection should have no promotion authority.

```

## Acceptance Criteria

- And a developer has a locally generated report
- Then CI should ignore the developer's local `report.md`
- And CI should compare only freshly generated evidence
- And any stale local projection should have no promotion authority.

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
