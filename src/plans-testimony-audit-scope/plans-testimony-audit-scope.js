const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { normalizesTestimonyPath } = require('../../packages/logme-testimony-remediation-primitives/src/normalizes-testimony-path');
const { collectsUniqueTestimonyValues } = require('../../packages/logme-testimony-remediation-primitives/src/collects-unique-testimony-values');

const AUDIT_SCOPES = Object.freeze([
  'source-domain audit', 'package audit', 'generated-evidence audit', 'documentation-only audit', 'complete workspace audit',
]);

function classifiesChangedPathForAudit(changedPath) {
  if (process.env.LOGME_AUDIT === '1') LogMe(classifiesChangedPathForAudit);
  const normalizedPath = normalizesTestimonyPath(changedPath);
  if (normalizedPath.startsWith('src/')) return { changedPath: normalizedPath, auditScope: 'source-domain audit' };
  if (normalizedPath.startsWith('packages/')) {
    const parts = normalizedPath.split('/');
    return { changedPath: normalizedPath, auditScope: 'package audit', owningPackagePath: parts.slice(0, 2).join('/') };
  }
  if (normalizedPath.startsWith('evidence/') || normalizedPath.startsWith('quality/')) return { changedPath: normalizedPath, auditScope: 'generated-evidence audit' };
  if (normalizedPath.startsWith('docs/')) return { changedPath: normalizedPath, auditScope: 'documentation-only audit' };
  if (normalizedPath.startsWith('contracts/file-system-bodies/') || normalizedPath.startsWith('contracts/packages/')) {
    return { changedPath: normalizedPath, auditScope: 'complete workspace audit', boundaryContractChange: true };
  }
  return { changedPath: normalizedPath, auditScope: 'complete workspace audit', unclassifiedWorkspacePath: true };
}

function plansTestimonyAuditScope(changedPaths, options = {}) {
  if (process.env.LOGME_AUDIT === '1') LogMe(plansTestimonyAuditScope);
  const pathClassifications = [];
  const selectedScopes = [];
  const owningPackagePaths = [];
  let boundaryContractChanged = false;
  for (const changedPath of changedPaths || []) {
    const classification = classifiesChangedPathForAudit(changedPath);
    pathClassifications.push(classification);
    selectedScopes.push(classification.auditScope);
    if (classification.owningPackagePath) owningPackagePaths.push(classification.owningPackagePath);
    if (classification.boundaryContractChange) boundaryContractChanged = true;
  }
  if (options.completeWorkspaceRequested || options.scheduledCompleteWorkspaceAudit || boundaryContractChanged) selectedScopes.push('complete workspace audit');
  return {
    pathClassifications,
    selectedAuditScopes: collectsUniqueTestimonyValues(selectedScopes),
    owningPackagePaths: collectsUniqueTestimonyValues(owningPackagePaths),
    sourceDomainRoots: ['src/'],
    packageInternalsExpandedBySourceAudit: false,
    completeWorkspaceReason: options.completeWorkspaceRequested ? 'explicitly requested'
      : (options.scheduledCompleteWorkspaceAudit ? 'scheduled' : (boundaryContractChanged ? 'boundary contract changed' : null)),
  };
}

module.exports = { AUDIT_SCOPES, classifiesChangedPathForAudit, plansTestimonyAuditScope };
