const path = require('node:path');
const fs = require('node:fs');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { writesFeatureScenarioEvidencePacket } = require('../per-feature-executable-body-evidence-reports/per-feature-executable-body-evidence-reports');

// featureId and featureDocPath are real inputs the caller supplies (the feature this CLI
// script's real work belongs to), not hardcoded here -- this module is a shared seam every
// real CLI script can call to report proof for its own feature, not just one feature.

// Every LogMe(...) call site in this codebase calls LogMe(sampleMethod) -- a uniform
// self-audit "testimony ping", not a per-function trace (see
// packages/logme-testimony-core/src/sample-method.js). That means the telemetry stream
// cannot identify which real function emitted an event by its name field; every event's
// name is "sampleMethod". What IS real and observable is the monotonically increasing
// executionStep counter and the wall-clock time each console.log line was observed. So
// this module attributes telemetry to a declared body node by real call-boundary windows
// (the executionStep range that was active while that specific real function call was
// running), not by name matching -- honest attribution given what the instrumentation
// actually provides.

// runsCallWithTelemetryWindow invokes a real function, capturing every LogMe telemetry
// line emitted strictly during that call along with real wall-clock observation times and
// the real executionStep values seen, then restores the previous console.log.
async function runsCallWithTelemetryWindow(sharedCapturedEvents, work) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const windowStartedAt = new Date();
  const originalConsoleLog = console.log;
  const windowEvents = [];
  let capturingConsoleLogHasTestified = false;

  console.log = function capturingConsoleLog(...args) {
    if (process.env.LOGME_AUDIT === '1' && !capturingConsoleLogHasTestified) {
      capturingConsoleLogHasTestified = true;
      const activeConsoleLog = console.log;
      console.log = originalConsoleLog;
      try {
        LogMe(capturingConsoleLog);
      } finally {
        console.log = activeConsoleLog;
      }
    }
    const observedAt = new Date();
    if (args.length === 1 && typeof args[0] === 'string') {
      try {
        const parsed = JSON.parse(args[0]);
        if (parsed && typeof parsed === 'object' && 'executionStep' in parsed && 'name' in parsed) {
          const record = { observedAt, event: parsed };
          windowEvents.push(record);
          sharedCapturedEvents.push(record);
          return;
        }
      } catch (parseError) {
        // not a LogMe telemetry line -- fall through to normal stdout behavior
      }
    }
    originalConsoleLog.apply(console, args);
  };

  let workResult;
  try {
    workResult = await work();
  } finally {
    console.log = originalConsoleLog;
  }

  const windowEndedAt = new Date();

  return { workResult, windowEvents, windowStartedAt, windowEndedAt };
}

// startsScenarioProofRun begins a real scenario execution: a shared event list every
// subsequent runsCallWithTelemetryWindow call appends into, plus the real scenario start
// time.
function startsScenarioProofRun() {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  return { capturedEvents: [], runStartedAt: new Date() };
}

// writesTelemetryEventsJsonl writes every real captured LogMe event (with real observed
// timestamps) to a real telemetry.events.v1.jsonl file under the scenario evidence packet.
function writesTelemetryEventsJsonl(telemetryEventPath, capturedEvents) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  fs.mkdirSync(path.dirname(telemetryEventPath), { recursive: true });
  const lines = [];
  for (const captured of capturedEvents) {
    lines.push(JSON.stringify({
      telemetryEventId: `logme-step-${captured.event.executionStep}`,
      executionStep: captured.event.executionStep,
      name: captured.event.name,
      timestamp: captured.observedAt.toISOString(),
    }));
  }
  fs.writeFileSync(telemetryEventPath, `${lines.join('\n')}\n`, 'utf8');
  return { telemetryEventPath, eventCount: capturedEvents.length };
}

