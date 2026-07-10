# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-body-sprawl-visibility--roll-up-method-level-sterility-findings-into-file-level-sprawl-hotspots--live-gemini
- Feature id: domain-body-sprawl-visibility
- Scenario id: roll-up-method-level-sterility-findings-into-file-level-sprawl-hotspots
- Scenario name: Roll up method-level sterility findings into file-level sprawl hotspots
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Roll up method-level sterility findings into file-level sprawl hotspots
    Given the domain sterility gate reports local method findings
    When the sprawl report is rendered
    Then findings should be grouped by file so the product owner can see responsibility concentration
    And grouped sterility signals should include:
      | signal |
      | local method without testimony |
      | anonymous executable method |
      | method name outside domain vocabulary |
      | local generic utility detected |
      | unimplemented stub detected |
    And a file with many grouped findings should appear as a top sprawl hotspot
    And the report should distinguish:
      | hotspot type |
      | missing observability discipline |
      | anonymous local callback sprawl |
      | generic package-worthy mechanics |
      | unclear domain vocabulary |
      | unimplemented source body |

```

## Acceptance Criteria

- Then findings should be grouped by file so the product owner can see responsibility concentration
- And grouped sterility signals should include:
- And a file with many grouped findings should appear as a top sprawl hotspot
- And the report should distinguish:

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
