# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: development-time-report-truth-guardrails--allow-fast-development-mode-without-weakening-truth--live-gemini
- Feature id: development-time-report-truth-guardrails
- Scenario id: allow-fast-development-mode-without-weakening-truth
- Scenario name: Allow fast development mode without weakening truth
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Allow fast development mode without weakening truth
    Given the full report truth command is too slow for watch mode
    When the developer runs the fast report truth command
    Then it may skip long-running receipt artifact publication
    But it should still fail on:
      | blocker |
      | contaminated verdict |
      | stale report provenance |
      | summary-to-row mismatch |
      | silent local methods |
      | anonymous executable methods |
      | unsupported clean or sterile claim |
```

```

## Acceptance Criteria

- Then it may skip long-running receipt artifact publication
- But it should still fail on:

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
