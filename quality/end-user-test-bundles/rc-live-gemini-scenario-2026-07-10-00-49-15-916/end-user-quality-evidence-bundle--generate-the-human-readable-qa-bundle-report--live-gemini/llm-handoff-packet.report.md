# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: end-user-quality-evidence-bundle--generate-the-human-readable-qa-bundle-report--live-gemini
- Feature id: end-user-quality-evidence-bundle
- Scenario id: generate-the-human-readable-qa-bundle-report
- Scenario name: Generate the human-readable QA bundle report
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Generate the human-readable QA bundle report
    Given `qa-evidence-bundle.manifest.v1.json` exists
    When `qa-evidence-bundle.report.md` is generated
    Then the first product-facing section should show:
      | field |
      | release candidate id |
      | QA run id |
      | quality gate decision |
      | tested feature scenarios |
      | QA operator or automation identity |
      | machine identity |
      | started at |
      | finished at |
      | duration ms |
      | blocker count |
      | promotion recommendation |
    And the report should include:
      | section |
      | executive QA summary |
      | tested user journeys |
      | end-user surface inspected |
      | generated Markdown reports reviewed |
      | generated HTML previews reviewed |
      | LLM user experience report |
      | acceptance criteria review |
      | linked executable body proof reports |
      | linked sprawl reports |
      | screenshots or visual evidence index |
      | machine and run provenance |
      | blocker worklist |
      | reviewer notes |
    And a product owner should not need to open JSON to understand whether the release candidate is QA passed.

```

## Acceptance Criteria

- Then the first product-facing section should show:
- And the report should include:
- And a product owner should not need to open JSON to understand whether the release candidate is QA passed.

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
