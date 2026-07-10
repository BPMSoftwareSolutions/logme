# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-body-sprawl-visibility--keep-product-meaning-separate-from-generic-mechanics--live-gemini
- Feature id: domain-body-sprawl-visibility
- Scenario id: keep-product-meaning-separate-from-generic-mechanics
- Scenario name: Keep product meaning separate from generic mechanics
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Keep product meaning separate from generic mechanics
    Given a domain source file contains local methods that perform generic mechanics
    And the method names or bodies do not express domain responsibility
    When the sprawl classifier runs
    Then those methods should be reported as package extraction candidates
    And generic mechanics should include:
      | mechanic |
      | slug/string formatting |
      | CSV escaping or projection |
      | file line reading |
      | path joining or path normalization |
      | sorting comparators |
      | timestamp arithmetic |
      | table formatting |
      | schema-agnostic JSON writing |
    And the finding code should be:
      | finding |
      | package-worthy-mechanic-inside-domain-body |
    And the fix route should name a package destination or explain why the mechanic is domain-specific.

```

## Acceptance Criteria

- And the method names or bodies do not express domain responsibility
- Then those methods should be reported as package extraction candidates
- And generic mechanics should include:
- And the finding code should be:
- And the fix route should name a package destination or explain why the mechanic is domain-specific.

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
