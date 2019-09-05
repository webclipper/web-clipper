import * as browser from '@web-clipper/chrome-promise';

export default () => {
  const url = browser.extension.getURL('tool.html');
  const match = /chrome-extension:\/\/(.*)\/tool.html/.exec(url);
  if (!match) {
    throw new Error('Get ExtensionId failed');
  }
  return match[1];
};
