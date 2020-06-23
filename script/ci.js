const { fork } = require('child_process');
const path = require('path');
const compressing = require('compressing');
const fs = require('fs');
const pump = require('pump');

const releaseDir = path.join(__dirname, '../release');
if (!fs.existsSync(releaseDir)) {
  fs.mkdirSync(releaseDir);
}

function build(targetBrowser) {
  const buildScript = require.resolve('./build');
  const buildEnv = Object.create(process.env);
  buildEnv.NODE_ENV = 'production';
  buildEnv.TARGET_BROWSER = targetBrowser;
  const cp = fork(buildScript, [], {
    env: buildEnv,
    silent: true,
  });
  return new Promise(r => {
    cp.on('message', r);
  });
}
function pack(targetBrowser) {
  const dist = path.resolve(__dirname, `../dist`);
  const { version } = JSON.parse(fs.readFileSync(path.join(dist, 'manifest.json'), 'utf-8'));
  const zipStream = new compressing.zip.Stream();
  fs.readdirSync(dist).forEach(o => {
    if (o.match(/^\./)) {
      return;
    }
    zipStream.addEntry(path.join(dist, o));
  });
  const dest = path.join(releaseDir, `web_clipper_${version}_${targetBrowser}.zip`);
  const destStream = fs.createWriteStream(dest);
  return new Promise(r => {
    pump(zipStream, destStream, r);
  });
}

(async () => {
  const browserList = ['Firefox', 'Chrome'];
  for (const browser of browserList) {
    console.log(`Start Build ${browser} Version`);
    await build(browser);
    console.log(`Build ${browser} Version Success`);
    await pack(browser);
  }
})();
