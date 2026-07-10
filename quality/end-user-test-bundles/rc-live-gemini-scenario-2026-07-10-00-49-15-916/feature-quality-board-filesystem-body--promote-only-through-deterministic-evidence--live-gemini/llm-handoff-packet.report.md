# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-quality-board-filesystem-body--promote-only-through-deterministic-evidence--live-gemini
- Feature id: feature-quality-board-filesystem-body
- Scenario id: promote-only-through-deterministic-evidence
- Scenario name: Promote only through deterministic evidence
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Promote only through deterministic evidence
    Given a feature status row is proposed as `qa-passed.promoted`
    When the board projection validates promotion
    Then it should require:
      | requirement |
      | latest QA gate decision is QA passed |
      | QA bundle manifest hashes match |
      | machine provenance exists |
      | required human reports exist |
      | deterministic promotion decision exists |
      | promotion decision points to the same release candidate id |
      | promotion decision points to the same QA run id |
      | no unresolved blocker findings exist |
    And an LLM-authored claim of promotion should not satisfy promotion
    And failure should produce:
      | finding code |
      | feature-promotion-not-evidence-backed |

```

## Acceptance Criteria

- Then it should require:
- And an LLM-authored claim of promotion should not satisfy promotion
- And failure should produce:

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
