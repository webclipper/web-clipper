const fs = require('mz/fs');
const path = require('path');

const mkdir = async (dirname) => {
  //console.log(dirname);
  if (fs.existsSync(dirname)) {
    return true;
  }
  if (mkdir(path.dirname(dirname))) {
    fs.mkdir(dirname);
    return true;
  }
};

function getPackageJsonVersion() {
  const packageJsonPath = path.join(__dirname, '../../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
}

class WebpackCreateExtensionManifestPlugin {
  constructor({ output, extra }) {
    this.options = { output, extra };
  }

  apply(compiler) {
    compiler.hooks.done.tapPromise('WebpackCreateExtensionManifestPlugin', async () => {
      const { output } = this.options;
      const manifest = {
        manifest_version: 3,
        name: 'Web Clipper',
        version: getPackageJsonVersion(),
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
        permissions: [
          'activeTab',
          'storage',
          'contextMenus',
          'declarativeNetRequestWithHostAccess',
        ],
      };
      mkdir(path.dirname(output));
      await fs.writeFile(output, JSON.stringify(manifest, null, 2));
    });
  }
}

module.exports = { WebpackCreateExtensionManifestPlugin };
