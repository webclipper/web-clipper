const merge = require('webpack-merge');
const common = require('./webpack.common.js');


// 一开始common里面改成数组后，这里没改，一直报错。好傻。
module.exports = common.map(config => {
    return merge(config, {
        devtool: 'inline-source-map',
        mode: 'development',
    });
});

