const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = common.map(config => {
    return merge(config, {
        devtool: 'inline-source-map',
        mode: 'development'
    });
});

