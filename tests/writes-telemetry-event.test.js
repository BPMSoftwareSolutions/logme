const test = require('node:test');
const assert = require('node:assert/strict');

const { writesTelemetryEvent } = require('../packages/logme-testimony-core/src/writes-telemetry-event');

function exampleMethod(firstName, lastName) {
  return `${firstName} ${lastName}`.trim();
}

test('writesTelemetryEvent returns the method name and its source lines', () => {
  const event = writesTelemetryEvent(exampleMethod);

  assert.equal(typeof event.executionStep, 'number');
  assert.equal(event.name, 'exampleMethod');
  assert.equal(Array.isArray(event.source), true);
  assert.equal(event.source.join('\n'), exampleMethod.toString().replace(/\r\n/g, '\n'));
});

test('writesTelemetryEvent falls back to (anonymous) for unnamed functions', () => {
  const event = writesTelemetryEvent(() => {});

  assert.equal(event.name, '(anonymous)');
});

test('writesTelemetryEvent increments executionStep for runtime testimony order', () => {
  const firstEvent = writesTelemetryEvent(exampleMethod);
  const secondEvent = writesTelemetryEvent(() => {});

  assert.equal(secondEvent.executionStep, firstEvent.executionStep + 1);
});
