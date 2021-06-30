const semver = require('semver');
const path = require('path');
const fs = require('fs');

function generateVersion(options) {
  const { version, commitsCount } = options;
  const currentVersion = semver.parse(version);
  if (Array.isArray(currentVersion.prerelease) && currentVersion.prerelease.length > 0) {
    return `${currentVersion.major}.${currentVersion.minor - 1}.${commitsCount}`;
  }
  return version;
}

function getPackageJsonVersion() {
  const packageJsonPath = path.join(__dirname, '../../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
}

module.exports = { generateVersion, getPackageJsonVersion };
