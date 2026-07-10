# Package Extraction Plan Report

Source run: 162db37c732514fdf33a2a30c417802dff3efbfda085f4e8e3d37876d49e04dd
Domain sprawl contract: evidence/runs/162db37c732514fdf33a2a30c417802dff3efbfda085f4e8e3d37876d49e04dd/sprawl/domain-body-sprawl.contract.v1.json

Total candidates: 34
Resolved sections: 23
Unresolved sections: 11

## src/builds-domain-body-analysis-contract/builds-domain-body-analysis-contract.js

- Classification: new package
- Target package: logme-path-primitives
- Extracted method names: formatsAcceptancePaths, formatsRepoRelativePath, normalizesVerbToken
- Domain call-site guidance: Domain call sites should replace direct calls with `logmePathPrimitives.formatAcceptancePaths(...)`, `logmePathPrimitives.formatRepoRelativePath(...)`, and `logmePathPrimitives.normalizeVerbToken(...)`.
- Finding codes: none
- Reasoning: The methods `formatsAcceptancePaths`, `formatsRepoRelativePath`, and `normalizesVerbToken` implement generic string and path formatting/normalization mechanics. These functionalities are reusable across different domains and do not fit any of the existing packages. A new package, `logme-path-primitives`, is proposed to encapsulate these common utilities. The other listed mechanic candidates (timestamp arithmetic for `readsOwnedRuntimePaths`, `isOwnedByRuntimePath` and table formatting for `filtersExecutableSourceFiles`) have method names that appear domain-specific to the builds analysis contract, despite their general mechanic descriptions, and are therefore not proposed for extraction.

## src/builds-domain-body-sprawl-contract/builds-domain-body-sprawl-contract.js

- Classification: retained domain body
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: The mechanics remain within the 'builds-domain-body-sprawl-contract' domain body, as their current naming reflects domain-specific concerns and usage.
- Finding codes: none
- Reasoning: Both 'normalizesSprawlThresholds' and 'comparesSprawlHotspots' include domain-specific terms ('SprawlThresholds', 'SprawlHotspots') in their names. While path normalization and sorting comparators are generic mechanic categories, the grounded method names indicate that these implementations are tightly coupled to the 'builds-domain-body-sprawl-contract' domain and are not suitable for extraction into a generic package without significant renaming and refactoring to remove domain context, which is beyond the scope of this extraction task.

## src/builds-llm-harness-assignment/builds-llm-harness-assignment.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/calculates-domain-body-sterility-summary/calculates-domain-body-sterility-summary.js

- Classification: new package
- Target package: logme-utils
- Extracted method names: lowercasesPathPart, lowercasesWord, getRelativePathParts
- Domain call-site guidance: Domain call sites should import and use methods from 'logme-utils' for string formatting and path manipulation, for example, `LogmeUtils.lowercasesPathPart(...)` or `LogmeUtils.getRelativePathParts(...)`.
- Finding codes: none
- Reasoning: The methods 'lowercasesPathPart', 'lowercasesWord', and 'getRelativePathParts' are generic string and path utility functions. They are highly reusable and not specific to any existing 'logme-primitives' package, justifying the creation of a new 'logme-utils' package for general-purpose utilities.

## src/calls-llm-harness-worker/calls-llm-harness-worker.js

- Classification: product-owner review required
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: worker returned an empty domainCallSiteGuidance

## src/detects-domain-language-impurity/detects-anonymous-local-methods.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/detects-domain-language-impurity/detects-forbidden-local-utility-paths.js

- Classification: existing package
- Target package: logme-source-body-primitives
- Extracted method names: lowercasesPathPart, getRelativePathParts
- Domain call-site guidance: Replace direct path and string manipulation with calls to the `logme-source-body-primitives` package, e.g., `sourceBodyPrimitives.lowercasesPathPart(...)` and `sourceBodyPrimitives.getRelativePathParts(...)`.
- Finding codes: none
- Reasoning: The methods `lowercasesPathPart` and `getRelativePathParts` represent generic path and string formatting utilities. These are fundamental primitives for working with source file paths and fit well within `logme-source-body-primitives`, a package dedicated to foundational utilities for source code bodies.

## src/detects-domain-language-impurity/detects-out-of-vocabulary-local-methods.js

