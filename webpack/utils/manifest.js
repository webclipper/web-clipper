const { generateVersion, getPackageJsonVersion } = require('./version');
const { getCommitsCount } = require('./get-commits-count');

const getBasicManifest = () => {
  const packageVersion = getPackageJsonVersion();
  const commitsCount = getCommitsCount();
  const version = generateVersion({ version: packageVersion, commitsCount });
  let name = 'Web Clipper';
  if (version !== packageVersion) {
    name = 'Web Clipper Beta';
  }
  return { version, name };
};

function isBeta() {
  const packageVersion = getPackageJsonVersion();
  const commitsCount = getCommitsCount();
  const version = generateVersion({ version: packageVersion, commitsCount });
  return version !== packageVersion;
}

module.exports = { getBasicManifest, isBeta };
