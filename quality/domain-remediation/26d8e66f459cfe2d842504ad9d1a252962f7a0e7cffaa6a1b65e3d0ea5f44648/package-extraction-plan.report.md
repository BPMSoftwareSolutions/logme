# Package Extraction Plan Report

Source run: 26d8e66f459cfe2d842504ad9d1a252962f7a0e7cffaa6a1b65e3d0ea5f44648
Domain sprawl contract: evidence/runs/26d8e66f459cfe2d842504ad9d1a252962f7a0e7cffaa6a1b65e3d0ea5f44648/sprawl/domain-body-sprawl.contract.v1.json

Total candidates: 68
Resolved sections: 27
Unresolved sections: 41

## src/blocks-path-only-body-contracts/blocks-path-only-body-contracts.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/blocks-unsupported-scenario-tieouts/blocks-unsupported-scenario-tieouts.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/builds-domain-body-analysis-contract/builds-domain-body-analysis-contract.js

- Classification: new package
- Target package: logme-string-primitives
- Extracted method names: formatsAcceptancePaths, formatsRepoRelativePath, normalizesVerbToken
- Domain call-site guidance: Domain call sites should replace direct calls with `LogmeStringPrimitives.formatsAcceptancePaths(...)`, `LogmeStringPrimitives.formatsRepoRelativePath(...)`, and `LogmeStringPrimitives.normalizesVerbToken(...)` respectively.
- Finding codes: none
- Reasoning: The methods 'formatsAcceptancePaths', 'formatsRepoRelativePath', and 'normalizesVerbToken' perform generic string formatting, path formatting, and string normalization, which are reusable utilities not specific to the current domain or any existing packages. These methods collectively form a cohesive set of string-related primitives. The proposed new package 'logme-string-primitives' aligns with the existing 'logme-' naming convention for utility packages. The methods 'readsOwnedRuntimePaths' and 'isOwnedByRuntimePath' were associated with 'timestamp arithmetic' but their names indicate path-related logic, not timestamp operations, making the extraction for 'timestamp arithmetic' unclear. Similarly, 'filtersExecutableSourceFiles' was associated with 'table formatting' but its name suggests file system filtering, not table formatting. Therefore, extraction for the latter two mechanic candidates is rejected due to a mismatch between the mechanic description and the provided method names.

## src/builds-domain-body-sprawl-contract/builds-domain-body-sprawl-contract.js

- Classification: retained domain body
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: The methods normalizesSprawlThresholds and comparesSprawlHotspots will remain within the current domain body, with call sites unchanged.
- Finding codes: none
- Reasoning: Both normalizesSprawlThresholds and comparesSprawlHotspots incorporate domain-specific terms in their names ('SprawlThresholds', 'SprawlHotspots'), indicating they operate on domain-specific data structures or concepts, making them specific implementations rather than generic utilities. Therefore, they should be retained in the domain body.

## src/builds-llm-harness-assignment/builds-llm-harness-assignment.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/calculates-domain-body-sterility-summary/calculates-domain-body-sterility-summary.js

- Classification: new package
- Target package: logme-common-primitives
- Extracted method names: lowercasesPathPart, lowercasesWord, getRelativePathParts
- Domain call-site guidance: Call sites should import and use these methods from the new 'logme-common-primitives' package, for example, `logmeCommonPrimitives.lowercasesPathPart(...)` or `logmeCommonPrimitives.getRelativePathParts(...)`.
- Finding codes: none
- Reasoning: The methods 'lowercasesPathPart' and 'lowercasesWord' provide generic string formatting utilities, while 'getRelativePathParts' offers generic path manipulation. None of these functionalities are specific to the domain body, nor do they fit into any of the existing specialized 'logme' primitive packages. They are reusable and broadly applicable, justifying extraction into a new 'logme-common-primitives' package.

## src/calls-contract-steward-worker/calls-contract-steward-worker.js

- Classification: retained domain body
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: worker returned an empty domainCallSiteGuidance

## src/calls-llm-harness-worker/calls-llm-harness-worker.js

- Classification: retained domain body
- Target package: n/a
- Extracted method names: buildsLlmHarnessOutputResponseSchema
- Domain call-site guidance: The method builds the specific LLM harness output response schema and should remain within the calls-llm-harness-worker domain.
- Finding codes: none
- Reasoning: The method name 'buildsLlmHarnessOutputResponseSchema' clearly indicates it constructs a schema specific to the LLM harness output, making it domain-specific to the 'calls-llm-harness-worker' context rather than a generic schema-agnostic JSON writing utility.

