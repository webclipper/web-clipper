const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = common.map(config => {
    return merge(config, {
        mode: 'production',
        optimization: {
            minimizer: [
                new UglifyJSPlugin({
                    uglifyOptions: {
                        compress: {
                            warnings: false,
                            drop_debugger: true,
                            drop_console: true
                        }
                    }
                })
            ]
        }
    });
});
