# Domain Map Report

Canonical JSON evidence: quality/domain-remediation/162db37c732514fdf33a2a30c417802dff3efbfda085f4e8e3d37876d49e04dd/domain-map.proposal.v1.json

## Executive Summary

- Total files mapped: 62
- product-domain body: 5
- package primitive: 21
- generated evidence: 0
- test body: 0
- scaffold or entrypoint: 1
- ambiguous: 35
- Ambiguous files needing product-owner review: 35

## Ambiguous Files Requiring Review

- src/builds-domain-body-analysis-contract/builds-domain-body-analysis-contract.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/builds-domain-body-sprawl-contract/builds-domain-body-sprawl-contract.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/builds-domain-body-sterility-contract/builds-domain-body-sterility-contract.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/builds-llm-harness-assignment/builds-llm-harness-assignment.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/calculates-domain-body-sterility-summary/calculates-domain-body-sterility-summary.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/calls-llm-harness-worker/calls-llm-harness-worker.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/detects-domain-language-impurity/detects-anonymous-local-methods.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/detects-domain-language-impurity/detects-forbidden-local-utility-paths.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/detects-domain-language-impurity/detects-out-of-vocabulary-local-methods.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/detects-retired-domain-name-reintroduction/detects-retired-domain-name-reintroduction.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/end-user-quality-evidence-bundle/end-user-quality-evidence-bundle.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/feature-execution-proof/feature-execution-proof.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/feature-quality-board/feature-quality-board.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/feature-scoped-ascii-execution-flow-report/feature-scoped-ascii-execution-flow-report.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/inventories-executable-domain-methods/inventories-executable-domain-methods.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/llm-end-user-testing-conveyor/llm-end-user-testing-conveyor.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/loads-report-layout-contract/loads-report-layout-contract.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/loads-workspace-observability-config/loads-workspace-observability-config.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/materializes-approved-harness/materializes-approved-harness.js: file was flagged mixed-responsibility-file by sprawl analysis (5 responsibility clusters) and cannot be assigned one primary body responsibility without product-owner review
- src/parses-llm-harness-output/parses-llm-harness-output.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/per-feature-executable-body-evidence-reports/per-feature-executable-body-evidence-reports.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/proposes-next-harness/proposes-next-harness.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/renders-domain-body-sterility-report/renders-domain-body-sterility-report.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/renders-report-from-layout-contract/renders-report-from-layout-contract.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/report-provenance/report-provenance.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/report-truth/report-truth.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/runs-generated-harness/runs-generated-harness.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/runs-report-truth-gate/runs-report-truth-gate.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/validates-generated-harness/validates-generated-harness.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/validates-report-contract/validates-report-contract.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/validates-report-layout-contract/validates-report-layout-contract.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/verifies-generated-harness/verifies-generated-harness.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/writes-domain-body-analysis-evidence/writes-domain-body-analysis-evidence.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/writes-domain-body-sprawl-evidence/writes-domain-body-sprawl-evidence.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction
- src/writes-harness-receipt/writes-harness-receipt.js: file contains a package-worthy generic mechanic inside the domain body and needs a product-owner decision on extraction

## File Responsibility Inventory

