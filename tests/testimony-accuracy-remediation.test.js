const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { buildsFeatureExecutionProof } = require('../src/feature-execution-proof/feature-execution-proof');
const { buildsFeatureProofBody } = require('../src/promotes-feature-execution-proof/promotes-feature-execution-proof');
const {
  CLASSIFICATIONS,
  buildsClassificationProposal,
  buildsCompactGeminiHandoff,
  buildsPackageExtractionProposal,
  buildsPackageAuditReceipt,
  buildsPatchProposal,
  buildsProductOwnerReview,
  buildsProviderUsage,
  buildsSourceDomainPackageSummary,
  buildsSterilizationPlan,
  buildsSterilizationReceipt,
  buildsTestimonyVerificationReport,
  calculatesSterilizationContamination,
  calculatesTestimonyScanEfficiency,
  callsGeminiTestimonyClassifier,
  plansTestimonyAccuracyBacklog,
  plansTestimonyAuditScope,
  projectsTestimonyRemediationStatus,
  regeneratesSourceTruthArtifacts,
  runsSterilizationGate,
  checksExternalizedPackageProof,
  runsTestimonyClassificationWorker,
  writesTestimonyPlanningArtifacts,
  writesPackageAuditReceipt,
} = require('../src/testimony-accuracy-remediation/testimony-accuracy-remediation');

function seedsSource(rootDir) {
  const sourcePath = path.join(rootDir, 'src', 'runs-order', 'runs-order.js');
  fs.mkdirSync(path.dirname(sourcePath), { recursive: true });
  fs.writeFileSync(sourcePath, [
    'function runsOrder() {',
    '  LogMe(sampleMethod);',
    '  return formatsCurrency(100);',
    '}',
  ].join('\n'), 'utf8');
}

function buildsNoisyProof() {
  return {
    schemaVersion: 'feature-execution.contract.v1',
    runId: 'run-noisy',
    featureId: 'orders',
    scenarioId: 'places-an-order',
    scenarioName: 'Places an order',
    telemetrySourcePaths: ['evidence/runs/run-noisy/telemetry.events.v1.jsonl'],
    declaredExecutableBody: [{
      nodeId: '01',
      nodeLabel: 'RUNS ORDER',
      runtimePath: 'src/runs-order/runs-order.js',
      sourceLineRange: { start: 1, end: 4 },
    }],
    observedExecutionTimeline: [{
      nodeId: '01',
      nodeLabel: 'RUNS ORDER',
      methodCalls: [
        { methodName: 'not observed', methodKind: 'not observed', runtimePath: 'src/runs-order/runs-order.js', sourceLineRange: { start: 1, end: 4 } },
        { methodName: 'sampleMethod', methodKind: 'function', runtimePath: 'src/runs-order/runs-order.js', sourceLineRange: { start: 2, end: 2 } },
      ],
    }],
  };
}

function buildsWorkerClassification(overrides = {}) {
  return {
    sourcePath: 'src/runs-order/runs-order.js',
    sourceLineRange: { start: 1, end: 4 },
    currentMethodName: 'sampleMethod',
    observedTelemetryName: 'sampleMethod',
    inferredIntendedMethodName: 'runsOrder',
    auditBoundary: 'product-domain-native',
    reason: 'the source slice shows the product method that owns the testimony call',
    evidenceCitations: ['src/runs-order/runs-order.js:1-4'],
    confidence: 0.99,
    recommendedRemediationAction: 'replace LogMe(sampleMethod) with LogMe(runsOrder)',
    ...overrides,
  };
}

