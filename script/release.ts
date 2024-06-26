import { fork } from 'child_process';
import fs from 'fs';
import path from 'path';
import { pack } from './utils/pack';

(async () => {
  const releaseDir = path.join(__dirname, '../release');
  if (!fs.existsSync(releaseDir)) {
    fs.mkdirSync(releaseDir);
  }
  await build();
  await pack({
    releaseDir,
    distDir: path.join(__dirname, '../dist/chrome'),
    fileName: 'web-clipper-chrome.zip',
  });
  await pack({
    releaseDir,
    distDir: path.join(__dirname, '../dist'),
    fileName: 'web-clipper-firefox.zip',
  });
})();

function build() {
  const buildScript = require.resolve('./build');
  const buildEnv = Object.create(process.env);
  buildEnv.NODE_ENV = 'production';
  const cp = fork(buildScript, [], {
    env: buildEnv as unknown as typeof process.env,
    stdio: 'inherit',
  });
  return new Promise((r) => {
    cp.on('message', r);
  });
}
