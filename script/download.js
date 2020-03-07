const { extend } = require('umi-request');
const path = require('path');
const fs = require('fs');
const request = extend({});
const configPath = path.join(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

request.get(config.iconfont).then(res => {
  fs.writeFileSync(path.join(__dirname, '../chrome/js/icon.js'), res);
});