test('plans a testimony backlog and compact bounded Gemini handoff from noisy proof', () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-testimony-'));
  try {
    seedsSource(rootDir);
    const proof = buildsNoisyProof();
    const proofPath = 'evidence/runs/run-noisy/features/orders/scenarios/places-an-order/feature-execution.contract.v1.json';
    const backlog = plansTestimonyAccuracyBacklog({ rootDir }, 'run-noisy', { proofEntries: [{ proofPath, proof }] });
    const item = backlog.backlogItems[0];

    assert.equal(backlog.executorPolicy.preferredProvider, 'gemini');
    assert.equal(item.packetId, 'orders--places-an-order');
    assert.equal(item.unnamedMethodCallCount, 1);
    assert.equal(item.repeatedSampleMethodEventCount, 1);
    assert.equal(item.defaultExecutor, 'gemini-worker-packet');
    assert.deepEqual(item.blockedMutationPaths, ['evidence/runs/run-noisy/', 'docs/feature-proofs/']);

    const handoff = buildsCompactGeminiHandoff({ rootDir }, item, proof);
    assert.equal(handoff.compactnessPolicy.entireRunFoldersIncluded, false);
    assert.equal(handoff.affectedSourceSlices.length, 1);
    assert.match(handoff.affectedSourceSlices[0].content, /LogMe\(sampleMethod\)/u);
    assert.deepEqual(handoff.requiredOutputSchema.properties.classifications.items.properties.auditBoundary.enum, CLASSIFICATIONS);
    assert.equal(JSON.stringify(handoff).includes('full historical archives'), false);
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true });
  }
});

test('writes backlog and one handoff artifact without mutating frozen run evidence', () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-testimony-'));
  try {
    seedsSource(rootDir);
    const proof = buildsNoisyProof();
    const proofPath = 'evidence/runs/run-noisy/features/orders/scenarios/places-an-order/feature-execution.contract.v1.json';
    const absoluteProofPath = path.join(rootDir, proofPath);
    fs.mkdirSync(path.dirname(absoluteProofPath), { recursive: true });
    fs.writeFileSync(absoluteProofPath, JSON.stringify(proof), 'utf8');
    const frozenProof = fs.readFileSync(absoluteProofPath, 'utf8');
    const backlog = plansTestimonyAccuracyBacklog({ rootDir }, 'run-noisy', { proofEntries: [{ proofPath, proof }] });
    const result = writesTestimonyPlanningArtifacts({ rootDir }, backlog, new Map([[proofPath, proof]]));

    assert.equal(result.writtenPaths.length, 2);
    assert.ok(result.writtenPaths.every((writtenPath) => writtenPath.includes(path.join('quality', 'domain-remediation'))));
    assert.equal(fs.readFileSync(absoluteProofPath, 'utf8'), frozenProof);
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true });
  }
});

test('accepts structured Gemini classifications and builds review, extraction, usage, and accepted patch proposals', () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-testimony-'));
  try {
    seedsSource(rootDir);
    const proof = buildsNoisyProof();
    const backlog = plansTestimonyAccuracyBacklog({ rootDir }, 'run-noisy', { proofEntries: [{ proofPath: 'proof.json', proof }] });
    const handoff = buildsCompactGeminiHandoff({ rootDir }, backlog.backlogItems[0], proof);
    const classifications = [
      buildsWorkerClassification(),
      buildsWorkerClassification({ auditBoundary: 'pure-utility-extract', inferredIntendedMethodName: 'formatsCurrency', currentMethodName: 'formatsCurrency' }),
      buildsWorkerClassification({ auditBoundary: 'product-domain-boundary-case', inferredIntendedMethodName: 'normalizesOrder', currentMethodName: 'normalizesOrder' }),
    ];
    const workerResult = {
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      rawResponseText: JSON.stringify({ classifications }),
      usage: { totalTokenCount: 321 },
      retryCount: 0,
      fallbackReason: null,
      callFailure: null,
    };
    const proposal = buildsClassificationProposal(handoff, workerResult);
    const extraction = buildsPackageExtractionProposal('run-noisy', proposal);
    const reviewRows = buildsProductOwnerReview(proposal);
    const usage = buildsProviderUsage('run-noisy', handoff, workerResult, { promptArtifactPath: 'prompt.json', responseArtifactPath: 'response.json' });

    assert.equal(proposal.implementationFilesMutated, false);
    assert.equal(extraction.extractionCandidates.length, 1);
    assert.equal(reviewRows.length, 1);
    assert.equal(reviewRows[0].reviewerDecisionNeeded, true);
    assert.equal(usage.tokenEstimate, 321);
    assert.throws(() => buildsPatchProposal('run-noisy', backlog.backlogItems[0], proposal, { adversarialReviewVerdict: 'PASS', productOwnerAccepted: false }), /product-owner acceptance/u);

    const patchProposal = buildsPatchProposal('run-noisy', backlog.backlogItems[0], proposal, {
      adversarialReviewVerdict: 'PASS',
      productOwnerAccepted: true,
      boundaryCaseDecisions: { normalizesOrder: 'retain native' },
    });
    assert.equal(patchProposal.historicalEvidenceMutationAllowed, false);
    assert.deepEqual(patchProposal.expectedAfterMetrics, { unnamedProductMethodCalls: 0, sampleMethodTelemetryEvents: 0 });
    assert.equal(patchProposal.testimonyReplacements[0].to, 'LogMe(runsOrder)');
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true });
  }
});

