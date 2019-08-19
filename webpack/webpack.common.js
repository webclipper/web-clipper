const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackChromeReloaderPlugin = require('webpack-chrome-extension-reloader');
const tsImportPluginFactory = require('ts-import-plugin');
const WebpackCreateExtensionManifestPlugin = require('webpack-create-extension-manifest-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  entry: {
    background: resolve('src/browser/background/index.ts'),
    tool: resolve('src/pages/app.tsx'),
    content_script: resolve('src/browser/content/index.tsx'),
  },
  output: {
    path: resolve('dist'),
    filename: '[name].js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|antd)[\\/]/,
          name: 'vendor',
          chunks: 'all',
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
    extensions: ['.ts', '.tsx', '.js', 'scss', 'less'],
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
            module: 'es2015',
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
        loader: 'url-loader?limit=1024000',
      },
      {
        test: /\.less$/,
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
              modifyVars: {
                '@body-background': 'transparent',
              },
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        exclude: /node_modules/,
        test: [/\.scss$/, /\.css$/],
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
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    process.env.NODE_ENV === 'development'
      ? new WebpackChromeReloaderPlugin({
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
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../'),
      verbose: true,
    }),
    new CopyWebpackPlugin([
      {
        from: resolve('chrome/icons'),
        to: resolve('dist'),
        ignore: ['.*'],
      },
      {
        from: resolve('dll'),
        to: resolve('dist'),
        ignore: ['react.manifest.json'],
      },
    ]),
    new WebpackCreateExtensionManifestPlugin({
      output: resolve('dist/manifest.json'),
      extra: { name: 'Web Clipper' },
    }),
    new HtmlWebpackPlugin({
      title: 'Web Clipper',
      filename: resolve('dist/tool.html'),
      chunks: ['tool'],
      template: 'src/index.html',
    }),
  ].filter(plugin => !!plugin),
};
