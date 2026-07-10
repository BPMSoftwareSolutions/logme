# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--reject-boxed-node-list-when-hierarchical-body-tree-is-required--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: reject-boxed-node-list-when-hierarchical-body-tree-is-required
- Scenario name: Reject boxed node list when hierarchical body tree is required
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Reject boxed node list when hierarchical body tree is required
    Given a feature-scoped executable body report contains an `EXECUTABLE BODY TREE` section
    But the section renders body nodes as flat boxed rows
    And the section does not render nested ASCII branches under each body node
    When the report presentation gate runs
    Then the report should fail
    And the finding code should be:
      | finding |
      | executable-body-tree-shape-mismatch |
    And the failure should explain that each node must contain branch groups for:
      | required branch |
      | contract |
      | runtime |
      | telemetry |
      | receipt |
      | status |

```

## Acceptance Criteria

- But the section renders body nodes as flat boxed rows
- And the section does not render nested ASCII branches under each body node
- Then the report should fail
- And the finding code should be:
- And the failure should explain that each node must contain branch groups for:

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
