const semver = require('semver');

function generateVersion(options) {
  const { version, beta, commitsCount } = options;
  const currentVersion = semver.parse(version);
  if (Array.isArray(currentVersion.prerelease) && currentVersion.prerelease.length > 0) {
    return `${currentVersion.major}.${currentVersion.minor - 1}.${commitsCount}`;
  }
  if (!beta) {
    return version;
  }
  return `${currentVersion.major}.${currentVersion.minor - 1}.${commitsCount}`;
}

module.exports = generateVersion;