test('Gemini classifier sends JSON-schema constrained input and records provider identity', async () => {
  let requestBody;
  const result = await callsGeminiTestimonyClassifier({ packetId: 'packet-1' }, {
    apiKey: 'test-key',
    fetchImpl: async (_url, request) => {
      requestBody = JSON.parse(request.body);
      return {
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: '{"classifications":[]}' }] } }],
          usageMetadata: { totalTokenCount: 12 },
        }),
      };
    },
  });
  assert.equal(requestBody.generationConfig.responseMimeType, 'application/json');
  assert.equal(result.provider, 'gemini');
  assert.equal(result.model, 'gemini-2.5-flash');
  assert.equal(result.callFailure, null);
});

test('classification worker persists prompt, response, proposal, and provider usage artifacts', async () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-testimony-'));
  try {
    seedsSource(rootDir);
    const proof = buildsNoisyProof();
    const backlog = plansTestimonyAccuracyBacklog({ rootDir }, 'run-noisy', { proofEntries: [{ proofPath: 'proof.json', proof }] });
    const result = await runsTestimonyClassificationWorker({ rootDir }, 'run-noisy', backlog.backlogItems[0], proof, {
      apiKey: 'test-key',
      fetchImpl: async () => ({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: JSON.stringify({ classifications: [buildsWorkerClassification()] }) }] } }],
          usageMetadata: { totalTokenCount: 42 },
        }),
      }),
    });
    assert.equal(result.proposal.classifications.length, 1);
    assert.equal(result.usage.provider, 'gemini');
    assert.equal(result.usage.tokenEstimate, 42);
    assert.ok([result.handoffPath, result.responsePath, result.proposalPath, result.usagePath].every((artifactPath) => fs.existsSync(path.join(rootDir, artifactPath))));
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true });
  }
});

test('proof gate blocks unnamed native calls and incomplete executable body source ranges', () => {
  const proof = buildsFeatureExecutionProof({
    runId: 'run-1',
    featureId: 'orders',
    scenarioId: 'places-order',
    scenarioName: 'Places order',
    runStartedAt: '2026-07-11T12:00:00.000Z',
    receiptWrittenAt: '2026-07-11T12:00:02.000Z',
    acceptanceSource: { path: 'docs/features/orders.feature.md', lineRange: { start: 1, end: 3 } },
    declaredExecutableBody: [{ nodeId: '01', nodeLabel: 'RUNS ORDER', runtimePath: 'src/orders.js', sourceLineRange: { start: 10, end: 20 } }],
    telemetryEvents: [{
      id: 'event-1',
      nodeId: '01',
      methodName: 'not observed',
      methodKind: 'not observed',
      auditBoundary: 'product-domain-native',
      sourceLineRange: { start: 9, end: 22 },
      timestamp: '2026-07-11T12:00:01.000Z',
    }],
  });
  assert.equal(proof.promotionDecision.status, 'blocked');
  assert.ok(proof.promotionDecision.blockerCodes.includes('product-method-name-not-observed'));
  assert.ok(proof.promotionDecision.blockerCodes.includes('executable-body-source-range-incomplete'));
  assert.match(proof.promotionDecision.recommendedFixes[0].fix, /Gemini/u);
});