| File Path | Classification | Primary Responsibility | Scenario Tie-Out |
| --- | --- | --- | --- |
| packages/logme-config-primitives/src/lowercases-string-list.js package primitive unclear-action missing |
| packages/logme-config-primitives/src/normalizes-config-string-array.js package primitive unclear-action missing |
| packages/logme-config-primitives/src/reads-json-config-file.js package primitive unclear-action missing |
| packages/logme-config-primitives/src/resolves-configured-root-path.js package primitive resolve missing |
| packages/logme-method-inventory-primitives/src/detects-logme-call-in-node.js package primitive unclear-action missing |
| packages/logme-method-inventory-primitives/src/extracts-executable-method-nodes.js package primitive unclear-action missing |
| packages/logme-method-inventory-primitives/src/parses-javascript-typescript-source.js package primitive unclear-action missing |
| packages/logme-method-inventory-primitives/src/resolves-method-kind.js package primitive resolve missing |
| packages/logme-method-inventory-primitives/src/resolves-method-name.js package primitive resolve missing |
| packages/logme-report-primitives/src/parses-execution-sketch-template.js package primitive parse missing |
| packages/logme-report-primitives/src/renders-ascii-execution-flow.js package primitive resolve missing |
| packages/logme-report-primitives/src/renders-ascii-tree.js package primitive render missing |
| packages/logme-report-primitives/src/renders-markdown-summary.js package primitive render missing |
| packages/logme-report-primitives/src/renders-markdown-table.js package primitive render missing |
| packages/logme-source-body-primitives/src/excludes-configured-directories.js package primitive unclear-action missing |
| packages/logme-source-body-primitives/src/filters-source-files-by-extension.js package primitive unclear-action missing |
| packages/logme-source-body-primitives/src/walks-configured-source-files.js package primitive unclear-action missing |
| packages/logme-testimony-core/src/LogMe.js package primitive unclear-action missing |
| packages/logme-testimony-core/src/sample-method.js package primitive unclear-action missing |
| packages/logme-testimony-core/src/writes-domain-receipt.js package primitive write missing |
| packages/logme-testimony-core/src/writes-telemetry-event.js package primitive write missing |
| scaffold.js scaffold or entrypoint unclear-action missing |
| src/builds-domain-body-analysis-contract/builds-domain-body-analysis-contract.js ambiguous build missing |
| src/builds-domain-body-sprawl-contract/builds-domain-body-sprawl-contract.js ambiguous build missing |
| src/builds-domain-body-sterility-contract/builds-domain-body-sterility-contract.js ambiguous inventory yes |
| src/builds-domain-body-sterility-findings/builds-domain-body-sterility-findings.js product-domain body build missing |
| src/builds-llm-harness-assignment/builds-llm-harness-assignment.js ambiguous unclear-action missing |
| src/calculates-domain-body-sterility-summary/calculates-domain-body-sterility-summary.js ambiguous unclear-action missing |
| src/calls-llm-harness-worker/calls-llm-harness-worker.js ambiguous build missing |
| src/detects-domain-language-impurity/detects-anonymous-local-methods.js ambiguous detect missing |
| src/detects-domain-language-impurity/detects-forbidden-local-utility-paths.js ambiguous unclear-action missing |
| src/detects-domain-language-impurity/detects-out-of-vocabulary-local-methods.js ambiguous unclear-action missing |
| src/detects-method-testimony/detects-method-testimony.js product-domain body detect missing |
| src/detects-retired-domain-name-reintroduction/detects-retired-domain-name-reintroduction.js ambiguous unclear-action yes |
| src/discovers-configured-source-bodies/discovers-configured-source-bodies.js product-domain body discover missing |
| src/end-user-quality-evidence-bundle/end-user-quality-evidence-bundle.js ambiguous unclear-action missing |
| src/feature-execution-proof/feature-execution-proof.js ambiguous unclear-action missing |
| src/feature-quality-board/feature-quality-board.js ambiguous unclear-action missing |
| src/feature-scoped-ascii-execution-flow-report/feature-scoped-ascii-execution-flow-report.js ambiguous unclear-action missing |
| src/inventories-executable-domain-methods/inventories-executable-domain-methods.js ambiguous build missing |
| src/llm-end-user-testing-conveyor/llm-end-user-testing-conveyor.js ambiguous unclear-action missing |
| src/loads-report-layout-contract/loads-report-layout-contract.js ambiguous load missing |
| src/loads-workspace-observability-config/loads-workspace-observability-config.js ambiguous load missing |
| src/materializes-approved-harness/materializes-approved-harness.js ambiguous write missing |
| src/parses-llm-harness-output/parses-llm-harness-output.js ambiguous unclear-action missing |
| src/per-feature-executable-body-evidence-reports/per-feature-executable-body-evidence-reports.js ambiguous build missing |
| src/proposes-next-harness/proposes-next-harness.js ambiguous unclear-action missing |
| src/renders-domain-body-sterility-report/renders-domain-body-sterility-report.js ambiguous render missing |
| src/renders-report-from-layout-contract/renders-report-from-layout-contract.js ambiguous unclear-action missing |
| src/report-provenance/report-provenance.js ambiguous unclear-action missing |
| src/report-truth/report-truth.js ambiguous unclear-action missing |
| src/runs-generated-harness/runs-generated-harness.js ambiguous detect missing |
| src/runs-logme-domain-audit.js product-domain body run missing |
| src/runs-report-truth-gate/runs-report-truth-gate.js ambiguous unclear-action missing |
| src/validates-generated-harness/validates-generated-harness.js ambiguous collect missing |
| src/validates-report-contract/validates-report-contract.js ambiguous resolve missing |
| src/validates-report-layout-contract/validates-report-layout-contract.js ambiguous unclear-action missing |
| src/verifies-generated-harness/verifies-generated-harness.js ambiguous unclear-action missing |
| src/writes-domain-body-analysis-evidence/writes-domain-body-analysis-evidence.js ambiguous write missing |
| src/writes-domain-body-sprawl-evidence/writes-domain-body-sprawl-evidence.js ambiguous write missing |
| src/writes-domain-body-sterility-receipt/writes-domain-body-sterility-receipt.js product-domain body write missing |
| src/writes-harness-receipt/writes-harness-receipt.js ambiguous unclear-action missing |

## Source Evidence Links

- Domain analysis contract: evidence/runs/162db37c732514fdf33a2a30c417802dff3efbfda085f4e8e3d37876d49e04dd/domain-analysis/domain-body-analysis.contract.v1.json
- Domain sprawl contract: evidence/runs/162db37c732514fdf33a2a30c417802dff3efbfda085f4e8e3d37876d49e04dd/sprawl/domain-body-sprawl.contract.v1.json
