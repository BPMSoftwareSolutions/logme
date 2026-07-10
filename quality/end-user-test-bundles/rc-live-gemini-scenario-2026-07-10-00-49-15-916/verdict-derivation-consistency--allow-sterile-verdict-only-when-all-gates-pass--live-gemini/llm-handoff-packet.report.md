# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: verdict-derivation-consistency--allow-sterile-verdict-only-when-all-gates-pass--live-gemini
- Feature id: verdict-derivation-consistency
- Scenario id: allow-sterile-verdict-only-when-all-gates-pass
- Scenario name: Allow sterile verdict only when all gates pass
- Provider: Gemini
- Model: gemini-flash-lite-latest

## Feature Gherkin

```gherkin
  Scenario: Allow sterile verdict only when all gates pass
    Given all local executable methods have LogMe testimony
    And no generic utility methods are inside the domain body
    And no anonymous executable methods exist
    And no method is outside the declared domain vocabulary
    And no unimplemented stub is reported as domain-bound code
    And the report contract schema is valid
    And the report freshness gate passes
    When the verdict is derived
    Then the verdict may be `STERILE DOMAIN BODY`.
```

```

## Acceptance Criteria

- And no generic utility methods are inside the domain body
- And no anonymous executable methods exist
- And no method is outside the declared domain vocabulary
- And no unimplemented stub is reported as domain-bound code
- And the report contract schema is valid
- And the report freshness gate passes
- Then the verdict may be `STERILE DOMAIN BODY`.

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