test('proof suppresses telemetry infrastructure and summarizes package calls outside product drill-down', () => {
  const proof = buildsFeatureExecutionProof({
    runId: 'run-1', featureId: 'orders', scenarioId: 'places-order', scenarioName: 'Places order',
    runStartedAt: '2026-07-11T12:00:00.000Z', receiptWrittenAt: '2026-07-11T12:00:03.000Z',
    receiptSourcePaths: ['evidence/runs/run-1/order.receipt.v1.json'],
    declaredExecutableBody: [{ nodeId: '01', nodeLabel: 'RUNS ORDER', runtimePath: 'src/orders.js', sourceLineRange: { start: 1, end: 20 } }],
    telemetryEvents: [
      { id: 'native', nodeId: '01', methodName: 'runsOrder', methodKind: 'function', auditBoundary: 'product-domain-native', receiptPath: 'evidence/runs/run-1/order.receipt.v1.json', timestamp: '2026-07-11T12:00:01.000Z' },
      { id: 'telemetry', nodeId: '01', methodName: 'sampleMethod', methodKind: 'function', auditBoundary: 'telemetry-infrastructure-suppress', telemetryPackagePath: 'packages/logme-testimony-core/', telemetryEventPath: 'telemetry.jsonl', timestamp: '2026-07-11T12:00:02.000Z' },
      { id: 'package', nodeId: '01', methodName: 'formatsCurrency', methodKind: 'function', auditBoundary: 'package-boundary-summarized', packagePath: 'packages/money/', packageName: 'money', packageVersion: '1.2.3', packageAuditReceiptPath: 'quality/package-audits/money.receipt.json', productDomainCallSite: 'src/orders.js:8', allowedBoundaryReason: 'currency formatting is utility behavior', timestamp: '2026-07-11T12:00:03.000Z' },
    ],
  });
  const node = proof.observedExecutionTimeline[0];
  assert.deepEqual(node.methodCalls.map((call) => call.methodName), ['runsOrder']);
  assert.equal(node.telemetryInfrastructureSummary.eventCount, 1);
  assert.deepEqual(node.telemetryInfrastructureSummary.suppressedMethodNames, ['sampleMethod']);
  assert.equal(node.packageBoundarySummaries[0].callCount, 1);
  assert.equal(node.packageBoundarySummaries[0].packageName, 'money');
  assert.equal(node.packageBoundarySummaries[0].packageAuditReceiptPath, 'quality/package-audits/money.receipt.json');
  assert.equal(node.packageBoundarySummaries[0].packageInternalMethodsExpanded, false);
  assert.equal(proof.promotionDecision.status, 'proven');
});

test('feature proof publisher independently rejects a forged proven status with unnamed native methods', () => {
  const body = buildsFeatureProofBody({
    featureId: 'orders', featureName: 'Orders', sourceFeaturePath: 'docs/features/orders.feature.md', sourceFeatureContent: 'Feature: Orders',
    currentScenarios: [{ scenarioId: 'places-order' }], selectedProofRunId: 'run-1',
    scenarioProofs: [{
      scenarioId: 'places-order', scenarioName: 'Places order', runId: 'run-1',
      proof: {
        promotionDecision: { status: 'proven', blockerCodes: [] },
        observedExecutionTimeline: [{ sourceLineRange: { start: 1, end: 5 }, methodCalls: [{ auditBoundary: 'product-domain-native', methodName: 'not observed', methodKind: 'not observed', sourceLineRange: { start: 1, end: 5 } }] }],
      },
    }],
  });
  assert.equal(body.promotionDecision, 'not proven');
  assert.deepEqual(body.blockerSummary, ['product-method-name-not-observed']);
});

test('verification report compares before and after testimony metrics and blocks residual unnamed native calls', () => {
  const before = buildsNoisyProof();
  const stillNoisy = JSON.parse(JSON.stringify(before));
  const blocked = buildsTestimonyVerificationReport('packet-1', [before], [stillNoisy], { commandResults: [{ exitCode: 0 }] });
  assert.equal(blocked.comparison.unnamedProductMethodCallsBefore, 1);
  assert.equal(blocked.comparison.unnamedProductMethodCallsAfter, 1);
  assert.equal(blocked.promotionDecision, 'BLOCKED');
  assert.equal(blocked.findings[0].code, 'product-method-name-not-observed');

  stillNoisy.observedExecutionTimeline[0].methodCalls[0].methodName = 'runsOrder';
  stillNoisy.observedExecutionTimeline[0].methodCalls[0].methodKind = 'function';
  stillNoisy.observedExecutionTimeline[0].methodCalls[1].auditBoundary = 'telemetry-infrastructure-suppress';
  const passed = buildsTestimonyVerificationReport('packet-1', [before], [stillNoisy], { commandResults: [{ exitCode: 0 }] });
  assert.equal(passed.comparison.unnamedProductMethodCallsAfter, 0);
  assert.equal(passed.promotionDecision, 'PROMOTABLE');
});

