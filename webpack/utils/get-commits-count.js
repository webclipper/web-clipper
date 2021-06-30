const { execSync } = require('child_process');

const getCommitsCount = () => {
  const branch = process.env.GITHUB_BRANCH || 'refs/heads/master';
  const commitsCount = execSync(`git rev-list --count ${branch}`)
    .toString()
    .trim();

  return parseInt(commitsCount, 10);
};

module.exports = { getCommitsCount };
