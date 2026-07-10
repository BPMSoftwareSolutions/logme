# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: development-time-report-truth-guardrails--keep-local-report-truth-output-quiet-enough-to-use--live-gemini
- Feature id: development-time-report-truth-guardrails
- Scenario id: keep-local-report-truth-output-quiet-enough-to-use
- Scenario name: Keep local report truth output quiet enough to use
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Keep local report truth output quiet enough to use
    Given report truth validation runs during development
    When telemetry or audit testimony is produced
    Then the command should not flood stdout with full telemetry event bodies
    And detailed telemetry should be written to an evidence artifact
    And stdout should show only the verdict, counts, and actionable top findings.

```

## Acceptance Criteria

- Then the command should not flood stdout with full telemetry event bodies
- And detailed telemetry should be written to an evidence artifact
- And stdout should show only the verdict, counts, and actionable top findings.

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
