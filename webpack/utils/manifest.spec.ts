const { generateManifest } = require('./manifest');

const FIREFOX_MANIFEST_STORE = {
  name: 'web clipper',
  version: '1.0.0',
  commands: {
    'toggle-feature-foo': { suggested_key: { default: 'Alt+S' }, description: 'Test' },
  },
  permissions: [
    'contextMenus',
    'activeTab',
    'webRequest',
    'webRequestBlocking',
    'storage',
    'https://api.clipper.website/*',
    'https://resource.clipper.website/*',
    'cookies',
    '<all_urls>',
  ],
};

const FIREFOX_MANIFEST_DEVELOPMENT = {
  name: 'web clipper',
  version: '1.0.0',
  commands: {
    'toggle-feature-foo': { suggested_key: { default: 'Alt+S' }, description: 'Test' },
  },
  applications: {
    gecko: {
      id: 'web-clipper@web-clipper',
    },
  },
  permissions: [
    'contextMenus',
    'activeTab',
    'webRequest',
    'webRequestBlocking',
    'storage',
    'https://api.clipper.website/*',
    'https://resource.clipper.website/*',
    'cookies',
    '<all_urls>',
  ],
};

const CHROME_MANIFEST = {
  name: 'web clipper',
  version: '1.0.0',
  permissions: [
    'activeTab',
    'storage',
    'https://api.clipper.website/*',
    'https://resource.clipper.website/*',
    'contextMenus',
  ],
  commands: { 'toggle-feature-foo': { suggested_key: { default: 'Alt+S' }, description: 'Test' } },
  optional_permissions: [
    'cookies',
    '<all_urls>',
    'webRequest',
    'webRequestBlocking',
    'pageCapture',
  ],
};

describe('test generateManifest', () => {
  it('Firefox Store', () => {
    expect(
      generateManifest({
        publishToStore: true,
        targetBrowser: 'Firefox',
        basicManifest: { name: 'web clipper', version: '1.0.0' },
      })
    ).toEqual(FIREFOX_MANIFEST_STORE);
  });

  it('Firefox', () => {
    expect(
      generateManifest({
        publishToStore: false,
        targetBrowser: 'Firefox',
        basicManifest: { name: 'web clipper', version: '1.0.0' },
      })
    ).toEqual(FIREFOX_MANIFEST_DEVELOPMENT);
  });

  it('Chrome', () => {
    expect(
      generateManifest({
        publishToStore: false,
        targetBrowser: 'Chrome',
        basicManifest: { name: 'web clipper', version: '1.0.0' },
      })
    ).toEqual(CHROME_MANIFEST);

    expect(
      generateManifest({
        publishToStore: true,
        targetBrowser: 'Chrome',
        basicManifest: { name: 'web clipper', version: '1.0.0' },
      })
    ).toEqual(CHROME_MANIFEST);
  });
});
