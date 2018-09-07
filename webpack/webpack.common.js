const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ]
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
