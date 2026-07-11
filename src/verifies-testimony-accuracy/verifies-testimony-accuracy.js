const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { calculatesTestimonyScanEfficiency } = require('../calculates-testimony-scan-efficiency/calculates-testimony-scan-efficiency');

const VERIFICATION_SCHEMA_VERSION = 'testimony-accuracy-verification.report.v1';
const NOT_OBSERVED = 'not observed';

function calculatesTestimonyMetrics(proofs) {
  if (process.env.LOGME_AUDIT === '1') LogMe(calculatesTestimonyMetrics);
  const metrics = {
    unnamedProductMethodCalls: 0, sampleMethodTelemetryEvents: 0, packageBoundarySummarizedCalls: 0,
    productDomainNativeCallsWithAccurateNames: 0, proofReportByteSize: 0,
  };
  for (const proof of proofs || []) {
    metrics.proofReportByteSize += Buffer.byteLength(JSON.stringify(proof), 'utf8');
    for (const node of proof.observedExecutionTimeline || []) {
      for (const methodCall of node.methodCalls || []) {
        const boundary = methodCall.auditBoundary || 'product-domain-native';
        if (boundary === 'product-domain-native') {
          if (methodCall.methodName === NOT_OBSERVED || methodCall.methodKind === NOT_OBSERVED) metrics.unnamedProductMethodCalls += 1;
          else metrics.productDomainNativeCallsWithAccurateNames += 1;
        }
        if (methodCall.methodName === 'sampleMethod') metrics.sampleMethodTelemetryEvents += 1;
      }
      for (const summary of node.packageBoundarySummaries || []) metrics.packageBoundarySummarizedCalls += summary.callCount || 0;
      if (node.telemetryInfrastructureSummary && node.telemetryInfrastructureSummary.suppressedMethodNames.includes('sampleMethod')) {
        metrics.sampleMethodTelemetryEvents += node.telemetryInfrastructureSummary.eventCount || 0;
      }
    }
  }
  return metrics;
}

function buildsTestimonyVerificationReport(packetId, beforeProofs, afterProofs, options = {}) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsTestimonyVerificationReport);
  const beforeMetrics = calculatesTestimonyMetrics(beforeProofs);
  const afterMetrics = calculatesTestimonyMetrics(afterProofs);
  const findings = [];
  if (afterMetrics.unnamedProductMethodCalls > 0) findings.push({ code: 'product-method-name-not-observed', recommendedFix: 'create a bounded Gemini testimony remediation packet' });
  for (const proof of afterProofs || []) {
    for (const code of (proof.promotionDecision && proof.promotionDecision.blockerCodes) || []) {
      let alreadyRecorded = false;
      for (const finding of findings) {
        if (finding.code === code) alreadyRecorded = true;
      }
      if (!alreadyRecorded) findings.push({ code, recommendedFix: 'resolve the deterministic proof blocker and rerun the affected feature scenario' });
    }
  }
  let commandsPassed = true;
  for (const result of options.commandResults || []) {
    if (result.exitCode !== 0) commandsPassed = false;
  }
  const scanEfficiency = calculatesTestimonyScanEfficiency(options.beforeScanMetrics, options.afterScanMetrics, options.packageScanMetrics);
  if (options.requireEfficiencyImprovement && !scanEfficiency.efficiencyImproved) {
    findings.push({ code: 'testimony-scan-efficiency-improvement-not-proven', recommendedFix: 'reduce source-domain scan scope, proof rows, or duration and report package scan cost separately' });
  }
  return {
    schemaVersion: VERIFICATION_SCHEMA_VERSION, packetId, verificationCommands: options.verificationCommands || [], commandResults: options.commandResults || [],
    comparison: {
      unnamedProductMethodCallsBefore: beforeMetrics.unnamedProductMethodCalls, unnamedProductMethodCallsAfter: afterMetrics.unnamedProductMethodCalls,
      sampleMethodTelemetryEventsBefore: beforeMetrics.sampleMethodTelemetryEvents, sampleMethodTelemetryEventsAfter: afterMetrics.sampleMethodTelemetryEvents,
      packageBoundarySummarizedCalls: afterMetrics.packageBoundarySummarizedCalls,
      productDomainNativeCallsWithAccurateNames: afterMetrics.productDomainNativeCallsWithAccurateNames,
      sourceDomainAuditFileCountBefore: scanEfficiency.sourceDomainFilesScannedBefore,
      sourceDomainAuditFileCountAfter: scanEfficiency.sourceDomainFilesScannedAfter,
      packageAuditFileCount: scanEfficiency.packageAuditFileCount,
      skippedPackageInternalUtilityMethods: scanEfficiency.skippedPackageInternalUtilityMethods,
      proofReportByteSizeBefore: beforeMetrics.proofReportByteSize, proofReportByteSizeAfter: afterMetrics.proofReportByteSize,
    },
    scanEfficiency,
    findings, promotionDecision: findings.length === 0 && commandsPassed ? 'PROMOTABLE' : 'BLOCKED',
  };
}

module.exports = { VERIFICATION_SCHEMA_VERSION, buildsTestimonyVerificationReport, calculatesTestimonyMetrics };