// buildsDeclaredExecutableBodyNodeFromWindow builds one declaredExecutableBody entry citing
// a real runtimePath and real sourceLineRange, plus the telemetryEvents observed during that
// node's real call window (attributed by real call-boundary timing, since every LogMe event
// name is the uniform "sampleMethod" testimony ping and cannot be matched by function name).
function buildsDeclaredExecutableBodyNodeFromWindow(nodeId, nodeLabel, runtimePath, sourceLineRange, windowResult, telemetryEventPathRelative, requiredReceiptPaths, featureDocPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const node = {
    nodeId,
    nodeLabel,
    contractPath: featureDocPath,
    runtimePath,
    sourceLineRange,
    requiredReceiptPaths: requiredReceiptPaths || [],
  };

  const telemetryEvents = [];
  for (const captured of windowResult.windowEvents) {
    telemetryEvents.push({
      nodeId,
      nodeLabel,
      runtimePath,
      telemetryEventId: `logme-step-${captured.event.executionStep}`,
      telemetryEventPath: telemetryEventPathRelative,
      timestamp: captured.observedAt.toISOString(),
      durationMs: 0,
      receiptPaths: requiredReceiptPaths || [],
    });
  }

  return { node, telemetryEvents, windowStartedAt: windowResult.windowStartedAt, windowEndedAt: windowResult.windowEndedAt };
}

// writesCliRunScenarioProof is the shared seam every real remediation CLI script calls after
// it finishes real work. It takes the run id the script was actually invoked with (no
// hardcoded run id -- this makes proof a byproduct of whatever run the operator names), real
// per-node call windows (each carrying real observed telemetry and real wall-clock times),
// and writes a feature-execution.contract.v1.json proof packet plus its sibling artifacts by
// calling the real writer, not hand-authoring JSON.
function writesCliRunScenarioProof(options) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const {
    rootDir,
    runId,
    featureId,
    featureDocPath,
    scenarioId,
    scenarioName,
    acceptanceLineRange,
    nodeWindows,
    capturedEvents,
    runStartedAt,
    runEndedAt,
    blockerFindings,
  } = options;

  const evidenceRoot = path.join(rootDir, 'evidence');
  const packetPath = path.join(evidenceRoot, 'runs', runId, 'features', featureId, 'scenarios', scenarioId);
  const telemetryEventPath = path.join(packetPath, 'telemetry.events.v1.jsonl');
  const telemetryEventPathRelative = path.relative(rootDir, telemetryEventPath).replace(/\\/gu, '/');

  writesTelemetryEventsJsonl(telemetryEventPath, capturedEvents);

  const declaredExecutableBody = [];
  const telemetryEvents = [];

  for (const nodeWindow of nodeWindows) {
    const built = buildsDeclaredExecutableBodyNodeFromWindow(
      nodeWindow.nodeId,
      nodeWindow.nodeLabel,
      nodeWindow.runtimePath,
      nodeWindow.sourceLineRange,
      nodeWindow.windowResult,
      telemetryEventPathRelative,
      nodeWindow.requiredReceiptPaths,
      featureDocPath,
    );
    declaredExecutableBody.push(built.node);
    for (const event of built.telemetryEvents) {
      telemetryEvents.push(event);
    }
  }

  const proofInput = {
    runId,
    featureId,
    scenarioId,
    scenarioName,
    runStartedAt: runStartedAt.toISOString(),
    receiptWrittenAt: runEndedAt.toISOString(),
    generatedAt: new Date().toISOString(),
    acceptanceSource: {
      path: featureDocPath,
      lineRange: acceptanceLineRange,
    },
    declaredExecutableBody,
    telemetryEvents,
    receiptSourcePaths: options.receiptSourcePaths || [],
    blockerFindings: blockerFindings || [],
  };

  return writesFeatureScenarioEvidencePacket(proofInput, { rootDir, evidenceRoot });
}

module.exports = {
  runsCallWithTelemetryWindow,
  startsScenarioProofRun,
  writesCliRunScenarioProof,
};