## src/calls-naming-decomposition-worker/calls-naming-decomposition-worker.js

- Classification: retained domain body
- Target package: n/a
- Extracted method names: buildsNamingDecompositionResponseSchema
- Domain call-site guidance: Calls to buildsNamingDecompositionResponseSchema remain within the calls-naming-decomposition-worker domain logic.
- Finding codes: none
- Reasoning: The method 'buildsNamingDecompositionResponseSchema' is named with direct reference to a 'NamingDecompositionResponseSchema', which is highly specific to the 'calls-naming-decomposition-worker' domain. Although the underlying mechanic is described as 'schema-agnostic JSON writing', the method's specific purpose of building a domain-specific response schema indicates it is not a generic, reusable primitive suitable for extraction.

## src/calls-package-extraction-worker/calls-package-extraction-worker.js

- Classification: retained domain body
- Target package: n/a
- Extracted method names: buildsPackageExtractionResponseSchema
- Domain call-site guidance: The method buildsPackageExtractionResponseSchema should remain within the package extraction worker's domain body as it defines the output schema for this specific worker's response.
- Finding codes: none
- Reasoning: The method `buildsPackageExtractionResponseSchema` explicitly creates the schema for the 'PackageExtractionResponse'. This direct naming convention indicates a tight coupling to the specific domain of the package extraction worker, defining the structure of its own output, rather than a generic, reusable schema-building utility applicable across different domains.

## src/calls-scenario-tieout-worker/calls-scenario-tieout-worker.js

- Classification: retained domain body
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: No change required, the method remains in the calls-scenario-tieout-worker domain file.
- Finding codes: none
- Reasoning: The method 'buildsScenarioTieOutResponseSchema' is specifically responsible for constructing the schema for a 'Scenario Tie Out Response'. Despite the mechanic's description as 'schema-agnostic JSON writing', the method name and its implied purpose are highly domain-specific to scenario tie-out operations, making it unsuitable for extraction into a generic package.

## src/challenges-worker-proposal/challenges-worker-proposal.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/detects-domain-language-impurity/detects-anonymous-local-methods.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/detects-domain-language-impurity/detects-forbidden-local-utility-paths.js

- Classification: new package
- Target package: logme-path-primitives
- Extracted method names: lowercasesPathPart, getRelativePathParts
- Domain call-site guidance: Domain call sites should import PathPrimitives and use PathPrimitives.lowercasesPathPart(...) and PathPrimitives.getRelativePathParts(...).
- Finding codes: none
- Reasoning: The methods `lowercasesPathPart` and `getRelativePathParts` are generic utility functions for path string manipulation and decomposition. They do not fit into any existing specialized `logme-...-primitives` package (e.g., config, LLM, method inventory, report, source body, testimony core) but are clearly reusable across different domains, warranting a new dedicated primitives package for general path operations.

## src/detects-domain-language-impurity/detects-out-of-vocabulary-local-methods.js

- Classification: new package
- Target package: logme-string-primitives
- Extracted method names: lowercasesWord
- Domain call-site guidance: Change direct calls to 'lowercasesWord(...)' to 'stringPrimitives.lowercasesWord(...)'.
- Finding codes: none
- Reasoning: The method 'lowercasesWord' performs a generic string formatting operation (lowercasing) that is highly reusable and not specific to any existing primitive package. It is a fundamental string utility, warranting a new dedicated 'string primitives' package for common text manipulations.

## src/detects-retired-domain-name-reintroduction/detects-retired-domain-name-reintroduction.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/end-user-quality-evidence-bundle/end-user-quality-evidence-bundle.js

- Classification: new package
- Target package: logme-path-primitives
- Extracted method names: formatsRepoRelativePath
- Domain call-site guidance: Call sites currently using `formatsRepoRelativePath(path)` would be updated to use `pathPrimitives.formatRepoRelative(path)`.
- Finding codes: none
- Reasoning: The `formatsRepoRelativePath` method performs generic string and path formatting, a reusable utility that does not fit into any of the existing domain-specific `logme-*primitives` packages. Establishing `logme-path-primitives` will centralize path manipulation logic, promoting reuse and modularity across the codebase.

## src/feature-execution-proof/feature-execution-proof.js

- Classification: existing package
- Target package: logme-report-primitives
- Extracted method names: formatsSourceLineRange, formatsValue, formatsProofPathForReport, rendersScenarioMethodTimelineTable, rendersScenarioTimingTable
- Domain call-site guidance: The methods involved in formatting and rendering related to reports indicate that they fit well into the 'logme-report-primitives' package, which is designed for handling report-related functionalities.
- Finding codes: none
- Reasoning: The identified methods focus on formatting and rendering aspects that align with report generation, suggesting they should be part of existing reporting primitives.

