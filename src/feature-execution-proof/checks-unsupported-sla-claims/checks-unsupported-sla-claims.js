const { LogMe } = require('../../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../../packages/logme-testimony-core/src/sample-method');

function indexesSloEvaluationsById(evaluations) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const evaluationsById = new Map();

  for (const evaluation of evaluations) {
    evaluationsById.set(evaluation.sloId, evaluation);
  }

  return evaluationsById;
}

function readsSupportingEvaluations(evaluationsById, supportingSloIds) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const supportingEvaluations = [];

  for (const sloId of supportingSloIds) {
    supportingEvaluations.push(evaluationsById.get(sloId));
  }

  return supportingEvaluations;
}

function detectsUnsupportedSupportingEvaluation(supportingEvaluations) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (supportingEvaluations.length === 0) {
    return true;
  }

  for (const evaluation of supportingEvaluations) {
    if (!evaluation || evaluation.status !== 'met') {
      return true;
    }
  }

  return false;
}

function checksUnsupportedSlaClaims(proof, slaClaims = []) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const evaluationsById = indexesSloEvaluationsById(proof.sloEvaluations || []);
  const findings = [];

  for (const claim of slaClaims) {
    const supportingEvaluations = readsSupportingEvaluations(evaluationsById, claim.supportingSloIds || []);
    const hasUnsupportedEvidence = detectsUnsupportedSupportingEvaluation(supportingEvaluations);

    if (hasUnsupportedEvidence) {
      findings.push({
        code: 'sla-claim-without-slo-evidence',
        slaId: claim.slaId,
        reason: 'the SLA claim is not supported by met SLO evidence in the canonical proof',
      });
    }
  }

  return findings;
}

module.exports = { checksUnsupportedSlaClaims };
