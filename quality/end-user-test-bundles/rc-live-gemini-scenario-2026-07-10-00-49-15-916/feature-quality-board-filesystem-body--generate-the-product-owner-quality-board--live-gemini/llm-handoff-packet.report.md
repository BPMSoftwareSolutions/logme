# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-quality-board-filesystem-body--generate-the-product-owner-quality-board--live-gemini
- Feature id: feature-quality-board-filesystem-body
- Scenario id: generate-the-product-owner-quality-board
- Scenario name: Generate the product-owner quality board
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Generate the product-owner quality board
    Given feature status contracts have been generated
    When the feature quality board projection runs
    Then it should write a human-readable board at:
      """
      docs/features/_FEATURE-QUALITY-BOARD.md
      """
    And it should write a machine-readable board at:
      """
      docs/features/_FEATURE-QUALITY-BOARD.v1.json
      """
    And the Markdown board should be readable by product owners, architects, business owners, and PI stakeholders
    And the JSON board should be the source used to regenerate the Markdown board
    And the board should never be hand-authored.

```

## Acceptance Criteria

- Then it should write a human-readable board at:
- And it should write a machine-readable board at:
- And the Markdown board should be readable by product owners, architects, business owners, and PI stakeholders
- And the JSON board should be the source used to regenerate the Markdown board
- And the board should never be hand-authored.

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