## src/feature-quality-board/feature-quality-board.js

- Classification: new package
- Target package: logme-board-formatting-primitives
- Extracted method names: buildsBoardRows, buildsBoardRow, sortsBoardRowsByProductUrgency, rendersBoardRows
- Domain call-site guidance: Methods related to formatting and rendering board rows are likely to be used across various domains and should be considered for extraction into a dedicated packaging for board formatting utilities.
- Finding codes: none
- Reasoning: The methods related to table formatting (buildsBoardRows, buildsBoardRow, etc.) are generic mechanics that can be reused in other contexts outside of this specific domain, justifying the creation of a new package.

## src/feature-scoped-ascii-execution-flow-report/feature-scoped-ascii-execution-flow-report.js

- Classification: new package
- Target package: logme-formatting-primitives
- Extracted method names: formatsRepoRelativePath, formatsRuntimePath, formatsFirstValue, formatsRuntimeStep, formatsReceiptValue, formatsNodeStatus, formatsBlockerValue, formatsFixRoute, formatsMethodSource
- Domain call-site guidance: These formatting methods are generic and could be reused across different features and domains, making them ideal candidates for a dedicated formatting-related package.
- Finding codes: none
- Reasoning: The methods listed perform various formatting tasks that are not domain-specific and could benefit multiple areas, thereby justifying the creation of a new package.

## src/inventories-executable-domain-methods/inventories-executable-domain-methods.js

- Classification: retained domain body
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: No extraction is proposed; call sites for 'inventoriesExecutableDomainMethods' should remain unchanged within the domain body.
- Finding codes: none
- Reasoning: The method 'inventoriesExecutableDomainMethods' is identified as the implementation for the 'table formatting' mechanic. Its name, and the context of the file path (src/inventories-executable-domain-methods/inventories-executable-domain-methods.js), strongly suggest that this table formatting logic is specialized for inventories of executable domain methods, making it domain-specific rather than a generic, reusable utility. Therefore, it should be retained within its current domain body.

## src/llm-end-user-testing-conveyor/llm-end-user-testing-conveyor.js

- Classification: new package
- Target package: logme-path-primitives
- Extracted method names: formatsRepoRelativePath, readsFormattedRequiredReportPaths, normalizesPathForComparison
- Domain call-site guidance: Calls to path formatting, slugging, and normalization utilities should be routed to the new PathPrimitives package.
- Finding codes: none
- Reasoning: The identified mechanics related to path formatting, slugging, and normalization are generic and reusable across different contexts involving file paths. They do not fit into any existing specialized 'logme' primitive packages which focus on specific data types or system aspects. Creating a dedicated 'logme-path-primitives' package will centralize path manipulation utilities, improving reusability and separation of concerns.

## src/loads-report-layout-contract/loads-report-layout-contract.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/loads-workspace-observability-config/loads-workspace-observability-config.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/maps-domain-body-responsibilities/maps-domain-body-responsibilities.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/materializes-approved-harness/materializes-approved-harness.js

- Classification: existing package
- Target package: logme-method-inventory-primitives
- Extracted method names: isStringStep
- Domain call-site guidance: The function `isStringStep` applies to validating and formatting string inputs, which aligns with the purposes of existing methods in `logme-method-inventory-primitives`. This package handles general-purpose method functionalities that deal with validations and transformations, making it suitable for the extraction of generic mechanics like string formatting.
- Finding codes: none
- Reasoning: The method `isStringStep` serves a generic function related to string validation and formatting, which is relevant to the utilities typically found in `logme-method-inventory-primitives`. Since it does not align specifically with business logic nor is it domain-specific, it qualifies for existing package classification.

## src/parses-llm-harness-output/parses-llm-harness-output.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/per-feature-executable-body-evidence-reports/per-feature-executable-body-evidence-reports.js

- Classification: existing package
- Target package: logme-report-primitives
- Extracted method names: rendersExecutableBodyTree, rendersExecutableBodyTreeArtifact, rendersExecutableBodyContractReport, buildsFeatureEvidenceIndexRow, buildsNotExecutedFeatureEvidenceIndexRow
- Domain call-site guidance: After extraction, domain call sites for report rendering will delegate to methods within 'logme-report-primitives', e.g., 'reportPrimitives.renderExecutableBodyTree(...)'.
- Finding codes: none
- Reasoning: The listed methods are responsible for formatting and rendering structured reports, specifically trees and tables for feature evidence, which aligns directly with the purpose of the 'logme-report-primitives' package.

