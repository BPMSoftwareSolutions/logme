# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: ci-cd-report-truth-guardrails--block-pull-request-when-report-truth-validation-fails--live-gemini
- Feature id: ci-cd-report-truth-guardrails
- Scenario id: block-pull-request-when-report-truth-validation-fails
- Scenario name: Block pull request when report truth validation fails
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Block pull request when report truth validation fails
    Given a pull request changes report rendering, report contracts, source inventory, domain audit behavior, or Gherkin acceptance criteria
    When the CI report truth workflow runs
    Then it should run:
      | gate |
      | unit tests |
      | Gherkin traceability check |
      | report contract generation |
      | report schema validation |
      | summary-to-row validator |
      | verdict derivation validator |
      | path portability validator |
      | evidence receipt validator |
      | end-user QA bundle validator |
    And the pull request should fail if any gate fails.

```

## Acceptance Criteria

- Then it should run:
- And the pull request should fail if any gate fails.

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
