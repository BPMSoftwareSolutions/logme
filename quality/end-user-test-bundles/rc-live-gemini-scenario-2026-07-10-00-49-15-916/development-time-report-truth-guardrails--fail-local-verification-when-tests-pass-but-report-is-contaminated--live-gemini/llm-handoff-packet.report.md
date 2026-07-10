# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: development-time-report-truth-guardrails--fail-local-verification-when-tests-pass-but-report-is-contaminated--live-gemini
- Feature id: development-time-report-truth-guardrails
- Scenario id: fail-local-verification-when-tests-pass-but-report-is-contaminated
- Scenario name: Fail local verification when tests pass but report is contaminated
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Fail local verification when tests pass but report is contaminated
    Given all unit tests pass
    And the generated report verdict is `DOMAIN BODY CONTAMINATED`
    When the developer runs the local verification command
    Then the command should fail
    And the status should say:
      """
      tests pass, report truth gate fails
      """
    And the output should show:
      | field |
      | report verdict |
      | coverage |
      | silent local methods |
      | anonymous executable methods |
      | top finding codes |
      | top finding paths |
    And no local command should emit a promotion-ready or clean claim.

```

## Acceptance Criteria

- And the generated report verdict is `DOMAIN BODY CONTAMINATED`
- Then the command should fail
- And the status should say:
- And the output should show:
- And no local command should emit a promotion-ready or clean claim.

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
