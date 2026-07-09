const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { discoversConfiguredSourceBodies } = require('../src/discovers-configured-source-bodies/discovers-configured-source-bodies');

test('discoversConfiguredSourceBodies returns sorted absolute paths of files matching includeExtensions, excluding configured directories and files', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-lab-'));

  try {
    // Create a test file structure
    fs.writeFileSync(path.join(tempDir, 'file1.js'), 'content');
    fs.writeFileSync(path.join(tempDir, 'file2.js'), 'content');
    fs.writeFileSync(path.join(tempDir, 'exclude-me.js'), 'content');
    fs.writeFileSync(path.join(tempDir, 'readme.md'), 'content');

    const subDir = path.join(tempDir, 'src');
    fs.mkdirSync(subDir);
    fs.writeFileSync(path.join(subDir, 'app.js'), 'content');

    const nodeModules = path.join(tempDir, 'node_modules');
    fs.mkdirSync(nodeModules);
    fs.writeFileSync(path.join(nodeModules, 'pkg.js'), 'content');

    const tempArtifactDir = path.join(tempDir, 'temp-123abc');
    fs.mkdirSync(tempArtifactDir);
    fs.writeFileSync(path.join(tempArtifactDir, 'ignored.js'), 'content');

    const config = {
      rootDir: tempDir,
      includeExtensions: ['.js', '.ts'],
      excludeDirectories: ['node_modules'],
      excludeFiles: ['exclude-me.js'],
    };

    const result = discoversConfiguredSourceBodies(config);

    // Should include .js files in rootDir and subdirs, not in excluded dirs or excluded files
    const expectedFiles = [
      path.join(tempDir, 'file1.js'),
      path.join(tempDir, 'file2.js'),
      path.join(tempDir, 'src', 'app.js'),
    ];

    assert.deepEqual(result, expectedFiles.sort((a, b) => a.localeCompare(b)));

    // Verify specific exclusions
    const fileNames = result.map(p => path.basename(p));
    assert.equal(fileNames.includes('exclude-me.js'), false, 'should exclude file in excludeFiles');
    assert.equal(fileNames.includes('readme.md'), false, 'should exclude files not in includeExtensions');
    assert.equal(result.some(p => p.includes('node_modules')), false, 'should exclude files in node_modules');
    assert.equal(result.some(p => p.includes('temp-123abc')), false, 'should exclude files in temp-* directories');

    // Verify sorting
    for (let i = 0; i < result.length - 1; i++) {
      assert.equal(result[i].localeCompare(result[i + 1]) <= 0, true, 'results should be sorted');
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
