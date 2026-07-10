# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: report-contract-schema-enforcement--validate-non-empty-sterility-report-schema--live-gemini
- Feature id: report-contract-schema-enforcement
- Scenario id: validate-non-empty-sterility-report-schema
- Scenario name: Validate non-empty sterility report schema
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Validate non-empty sterility report schema
    Given `contracts/domains/logme/sterility-report.schema.v1.json` defines required fields
    And the report generator has built an in-memory report contract
    When schema validation runs
    Then the contract should include:
      | field |
      | generatedBy |
      | schemaVersion |
      | reportPath |
      | configPath |
      | rootDir |
      | filesScanned |
      | localExecutableMethods |
      | domainBoundMethods |
      | methodsWithLogMeCall |
      | silentLocalMethods |
      | findings |
      | methods |
      | coverage |
      | verdict |
      | evidence |
    And markdown should be written only after schema validation passes.

```

## Acceptance Criteria

- And the report generator has built an in-memory report contract
- Then the contract should include:
- And markdown should be written only after schema validation passes.

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
