const fs = require('node:fs');
const path = require('node:path');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');

const PIN_SCHEMA_VERSION = 'evidence-pin.v1';

function pinsEvidenceRun(rootDir, request) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const pin = buildsPinRecord(request);
  const pinPath = path.join(rootDir, 'evidence', 'index', 'pins', `${request.runId}.pin.v1.json`);

  fs.mkdirSync(path.dirname(pinPath), { recursive: true });
  fs.writeFileSync(pinPath, `${JSON.stringify(pin, null, 2)}\n`, 'utf8');

  return {
    pinPath: path.relative(rootDir, pinPath).split(path.sep).join('/'),
    pin,
  };
}

function buildsPinRecord(request) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return {
    schemaVersion: PIN_SCHEMA_VERSION,
    runId: request.runId,
    pinnedBy: request.pinnedBy,
    pinnedAt: request.pinnedAt || new Date().toISOString(),
    reason: request.reason,
    expiryCondition: request.expiryCondition || null,
    relatedFeatureIds: request.relatedFeatureIds || [],
    relatedPiIds: request.relatedPiIds || [],
  };
}

function readsEvidencePins(rootDir) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const pinsDir = path.join(rootDir, 'evidence', 'index', 'pins');

  if (!fs.existsSync(pinsDir)) {
    return [];
  }

  const pins = [];
  for (const entry of fs.readdirSync(pinsDir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.pin.v1.json')) {
      pins.push(JSON.parse(fs.readFileSync(path.join(pinsDir, entry.name), 'utf8')));
    }
  }

  return pins;
}

function isPinExpired(pin, now) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (!pin.expiryCondition) {
    return false;
  }

  const expiryTime = Date.parse(pin.expiryCondition);
  if (Number.isNaN(expiryTime)) {
    return false;
  }

  const nowTime = now instanceof Date ? now.getTime() : new Date(now).getTime();
  return nowTime >= expiryTime;
}

function readsActivePinnedRunIds(rootDir, now = new Date()) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const activeRunIds = new Set();
  for (const pin of readsEvidencePins(rootDir)) {
    if (!isPinExpired(pin, now)) {
      activeRunIds.add(pin.runId);
    }
  }

  return activeRunIds;
}

module.exports = {
  PIN_SCHEMA_VERSION,
  pinsEvidenceRun,
  readsEvidencePins,
  isPinExpired,
  readsActivePinnedRunIds,
};
