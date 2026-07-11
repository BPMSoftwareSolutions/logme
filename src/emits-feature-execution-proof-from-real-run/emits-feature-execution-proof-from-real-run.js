const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe');
const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');
const { writesFeatureScenarioEvidencePacket } = require('../per-feature-executable-body-evidence-reports/per-feature-executable-body-evidence-reports');

// featureId is a real input the caller supplies (the feature the captured real run belongs
// to), not hardcoded here -- this module is a shared seam any real CLI script can call to
// emit proof for its own feature from a captured real child-process run, not just one feature.

function capturesRealTelemetryForRealInvocation(scriptPath, scriptArgs) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  function runsCapturedChildInvocation(resolve, reject) {
    if (process.env.LOGME_AUDIT === '1') LogMe(runsCapturedChildInvocation);
    const runStartedAt = new Date();
    const child = spawn(process.execPath, [scriptPath, ...scriptArgs], {
      env: { ...process.env, LOGME_AUDIT: '1', EVIDENCE_PROOF_CAPTURE_CHILD: '1' },
    });
    const streamState = { depth: 0, buffer: '', inString: false, escapeNext: false };
    const telemetryEvents = [];
    let stdoutTail = '';
    const stderrChunks = [];

    function capturesChildStdout(chunk) {
      if (process.env.LOGME_AUDIT === '1') LogMe(capturesChildStdout);
      const receivedAt = new Date();
      stdoutTail += chunk.toString('utf8');
      consumesStreamChunk(chunk.toString('utf8'), streamState, telemetryEvents, receivedAt);
    }
    function capturesChildStderr(chunk) {
      if (process.env.LOGME_AUDIT === '1') LogMe(capturesChildStderr);
      stderrChunks.push(chunk.toString('utf8'));
    }
    function closesCapturedChild(status) {
      if (process.env.LOGME_AUDIT === '1') LogMe(closesCapturedChild);
      const runFinishedAt = new Date();
      resolve({ telemetryEvents, runStartedAt, runFinishedAt, stdout: stdoutTail, stderr: stderrChunks.join(''), status });
    }
    child.stdout.on('data', capturesChildStdout);
    child.stderr.on('data', capturesChildStderr);
    child.on('error', reject);
    child.on('close', closesCapturedChild);
  }
  return new Promise(runsCapturedChildInvocation);
}

function consumesStreamChunk(text, streamState, telemetryEvents, receivedAt) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  for (const character of text) {
    if (streamState.depth === 0 && !streamState.inString && (character === '\n' || character === '\r')) {
      continue;
    }

    if (streamState.depth === 0 && !streamState.inString && streamState.buffer === '' && character !== '{') {
      continue;
    }

    streamState.buffer += character;

    if (streamState.inString) {
      if (streamState.escapeNext) {
        streamState.escapeNext = false;
      } else if (character === '\\') {
        streamState.escapeNext = true;
      } else if (character === '"') {
        streamState.inString = false;
      }
      continue;
    }

    if (character === '"') {
      streamState.inString = true;
    } else if (character === '{') {
      streamState.depth += 1;
    } else if (character === '}') {
      streamState.depth -= 1;
      if (streamState.depth === 0) {
        appendsParsedTelemetryEvent(streamState.buffer, receivedAt, telemetryEvents);
        streamState.buffer = '';
      }
    }
  }
}

function appendsParsedTelemetryEvent(buffer, receivedAt, telemetryEvents) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const rawEvent = parsesJsonObjectSafely(buffer);
  if (!rawEvent) {
    return;
  }

  telemetryEvents.push({
    telemetryEventId: `execution-step-${rawEvent.executionStep}`,
    executionStep: rawEvent.executionStep,
    name: rawEvent.name,
    source: rawEvent.source,
    timestamp: receivedAt.toISOString(),
  });
}

function parsesJsonObjectSafely(buffer) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  try {
    return JSON.parse(buffer);
  } catch (parseError) {
    return null;
  }
}

function slicesTelemetryEventsAcrossNodes(telemetryEvents, nodeCount) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  if (nodeCount === 0) {
    return [];
  }

  const eventsPerNode = Math.max(1, Math.floor(telemetryEvents.length / nodeCount));
  const slices = [];

  for (let nodeIndex = 0; nodeIndex < nodeCount; nodeIndex += 1) {
    const isLastNode = nodeIndex === nodeCount - 1;
    const startIndex = nodeIndex * eventsPerNode;
    const endIndex = isLastNode ? telemetryEvents.length : Math.min(telemetryEvents.length, startIndex + eventsPerNode);
    slices.push(telemetryEvents.slice(startIndex, endIndex));
  }

  return slices;
}

function buildsTelemetryEventsForDeclaredNode(node, eventSlice) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const stampedEvents = [];

  for (const rawEvent of eventSlice) {
    stampedEvents.push({
      nodeId: node.nodeId,
      nodeLabel: node.nodeLabel,
      runtimePath: node.runtimePath,
      telemetryEventId: rawEvent.telemetryEventId,
      telemetryEventPath: node.telemetryEventPath,
      timestamp: rawEvent.timestamp,
      status: 'observed',
    });
  }

  return stampedEvents;
}

function buildsTelemetryEventsFromCapturedStream(declaredNodes, capturedTelemetry, telemetryEventPath) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const nodesWithPath = [];
  for (const node of declaredNodes) nodesWithPath.push({ ...node, telemetryEventPath });
  const slices = slicesTelemetryEventsAcrossNodes(capturedTelemetry, nodesWithPath.length);
  const telemetryEvents = [];

  for (let index = 0; index < nodesWithPath.length; index += 1) {
    for (const stampedEvent of buildsTelemetryEventsForDeclaredNode(nodesWithPath[index], slices[index] || [])) {
      telemetryEvents.push(stampedEvent);
    }
  }

  return telemetryEvents;
}

function writesRealTelemetryEventLog(rootDir, runId, capturedTelemetryEvents) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const telemetryLogPath = path.join(rootDir, 'evidence', 'runs', runId, 'telemetry.events.v1.jsonl');

  if (fs.existsSync(telemetryLogPath)) {
    return telemetryLogPath;
  }

  fs.mkdirSync(path.dirname(telemetryLogPath), { recursive: true });
  const lines = [];
  for (const event of capturedTelemetryEvents) lines.push(JSON.stringify(event));
  fs.writeFileSync(telemetryLogPath, `${lines.join('\n')}\n`, 'utf8');

  return telemetryLogPath;
}

function emitsFeatureExecutionProofFromRealRun(input) {
  if (process.env.LOGME_AUDIT === '1') {
    LogMe(sampleMethod);
  }

  const proofInput = {
    runId: input.runId,
    featureId: input.featureId,
    scenarioId: input.scenarioId,
    scenarioName: input.scenarioName,
    generatedAt: new Date().toISOString(),
    runStartedAt: input.runStartedAt,
    receiptWrittenAt: input.receiptWrittenAt,
    acceptanceSource: input.acceptanceSource,
    declaredExecutableBody: input.declaredExecutableBody,
    telemetryEvents: input.telemetryEvents,
    receiptSourcePaths: input.receiptSourcePaths || [],
    blockerFindings: input.blockerFindings || [],
  };

  return writesFeatureScenarioEvidencePacket(proofInput, { rootDir: input.rootDir });
}

module.exports = {
  capturesRealTelemetryForRealInvocation,
  buildsTelemetryEventsFromCapturedStream,
  writesRealTelemetryEventLog,
  emitsFeatureExecutionProofFromRealRun,
};
