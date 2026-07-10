# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: method-level-execution-drill-down--distinguish-discovered-methods-from-observed-method-calls--live-gemini
- Feature id: method-level-execution-drill-down
- Scenario id: distinguish-discovered-methods-from-observed-method-calls
- Scenario name: Distinguish discovered methods from observed method calls
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Distinguish discovered methods from observed method calls
    Given LogMe has a static source inventory
    And runtime telemetry exists for a scenario
    When method-level execution proof is rendered
    Then the report should distinguish:
      | concept | meaning | promotion authority |
      | discovered method | method found by static source scan | no runtime proof |
      | observed method call | method invocation proven by telemetry | runtime proof |
      | receipted method action | observed method call tied to durable receipt evidence | promotion proof |
    And the report should not label a discovered method as executed unless telemetry proves an observed call
    And the finding code for a false runtime claim should be:
      | finding |
      | static-method-presented-as-runtime-execution |

```

## Acceptance Criteria

- And runtime telemetry exists for a scenario
- Then the report should distinguish:
- And the report should not label a discovered method as executed unless telemetry proves an observed call
- And the finding code for a false runtime claim should be:

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
