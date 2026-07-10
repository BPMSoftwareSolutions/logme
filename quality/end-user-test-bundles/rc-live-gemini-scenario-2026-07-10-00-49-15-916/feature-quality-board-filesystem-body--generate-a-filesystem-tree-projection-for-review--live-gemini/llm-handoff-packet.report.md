# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-quality-board-filesystem-body--generate-a-filesystem-tree-projection-for-review--live-gemini
- Feature id: feature-quality-board-filesystem-body
- Scenario id: generate-a-filesystem-tree-projection-for-review
- Scenario name: Generate a filesystem tree projection for review
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Generate a filesystem tree projection for review
    Given the status sentinels and board have been generated
    When the board projection writes review artifacts
    Then it should write a filesystem tree projection at:
      """
      docs/features/_FEATURE-QUALITY-TREE.txt
      """
    And the tree should show only product-owner scan surfaces:
      | surface |
      | generated quality board |
      | visible status sentinels |
      | feature source documents |
      | status contract directory |
    And the tree should make the quality state visible from filenames
    And the tree should be safe to paste into PI planning notes or architecture review notes.

```

## Acceptance Criteria

- Then it should write a filesystem tree projection at:
- And the tree should show only product-owner scan surfaces:
- And the tree should make the quality state visible from filenames
- And the tree should be safe to paste into PI planning notes or architecture review notes.

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
