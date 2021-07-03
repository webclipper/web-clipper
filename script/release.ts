import { getBuildOptions } from './utils/get-build-options';
import { TDistType, IReleaseProcessEnv } from './utils/types';

const { isBeta } = require('../webpack/utils/manifest');

(async () => {
  const buildEnv = (process.env as unknown) as IReleaseProcessEnv;
  const buildOptions = getBuildOptions(buildEnv);
  const CurrentDistType: TDistType = isBeta() ? 'Beta' : 'Release';
  if (!buildOptions.distType.has(CurrentDistType)) {
    process.exit(100);
  }
  console.log('buildOptions: \n', buildOptions);
  for (const iterator of buildOptions.targetBrowser) {
    console.log(`Release ${iterator}`);
  }
})();