- Classification: new package
- Target package: logme-string-utils
- Extracted method names: lowercasesWord
- Domain call-site guidance: Call site should read: stringUtils.lowercasesWord()
- Finding codes: none
- Reasoning: The method 'lowercasesWord' is a generic string formatting utility. It is not domain-specific to 'detects-domain-language-impurity' and does not fit into any of the existing packages. It offers reusable functionality appropriate for a new, dedicated utility package.

## src/detects-retired-domain-name-reintroduction/detects-retired-domain-name-reintroduction.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/end-user-quality-evidence-bundle/end-user-quality-evidence-bundle.js

- Classification: existing package
- Target package: logme-source-body-primitives
- Extracted method names: formatsRepoRelativePath
- Domain call-site guidance: Call `sourceBodyPrimitives.formatRepoRelativePath(path)`
- Finding codes: none
- Reasoning: The method `formatsRepoRelativePath` performs generic string and path formatting relevant to processing repository-relative paths, which aligns with the scope of `logme-source-body-primitives`.

## src/feature-execution-proof/feature-execution-proof.js

- Classification: new package
- Target package: logme-string-primitives
- Extracted method names: slugifies, formatsSourceLineRange, formatsValue, formatsRepoRelativePath, formatsProofPathForReport, formatsSourcePathWithLineRange
- Domain call-site guidance: Replace direct string formatting calls with calls to the new logme-string-primitives package, e.g., StringPrimitives.slugifies(...)
- Finding codes: none
- Reasoning: The identified methods perform various generic string formatting, slugification, and path-related string manipulations. These are highly reusable utilities that do not fit into any existing logme-*primitives packages. A new dedicated package logme-string-primitives will centralize these text utilities.

## src/feature-quality-board/feature-quality-board.js

- Classification: new package
- Target package: logme-path-string-primitives
- Extracted method names: formatsRepoRelativePath, formatsSentinelPathForFinding
- Domain call-site guidance: Calls to 'formatsRepoRelativePath' and 'formatsSentinelPathForFinding' should be replaced with calls to the corresponding methods in the new 'logme-path-string-primitives' package, for example, 'logmePathStringPrimitives.formatRepoRelativePath(...)'
- Finding codes: none
- Reasoning: The methods 'formatsRepoRelativePath' and 'formatsSentinelPathForFinding' implement generic string and path formatting logic that is reusable across different domains and aligns with the 'primitives' naming convention of existing packages. They do not fit any current package.

## src/feature-scoped-ascii-execution-flow-report/feature-scoped-ascii-execution-flow-report.js

- Classification: existing package
- Target package: logme-report-primitives
- Extracted method names: rendersDenseTimingRows, checksPortableAscii
- Domain call-site guidance: Domain call sites should now call ReportPrimitives.rendersDenseTimingRows(...) and ReportPrimitives.checksPortableAscii(...).
- Finding codes: none
- Reasoning: The identified methods, rendersDenseTimingRows and checksPortableAscii, are concerned with the formatting and validation of tabular data for presentation. This aligns directly with the purpose of logme-report-primitives, which is intended to house fundamental utilities for generating reports.

## src/inventories-executable-domain-methods/inventories-executable-domain-methods.js

- Classification: retained domain body
- Target package: n/a
- Extracted method names: inventoriesExecutableDomainMethods
- Domain call-site guidance: The method 'inventoriesExecutableDomainMethods' remains in the domain body, continuing to provide formatted inventory data.
- Finding codes: none
- Reasoning: The method name 'inventoriesExecutableDomainMethods' is highly domain-specific, strongly suggesting its primary role is to manage or present inventory data rather than to provide a generic table formatting utility. Any table formatting performed by this method is likely in service of its specific domain context, making it unsuitable for extraction as a generic primitive.

## src/llm-end-user-testing-conveyor/llm-end-user-testing-conveyor.js

- Classification: new package
- Target package: logme-path-primitives
- Extracted method names: formatsRepoRelativePath, normalizesPathForComparison
- Domain call-site guidance: Call methods from `LogmePathPrimitives` (or similar) to handle path formatting and normalization.
- Finding codes: none
- Reasoning: The methods 'formatsRepoRelativePath' and 'normalizesPathForComparison' provide generic and reusable utility for handling and standardizing file paths. This functionality is not specific to the domain of llm-end-user-testing-conveyor and does not fit into any existing Logme primitive package. A new package, 'logme-path-primitives', is proposed to encapsulate these common path manipulation functionalities.

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

