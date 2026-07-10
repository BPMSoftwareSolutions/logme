# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-execution-proof-source-of-truth--preserve-sla-evidence-without-turning-reports-into-contracts--live-gemini
- Feature id: feature-execution-proof-source-of-truth
- Scenario id: preserve-sla-evidence-without-turning-reports-into-contracts
- Scenario name: Preserve SLA evidence without turning reports into contracts
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Preserve SLA evidence without turning reports into contracts
    Given an external or internal SLA depends on one or more SLOs
    When a feature scenario is executed during an SLA measurement window
    Then the JSON proof should preserve the evidence required to support the SLA calculation
    And the human report should show whether the supporting SLOs were met, missed, or lacked evidence
    And the report should not present an SLA as satisfied unless the underlying SLO evidence is satisfied
    And the finding code for unsupported SLA claims should be:
      | finding |
      | sla-claim-without-slo-evidence |

```

## Acceptance Criteria

- Then the JSON proof should preserve the evidence required to support the SLA calculation
- And the human report should show whether the supporting SLOs were met, missed, or lacked evidence
- And the report should not present an SLA as satisfied unless the underlying SLO evidence is satisfied
- And the finding code for unsupported SLA claims should be:

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
