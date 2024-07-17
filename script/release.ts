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
  const manifestConfig = path.join(__dirname, '../dist/manifest.json');
  const content = fs.readFileSync(manifestConfig, 'utf-8');
  const manifest = JSON.parse(content);
  manifest.browser_specific_settings = {
    gecko: {
      id: '{3fbb1f97-0acf-49a0-8348-36e91bef22ea}',
    },
  };
  manifest.name = 'Universal Web Clipper';
  fs.writeFileSync(manifestConfig, JSON.stringify(manifest, null, 2));
  await pack({
    releaseDir,
    distDir: path.join(__dirname, '../dist'),
    fileName: 'web-clipper-firefox-store.zip',
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
