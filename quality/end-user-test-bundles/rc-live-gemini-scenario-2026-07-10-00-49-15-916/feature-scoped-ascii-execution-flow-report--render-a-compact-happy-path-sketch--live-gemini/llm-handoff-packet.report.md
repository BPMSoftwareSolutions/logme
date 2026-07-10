# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--render-a-compact-happy-path-sketch--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: render-a-compact-happy-path-sketch
- Scenario name: Render a compact happy-path sketch
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Render a compact happy-path sketch
    Given the report verdict is clean
    And every required runtime node has telemetry and receipt proof
    When the ASCII execution sketch is rendered
    Then the sketch should show:
      """
      +------------------------------------------------------------+
      | REPORT TRUTH                                               |
      +------------------------------------------------------------+
      | Verdict        : STERILE DOMAIN BODY                       |
      | Run            : <run-id>                                  |
      | Promotion      : ALLOWED                                   |
      +------------------------------------------------------------+
      | Gherkin -> Contract -> Source -> Telemetry -> Receipt      |
      |    ok         ok          ok        observed     written   |
      +------------------------------------------------------------+
      """
    And every `ok`, `observed`, or `written` label should be backed by evidence.

```

## Acceptance Criteria

- And every required runtime node has telemetry and receipt proof
- Then the sketch should show:
- And every `ok`, `observed`, or `written` label should be backed by evidence.

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
