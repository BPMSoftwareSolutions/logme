# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: end-user-quality-evidence-bundle--link-executable-body-reports-into-the-qa-bundle--live-gemini
- Feature id: end-user-quality-evidence-bundle
- Scenario id: link-executable-body-reports-into-the-qa-bundle
- Scenario name: Link executable body reports into the QA bundle
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Link executable body reports into the QA bundle
    Given a QA bundle validates one or more feature scenarios
    When the QA evidence bundle is assembled
    Then it should copy or link the relevant human reports:
      | report |
      | executable-body-contract.report.md |
      | execution-timeline.table.md |
      | method-execution-timeline.table.md |
      | method-call-evidence.report.md |
      | domain-body-sprawl.report.md |
      | domain-body-sprawl-hotspots.table.md |
      | report.md |
      | llm-user-experience.report.md |
      | acceptance-criteria-review.report.md |
    And the bundle manifest should include the source path and content hash for each linked report
    And missing required human reports should block QA pass
    And the finding code should be:
      | finding |
      | qa-bundle-missing-human-proof-report |

```

## Acceptance Criteria

- Then it should copy or link the relevant human reports:
- And the bundle manifest should include the source path and content hash for each linked report
- And missing required human reports should block QA pass
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
