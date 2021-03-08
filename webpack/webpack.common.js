const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtensionReloader = require('webpack-extension-reloader');
const tsImportPluginFactory = require('ts-import-plugin');
const WebpackCreateExtensionManifestPlugin = require('webpack-create-extension-manifest-plugin');
const fs = require('fs');
const getVersion = require('./getVersion');

const distFiles = fs.readdirSync(resolve('dist')).filter(o => o !== '.gitkeep');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const packageJson = JSON.parse(fs.readFileSync(resolve('package.json'), 'utf8'));

let manifestExtra = {
  name: 'Web Clipper',
  version: getVersion(packageJson.version),
  permissions: [
    'activeTab',
    'storage',
    'https://api.clipper.website/*',
    'https://resource.clipper.website/*',
    'contextMenus',
  ],
  commands: {
    'toggle-feature-foo': {
      suggested_key: {
        default: 'Alt+S',
      },
      description: 'Test',
    },
  },
  optional_permissions: ['cookies', '<all_urls>', 'webRequest', 'webRequestBlocking'],
};

let background = resolve('src/main/background.main.chrome.ts');
let tool = resolve('src/main/tool.main.chrome.ts');

if (process.env.TARGET_BROWSER === 'Firefox') {
  manifestExtra = {
    name: 'Web Clipper',
    version: getVersion(packageJson.version),
    commands: {
      'toggle-feature-foo': {
        suggested_key: {
          default: 'Alt+S',
        },
        description: 'Test',
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
  if (process.env.FF_RELEASE !== 'true') {
    manifestExtra.applications = {
      gecko: {
        id: 'web-clipper@web-clipper',
      },
    };
  }
  background = resolve('src/main/background.main.firefox.ts');
  tool = resolve('src/main/tool.main.firefox.ts');
}

module.exports = {
  entry: {
    tool,
    content_script: resolve('src/main/contentScript.main.ts'),
    background,
  },
  output: {
    path: resolve('dist'),
    filename: '[name].js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react\/|react-dom|antd|lodash|@ant-design)[\\/]/,
          name: 'vendor',
          chunks(chunk) {
            return chunk.name !== 'background';
          },
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve('src/'),
      common: resolve('src/common/'),
      components: resolve('src/components/'),
      browserActions: resolve('src/browser/actions/'),
      pageActions: resolve('src/actions'),
      extensions: resolve('src/extensions/'),
    },
    extensions: ['.ts', '.tsx', '.js', 'less'],
  },
  module: {
    rules: [
      {
        test: /\.(jsx|tsx|js|ts)$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory([
                {
                  style: false,
                  libraryName: 'lodash',
                  libraryDirectory: null,
                  camel2DashComponentName: false,
                },
                { style: true },
              ]),
            ],
          }),
          compilerOptions: {
            module: 'esnext',
          },
        },
        exclude: /node_modules/,
      },
      {
        include: /hypermd|codemirror/,
        test: [/\.css$/],
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        include: /node_modules\/antd|@ant-design/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: {
                  '@body-background': 'transparent',
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              camelCase: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: {
                  '@body-background': 'transparent',
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    process.env.NODE_ENV === 'development'
      ? new ExtensionReloader({
          port: 9091,
          reloadPage: false,
          entries: {
            contentScript: 'content_script',
            background: 'background',
          },
        })
      : null,
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new CleanWebpackPlugin(
      distFiles.map(p => `dist/${p}`),
      {
        root: path.resolve(__dirname, '../'),
        verbose: true,
      }
    ),
    new CopyWebpackPlugin([
      {
        from: resolve('chrome/js'),
        to: resolve('dist'),
        ignore: ['.*'],
      },
      {
        from: resolve('chrome/icons'),
        to: resolve('dist'),
        ignore: ['.*'],
      },
    ]),
    new WebpackCreateExtensionManifestPlugin({
      output: resolve('dist/manifest.json'),
      extra: manifestExtra,
    }),
    new HtmlWebpackPlugin({
      title: 'Web Clipper',
      filename: resolve('dist/tool.html'),
      chunks: ['tool'],
      template: 'src/index.html',
    }),
  ].filter(plugin => !!plugin),
};
