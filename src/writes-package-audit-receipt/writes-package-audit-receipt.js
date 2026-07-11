const crypto = require('node:crypto');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { writesTestimonyJson } = require('../../packages/logme-testimony-remediation-primitives/src/reads-writes-testimony-json');

const PACKAGE_AUDIT_RECEIPT_SCHEMA_VERSION = 'package-audit-receipt.v1';

function calculatesPackageContentHash(packageEvidence) {
  if (process.env.LOGME_AUDIT === '1') LogMe(calculatesPackageContentHash);
  return crypto.createHash('sha256').update(JSON.stringify(packageEvidence)).digest('hex');
}

function buildsPackageAuditReceipt(runId, packageEvidence) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsPackageAuditReceipt);
  const contentHash = packageEvidence.packageContentHash || calculatesPackageContentHash({
    changedFiles: packageEvidence.changedFiles, packageMethodsAudited: packageEvidence.packageMethodsAudited,
    packageTestsRun: packageEvidence.packageTestsRun, packageTestimonyStatus: packageEvidence.packageTestimonyStatus,
  });
  const auditDecision = packageEvidence.packageTestimonyStatus === 'complete'
    && (packageEvidence.packageTestsRun || []).length > 0 ? 'PASS' : 'BLOCKED';
  return {
    schemaVersion: PACKAGE_AUDIT_RECEIPT_SCHEMA_VERSION, sourceRunId: runId, packageId: packageEvidence.packageId,
    packagePath: packageEvidence.packagePath, packageVersionOrContentHash: packageEvidence.packageVersion || contentHash,
    changedFiles: packageEvidence.changedFiles || [], packageMethodsAudited: packageEvidence.packageMethodsAudited || [],
    packageTestsRun: packageEvidence.packageTestsRun || [], packageTestimonyStatus: packageEvidence.packageTestimonyStatus,
    sourceDomainDependents: packageEvidence.sourceDomainDependents || [], auditDecision,
    receiptPath: `quality/domain-remediation/${runId}/package-audits/${packageEvidence.packageId}.package-audit-receipt.v1.json`,
  };
}

function writesPackageAuditReceipt(config, receipt) {
  if (process.env.LOGME_AUDIT === '1') LogMe(writesPackageAuditReceipt);
  return writesTestimonyJson(config.rootDir, receipt.receiptPath, receipt);
}

function buildsSourceDomainPackageSummary(packageReceipt, callSite, operationSummary, boundaryReason) {
  if (process.env.LOGME_AUDIT === '1') LogMe(buildsSourceDomainPackageSummary);
  if (!packageReceipt || packageReceipt.auditDecision !== 'PASS') throw new Error('source-domain package summary requires a passing package audit receipt');
  return {
    packageName: packageReceipt.packageId, packageOperationSummary: operationSummary,
    packageVersionOrLocalPackagePath: packageReceipt.packageVersionOrContentHash || packageReceipt.packagePath,
    packageAuditReceiptPath: packageReceipt.receiptPath, productDomainCallSite: callSite,
    allowedBoundaryReason: boundaryReason, packageInternalMethodsExpanded: false,
  };
}

function checksExternalizedPackageProof(dependency) {
  if (process.env.LOGME_AUDIT === '1') LogMe(checksExternalizedPackageProof);
  const requiredFields = ['packageName', 'packageVersion', 'packageIntegrityHash', 'externalPackageAuditReceiptOrReleaseProof', 'allowedApiSurface', 'sourceDomainDependents'];
  const missingFields = [];
  for (const field of requiredFields) {
    const value = dependency && dependency[field];
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) missingFields.push(field);
  }
  return {
    verdict: missingFields.length === 0 ? 'PASS' : 'BLOCKED', missingFields,
    mutationPolicy: 'source-domain agents must not mutate externalized package internals from this repository',
    findingCode: missingFields.length === 0 ? null : 'external-package-proof-missing-or-stale',
  };
}

function runsPackageTestimonyAudit(config, runId, packageId, packagePath, options = {}) {
  if (process.env.LOGME_AUDIT === '1') LogMe(runsPackageTestimonyAudit);
  const { buildsDomainBodySterilityContract } = require('../builds-domain-body-sterility-contract/builds-domain-body-sterility-contract');
  const packageConfig = { ...config, auditScope: 'package audit', packageAuditPaths: [packagePath] };
  const audit = buildsDomainBodySterilityContract(packageConfig);
  const packageMethodsAudited = [];
  for (const method of audit.methods) packageMethodsAudited.push(method.name);
  const receipt = buildsPackageAuditReceipt(runId, {
    packageId, packagePath, changedFiles: options.changedFiles || audit.sourceFiles,
    packageMethodsAudited, packageTestsRun: options.packageTestsRun || [],
    packageTestimonyStatus: audit.summary.verdict === audit.summary.domainContract.verdicts.sterile ? 'complete' : 'blocked',
    sourceDomainDependents: options.sourceDomainDependents || [],
  });
  const receiptPath = writesPackageAuditReceipt(config, receipt);
  return { audit, receipt, receiptPath };
}

module.exports = {
  PACKAGE_AUDIT_RECEIPT_SCHEMA_VERSION, buildsPackageAuditReceipt, buildsSourceDomainPackageSummary,
  checksExternalizedPackageProof, runsPackageTestimonyAudit, writesPackageAuditReceipt,
};
