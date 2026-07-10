# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: adversarial-challenge-packet--generate-report-challenge-packet--live-gemini
- Feature id: adversarial-challenge-packet
- Scenario id: generate-report-challenge-packet
- Scenario name: Generate report challenge packet
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Generate report challenge packet
    Given report.md has been generated
    When the challenge packet is produced
    Then it should ask a reviewer to disprove:
      | claim |
      | files scanned |
      | local executable method count |
      | domain-bound method count |
      | methods with LogMe call |
      | silent local method count |
      | coverage percentage |
      | no findings claim |
      | sterile verdict |
      | execution step labels |
      | executable body tree shape |
      | fallback body tree usage |
      | telemetry observation source |
      | runtime duration evidence |
      | package-governed exclusions |
    And it should include every source, config, schema, telemetry, and receipt path required for review.

```

## Acceptance Criteria

- Then it should ask a reviewer to disprove:
- And it should include every source, config, schema, telemetry, and receipt path required for review.

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
