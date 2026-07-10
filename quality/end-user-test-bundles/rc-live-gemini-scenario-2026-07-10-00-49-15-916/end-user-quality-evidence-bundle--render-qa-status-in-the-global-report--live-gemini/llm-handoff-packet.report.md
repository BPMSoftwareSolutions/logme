# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: end-user-quality-evidence-bundle--render-qa-status-in-the-global-report--live-gemini
- Feature id: end-user-quality-evidence-bundle
- Scenario id: render-qa-status-in-the-global-report
- Scenario name: Render QA status in the global report
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Render QA status in the global report
    Given one or more QA evidence bundles exist in the repo
    When the global `report.md` is rendered
    Then it should include a compact QA readiness section with:
      | field |
      | release candidate id |
      | latest QA run id |
      | QA status |
      | quality gate decision |
      | tested scenario count |
      | failed scenario count |
      | waived scenario count |
      | bundle path |
      | QA report path |
      | machine provenance path |
    And `report.md` should link to `qa-evidence-bundle.report.md` using a repo-relative path
    And `report.md` should not embed the full QA bundle.

```

## Acceptance Criteria

- Then it should include a compact QA readiness section with:
- And `report.md` should link to `qa-evidence-bundle.report.md` using a repo-relative path
- And `report.md` should not embed the full QA bundle.

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
