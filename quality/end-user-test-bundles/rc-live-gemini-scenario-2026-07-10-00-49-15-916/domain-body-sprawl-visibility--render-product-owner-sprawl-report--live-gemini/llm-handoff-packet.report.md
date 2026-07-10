# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-body-sprawl-visibility--render-product-owner-sprawl-report--live-gemini
- Feature id: domain-body-sprawl-visibility
- Scenario id: render-product-owner-sprawl-report
- Scenario name: Render product-owner sprawl report
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Render product-owner sprawl report
    Given `domain-body-sprawl.contract.v1.json` exists for a run
    When the global `report.md` is rendered
    Then it should include a compact sprawl summary with:
      | field |
      | total source files scanned |
      | focused files |
      | watchlist files |
      | god-file candidates |
      | package extraction candidates |
      | mixed-responsibility files |
      | orphan artifacts |
      | top sprawl hotspots |
    And each hotspot should show:
      | field |
      | file path |
      | classification |
      | line count |
      | executable method count |
      | responsibility cluster count |
      | generic mechanic count |
      | finding codes |
      | one-line fix route |
    And dense per-method detail should live in the sprawl evidence artifact or a linked sprawl report.
    And `report.md` should link to `evidence/runs/<run-id>/sprawl/domain-body-sprawl.report.md`.

```

## Acceptance Criteria

- Then it should include a compact sprawl summary with:
- And each hotspot should show:
- And dense per-method detail should live in the sprawl evidence artifact or a linked sprawl report.
- And `report.md` should link to `evidence/runs/<run-id>/sprawl/domain-body-sprawl.report.md`.

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
