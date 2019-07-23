export function codeCallWithContext(plugin?: Function): undefined | string {
  if (!plugin) {
    return;
  }
  if (Object.prototype.toString.call(plugin) !== '[object Function]') {
    throw new TypeError('plugin must be function.');
  }
  return `(${plugin.toString()})(typeof(context) === 'undefined' ? {}:context);`;
}
