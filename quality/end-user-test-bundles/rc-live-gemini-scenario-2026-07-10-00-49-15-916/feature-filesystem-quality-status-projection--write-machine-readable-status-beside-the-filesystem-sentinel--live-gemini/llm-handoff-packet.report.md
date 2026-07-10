# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-filesystem-quality-status-projection--write-machine-readable-status-beside-the-filesystem-sentinel--live-gemini
- Feature id: feature-filesystem-quality-status-projection
- Scenario id: write-machine-readable-status-beside-the-filesystem-sentinel
- Scenario name: Write machine-readable status beside the filesystem sentinel
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Write machine-readable status beside the filesystem sentinel
    Given the status sentinel has been generated
    When the projection closes the feature status calculation
    Then it should write a machine-readable status contract at:
      """
      docs/features/_feature-status/<feature-id>.status.v1.json
      """
    And the JSON status contract should contain:
      | field |
      | schema version |
      | feature id |
      | feature name |
      | source feature path |
      | source feature content hash |
      | display status |
      | implementation status |
      | execution proof status |
      | end-user QA status |
      | promotion status |
      | latest execution run id |
      | latest QA run id |
      | latest release candidate id |
      | latest execution proof path |
      | latest QA bundle path |
      | latest QA gate decision path |
      | latest promotion decision path |
      | evidence hashes |
      | blocker codes |
      | stale reasons |
      | generated at |
      | generator name |
    And the JSON should be the source used to regenerate the sentinel Markdown
    And the sentinel Markdown should include a repo-relative link to this JSON contract.

```

## Acceptance Criteria

- Then it should write a machine-readable status contract at:
- And the JSON status contract should contain:
- And the JSON should be the source used to regenerate the sentinel Markdown
- And the sentinel Markdown should include a repo-relative link to this JSON contract.

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
