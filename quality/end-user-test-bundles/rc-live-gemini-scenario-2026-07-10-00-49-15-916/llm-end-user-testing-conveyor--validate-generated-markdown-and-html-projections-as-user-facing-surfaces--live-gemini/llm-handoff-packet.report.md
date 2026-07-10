# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: llm-end-user-testing-conveyor--validate-generated-markdown-and-html-projections-as-user-facing-surfaces--live-gemini
- Feature id: llm-end-user-testing-conveyor
- Scenario id: validate-generated-markdown-and-html-projections-as-user-facing-surfaces
- Scenario name: Validate generated Markdown and HTML projections as user-facing surfaces
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Validate generated Markdown and HTML projections as user-facing surfaces
    Given the tested feature produces Markdown, ASCII, or HTML reports
    When the LLM runs end-user testing
    Then it should inspect the generated Markdown report as a human-facing artifact
    And it should inspect the HTML projection when HTML rendering is available
    And the inspection should verify:
      | expectation |
      | executive summary is understandable |
      | ASCII sketches render clearly |
      | links use repo-relative or artifact-relative paths |
      | evidence paths resolve |
      | blocker states are visible before dense details |
      | timing and call-count facts are readable |
      | no JSON-only evidence is presented as product-ready |
      | report can be shared with architects and business owners |
    And visual or readability blockers should be recorded in the QA bundle
    And a screenshot index should be written when visual surfaces are inspected.

```

## Acceptance Criteria

- Then it should inspect the generated Markdown report as a human-facing artifact
- And it should inspect the HTML projection when HTML rendering is available
- And the inspection should verify:
- And visual or readability blockers should be recorded in the QA bundle
- And a screenshot index should be written when visual surfaces are inspected.

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
