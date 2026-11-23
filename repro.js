const path = require('path');
const fs = require('fs');

const pluginPath = require.resolve('react-native-worklets/plugin');
const original = require(pluginPath);
require.cache[pluginPath].exports = function (api, options, dirname) {
  console.log(`worklets plugin instance created, options: ${JSON.stringify(options)}`);
  const instance = original(api, options, dirname);
  const pre = instance.pre;
  instance.pre = function (file) {
    console.log(`  pre() on ${path.basename(file.opts.filename)}, options: ${JSON.stringify(this.opts)}`);
    return pre?.call(this, file);
  };
  return instance;
};

const babel = require('@babel/core');
const filename = path.join(__dirname, 'App.js');
babel.transformSync(fs.readFileSync(filename, 'utf8'), {
  filename,
  cwd: __dirname,
  caller: { name: 'metro', bundler: 'metro', platform: 'ios' },
});
