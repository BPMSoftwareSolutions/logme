const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { writesDomainReceipt } = require('../packages/logme-testimony-core/src/writes-domain-receipt');

test('writesDomainReceipt writes reportContent to reportPath and returns receipt object', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-lab-'));

  try {
    const reportPath = path.join(tempDir, 'report.md');
    const reportContent = '# Test Report\n\nThis is a test report.';

    const receipt = writesDomainReceipt(reportPath, reportContent);

    // Assert file exists and has correct content
    assert.equal(fs.existsSync(reportPath), true, 'File should exist at reportPath');
    const fileContent = fs.readFileSync(reportPath, 'utf8');
    assert.equal(fileContent, reportContent, 'File content should match reportContent');

    // Assert receipt object structure
    assert.equal(receipt.reportPath, reportPath, 'receipt.reportPath should match input');
    const expectedBytesWritten = Buffer.byteLength(reportContent, 'utf8');
    assert.equal(receipt.bytesWritten, expectedBytesWritten, 'receipt.bytesWritten should match content length');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('writesDomainReceipt calculates bytesWritten correctly for multi-byte characters', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-lab-'));

  try {
    const reportPath = path.join(tempDir, 'report-unicode.md');
    const reportContent = '# 日本語テスト\n\nUnicode: €™';

    const receipt = writesDomainReceipt(reportPath, reportContent);

    // Assert file was written
    assert.equal(fs.existsSync(reportPath), true, 'File should exist at reportPath');
    const fileContent = fs.readFileSync(reportPath, 'utf8');
    assert.equal(fileContent, reportContent, 'File content should match');

    // Assert bytesWritten accounts for multi-byte UTF-8 encoding
    const expectedBytesWritten = Buffer.byteLength(reportContent, 'utf8');
    assert.equal(receipt.bytesWritten, expectedBytesWritten, 'bytesWritten should account for multi-byte UTF-8');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