test('accepted classifications become exactly one concrete sterilization action each', () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-testimony-'));
  try {
    seedsSource(rootDir);
    const proof = buildsNoisyProof();
    const backlog = plansTestimonyAccuracyBacklog({ rootDir }, 'run-noisy', { proofEntries: [{ proofPath: 'proof.json', proof }] });
    const boundaries = [
      'audit boundary',
      'product-domain-native',
      'product-domain-boundary-case',
      'package-boundary-summarized',
      'pure-utility-extract',
      'telemetry-infrastructure-suppress',
      'generated-evidence-ignore',
      'product-owner-review-required',
    ];
    const classifications = [];
    for (const boundary of boundaries) classifications.push(buildsWorkerClassification({ auditBoundary: boundary }));
    const proposal = { packetId: backlog.backlogItems[0].packetId, classifications };

    assert.throws(() => buildsSterilizationPlan('run-noisy', backlog.backlogItems[0], proposal, {}), /accepted classification/u);
    const plan = buildsSterilizationPlan('run-noisy', backlog.backlogItems[0], proposal, {
      adversarialReviewVerdict: 'PASS',
      productOwnerAccepted: true,
    });
    assert.equal(plan.actions.length, classifications.length);
    assert.equal(plan.reportOnlyFindingsAllowed, false);
    for (const action of plan.actions) {
      assert.equal(typeof action.nextAction, 'string');
      assert.equal(action.mutationPaths.length > 0, true);
      assert.match(action.zeroContaminationAssertion, /all eight/u);
      assert.equal(typeof action.verificationCommand, 'string');
    }
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true });
  }
});

test('report-only testimony analysis remains needs-remediation until an actionable plan is accepted', () => {
  const contaminationItems = [{ contaminationId: 'c-1' }];
  const blocked = projectsTestimonyRemediationStatus(contaminationItems, null);
  assert.equal(blocked.status, 'needs-remediation');
  assert.equal(blocked.findings[0].code, 'testimony-remediation-report-without-action');

  const planned = projectsTestimonyRemediationStatus(contaminationItems, { status: 'accepted', actions: [{ contaminationId: 'c-1' }] });
  assert.equal(planned.status, 'remediation-planned');
  assert.deepEqual(planned.findings, []);
});

test('sterilization gate requires all eight contamination counts to be zero and creates the next packet otherwise', () => {
  const noisyProof = buildsNoisyProof();
  noisyProof.observedExecutionTimeline[0].methodCalls[1].auditBoundary = 'telemetry-infrastructure-suppress';
  const workspaceFindings = [
    { code: 'local-method-without-testimony', filePath: 'src/orders/runs-order.js' },
    { code: 'package-worthy-mechanic-inside-domain-body', filePath: 'src/orders/runs-order.js' },
  ];
  const counts = calculatesSterilizationContamination([noisyProof], workspaceFindings);
  assert.equal(counts.unnamedProductDomainNativeMethodCalls, 1);
  assert.equal(counts.productDomainNativeCallsWithMethodKindNotObserved, 1);
  assert.equal(counts.unclassifiedSilentMethodsInProductDomainBodies, 1);
  assert.equal(counts.pureUtilityMethodsRemainingInsideProductDomainBodies, 1);
  assert.equal(counts.telemetryInfrastructureCallsShownAsProductMethodRows, 1);

  const receipt = buildsSterilizationReceipt('run-noisy', 'packet-1', [noisyProof], workspaceFindings, {
    bodyContractMatches: true,
    affectedFeatureScenariosRegenerated: true,
    evaluatedAt: '2026-07-11T12:00:00.000Z',
  });
  assert.equal(receipt.promotionDecision, 'BLOCKED');
  assert.equal(receipt.packetStatus, 'needs-remediation');
  assert.equal(receipt.nextRemediationPacket.executor, 'gemini-worker-packet');
  assert.equal(receipt.nextRemediationPacket.contaminationItems.length > 0, true);
});

