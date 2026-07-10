# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-quality-board-filesystem-body--populate-the-board-with-scan-friendly-product-fields--live-gemini
- Feature id: feature-quality-board-filesystem-body
- Scenario id: populate-the-board-with-scan-friendly-product-fields
- Scenario name: Populate the board with scan-friendly product fields
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Populate the board with scan-friendly product fields
    Given feature status contracts exist
    When the Markdown quality board is generated
    Then each feature row should include:
      | field |
      | feature id |
      | feature name |
      | display status |
      | implementation status |
      | execution proof status |
      | end-user QA status |
      | promotion status |
      | latest release candidate id |
      | latest QA run id |
      | latest QA bundle path |
      | blocker count |
      | top blocker code |
      | stale indicator |
      | next action |
    And the board should sort features by product urgency:
      | order |
      | stale |
      | QA blocked |
      | QA failed |
      | implemented but not tested |
      | proof blocked |
      | not implemented |
      | QA passed but not promoted |
      | QA waived |
      | QA passed and promoted |
    And the board should group promoted features separately from features needing action.

```

## Acceptance Criteria

- Then each feature row should include:
- And the board should sort features by product urgency:
- And the board should group promoted features separately from features needing action.

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
