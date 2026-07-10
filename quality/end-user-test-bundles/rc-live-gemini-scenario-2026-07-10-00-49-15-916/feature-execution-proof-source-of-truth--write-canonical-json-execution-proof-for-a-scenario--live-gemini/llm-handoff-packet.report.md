# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-execution-proof-source-of-truth--write-canonical-json-execution-proof-for-a-scenario--live-gemini
- Feature id: feature-execution-proof-source-of-truth
- Scenario id: write-canonical-json-execution-proof-for-a-scenario
- Scenario name: Write canonical JSON execution proof for a scenario
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Write canonical JSON execution proof for a scenario
    Given a feature scenario has been executed by an end-to-end test, demo run, PI validation run, or local feature truth command
    And the run id is `<run-id>`
    And the feature id is `<feature-id>`
    And the scenario id is `<scenario-id>`
    When feature execution evidence is closed
    Then it should write canonical JSON proof at:
      """
      evidence/runs/<run-id>/features/<feature-id>/scenarios/<scenario-id>/feature-execution.contract.v1.json
      """
    And the JSON proof should contain:
      | field |
      | schema version |
      | run id |
      | feature id |
      | scenario id |
      | scenario name |
      | generated at |
      | generator name |
      | acceptance source |
      | declared executable body |
      | observed execution timeline |
      | telemetry source paths |
      | receipt source paths |
      | timing metrics |
      | call count metrics |
      | method call drill-down |
      | blocker findings |
      | promotion decision |
    And every report field about execution should be derived from this JSON proof or explicitly marked `not observed`.

```

## Acceptance Criteria

- And the run id is `<run-id>`
- And the feature id is `<feature-id>`
- And the scenario id is `<scenario-id>`
- Then it should write canonical JSON proof at:
- And the JSON proof should contain:
- And every report field about execution should be derived from this JSON proof or explicitly marked `not observed`.

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
