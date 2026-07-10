# LLM QA Handoff Packet: rc-live-gemini-2026-07-10-00-47-01-674

- Release candidate id: rc-live-gemini-2026-07-10-00-47-01-674
- QA run id: adversarial-challenge-packet--block-false-pass-claim--live-gemini
- Feature id: adversarial-challenge-packet
- Scenario id: block-false-pass-claim
- Scenario name: Block false pass claim
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Block false pass claim
    Given report.md claims a passing or sterile verdict
    When the challenge packet reveals any missing schema, stale hash, missing method testimony, path drift, missing receipt, or unsupported language
    Then the report verdict should be changed to BLOCKED
    And the finding code should be:
      | finding |
      | false-pass-claim |
      | report-overclaims-evidence |
```

```

## Acceptance Criteria

- Then the report verdict should be changed to BLOCKED
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
