import { BasePlugin } from './interface';

function codeCallWithContext(plugin?: Function) {
  if (!plugin) {
    return null;
  }
  if (Object.prototype.toString.call(plugin) !== '[object Function]') {
    throw new TypeError('plugin must be function.');
  }
  return `(${plugin.toString()})(typeof(context) === 'undefined' ? {}:context);`;
}

export function serializePlugin(plugin: BasePlugin) {
  const { run, afterRun, beforeLoad, clean, ...rest } = plugin;
  return {
    run: codeCallWithContext(run),
    afterRun: codeCallWithContext(afterRun),
    beforeLoad: codeCallWithContext(beforeLoad),
    clean: codeCallWithContext(clean),
    ...rest,
  };
}
