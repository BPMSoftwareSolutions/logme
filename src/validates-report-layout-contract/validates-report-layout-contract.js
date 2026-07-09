const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { resolvesDottedPath } = require('../validates-report-contract/validates-report-contract');

const REQUIRED_TRUTH_FIELDS = [
  'verdict',
  'blockerCount',
  'silentLocalMethods',
  'anonymousExecutableMethods',
  'missingTelemetry',
  'missingReceipt',
  'promotionDecision',
  'provenance.sourceInventoryHash',
];

function extractsTemplateVariables(templateValue) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const templateLines = Array.isArray(templateValue) ? templateValue : [templateValue];
  const variablePattern = /\{\{\s*([^}\s]+)\s*\}\}/gu;
  const variables = [];

  for (const line of templateLines) {
    if (typeof line !== 'string') {
      continue;
    }

    let match = variablePattern.exec(line);
    while (match !== null) {
      variables.push(match[1]);
      match = variablePattern.exec(line);
    }
  }

  return variables;
}

function validatesLayoutContractShape(layoutSchema, layoutContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const requiredFields = layoutSchema && Array.isArray(layoutSchema.requiredFields)
    ? layoutSchema.requiredFields
    : [];

  if (requiredFields.length === 0) {
    return [{
      code: 'report-schema-empty',
      reason: 'the report layout schema declares no required fields, so the layout contract cannot be validated',
    }];
  }

  function isLayoutFieldMissing(field) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return resolvesDottedPath(layoutContract, field) === undefined;
  }

  function buildsMissingLayoutFieldFinding(field) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return {
      code: 'report-layout-contract-incomplete',
      reason: `required report layout field "${field}" is missing from the layout contract`,
    };
  }

  return requiredFields.filter(isLayoutFieldMissing).map(buildsMissingLayoutFieldFinding);
}

function validatesTemplateVariablesBound(layoutContract, reportSchema) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const declaredFields = reportSchema && Array.isArray(reportSchema.requiredFields)
    ? reportSchema.requiredFields
    : [];
  const sectionIds = Object.keys(layoutContract.sections || {});

  function findsUnboundVariablesInSection(sectionId) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    const section = layoutContract.sections[sectionId];
    const variables = extractsTemplateVariables(section.template);

    function isVariableUnbound(variable) {
      if (process.env.LOGME_AUDIT === '1') {
        LogMe(sampleMethod);
      }

      return !declaredFields.includes(variable);
    }

    function buildsUnboundVariableFinding(variable) {
      if (process.env.LOGME_AUDIT === '1') {
        LogMe(sampleMethod);
      }

      return {
        code: 'report-template-variable-unbound',
        reason: `template variable "{{${variable}}}" in section "${sectionId}" has no matching field in the report data contract`,
      };
    }

    return variables.filter(isVariableUnbound).map(buildsUnboundVariableFinding);
  }

  return sectionIds.flatMap(findsUnboundVariablesInSection);
}

function validatesTruthFieldsRequired(layoutContract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const requiredDataFields = Array.isArray(layoutContract.requiredDataFields)
    ? layoutContract.requiredDataFields
    : [];

  function isTruthFieldOmitted(truthField) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return !requiredDataFields.includes(truthField);
  }

  function buildsOmittedTruthFieldFinding(truthField) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return {
      code: 'report-layout-truth-field-omitted',
      reason: `the layout contract must declare "${truthField}" in requiredDataFields; a template cannot hide this truth field`,
    };
  }

  return REQUIRED_TRUTH_FIELDS.filter(isTruthFieldOmitted).map(buildsOmittedTruthFieldFinding);
}

function validatesReportLayoutContract(layoutSchema, layoutContract, reportSchema) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const shapeFindings = validatesLayoutContractShape(layoutSchema, layoutContract);

  if (shapeFindings.length > 0) {
    return { isValid: false, findings: shapeFindings };
  }

  const truthFindings = validatesTruthFieldsRequired(layoutContract);
  const variableFindings = validatesTemplateVariablesBound(layoutContract, reportSchema);
  const findings = [...truthFindings, ...variableFindings];

  return { isValid: findings.length === 0, findings };
}

module.exports = {
  REQUIRED_TRUTH_FIELDS,
  extractsTemplateVariables,
  validatesReportLayoutContract,
};
