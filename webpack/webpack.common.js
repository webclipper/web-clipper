const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackChromeReloaderPlugin = require('webpack-chrome-extension-reloader');
const ChromeManifestPlugin = require('./chromeManifestPlugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const baseConfig = {
  output: {
    path: resolve('dist/js'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        include: /hypermd|codemirror/,
        test: [/\.css$/],
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=1024000',
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader'
          }, {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true
            }
          }]
      },
      {
        exclude: /node_modules/,
        test: [/\.scss$/, /\.css$/],
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              modules: true,
              namedExport: true,
              camelCase: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
            }
          },

          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'scss', 'less'],
    alias: {
      '@': resolve('src'),
      'antd-style': resolve('/node_modules/antd/dist/antd.less')
    }
  },
  plugins: [
    process.env.NODE_ENV === 'development' ? new WebpackChromeReloaderPlugin({
      reloadPage: false,
      entries: {
        contentScript: 'content_script',
        background: 'background'
      }
    }) : null,
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ].filter(plugin => !!plugin)
};

const commonConfig = merge(baseConfig, {
  entry: {
    initialize: resolve('src/pages/initialize/index.tsx'),
    background: resolve('src/background/index.ts')
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial'
    }
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../'),
      verbose: true
    }),
    new CopyWebpackPlugin([
      {
        from: resolve('chrome'),
        to: resolve('dist'),
        ignore: ['.*']
      }
    ]),
    new ChromeManifestPlugin({
      packageJson: path.resolve(__dirname, '../package.json'),
      out: path.resolve(__dirname, '../dist/manifest.json'),
    }),
    new HtmlWebpackPlugin({
      title: '语雀剪藏向导',
      filename: '../initialize.html',
      chunks: ['initialize', 'vendor']
    })
  ]
});

// 主要还是为了 antd 的样式不影响到其他页面。
const resetAntdConfig = merge(baseConfig, {
  entry: {
    content_script: resolve('src/content/index.tsx')
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/node_modules\/antd\/dist\/antd\.less/, resolve('src/content/antd-reset.less'))
  ]
});

module.exports = [commonConfig, resetAntdConfig];