test('sterilization gate writes the sole promotion receipt when the workspace is contamination-free', () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-sterile-'));
  try {
    const sterileProof = {
      promotionDecision: { status: 'proven', blockerCodes: [] },
      observedExecutionTimeline: [{
        sourceLineRange: { start: 1, end: 10 },
        methodCalls: [{ methodName: 'runsOrder', methodKind: 'function', auditBoundary: 'product-domain-native', runtimePath: 'src/orders.js', sourceLineRange: { start: 1, end: 10 } }],
        packageBoundarySummaries: [{ packagePath: 'packages/money/', callCount: 1 }],
        telemetryInfrastructureSummary: { eventCount: 1, suppressedMethodNames: ['sampleMethod'] },
      }],
    };
    const result = runsSterilizationGate({ rootDir }, 'run-sterile', 'packet-1', [sterileProof], [], {
      bodyContractMatches: true,
      affectedFeatureScenariosRegenerated: true,
      evaluatedAt: '2026-07-11T12:00:00.000Z',
    });
    assert.equal(result.receipt.totalContamination, 0);
    assert.equal(result.receipt.promotionDecision, 'PROMOTABLE');
    assert.equal(result.receipt.featureStatus, 'sterilized');
    assert.equal(result.receipt.nextRemediationPacket, null);
    assert.equal(fs.existsSync(result.receiptPath), true);
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true });
  }
});

test('source-truth regeneration requires a passing receipt, cites it, and writes only changed content', () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-source-truth-'));
  try {
    const receipt = {
      promotionDecision: 'PROMOTABLE',
      sterilizationReceiptPath: 'quality/domain-remediation/run-1/testimony-accuracy/packet-1.sterilization-receipt.v1.json',
    };
    const artifacts = [
      { type: 'declared-file-system-body-contract', path: 'contracts/file-system-bodies/body.json', content: { status: 'declared' } },
      { type: 'package-ownership-contract', path: 'contracts/packages/money.json', content: { owner: 'money' } },
      { type: 'feature-execution-proof-json', path: 'evidence/runs/run-new/features/orders/scenarios/place/proof.json', content: { promotionDecision: { status: 'proven' } } },
      { type: 'executable-body-report', path: 'quality/generated/executable-body.report.md', content: '# Body report\n' },
      { type: 'executable-body-tree', path: 'quality/generated/executable-body-tree.ascii.md', content: '# Body tree\n' },
      { type: 'source-controlled-feature-proof-body', path: 'docs/feature-proofs/orders.proof.md', content: '# Orders proof\n' },
      { type: 'feature-status-projection', path: 'docs/features/_feature-status/orders.status.v1.json', content: { status: 'sterilized' } },
    ];
    assert.throws(() => regeneratesSourceTruthArtifacts({ rootDir }, { promotionDecision: 'BLOCKED' }, artifacts), /passing sterilization receipt/u);

    const first = regeneratesSourceTruthArtifacts({ rootDir }, receipt, artifacts);
    assert.equal(first.artifacts.every((artifact) => artifact.changed), true);
    const proofPath = path.join(rootDir, artifacts[2].path);
    assert.equal(JSON.parse(fs.readFileSync(proofPath, 'utf8')).sterilizationReceiptPath, receipt.sterilizationReceiptPath);
    assert.match(fs.readFileSync(path.join(rootDir, artifacts[5].path), 'utf8'), /sterilization receipt/u);

    const second = regeneratesSourceTruthArtifacts({ rootDir }, receipt, artifacts);
    assert.equal(second.artifacts.every((artifact) => !artifact.changed), true);
    assert.equal(second.statusChangedOnlyWhenContentChanged, true);
    assert.equal(second.rawRunEvidenceVersionControlAllowed, false);
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true });
  }
});

test('changed paths select source, owning-package, evidence, documentation, and complete workspace scopes', () => {
  const plan = plansTestimonyAuditScope([
    'src/orders/runs-order.js',
    'packages/money/src/formats-currency.js',
    'quality/generated/report.md',
    'docs/features/orders.feature.md',
  ]);
  assert.deepEqual(plan.selectedAuditScopes, ['documentation-only audit', 'generated-evidence audit', 'package audit', 'source-domain audit']);
  assert.deepEqual(plan.owningPackagePaths, ['packages/money']);
  assert.equal(plan.packageInternalsExpandedBySourceAudit, false);

  const boundaryPlan = plansTestimonyAuditScope(['contracts/packages/money.json']);
  assert.deepEqual(boundaryPlan.selectedAuditScopes, ['complete workspace audit']);
  assert.equal(boundaryPlan.completeWorkspaceReason, 'boundary contract changed');
});

