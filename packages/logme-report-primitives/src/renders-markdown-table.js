// Renders markdown table from methods array
const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

function rendersMarkdownTable(methods) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (methods.length === 0) {
    return '_No methods found._';
  }

  const includesExecutionStep = methods.some(hasExecutionStep);

  function hasExecutionStep(method) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return method.executionStep !== undefined;
  }

  function buildsMethodRow(method) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    const row = [
      String(method.scanOrder),
      method.name,
      method.kind,
      method.hasLogMeCall ? 'yes' : 'no',
      `${method.filePath}:${method.lineStart}-${method.lineEnd}`,
    ];

    if (includesExecutionStep) {
      row.splice(1, 0, formatsExecutionStep(method));
    }

    return row;
  }

  function formatsExecutionStep(method) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    if (method.executionStep === undefined) {
      return '';
    }

    return String(method.executionStep);
  }

  const methodRows = methods.map(buildsMethodRow);

  function formatsRowAsMarkdown(row) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return `| ${row.join(' | ')} |`;
  }

  const tableLines = [
    includesExecutionStep
      ? '| Scan Order | Execution Step | Method | Kind | LogMe | Location |'
      : '| Scan Order | Method | Kind | LogMe | Location |',
    includesExecutionStep
      ? '| --- | --- | --- | --- | --- | --- |'
      : '| --- | --- | --- | --- | --- |',
    ...methodRows.map(formatsRowAsMarkdown),
  ];

  return tableLines.join('\n');
}

module.exports = { rendersMarkdownTable };