## src/plans-remediation-backlog/plans-remediation-backlog.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/promotes-body-contract-patch/promotes-body-contract-patch.js

- Classification: existing package
- Target package: logme-report-primitives
- Extracted method names: selectsPromotableEntries
- Domain call-site guidance: The domain body would invoke the reporting package's primitive to select entries, for example: 'reportPrimitives.selectPromotableEntries(data)'
- Finding codes: none
- Reasoning: The method 'selectsPromotableEntries' directly aligns with the 'table formatting' mechanic, as it implies selecting specific data for presentation. This is a fundamental operation for report generation and fits perfectly within the 'logme-report-primitives' package.

## src/proposes-body-contract-patch/proposes-body-contract-patch.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/proposes-decomposition-plan/proposes-decomposition-plan.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/proposes-next-harness/proposes-next-harness.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/proposes-package-extraction-plan/proposes-package-extraction-plan.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/proposes-rename-plan/proposes-rename-plan.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/proposes-scenario-tieout/proposes-scenario-tieout.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/renders-domain-body-sterility-report/renders-domain-body-sterility-report.js

- Classification: new package
- Target package: logme-string-formatting-primitives
- Extracted method names: formatsLayoutFindingAsText
- Domain call-site guidance: This formatting method can be used in other areas where string formatting is required, making it reusable across different reports and contexts.
- Finding codes: none
- Reasoning: The method 'formatsLayoutFindingAsText' is generic and reusable for string formatting, which does not fit any existing package, justifying the proposal of a new package.

## src/renders-report-from-layout-contract/renders-report-from-layout-contract.js

- Classification: new package
- Target package: logme-formatting
- Extracted method names: formatsBlockerFixRoute, formatsBlockerLine, formatsLawAsMarkdown, formatsSprawlHotspotRow, formatsDomainAnalysisFindingRow
- Domain call-site guidance: Domain call sites should delegate text and row formatting responsibilities to the new logme-formatting package, for example: 'Formatting.formatsBlockerFixRoute(...)'
- Finding codes: none
- Reasoning: The methods formatsBlockerFixRoute, formatsBlockerLine, formatsLawAsMarkdown, formatsSprawlHotspotRow, and formatsDomainAnalysisFindingRow are generic text and table row formatting utilities. They are reusable across different domains and do not fit within the scope of existing 'primitives' packages, which seem to handle foundational data structures or operations rather than presentation formatting. A new dedicated package for formatting will improve modularity and reusability.

## src/report-provenance/report-provenance.js

- Classification: new package
- Target package: logme-string-formatting-primitives
- Extracted method names: stableStringify, stringifiesStableValue, stringifiesObjectEntry, formatsCommandLine, formatsCommandLineSegment, trimsProvenanceLine
- Domain call-site guidance: Domain call sites like formatsCommandLine(args) would become StringFormatting.formatsCommandLine(args), leveraging the new StringFormatting package.
- Finding codes: none
- Reasoning: The identified methods provide generic string formatting and stable stringification capabilities that are reusable across different parts of the system. They are not domain-specific to 'report-provenance' and do not fit into any of the existing package definitions, warranting a new dedicated package for string and formatting primitives.

## src/report-truth/report-truth.js

- Classification: new package
- Target package: logme-markdown-table-primitives
- Extracted method names: readsMarkdownMethodTable, isMarkdownTableRow, isMarkdownHeaderRow, isMarkdownSeparatorRow, splitsMarkdownTableRow
- Domain call-site guidance: Domain call sites should now invoke methods from the new 'MarkdownTablePrimitives' package, for example, `MarkdownTablePrimitives.readsMarkdownMethodTable(...)` and `MarkdownTablePrimitives.isMarkdownTableRow(...)`.
- Finding codes: none
- Reasoning: The methods pertaining to Markdown table parsing (readsMarkdownMethodTable, isMarkdownTableRow, isMarkdownHeaderRow, isMarkdownSeparatorRow, splitsMarkdownTableRow) offer generic and reusable functionality for interpreting and manipulating Markdown table structures. This mechanic does not align with any of the existing packages. The method 'validatesSummaryToRowConsistency' is excluded from this extraction due to its domain-specific name ('SummaryToRowConsistency') and should be retained within the domain body.

## src/runs-adversarial-review-worker/runs-adversarial-review-worker.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/runs-body-contract-promotion/runs-body-contract-promotion.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/runs-contract-steward-worker/runs-contract-steward-worker.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/runs-domain-cartographer/runs-domain-cartographer.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/runs-generated-harness/runs-generated-harness.js

