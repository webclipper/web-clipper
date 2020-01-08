const compressing = require('compressing');
const path = require('path');
const { version, name } = require('../package.json');
const pump = require('pump');
const fs = require('fs');

const homedir = require('os').homedir();

const dest = path.resolve(homedir, `${name}_${version}_firefox.zip`);
const source = path.resolve(__dirname, `../dist`);
const zipStream = new compressing.zip.Stream();

fs.readdirSync(source).forEach(o => {
  zipStream.addEntry(path.join(source, o));
});

const destStream = fs.createWriteStream(dest);
pump(zipStream, destStream);
