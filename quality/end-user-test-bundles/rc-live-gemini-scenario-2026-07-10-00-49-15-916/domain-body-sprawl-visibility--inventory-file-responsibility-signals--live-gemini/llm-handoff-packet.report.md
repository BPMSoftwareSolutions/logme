# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-body-sprawl-visibility--inventory-file-responsibility-signals--live-gemini
- Feature id: domain-body-sprawl-visibility
- Scenario id: inventory-file-responsibility-signals
- Scenario name: Inventory file responsibility signals
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Inventory file responsibility signals
    Given LogMe scans the configured domain body
    When the sprawl inventory runs
    Then it should write a sprawl evidence JSON artifact at:
      """
      evidence/runs/<run-id>/sprawl/domain-body-sprawl.contract.v1.json
      """
    And each source file entry should include:
      | field |
      | file path |
      | package or domain scope |
      | line count |
      | byte count |
      | executable method count |
      | exported symbol count |
      | imported module count |
      | local nested function count |
      | domain vocabulary tokens |
      | responsibility clusters |
      | side-effect lanes |
      | feature ids referenced |
      | contract paths referenced |
      | generic mechanic candidates |
      | finding codes |
    And the human report should be rendered from this JSON artifact, not hand-authored prose.

```

## Acceptance Criteria

- Then it should write a sprawl evidence JSON artifact at:
- And each source file entry should include:
- And the human report should be rendered from this JSON artifact, not hand-authored prose.

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
