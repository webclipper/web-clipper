import { IWebpackProcessEnv } from './types';
import { fork } from 'child_process';

export function build({ targetBrowser }) {
  const buildScript = require.resolve('../build');
  const buildEnv: IWebpackProcessEnv = Object.create(process.env);
  buildEnv.NODE_ENV = 'production';
  buildEnv.TARGET_BROWSER = targetBrowser;

  const cp = fork(buildScript, [], {
    env: (buildEnv as unknown) as typeof process.env,
    silent: true,
  });
  cp.stderr.on('data', e => console.log(e.toString()));
  return new Promise(r => {
    cp.on('message', r);
  });
}
