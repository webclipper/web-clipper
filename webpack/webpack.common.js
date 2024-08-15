const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
  WebpackCreateExtensionManifestPlugin,
} = require('./plugin/webpack-create-extension-manifest-plugin');
const fs = require('fs');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const distFiles = fs.readdirSync(resolve('dist')).filter((o) => o !== '.gitkeep');

module.exports = {
  entry: {
    tool: resolve('src/main/tool.main.chrome.ts'),
    content_script: resolve('src/main/contentScript.main.ts'),
    background: resolve('src/main/background.worker.ts'),
  },
  output: {
    path: resolve('dist/chrome'),
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
        test: /\.md$/,
        use: 'raw-loader',
      },
      {
        test: /\.(jsx|tsx|js|ts)$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [],
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
        include: /node_modules\/antd|@ant-design|@formily/,
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
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new CleanWebpackPlugin(
      distFiles.map((p) => `dist/${p}`),
      {
        root: path.resolve(__dirname, '../'),
        verbose: true,
      }
    ),
    new CopyWebpackPlugin([
      {
        from: resolve('chrome/html'),
        to: resolve('dist/chrome'),
        ignore: ['.*'],
      },
      {
        from: resolve('chrome/js'),
        to: resolve('dist/chrome'),
        ignore: ['.*'],
      },
      {
        from: resolve('chrome/icons'),
        to: resolve('dist/chrome/icons'),
        ignore: ['.*'],
      },
    ]),
    new WebpackCreateExtensionManifestPlugin({
      output: resolve('dist'),
    }),
    new HtmlWebpackPlugin({
      title: 'Web Clipper',
      filename: resolve('dist/chrome/tool.html'),
      chunks: ['tool'],
      template: 'src/index.html',
    }),
  ].filter((plugin) => !!plugin),
};
