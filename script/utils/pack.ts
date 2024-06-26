import compressing from 'compressing';
import fs from 'fs';
import path from 'path';
const pump = require('pump');
interface IPackOptions {
  distDir: string;
  releaseDir: string;
  fileName: string;
}

export function pack(options: IPackOptions) {
  const zipStream = new compressing.zip.Stream();
  const files = fs.readdirSync(options.distDir).filter((p) => !p.match(/^\./));
  for (const file of files) {
    zipStream.addEntry(path.join(options.distDir, file));
  }
  const dest = path.join(options.releaseDir, options.fileName);
  const destStream = fs.createWriteStream(dest);
  return new Promise((r) => {
    pump(zipStream, destStream, r);
  });
}
