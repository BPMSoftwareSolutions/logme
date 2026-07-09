const test = require('node:test');
const assert = require('node:assert/strict');

const { LogMe } = require('../packages/logme-testimony-core/src/LogMe');

function exampleMethod(firstName, lastName) {
  return `${firstName} ${lastName}`.trim();
}

test('LogMe(fn) testifies about a function and returns its telemetry event', () => {
  const event = LogMe(exampleMethod);

  assert.equal(typeof event.executionStep, 'number');
  assert.equal(event.name, 'exampleMethod');
  assert.equal(Array.isArray(event.source), true);
});

test('LogMe(fn) records executionStep in the order LogMe is called at runtime', () => {
  function secondExampleMethod() {
    return 'second';
  }

  const firstEvent = LogMe(exampleMethod);
  const secondEvent = LogMe(secondExampleMethod);

  assert.equal(secondEvent.executionStep, firstEvent.executionStep + 1);
});

test('LogMe(fn) does not recurse infinitely when LOGME_AUDIT is set', () => {
  const previousAudit = process.env.LOGME_AUDIT;
  process.env.LOGME_AUDIT = '1';

  try {
    assert.doesNotThrow(() => LogMe(exampleMethod));
  } finally {
    if (previousAudit === undefined) {
      delete process.env.LOGME_AUDIT;
    } else {
      process.env.LOGME_AUDIT = previousAudit;
    }
  }
});

test('LogMe() with no argument delegates to the full domain audit and returns a receipt', () => {
  const receipt = LogMe();

  assert.equal(typeof receipt.reportPath, 'string');
  assert.equal(typeof receipt.bytesWritten, 'number');
  assert.match(receipt.reportContent, /^# Domain Body Contract Report/);
});
