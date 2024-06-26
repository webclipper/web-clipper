const path = require('path');
const fsP = require('fs/promises');

async function getPackageJsonVersion() {
  const packageJsonPath = path.join(__dirname, '../../package.json');
  const packageJson = JSON.parse(await fsP.readFile(packageJsonPath, 'utf8'));
  return packageJson.version;
}

class WebpackCreateExtensionManifestPlugin {
  constructor({ output, extra }) {
    this.options = { output, extra };
  }

  apply(compiler) {
    compiler.hooks.done.tapPromise('WebpackCreateExtensionManifestPlugin', async () => {
      const { output } = this.options;

      const chromeManifest = path.join(output, 'chrome/manifest.json');
      const firefoxManifest = path.join(output, 'manifest.json');
      await fsP.mkdir(path.dirname(chromeManifest), { recursive: true });
      await fsP.writeFile(chromeManifest, JSON.stringify(await getChromeManifest(), null, 2));
      await fsP.writeFile(firefoxManifest, JSON.stringify(await getFirefoxManifest(), null, 2));
    });
  }
}

module.exports = { WebpackCreateExtensionManifestPlugin };

async function getChromeManifest() {
  return {
    manifest_version: 3,
    name: 'Web Clipper',
    version: await getPackageJsonVersion(),
    action: {},
    background: {
      service_worker: './background.js',
    },
    icons: {
      128: 'icon.png',
    },
    commands: {
      'save-selection': {
        suggested_key: {
          default: 'Alt+S',
        },
        description: 'Save selection',
      },
    },
    web_accessible_resources: [
      {
        resources: ['tool.html', 'tool.js', 'vendor.js'],
        matches: ['<all_urls>'],
      },
    ],
    content_scripts: [
      {
        matches: ['<all_urls>'],
        js: ['./content_script.js'],
      },
    ],
    host_permissions: ['https://api.clipper.website/*', 'https://resource.clipper.website/*'],
    optional_host_permissions: ['https://*/*', 'http://*/*', '<all_urls>'],
    optional_permissions: ['cookies'],
    permissions: ['activeTab', 'storage', 'contextMenus', 'declarativeNetRequestWithHostAccess'],
  };
}

async function getFirefoxManifest() {
  return {
    manifest_version: 3,
    name: 'Web Clipper',
    version: await getPackageJsonVersion(),
    action: {},
    background: {
      scripts: ['chrome/background.js'],
    },
    icons: {
      128: 'chrome/icon.png',
    },
    commands: {
      'save-selection': {
        suggested_key: {
          default: 'Alt+S',
        },
        description: 'Save selection',
      },
    },
    browser_specific_settings: {
      gecko: {
        id: 'web-clipper@web-clipper',
      },
    },
    web_accessible_resources: [
      {
        resources: ['chrome/tool.html', 'chrome/tool.js', 'chrome/vendor.js'],
        matches: ['<all_urls>'],
      },
    ],
    content_scripts: [
      {
        matches: ['http://*/*', 'https://*/*'],
        js: ['chrome/content_script.js'],
      },
    ],
    host_permissions: ['<all_urls>', 'http://*/*', 'https://*/*'],
    permissions: [
      'cookies',
      'activeTab',
      'storage',
      'contextMenus',
      'declarativeNetRequestWithHostAccess',
    ],
  };
}
