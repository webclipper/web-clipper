const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        popup: path.join(__dirname, '../src/popup/index.tsx'),
        background: path.join(__dirname, '../src/background/index.ts'),
        content_script: path.join(__dirname, '../src/content/index.tsx')
    },
    output: {
        path: path.join(__dirname, '../dist/js'),
        filename: '[name].js'
    },
    optimization: {
        splitChunks: {
            name: 'vendor',
            chunks: 'initial'
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                exclude: /node_modules/,
                test: /\.s?css$/,
                use: [
                    {
                        loader: 'style-loader', // Creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader', // Translates CSS into CommonJS
                    },
                    {
                        loader: 'sass-loader', // Compiles Sass to CSS
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], {
            root: path.resolve(__dirname, '../'),
            verbose: true
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../chrome'),
                to: path.resolve(__dirname, '../dist'),
                ignore: ['.*']
            },
            {
                from: path.resolve(__dirname, '../index.html'),
                to: path.resolve(__dirname, '../dist'),
                ignore: ['.*']
            }
        ])
    ]
};
