const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { discoversFeatureScenarios } = require('../feature-execution-proof/discovers-feature-and-scenario-metadata/discovers-feature-and-scenario-metadata');
const { sha256Hex } = require('../promotes-feature-execution-proof/promotes-feature-execution-proof');
const { buildsFeatureProofBodyPath } = require('../runs-feature-proof-promotion/runs-feature-proof-promotion');

const MISSING_PROOF_BODY_FINDING = 'feature-status-without-source-controlled-proof-body';
const STALE_PROOF_BODY_FINDING = 'source-controlled-feature-proof-stale';
const MISSING_SCENARIO_FINDING = 'source-controlled-feature-proof-missing-scenario';
const OPT_OUT_REASON = 'source-controlled-feature-proof-current';

function readsProofBodyHashFromContent(content) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const match = content.match(/<!-- proof body hash: ([0-9a-f]+) -->/u);
  return match ? match[1] : undefined;
}

function checksFeatureStatusClaimsProofBody(rootDir, featureId, claimedStatus) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!['proven', 'qa-passed', 'promoted'].includes(claimedStatus)) {
    return { verdict: 'PASS', findings: [] };
  }

  const proofBodyPath = buildsFeatureProofBodyPath(rootDir, featureId);

  if (!fs.existsSync(proofBodyPath)) {
    return {
      verdict: 'BLOCKED',
      findings: [
        {
          code: MISSING_PROOF_BODY_FINDING,
          reason: `feature status claims "${claimedStatus}" but no committed proof body exists at docs/feature-proofs/${featureId}.proof.md`,
        },
      ],
    };
  }

  const content = fs.readFileSync(proofBodyPath, 'utf8');

  if (!/selected proof run id:\s*\S+/u.test(content) || !readsProofBodyHashFromContent(content)) {
    return {
      verdict: 'BLOCKED',
      findings: [
        {
          code: MISSING_PROOF_BODY_FINDING,
          reason: `proof body at docs/feature-proofs/${featureId}.proof.md is missing the selected proof run id or artifact hashes`,
        },
      ],
    };
  }

  return { verdict: 'PASS', findings: [] };
}

function checksFeatureProofBodyFreshness(rootDir, featureId) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const proofBodyPath = buildsFeatureProofBodyPath(rootDir, featureId);

  if (!fs.existsSync(proofBodyPath)) {
    return { status: 'not present', findings: [] };
  }

  const content = fs.readFileSync(proofBodyPath, 'utf8');
  const recordedHash = readsProofBodyHashFromContent(content);

  const featureFilePath = path.join(rootDir, 'docs', 'features', `${featureId}.feature.md`);
  const sourceFeatureContent = fs.readFileSync(featureFilePath, 'utf8');
  const currentSourceFeatureHash = sha256Hex(sourceFeatureContent);
  const feature = discoversFeatureScenarios(featureFilePath);

  const sourceHashMatch = content.includes(currentSourceFeatureHash);
  const missingScenarios = findsScenariosMissingFromBody(content, feature.scenarios);

  if (missingScenarios.length > 0) {
    return {
      status: 'stale',
      findings: [
        {
          code: MISSING_SCENARIO_FINDING,
          reason: `current scenarios missing from proof body: ${missingScenarios.join(', ')}`,
        },
      ],
    };
  }

  if (!sourceHashMatch) {
    return {
      status: 'stale',
      findings: [
        {
          code: STALE_PROOF_BODY_FINDING,
          reason: 'the feature source document hash no longer matches the hash recorded in the committed proof body',
        },
      ],
    };
  }

  return {
    status: 'current',
    findings: [],
    recordedHash,
  };
}

function findsScenariosMissingFromBody(proofBodyContent, currentScenarios) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const missingScenarios = [];

  for (const scenario of currentScenarios) {
    if (!proofBodyContent.includes(`scenario id: ${scenario.scenarioId}`)) {
      missingScenarios.push(scenario.scenarioId);
    }
  }

  return missingScenarios;
}

function checksFeatureProofOptOut(rootDir, featureId, invalidationConditions = []) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (invalidationConditions.length > 0) {
    return {
      optedOut: false,
      reason: 'proof invalidation condition detected',
      invalidationConditions,
    };
  }

  const freshness = checksFeatureProofBodyFreshness(rootDir, featureId);

  if (freshness.status !== 'current') {
    return {
      optedOut: false,
      reason: freshness.status === 'not present' ? 'no proof body exists' : 'proof body is stale',
      findings: freshness.findings,
    };
  }

  return {
    optedOut: true,
    optOutReason: OPT_OUT_REASON,
    proofBodyPath: buildsFeatureProofBodyPath(rootDir, featureId),
    proofBodyHash: freshness.recordedHash,
  };
}

module.exports = {
  MISSING_PROOF_BODY_FINDING,
  MISSING_SCENARIO_FINDING,
  OPT_OUT_REASON,
  STALE_PROOF_BODY_FINDING,
  checksFeatureProofBodyFreshness,
  checksFeatureProofOptOut,
  checksFeatureStatusClaimsProofBody,
  readsProofBodyHashFromContent,
};
