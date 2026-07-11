const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');

function readsScanMetric(metrics, metricName) {
  if (process.env.LOGME_AUDIT === '1') LogMe(readsScanMetric);
  return Number(metrics && metrics[metricName]) || 0;
}

function calculatesTestimonyScanEfficiency(beforeMetrics = {}, afterMetrics = {}, packageMetrics = {}) {
  if (process.env.LOGME_AUDIT === '1') LogMe(calculatesTestimonyScanEfficiency);
  const comparison = {
    sourceDomainFilesScannedBefore: readsScanMetric(beforeMetrics, 'sourceDomainFilesScanned'),
    sourceDomainFilesScannedAfter: readsScanMetric(afterMetrics, 'sourceDomainFilesScanned'),
    sourceDomainMethodsScannedBefore: readsScanMetric(beforeMetrics, 'sourceDomainMethodsScanned'),
    sourceDomainMethodsScannedAfter: readsScanMetric(afterMetrics, 'sourceDomainMethodsScanned'),
    packageMethodsScannedSeparately: readsScanMetric(packageMetrics, 'packageMethodsScanned'),
    sourceDomainScanDurationBefore: readsScanMetric(beforeMetrics, 'sourceDomainScanDurationMs'),
    sourceDomainScanDurationAfter: readsScanMetric(afterMetrics, 'sourceDomainScanDurationMs'),
    sourceDomainProofRowsBefore: readsScanMetric(beforeMetrics, 'sourceDomainProofRows'),
    sourceDomainProofRowsAfter: readsScanMetric(afterMetrics, 'sourceDomainProofRows'),
    packageAuditFileCount: readsScanMetric(packageMetrics, 'packageAuditFileCount'),
    skippedPackageInternalUtilityMethods: readsScanMetric(afterMetrics, 'skippedPackageInternalUtilityMethods'),
    packageAuditReceiptsReused: readsScanMetric(packageMetrics, 'packageAuditReceiptsReused'),
  };
  comparison.efficiencyImproved = comparison.sourceDomainFilesScannedAfter < comparison.sourceDomainFilesScannedBefore
    || comparison.sourceDomainMethodsScannedAfter < comparison.sourceDomainMethodsScannedBefore
    || comparison.sourceDomainScanDurationAfter < comparison.sourceDomainScanDurationBefore
    || comparison.sourceDomainProofRowsAfter < comparison.sourceDomainProofRowsBefore;
  comparison.sourceDomainScanCost = { files: comparison.sourceDomainFilesScannedAfter, methods: comparison.sourceDomainMethodsScannedAfter, durationMs: comparison.sourceDomainScanDurationAfter };
  comparison.packageScanCost = { files: comparison.packageAuditFileCount, methods: comparison.packageMethodsScannedSeparately };
  return comparison;
}

module.exports = { calculatesTestimonyScanEfficiency };