## src/materializes-approved-harness/materializes-approved-harness.js

- Classification: new package
- Target package: logme-string-primitives
- Extracted method names: isStringStep
- Domain call-site guidance: Call sites should import isStringStep from 'logme-string-primitives' and use it directly, e.g., import { isStringStep } from 'logme-string-primitives';
- Finding codes: none
- Reasoning: The 'isStringStep' method, categorized as a slug/string formatting utility, is a generic and reusable mechanic. It does not fit into any of the existing domain-specific 'logme-*-primitives' packages. Therefore, a new package dedicated to general string utilities is proposed to maintain clear separation of concerns.

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
- Domain call-site guidance: Domain call sites for rendering report elements, such as `rendersExecutableBodyTree(data)`, should be updated to delegate to the `logme-report-primitives` package, for example, `reportPrimitives.renderExecutableBodyTree(data)`.
- Finding codes: none
- Reasoning: The methods identified are responsible for generic table formatting and report rendering. This mechanic directly aligns with the existing `logme-report-primitives` package, which is intended for reusable components related to report generation and formatting. Extraction will consolidate report-related utilities.

## src/proposes-next-harness/proposes-next-harness.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/renders-domain-body-sterility-report/renders-domain-body-sterility-report.js

- Classification: existing package
- Target package: logme-report-primitives
- Extracted method names: formatsLayoutFindingAsText
- Domain call-site guidance: Domain call sites should invoke the method via `logmeReportPrimitives.formatLayoutFindingAsText(...)` after the extraction.
- Finding codes: none
- Reasoning: The method `formatsLayoutFindingAsText` performs a generic string formatting task to render a 'LayoutFinding' into text. This is a common utility function that prepares data for presentation, likely within a report context. The `logme-report-primitives` package is the most suitable existing home for such a primitive utility that supports report generation and data presentation.

## src/renders-report-from-layout-contract/renders-report-from-layout-contract.js

- Classification: existing package
- Target package: logme-report-primitives
- Extracted method names: formatsBlockerFixRoute, formatsBlockerLine, formatsLawAsMarkdown, formatsSprawlHotspotRow, formatsDomainAnalysisFindingRow
- Domain call-site guidance: Call methods on `reportPrimitives` for formatting specific report elements.
- Finding codes: none
- Reasoning: The methods provide generic string and table formatting capabilities for rendering report components, which aligns directly with the purpose of the existing `logme-report-primitives` package, especially given the context of the file path indicating report rendering.

## src/report-provenance/report-provenance.js

- Classification: existing package
- Target package: logme-report-primitives
- Extracted method names: stableStringify, stringifiesStableValue, stringifiesObjectEntry, formatsCommandLine, formatsCommandLineSegment, trimsProvenanceLine
- Domain call-site guidance: Domain code should utilize methods from 'logme-report-primitives' for stable stringification of values and objects, and for consistent formatting of command line and provenance line segments within reports.
- Finding codes: none
- Reasoning: These methods represent generic string and line formatting utilities, including stable serialization, which are fundamental primitives for generating consistent and well-structured report outputs. This aligns directly with the established purpose of the 'logme-report-primitives' package.

## src/report-truth/report-truth.js

- Classification: new package
- Target package: logme-markdown-table-primitives
- Extracted method names: readsMarkdownMethodTable, isMarkdownTableRow, isMarkdownHeaderRow, isMarkdownSeparatorRow, splitsMarkdownTableRow, validatesSummaryToRowConsistency
- Domain call-site guidance: Domain call sites consuming or manipulating markdown tables should be refactored to use the methods from the new 'logme-markdown-table-primitives' package. For example, a call like 'readsMarkdownMethodTable(...)' would become 'MarkdownTablePrimitives.readsMarkdownMethodTable(...)'.
- Finding codes: none
- Reasoning: The methods grouped under 'table formatting' provide generic functionality for parsing, identifying, and validating elements within Markdown tables. This is a highly reusable capability that is not specific to 'report-truth' and does not fit any of the existing package definitions. Therefore, a new package, 'logme-markdown-table-primitives', is proposed to encapsulate these generic markdown table utilities.

