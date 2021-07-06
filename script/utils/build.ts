import { IWebpackProcessEnv, TTargetBrowser } from './types';
import { fork } from 'child_process';

interface IBuildOptions {
  targetBrowser: TTargetBrowser;
  publishToStore: boolean;
}

export function build(options: IBuildOptions) {
  const buildScript = require.resolve('../build');
  const buildEnv: IWebpackProcessEnv = Object.create(process.env);
  buildEnv.NODE_ENV = 'production';
  buildEnv.TARGET_BROWSER = options.targetBrowser;
  if (options.publishToStore) {
    buildEnv.PUBLISH_TO_STORE = 'true';
  }
  const cp = fork(buildScript, [], {
    env: (buildEnv as unknown) as typeof process.env,
    silent: true,
  });
  cp.stderr!.on('data', e => console.log(e.toString()));
  return new Promise(r => {
    cp.on('message', r);
  });
}
