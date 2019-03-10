const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = common.map(config => {
  return merge(config, {
    mode: 'production',
    optimization: {
      minimize: false
    }
  });
});
