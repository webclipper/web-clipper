const compressing = require('compressing');
const path = require('path');
const pump = require('pump');
const fs = require('fs');

const dest = path.resolve(__dirname, `../webclipper.zip`);
const source = path.resolve(__dirname, `../dist`);
const zipStream = new compressing.zip.Stream();

fs.readdirSync(source).forEach(o => {
  zipStream.addEntry(path.join(source, o));
});

const destStream = fs.createWriteStream(dest);
pump(zipStream, destStream);
