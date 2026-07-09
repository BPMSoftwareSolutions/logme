const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const TELEMETRY_STEP_PATTERN = /TELEMETRY-STEP: (.+)$/u;
const SELF_PROMOTION_PATTERN = /\bpromoted\b|self-conformance-proven|\bapproved\b|promotion\s*:\s*true/iu;

function extractsObservedTelemetrySteps(stdout) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const observedSteps = [];

  for (const line of stdout.split('\n')) {
    const match = TELEMETRY_STEP_PATTERN.exec(line.trim());
    if (match) {
      observedSteps.push(match[1]);
    }
  }

  return observedSteps;
}

function readsDeclaredExecutionSteps(harnessDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const executionPathFile = path.join(harnessDir, 'execution-path.json');

  if (!fs.existsSync(executionPathFile)) {
    return [];
  }

  try {
    const executionPathContent = JSON.parse(fs.readFileSync(executionPathFile, 'utf8'));
    return Array.isArray(executionPathContent.steps) ? executionPathContent.steps : [];
  } catch {
    return [];
  }
}

function areStepListsEqual(declaredSteps, observedSteps) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (declaredSteps.length !== observedSteps.length) {
    return false;
  }

  function stepsMatchAtIndex(declaredStep, index) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return declaredStep === observedSteps[index];
  }

  return declaredSteps.every(stepsMatchAtIndex);
}

function tiesOutDeclaredTelemetry(materializationResult, runResult) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const harnessDir = path.dirname(materializationResult.entryFilePath);
  const declaredSteps = readsDeclaredExecutionSteps(harnessDir);
  const observedSteps = extractsObservedTelemetrySteps(runResult.stdout);

  return {
    expected: declaredSteps,
    observed: observedSteps,
    matches: areStepListsEqual(declaredSteps, observedSteps),
  };
}

function collectsStringValues(value, collected) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (typeof value === 'string') {
    collected.push(value);
    return collected;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectsStringValues(item, collected);
    }
    return collected;
  }

  if (value !== null && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      collectsStringValues(value[key], collected);
    }
  }

  return collected;
}

function readsDeclaredReceiptPaths(harnessDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const receiptCoverageFile = path.join(harnessDir, 'receipt-coverage.json');

  if (!fs.existsSync(receiptCoverageFile)) {
    return [];
  }

  let receiptCoverageContent;

  try {
    receiptCoverageContent = JSON.parse(fs.readFileSync(receiptCoverageFile, 'utf8'));
  } catch {
    return [];
  }

  const allStrings = collectsStringValues(receiptCoverageContent, []);

  function looksLikeReceiptPath(candidate) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return candidate.endsWith('.json') || candidate.endsWith('.jsonl');
  }

  return allStrings.filter(looksLikeReceiptPath);
}

function resolvesLeaseRoot(materializationResult) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const harnessDir = path.dirname(materializationResult.entryFilePath);
  return path.dirname(harnessDir);
}

function tiesOutDeclaredReceiptCoverage(materializationResult) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const harnessDir = path.dirname(materializationResult.entryFilePath);
  const leaseRoot = resolvesLeaseRoot(materializationResult);
  const declaredReceiptPaths = readsDeclaredReceiptPaths(harnessDir);

  function receiptExistsOnDisk(declaredPath) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    const baseName = path.basename(declaredPath);
    return fs.existsSync(path.resolve(harnessDir, baseName)) || fs.existsSync(path.resolve(leaseRoot, declaredPath));
  }

  const observedReceiptPaths = declaredReceiptPaths.filter(receiptExistsOnDisk);

  return {
    expected: declaredReceiptPaths,
    observed: observedReceiptPaths,
    matches: observedReceiptPaths.length === declaredReceiptPaths.length,
  };
}

function detectsSelfPromotionAttempt(runResult) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return SELF_PROMOTION_PATTERN.test(runResult.stdout) || SELF_PROMOTION_PATTERN.test(runResult.stderr);
}

function buildsFinding(code, filePath, reason) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return { code, filePath, methodName: '', reason };
}

function collectsRequiredFindings(materializationResult, runResult, telemetryTieOut, receiptTieOut, selfPromotionAttempted) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const findings = [];

  if (!telemetryTieOut.matches) {
    findings.push(buildsFinding(
      'llm-claimed-verification-without-telemetry',
      materializationResult.entryFilePath,
      'declared telemetry requirements do not match what the harness actually emitted',
    ));
  }

  if (!receiptTieOut.matches) {
    findings.push(buildsFinding(
      'llm-invented-receipt',
      materializationResult.entryFilePath,
      'declared receipt coverage does not match what the harness actually wrote to disk',
    ));
  }

  if (selfPromotionAttempted) {
    findings.push(buildsFinding(
      'llm-promoted-itself',
      materializationResult.entryFilePath,
      'the harness run emitted a self-promotion or self-conformance-proven claim; only the verifier may promote',
    ));
  }

  if (runResult.exitCode !== 0 || runResult.timedOut) {
    findings.push(buildsFinding(
      'generated-harness-missing-testimony',
      materializationResult.entryFilePath,
      'the harness did not complete its declared execution path (non-zero exit or timeout)',
    ));
  }

  return findings;
}

function verifiesGeneratedHarness(materializationResult, runResult, parsedOutput) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const telemetryTieOut = tiesOutDeclaredTelemetry(materializationResult, runResult);
  const receiptTieOut = tiesOutDeclaredReceiptCoverage(materializationResult);
  const selfPromotionAttempted = detectsSelfPromotionAttempt(runResult);

  const requiredFindingsMustBeZero = collectsRequiredFindings(
    materializationResult,
    runResult,
    telemetryTieOut,
    receiptTieOut,
    selfPromotionAttempted,
  );

  const decision = requiredFindingsMustBeZero.length === 0 ? 'PROMOTED' : 'BLOCKED';

  function extractsFindingCode(finding) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return finding.code;
  }

  return {
    schemaVersion: 'harness-promotion-decision.schema.v1',
    harnessId: materializationResult.harnessId,
    runId: parsedOutput.runId,
    decision,
    reason: decision === 'PROMOTED'
      ? 'telemetry and receipt coverage independently tied out; no self-promotion claim detected'
      : requiredFindingsMustBeZero.map(extractsFindingCode).join(', '),
    requiredFindingsMustBeZero,
    telemetryTieOut,
    receiptTieOut,
    selfPromotionAttempted,
  };
}

module.exports = { verifiesGeneratedHarness };
