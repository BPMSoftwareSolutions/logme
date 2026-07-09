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

  function buildsMethodRow(method) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return [
      String(method.scanOrder),
      method.name,
      method.kind,
      method.hasLogMeCall ? 'yes' : 'no',
      `${method.filePath}:${method.lineStart}-${method.lineEnd}`,
    ];
  }

  const methodRows = methods.map(buildsMethodRow);

  function formatsRowAsMarkdown(row) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return `| ${row.join(' | ')} |`;
  }

  const tableLines = [
    '| Scan Order | Method | Kind | LogMe | Location |',
    '| --- | --- | --- | --- | --- |',
    ...methodRows.map(formatsRowAsMarkdown),
  ];

  return tableLines.join('\n');
}

module.exports = { rendersMarkdownTable };
