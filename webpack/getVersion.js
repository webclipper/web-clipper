const semver = require('semver');
const { execSync } = require('child_process');

const branch = process.env.GITHUB_BRANCH || 'refs/heads/master';
const masterCommitsCount = execSync(`git rev-list --count ${branch}`)
  .toString()
  .trim();

console.log('masterCommitsCount', masterCommitsCount);

function getVersion(version, beta) {
  const currentVersion = semver.parse(version);
  if (Array.isArray(currentVersion.prerelease) && currentVersion.prerelease.length > 0) {
    return version;
  }
  if (!beta) {
    return version;
  }
  return semver.coerce(version).version.replace(/.[0-9]$/, `.${masterCommitsCount}`);
}

module.exports = getVersion;
