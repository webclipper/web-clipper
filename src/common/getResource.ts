export function getResourcePath(name: string) {
  let isFirefox = chrome.runtime.getURL(name).startsWith('moz-extension');
  if (isFirefox) {
    return `chrome/${name}`;
  }
  return name;
}
