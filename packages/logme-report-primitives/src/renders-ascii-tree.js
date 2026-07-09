// Renders ASCII tree of methods grouped by file
const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

function rendersAsciiTree(methods) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (methods.length === 0) {
    return '';
  }

  function groupsMethodsByFile(acc, method) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    const filePath = method.filePath;
    if (!acc[filePath]) {
      acc[filePath] = [];
    }
    acc[filePath].push(method.name);
    return acc;
  }

  const grouped = methods.reduce(groupsMethodsByFile, {});
  const fileOrder = [];

  function tracksFileOrder(method) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    if (!fileOrder.includes(method.filePath)) {
      fileOrder.push(method.filePath);
    }
  }

  methods.forEach(tracksFileOrder);

  function formatsFileLine(filePath) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return filePath;
  }

  function formatsMethodLine(methodName) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    return `  - ${methodName}`;
  }

  const treeLines = [];
  for (const filePath of fileOrder) {
    treeLines.push(formatsFileLine(filePath));
    treeLines.push(...grouped[filePath].map(formatsMethodLine));
  }

  return treeLines.join('\n');
}

module.exports = { rendersAsciiTree };
