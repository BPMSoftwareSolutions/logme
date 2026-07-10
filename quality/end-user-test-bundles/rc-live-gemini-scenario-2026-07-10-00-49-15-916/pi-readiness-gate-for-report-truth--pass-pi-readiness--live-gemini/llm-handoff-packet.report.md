# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: pi-readiness-gate-for-report-truth--pass-pi-readiness--live-gemini
- Feature id: pi-readiness-gate-for-report-truth
- Scenario id: pass-pi-readiness
- Scenario name: Pass PI readiness
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Pass PI readiness
    Given every report feature has:
      | requirement |
      | Gherkin acceptance criteria |
      | schema-enforced contract |
      | implementation tests |
      | source inventory tie-out |
      | telemetry or explicit no-telemetry label |
      | receipt coverage |
      | adversarial challenge packet |
      | end-user QA evidence bundle |
      | human-readable QA report |
      | machine provenance |
    When the PI readiness gate runs
    Then the PI verdict should be PASS
    And report.md may be promoted as a truthful projection for that run.

```

## Acceptance Criteria

- Then the PI verdict should be PASS
- And report.md may be promoted as a truthful projection for that run.

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