- Classification: new package
- Target package: logme-timing-primitives
- Extracted method names: detectsTimeout
- Domain call-site guidance: Replace `detectsTimeout(...)` with `timingPrimitives.detectsTimeout(...)` to explicitly use the new timing utility package.
- Finding codes: none
- Reasoning: The `detectsTimeout` method implements generic timestamp arithmetic logic to check for timeouts. This is a reusable utility that does not align with the specific purviews of existing primitive packages. A new `logme-timing-primitives` package is proposed to house such generic timing utilities.

## src/runs-naming-decomposition-worker/runs-naming-decomposition-worker.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/runs-package-extraction-worker/runs-package-extraction-worker.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/runs-remediation-planner/runs-remediation-planner.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/runs-report-truth-gate/runs-report-truth-gate.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/runs-scenario-tieout-worker/runs-scenario-tieout-worker.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/runs-verification-worker/runs-verification-worker.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/validates-generated-harness/validates-generated-harness.js

- Classification: new package
- Target package: logme-string-primitives
- Extracted method names: collectsStringValues, collectsAllDraftStrings
- Domain call-site guidance: Replace direct calls to collectsStringValues and collectsAllDraftStrings with calls to the new 'StringPrimitives' package.
- Finding codes: none
- Reasoning: The identified methods perform generic string collection and formatting, which are reusable utilities not specific to the 'validates-generated-harness' domain or any existing 'logme' primitive package. A new package, 'logme-string-primitives', is proposed to encapsulate these common string-related operations.

## src/validates-report-contract/validates-report-contract.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: worker returned an empty domainCallSiteGuidance

## src/validates-report-layout-contract/validates-report-layout-contract.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/verifies-generated-harness/verifies-generated-harness.js

- Classification: new package
- Target package: logme-string-primitives
- Extracted method names: collectsStringValues
- Domain call-site guidance: Use the new string primitive for collecting string values from various inputs.
- Finding codes: none
- Reasoning: The 'collectsStringValues' method offers generic string formatting and collection capabilities that are reusable across different domain contexts and do not align with the specialized functions of any existing primitive package.

## src/verifies-remediation-packet/verifies-remediation-packet.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/writes-adversarial-review-evidence/writes-adversarial-review-evidence.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/writes-body-contract-patch-evidence/writes-body-contract-patch-evidence.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/writes-decomposition-plan-evidence/writes-decomposition-plan-evidence.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/writes-domain-body-analysis-evidence/writes-domain-body-analysis-evidence.js

- Classification: product-owner review required
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: worker returned an empty domainCallSiteGuidance

## src/writes-domain-body-sprawl-evidence/writes-domain-body-sprawl-evidence.js

- Classification: existing package
- Target package: logme-report-primitives
- Extracted method names: formatsMarkdownCell, rendersDomainBodySprawlHotspotTable, rendersRankedHotspotRows, rendersHotspotRowsTable
- Domain call-site guidance: The domain body's report generation logic should now delegate string and table formatting tasks to the corresponding methods in the 'logme-report-primitives' package. For example, instead of direct formatting, it should invoke `reportPrimitives.formatsMarkdownCell(cellContent)` or `reportPrimitives.rendersHotspotRowsTable(dataRows)`.
- Finding codes: none
- Reasoning: The identified methods perform generic string formatting (markdown cells) and table rendering, which are core primitives for constructing reports. These responsibilities align directly with the purpose of the 'logme-report-primitives' package, making it the most suitable home for these reusable mechanics.

## src/writes-domain-map-evidence/writes-domain-map-evidence.js

- Classification: existing package
- Target package: logme-report-primitives
- Extracted method names: formatsMarkdownCell, rendersFileInventoryTable
- Domain call-site guidance: Call the new functions from the logme-report-primitives package to format markdown cells and render file inventory tables.
- Finding codes: none
- Reasoning: Both `formatsMarkdownCell` and `rendersFileInventoryTable` are generic formatting and rendering utilities that are highly reusable in the context of generating reports. The `logme-report-primitives` package is the most suitable existing package for these functionalities.

## src/writes-harness-receipt/writes-harness-receipt.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/writes-package-extraction-plan-evidence/writes-package-extraction-plan-evidence.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/writes-remediation-backlog-evidence/writes-remediation-backlog-evidence.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/writes-rename-plan-evidence/writes-rename-plan-evidence.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/writes-scenario-tieout-evidence/writes-scenario-tieout-evidence.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/writes-verification-report-evidence/writes-verification-report-evidence.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction
