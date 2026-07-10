# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-quality-board-filesystem-body--tie-board-status-to-immutable-qa-bundle-evidence--live-gemini
- Feature id: feature-quality-board-filesystem-body
- Scenario id: tie-board-status-to-immutable-qa-bundle-evidence
- Scenario name: Tie board status to immutable QA bundle evidence
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Tie board status to immutable QA bundle evidence
    Given a feature row is marked `qa-passed` or `qa-passed.promoted`
    When the board projection validates the row
    Then it should verify that the latest QA bundle exists
    And it should verify that `qa-evidence-bundle.manifest.v1.json` exists
    And it should verify that all required bundle artifact hashes match
    And it should verify that `machine-environment.v1.json` exists
    And it should verify that `qa-gate-decision.v1.json` supports the displayed QA status
    And if any verification fails, the feature row should be marked `stale`
    And the board should include the failing artifact path.

```

## Acceptance Criteria

- Then it should verify that the latest QA bundle exists
- And it should verify that `qa-evidence-bundle.manifest.v1.json` exists
- And it should verify that all required bundle artifact hashes match
- And it should verify that `machine-environment.v1.json` exists
- And it should verify that `qa-gate-decision.v1.json` supports the displayed QA status
- And if any verification fails, the feature row should be marked `stale`
- And the board should include the failing artifact path.

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