test('package audit receipts are independently provable and reusable as concise source-domain summaries', () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-package-audit-'));
  try {
    const receipt = buildsPackageAuditReceipt('run-1', {
      packageId: 'money', packagePath: 'packages/money', changedFiles: ['packages/money/src/formats-currency.js'],
      packageMethodsAudited: ['formatsCurrency'], packageTestsRun: ['node --test packages/money/tests'],
      packageTestimonyStatus: 'complete', sourceDomainDependents: ['src/orders/runs-order.js'],
    });
    const receiptPath = writesPackageAuditReceipt({ rootDir }, receipt);
    assert.equal(receipt.auditDecision, 'PASS');
    assert.equal(fs.existsSync(receiptPath), true);
    const summary = buildsSourceDomainPackageSummary(receipt, 'src/orders/runs-order.js:8', 'format order total', 'formatting is utility behavior');
    assert.equal(summary.packageName, 'money');
    assert.equal(summary.packageAuditReceiptPath, receipt.receiptPath);
    assert.equal(summary.packageInternalMethodsExpanded, false);
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true });
  }
});

test('externalized packages require current integrity and audit proof without granting mutation authority', () => {
  const blocked = checksExternalizedPackageProof({ packageName: 'money', packageVersion: '1.2.3' });
  assert.equal(blocked.verdict, 'BLOCKED');
  assert.equal(blocked.findingCode, 'external-package-proof-missing-or-stale');

  const dependency = {
    packageName: 'money', packageVersion: '1.2.3', packageIntegrityHash: 'sha256-abc',
    externalPackageAuditReceiptOrReleaseProof: 'https://example.test/money/1.2.3/proof',
    allowedApiSurface: ['formatsCurrency'], sourceDomainDependents: ['orders'],
  };
  assert.equal(checksExternalizedPackageProof(dependency).verdict, 'PASS');

  const proof = buildsFeatureExecutionProof({
    runId: 'run-1', featureId: 'orders', scenarioId: 'places-order', scenarioName: 'Places order',
    declaredExecutableBody: [], externalPackageDependencies: [{ packageName: 'money' }],
  });
  assert.equal(proof.promotionDecision.status, 'blocked');
  assert.ok(proof.promotionDecision.blockerCodes.includes('external-package-proof-missing-or-stale'));
});

test('scan efficiency is proven only by reduced source-domain scope, proof noise, or duration', () => {
  const efficiency = calculatesTestimonyScanEfficiency(
    { sourceDomainFilesScanned: 20, sourceDomainMethodsScanned: 100, sourceDomainScanDurationMs: 500, sourceDomainProofRows: 120 },
    { sourceDomainFilesScanned: 15, sourceDomainMethodsScanned: 80, sourceDomainScanDurationMs: 450, sourceDomainProofRows: 90, skippedPackageInternalUtilityMethods: 20 },
    { packageMethodsScanned: 20, packageAuditFileCount: 5, packageAuditReceiptsReused: 2 },
  );
  assert.equal(efficiency.efficiencyImproved, true);
  assert.deepEqual(efficiency.packageScanCost, { files: 5, methods: 20 });

  const report = buildsTestimonyVerificationReport('packet-1', [], [], {
    commandResults: [{ exitCode: 0 }], requireEfficiencyImprovement: true,
    beforeScanMetrics: { sourceDomainFilesScanned: 10, sourceDomainMethodsScanned: 50, sourceDomainScanDurationMs: 100, sourceDomainProofRows: 50 },
    afterScanMetrics: { sourceDomainFilesScanned: 10, sourceDomainMethodsScanned: 50, sourceDomainScanDurationMs: 100, sourceDomainProofRows: 50 },
  });
  assert.equal(report.promotionDecision, 'BLOCKED');
  assert.equal(report.findings[0].code, 'testimony-scan-efficiency-improvement-not-proven');
});
