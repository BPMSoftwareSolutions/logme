# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: per-feature-executable-body-evidence-reports--render-the-executable-body-tree-in-the-feature-report--live-gemini
- Feature id: per-feature-executable-body-evidence-reports
- Scenario id: render-the-executable-body-tree-in-the-feature-report
- Scenario name: Render the executable body tree in the feature report
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Render the executable body tree in the feature report
    Given a feature evidence packet exists
    When `executable-body-contract.report.md` is rendered
    Then the first product-facing section should be the hierarchical ASCII executable body tree
    And the tree should be generated from the feature's executable body contract and runtime evidence
    And the tree should show:
      | proof lane |
      | acceptance source |
      | contract path |
      | runtime path and line range |
      | telemetry event path |
      | observed runtime step |
      | observed timestamp |
      | observed duration ms |
      | receipt path |
      | status |
      | blocker and fix route when blocked |
    And dense method tables should be optional supporting detail below the tree.

```

## Acceptance Criteria

- Then the first product-facing section should be the hierarchical ASCII executable body tree
- And the tree should be generated from the feature's executable body contract and runtime evidence
- And the tree should show:
- And dense method tables should be optional supporting detail below the tree.

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
