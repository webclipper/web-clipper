export function codeCallWithContext(plugin: Function) {
  if (Object.prototype.toString.call(plugin) !== '[object Function]') {
    throw new TypeError('plugin must be function.');
  }
  return `(${plugin.toString()})(typeof(context) === 'undefined' ? {}:context);`;
}
