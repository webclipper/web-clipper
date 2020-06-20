const webpack = require('webpack');
const prodConfig = require('../webpack/webpack.prod');
const compiler = webpack(prodConfig);

function send(data) {
  if (!process.send) {
    return;
  }
  return new Promise(r => {
    process.send(data, null, {}, r);
  });
}

compiler.run(() => {
  send({
    type: 'Success',
  });
});
