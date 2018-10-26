const fs = require('fs');
const path = require('path');

const writeFile = (path, data, opts = 'utf8') =>
  new Promise((res, rej) => {
    fs.writeFile(path, data, opts, (err) => {
      if (err) rej(err);
      else res();
    });
  });

const readFile = (path, opts = 'utf8') =>
  new Promise((res, rej) => {
    fs.readFile(path, opts, (err, data) => {
      if (err) rej(err);
      else res(data);
    });
  });

const mkdirsSync = (dirname) => {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
};

class ChromeManifestPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.done.tapPromise('ChromeManifestPlugin', async (compilation) => {
      const packageJson = JSON.parse(await readFile(this.options.packageJson));
      const manifest = packageJson.chrome;
      manifest.version = packageJson.version;
      manifest.description = packageJson.description;
      mkdirsSync(path.dirname(this.options.out));
      await writeFile(this.options.out, JSON.stringify(manifest));
    });

  }
}

module.exports = ChromeManifestPlugin;
