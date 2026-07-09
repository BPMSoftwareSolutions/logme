// Parses the product-owned execution-sketch template into a declarative row list.
const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

function parsesTemplateLine(line) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const separatorIndex = line.indexOf(':');
  if (separatorIndex === -1) {
    return null;
  }

  const directive = line.slice(0, separatorIndex).trim();
  const value = line.slice(separatorIndex + 1).trim();
  return { directive, value };
}

function parsesExecutionSketchTemplate(templateText) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const template = {
    boxTitle: 'REPORT TRUTH',
    boxRows: [],
    routeSterile: '',
    routeSterileStatus: '',
    routeBlocked: '',
    routeBlockedStatus: '',
    treeHeaderTitle: 'EXECUTABLE BODY CONTRACT - FILE-SYSTEM EXECUTION TREE',
    treeHeaderRows: [],
    missingTreeLabel: 'EXECUTABLE BODY TREE: missing',
    diagnosticFallbackLabel: 'DIAGNOSTIC FALLBACK - NOT PROMOTION EVIDENCE',
    worklistBoxTitle: 'TOP BLOCKERS',
    worklistEmptyLabel: 'No blockers',
    worklistRowTemplates: [],
  };

  const lines = templateText.split('\n');

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    const parsed = parsesTemplateLine(line);
    if (!parsed) {
      continue;
    }

    appliesTemplateDirective(template, parsed.directive, parsed.value);
  }

  return template;
}

function appliesTemplateDirective(template, directive, value) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (directive === 'box') {
    template.boxTitle = value;
  } else if (directive === 'row') {
    const [label, variable] = value.split('|');
    template.boxRows.push({ label, variable });
  } else if (directive === 'route-sterile') {
    template.routeSterile = value;
  } else if (directive === 'route-sterile-status') {
    template.routeSterileStatus = value;
  } else if (directive === 'route-blocked') {
    template.routeBlocked = value;
  } else if (directive === 'route-blocked-status') {
    template.routeBlockedStatus = value;
  } else if (directive === 'tree-header') {
    template.treeHeaderTitle = value;
  } else if (directive === 'tree-header-row') {
    template.treeHeaderRows.push(value);
  } else if (directive === 'missing-tree-label') {
    template.missingTreeLabel = value;
  } else if (directive === 'diagnostic-fallback-label') {
    template.diagnosticFallbackLabel = value;
  } else if (directive === 'worklist-box') {
    template.worklistBoxTitle = value;
  } else if (directive === 'worklist-empty') {
    template.worklistEmptyLabel = value;
  } else if (directive === 'worklist-row') {
    template.worklistRowTemplates.push(value);
  }
}

module.exports = { parsesExecutionSketchTemplate };