## src/runs-generated-harness/runs-generated-harness.js

- Classification: new package
- Target package: logme-temporal-primitives
- Extracted method names: detectsTimeout
- Domain call-site guidance: This call determines if the operation has exceeded its allowed duration by comparing a start timestamp against the current time plus the specified duration.
- Finding codes: none
- Reasoning: The 'timestamp arithmetic' mechanic, exemplified by 'detectsTimeout', is a generic, reusable utility for handling time-related calculations and timeout detection. It does not fit logically into any of the existing specialized 'logme-*-primitives' packages. A new package, 'logme-temporal-primitives', provides a clear and cohesive home for this functionality, enhancing modularity and reusability.

## src/runs-report-truth-gate/runs-report-truth-gate.js

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
- Domain call-site guidance: Domain call sites should now import and use functions from logme-string-primitives for string collection and formatting.
- Finding codes: none
- Reasoning: The methods collectsStringValues and collectsAllDraftStrings represent a generic and reusable string collection and formatting mechanic. This functionality does not fit within any existing specific logme-* primitive packages and warrants a new utility package for string operations.

## src/validates-report-contract/validates-report-contract.js

- Classification: retained domain body
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: The `loadsReportSchema` method should remain within the `validates-report-contract` domain body, as its function is specific to loading the report schema for contract validation.
- Finding codes: none
- Reasoning: The method `loadsReportSchema` is highly specific to the domain of validating report contracts within `src/validates-report-contract/validates-report-contract.js`. It does not represent a generic 'schema-agnostic JSON writing' utility, as its name explicitly references 'ReportSchema', indicating domain-specificity rather than a generic JSON utility. Its function is directly tied to the current domain logic of loading a specific report schema for validation, making its extraction to a shared package inappropriate.

## src/validates-report-layout-contract/validates-report-layout-contract.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction

## src/verifies-generated-harness/verifies-generated-harness.js

- Classification: new package
- Target package: logme-string-utilities
- Extracted method names: collectsStringValues
- Domain call-site guidance: This method, previously for collecting string values, is now available as part of a new string utility package. Replace direct calls with logmeStringUtilities.collectsStringValues().
- Finding codes: none
- Reasoning: The 'collectsStringValues' method represents a generic string formatting/collection utility that is reusable across different domains. It does not fit within any of the existing logme-specific primitive packages. A new package, 'logme-string-utilities', is proposed to house such common string manipulation functions.

## src/writes-domain-body-analysis-evidence/writes-domain-body-analysis-evidence.js

- Classification: new package
- Target package: logme-markdown-formatting-primitives
- Extracted method names: formatsMarkdownCell
- Domain call-site guidance: Call the new package's primary markdown formatting method, for example, markdownFormatter.formatCell(...)
- Finding codes: none
- Reasoning: The method 'formatsMarkdownCell' provides a generic utility for formatting markdown cells. It is reusable across various contexts within the 'logme' ecosystem but does not align with the specialized focus of any of the existing primitive packages (e.g., config, LLM provider, method inventory, report, source body, testimony core). Therefore, a new package specifically for markdown formatting primitives is proposed to properly encapsulate this reusable mechanic.

## src/writes-domain-body-sprawl-evidence/writes-domain-body-sprawl-evidence.js

- Classification: new package
- Target package: logme-markdown-formatting-primitives
- Extracted method names: formatsMarkdownCell
- Domain call-site guidance: Call markdownFormatting.formatCell(value)
- Finding codes: none
- Reasoning: The formatsMarkdownCell method provides generic string formatting specifically for markdown table cells, which is a reusable utility not fitting into any existing package and can be broadly applied where markdown cell formatting is needed.

## src/writes-harness-receipt/writes-harness-receipt.js

- Classification: rejected extraction
- Target package: n/a
- Extracted method names: none
- Domain call-site guidance: n/a
- Finding codes: package-extraction-ungrounded
- Reasoning: no generic mechanic candidate for this file cites a real method name; the sprawl pattern match is unsupported and cannot justify an extraction
