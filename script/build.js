const webpack = require('webpack');
const prodConfig = require('../webpack/webpack.prod');
const compiler = webpack(prodConfig);
compiler.run();
