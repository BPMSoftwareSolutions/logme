# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: summary-findings-and-method-row-tie-out--block-clean-label-with-nonzero-findings--live-gemini
- Feature id: summary-findings-and-method-row-tie-out
- Scenario id: block-clean-label-with-nonzero-findings
- Scenario name: Block clean label with nonzero findings
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Block clean label with nonzero findings
    Given the report contains one or more findings
    When report.md is rendered
    Then the Findings section should not show the configured clean findings label
    And the verdict should not be `STERILE DOMAIN BODY`
    And the finding code should be:
      | finding |
      | clean-label-with-findings |
```

```

## Acceptance Criteria

- Then the Findings section should not show the configured clean findings label
- And the verdict should not be `STERILE DOMAIN BODY`
- And the finding code should be:

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
