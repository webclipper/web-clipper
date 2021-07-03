import { getBuildOptions } from './utils/get-build-options';
import { TDistType, IReleaseProcessEnv } from './utils/types';
import { build } from './utils/build';
import { pack } from './utils/pack';
import path from 'path';
import fs from 'fs';

const { isBeta } = require('../webpack/utils/manifest');

(async () => {
  const releaseDir = path.join(__dirname, '../release');
  const distDir = path.join(__dirname, '../dist');
  if (!fs.existsSync(releaseDir)) {
    fs.mkdirSync(releaseDir);
  }
  const buildEnv = (process.env as unknown) as IReleaseProcessEnv;
  const buildOptions = getBuildOptions(buildEnv);
  const CurrentDistType: TDistType = isBeta() ? 'Beta' : 'Release';
  if (!buildOptions.distType.has(CurrentDistType)) {
    process.exit(100);
  }
  console.log('buildOptions: \n', buildOptions);
  for (const iterator of buildOptions.targetBrowser) {
    console.log(`Release: ${iterator} PublishToStore: ${buildOptions.publishToStore}`);
    await build({ targetBrowser: iterator, publishToStore: buildOptions.publishToStore });
    await pack({ targetBrowser: iterator, releaseDir, distDir });
  }
})();
