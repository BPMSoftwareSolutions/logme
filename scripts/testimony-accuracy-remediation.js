#!/usr/bin/env node
const path = require('node:path');
const {
  plansTestimonyAccuracyBacklog,
  readsProofsForRun,
  writesTestimonyPlanningArtifacts,
} = require('../src/testimony-accuracy-remediation/testimony-accuracy-remediation');

const runId = process.argv[2];
if (!runId) {
  process.stderr.write('usage: node scripts/testimony-accuracy-remediation.js <run-id>\n');
  process.exitCode = 1;
} else {
  try {
    const rootDir = path.join(__dirname, '..');
    const proofEntries = readsProofsForRun(rootDir, runId);
    const backlog = plansTestimonyAccuracyBacklog({ rootDir }, runId, { proofEntries });
    const proofsByPath = new Map();
    for (const entry of proofEntries) proofsByPath.set(entry.proofPath, entry.proof);
    const result = writesTestimonyPlanningArtifacts({ rootDir }, backlog, proofsByPath);
    process.stdout.write(`Wrote ${backlog.backlogItems.length} bounded Gemini testimony packet(s) across ${result.writtenPaths.length} artifact(s).\n`);
  } catch (error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}
