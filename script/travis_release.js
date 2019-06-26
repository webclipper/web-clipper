const compressing = require('compressing');
const path = require('path');

const dest = path.resolve(__dirname, `../webclipper.zip`);
const source = path.resolve(__dirname, `../dist`);
compressing.zip.compressDir(source, dest);
