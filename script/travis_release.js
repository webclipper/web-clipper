const compressing = require('compressing');
const path = require('path');

const dest = path.resolve(__dirname, `../yuquewebclipper.zip`);
const source = path.resolve(__dirname, `../dist`);
compressing.zip.compressDir(source, dest);
