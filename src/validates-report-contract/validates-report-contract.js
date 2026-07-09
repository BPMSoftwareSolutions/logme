const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { readsJsonConfigFile } = require('../../packages/logme-config-primitives/src/reads-json-config-file');

function resolvesDottedPath(contract, dottedPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const segments = dottedPath.split('.');
  let value = contract;

  for (const segment of segments) {
    if (value === null || value === undefined) {
      return undefined;
    }

    value = value[segment];
  }

  return value;
}

function validatesReportContract(reportSchema, contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const requiredFields = reportSchema && Array.isArray(reportSchema.requiredFields)
    ? reportSchema.requiredFields
    : [];

  if (requiredFields.length === 0) {
    return {
      isValid: false,
      findings: [
        {
          code: 'report-schema-empty',
          reason: 'the report schema declares no required fields, so report content cannot be validated before rendering',
        },
      ],
    };
  }

  function isFieldUnbound(field) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return resolvesDottedPath(contract, field) === undefined;
  }

  const unboundFields = requiredFields.filter(isFieldUnbound);

  function buildsUnboundFieldFinding(field) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return {
      code: 'report-contract-not-enforced',
      reason: `required report field "${field}" is missing from the built report contract`,
    };
  }

  return {
    isValid: unboundFields.length === 0,
    findings: unboundFields.map(buildsUnboundFieldFinding),
  };
}

function loadsReportSchema(schemaPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return readsJsonConfigFile(schemaPath);
}

module.exports = { validatesReportContract, resolvesDottedPath, loadsReportSchema };
