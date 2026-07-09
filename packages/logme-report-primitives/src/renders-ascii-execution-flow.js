// Renders a compact ASCII execution flow sketch for the report header
const path = require('node:path');
const { LogMe } = require('../../logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../logme-testimony-core/src/sample-method');

const BOX_WIDTH = 60;

function rendersAsciiExecutionFlow(contract) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  function padsLine(label, value) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    const line = `${label}: ${value}`;
    return `| ${line.padEnd(BOX_WIDTH - 2)} |`;
  }

  function formatsRouteLine() {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    if (contract.verdict === 'STERILE DOMAIN BODY') {
      return '| Gherkin -> Contract -> Source -> Telemetry -> Receipt      |';
    }

    return '| Declared Source -> Static Inventory -> Telemetry -> Receipt |';
  }

  function formatsObservationLine() {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    if (contract.verdict === 'STERILE DOMAIN BODY') {
      return '|    ok         ok          ok        observed     written    |';
    }

    return '|       ok              has gaps          missing    unknown  |';
  }

  function formatsProminentPath(filePath) {
    if (process.env.LOGME_AUDIT === '1') {
      LogMe(sampleMethod);
    }

    if (!filePath) {
      return 'unknown';
    }

    const relativePath = path.relative(contract.rootDir || process.cwd(), filePath);
    return relativePath || path.basename(filePath);
  }

  const receiptPath = formatsProminentPath(contract.reportPath);
  const declaredSourceAuthority = formatsProminentPath(contract.provenance.configPath);
  const staticSourceInventory = `${contract.filesScanned} files / ${contract.localExecutableMethods} methods`;
  const telemetryObservation = 'not observed';
  const blockerCount = contract.findings.length;
  const promotionDecision = blockerCount === 0 ? 'ALLOWED' : 'BLOCKED';

  return [
    '+------------------------------------------------------------+',
    '| REPORT TRUTH                                               |',
    '+------------------------------------------------------------+',
    padsLine('Verdict'.padEnd(15), contract.verdict),
    padsLine('Run'.padEnd(15), contract.provenance.runId),
    padsLine('Promotion'.padEnd(15), promotionDecision),
    '+------------------------------------------------------------+',
    formatsRouteLine(),
    formatsObservationLine(),
    padsLine('Declared source authority'.padEnd(27), declaredSourceAuthority),
    padsLine('Static source inventory'.padEnd(27), staticSourceInventory),
    padsLine('Telemetry observation'.padEnd(27), telemetryObservation),
    padsLine('Receipt evidence'.padEnd(27), receiptPath),
    padsLine('Blockers'.padEnd(27), String(blockerCount)),
    '+------------------------------------------------------------+',
  ].join('\n');
}

module.exports = { rendersAsciiExecutionFlow };
