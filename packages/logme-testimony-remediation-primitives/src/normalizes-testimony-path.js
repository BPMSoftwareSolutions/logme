const path = require('node:path');
const { LogMe } = require('../../logme-testimony-core/src/LogMe');

function normalizesTestimonyPath(value) {
  if (process.env.LOGME_AUDIT === '1') LogMe(normalizesTestimonyPath);
  return String(value || '').replace(/\\/gu, '/');
}

function resolvesTestimonyWorkspacePath(rootDir, candidatePath) {
  if (process.env.LOGME_AUDIT === '1') LogMe(resolvesTestimonyWorkspacePath);
  const withoutLineRange = normalizesTestimonyPath(candidatePath).replace(/:\d+-\d+$/u, '');
  return path.isAbsolute(withoutLineRange) ? withoutLineRange : path.join(rootDir, withoutLineRange);
}

module.exports = { normalizesTestimonyPath, resolvesTestimonyWorkspacePath };
