# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: end-user-quality-evidence-bundle--keep-transient-run-evidence-separate-from-promoted-qa-evidence--live-gemini
- Feature id: end-user-quality-evidence-bundle
- Scenario id: keep-transient-run-evidence-separate-from-promoted-qa-evidence
- Scenario name: Keep transient run evidence separate from promoted QA evidence
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Keep transient run evidence separate from promoted QA evidence
    Given `evidence/runs/` contains transient generated evidence
    And a QA bundle is promoted
    When the QA bundle is assembled
    Then the promoted bundle should live under `quality/end-user-test-bundles/`
    And it should include hashes or copied snapshots of the evidence needed for human review
    And transient `evidence/runs/` paths alone should not be release authority
    And the source-controlled QA bundle should be the durable promotion record.
```

```

## Acceptance Criteria

- And a QA bundle is promoted
- Then the promoted bundle should live under `quality/end-user-test-bundles/`
- And it should include hashes or copied snapshots of the evidence needed for human review
- And transient `evidence/runs/` paths alone should not be release authority
- And the source-controlled QA bundle should be the durable promotion record.

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
