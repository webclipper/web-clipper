import { IReleaseProcessEnv, IBuildOptions } from './types';

export function getBuildOptions(env: IReleaseProcessEnv): IBuildOptions {
  const option: IBuildOptions = {
    targetBrowser: new Set(),
    publishToStore: false,
    distType: new Set(),
  };

  if (!env.TARGET_BROWSER || !['Chrome', 'Firefox'].includes(env.TARGET_BROWSER)) {
    option.targetBrowser.add('Chrome');
    option.targetBrowser.add('Firefox');
  } else {
    option.targetBrowser.add(env.TARGET_BROWSER);
  }

  if (env.PUBLISH_TO_STORE === 'true') {
    option.publishToStore = true;
  }

  if (!env.DIST_TYPE || !['Beta', 'Release'].includes(env.DIST_TYPE)) {
    option.distType.add('Beta');
    option.distType.add('Release');
  } else {
    option.distType.add(env.DIST_TYPE);
  }

  return option;
}
