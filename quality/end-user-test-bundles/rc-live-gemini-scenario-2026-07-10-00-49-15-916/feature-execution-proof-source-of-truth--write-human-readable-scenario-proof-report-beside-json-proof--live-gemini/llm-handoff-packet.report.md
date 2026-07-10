# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-execution-proof-source-of-truth--write-human-readable-scenario-proof-report-beside-json-proof--live-gemini
- Feature id: feature-execution-proof-source-of-truth
- Scenario id: write-human-readable-scenario-proof-report-beside-json-proof
- Scenario name: Write human-readable scenario proof report beside JSON proof
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Write human-readable scenario proof report beside JSON proof
    Given `feature-execution.contract.v1.json` has been written for a scenario
    When scenario proof reporting completes
    Then it should write a Markdown proof report at:
      """
      evidence/runs/<run-id>/features/<feature-id>/scenarios/<scenario-id>/executable-body-contract.report.md
      """
    And the report should be generated from `feature-execution.contract.v1.json`
    And the report should be suitable for product owners, architects, business owners, and PI planning review
    And the first product-facing section should be an ASCII execution sketch
    And the report should include:
      | section |
      | executive proof summary |
      | feature and scenario identity |
      | promotion decision |
      | ASCII executable body sketch |
      | ordered execution timeline |
      | timing and call-count metrics |
      | SLI summary |
      | SLO evaluation |
      | SLA support evidence |
      | blocker worklist |
      | source evidence links |
      | dense telemetry appendix |
      | method-by-method execution drill-down |
    And the report should link back to the canonical JSON proof using a repo-relative path.

```

## Acceptance Criteria

- Then it should write a Markdown proof report at:
- And the report should be generated from `feature-execution.contract.v1.json`
- And the report should be suitable for product owners, architects, business owners, and PI planning review
- And the first product-facing section should be an ASCII execution sketch
- And the report should include:
- And the report should link back to the canonical JSON proof using a repo-relative path.

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
