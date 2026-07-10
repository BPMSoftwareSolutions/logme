# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: end-user-quality-evidence-bundle--preserve-machine-and-execution-provenance--live-gemini
- Feature id: end-user-quality-evidence-bundle
- Scenario id: preserve-machine-and-execution-provenance
- Scenario name: Preserve machine and execution provenance
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Preserve machine and execution provenance
    Given a QA evidence bundle is created
    When machine provenance is captured
    Then `machine-environment.v1.json` should include:
      | field |
      | machine hostname or stable machine id |
      | operating system |
      | CPU architecture |
      | timezone |
      | Node.js version |
      | browser name and version when applicable |
      | viewport or terminal size when applicable |
      | git branch |
      | git commit or working-tree marker |
      | repository root |
      | command executed |
      | started at |
      | finished at |
      | duration ms |
      | CI provider and run URL when applicable |
    And secrets, API keys, and personal access tokens should be redacted.

```

## Acceptance Criteria

- Then `machine-environment.v1.json` should include:
- And secrets, API keys, and personal access tokens should be redacted.

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
