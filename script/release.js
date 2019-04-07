const compressing = require('compressing');
const path = require('path');
const { version, name } = require('../package.json');

const homedir = require('os').homedir();

const dest = path.resolve(homedir, `${name}_${version}.zip`);
const source = path.resolve(__dirname, `../dist`);
compressing.zip.compressDir(source, dest);
