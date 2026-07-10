# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--preserve-product-readable-execution-tree-shape--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: preserve-product-readable-execution-tree-shape
- Scenario name: Preserve product-readable execution tree shape
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Preserve product-readable execution tree shape
    Given the executable body contract contains sections such as acceptance source, surface receipt, canonical binding, shared runner, root contract resolution, gates, routing, provider call, receipt writeback, and surface parity
    When the feature-scoped executable body report renders the body tree
    Then the report should keep the tree grouped by those body sections
    And each section should fit on screen without requiring the product owner to read a dense paragraph
    And every section should make the evidence route visible as:
      """
      contract -> runtime -> telemetry -> receipt -> status
      """
    And the report should show blockers directly under the section where truth broke.

```

## Acceptance Criteria

- Then the report should keep the tree grouped by those body sections
- And each section should fit on screen without requiring the product owner to read a dense paragraph
- And every section should make the evidence route visible as:
- And the report should show blockers directly under the section where truth broke.

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
