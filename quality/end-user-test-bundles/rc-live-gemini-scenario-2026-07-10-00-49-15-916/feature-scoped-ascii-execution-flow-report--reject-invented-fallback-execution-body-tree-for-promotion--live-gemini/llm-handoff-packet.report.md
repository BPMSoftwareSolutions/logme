# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--reject-invented-fallback-execution-body-tree-for-promotion--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: reject-invented-fallback-execution-body-tree-for-promotion
- Scenario name: Reject invented fallback execution body tree for promotion
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Reject invented fallback execution body tree for promotion
    Given no explicit executable body contract nodes are provided
    And no product-owned report data contract declares `executionNodes`
    When the feature-scoped executable body report is rendered
    Then the renderer should not invent fallback body nodes
    And the report should show:
      """
      EXECUTABLE BODY TREE: missing
      """
    And promotion should be BLOCKED
    And the finding code should be:
      | finding |
      | executable-body-contract-missing |

```

## Acceptance Criteria

- And no product-owned report data contract declares `executionNodes`
- Then the renderer should not invent fallback body nodes
- And the report should show:
- And promotion should be BLOCKED
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
