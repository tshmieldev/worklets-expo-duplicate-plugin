const path = require('path');

const pluginPath = require.resolve('react-native-worklets/plugin', { paths: [process.cwd()] });
const original = require(pluginPath);
require.cache[pluginPath].exports = function (api, options, dirname) {
  console.log(`[pid ${process.pid}] worklets plugin instance created, options: ${JSON.stringify(options)}`);
  const instance = original(api, options, dirname);
  const pre = instance.pre;
  instance.pre = function (file) {
    if (path.basename(file.opts.filename) === 'App.js') {
      console.log(`[pid ${process.pid}]   pre() on App.js, options: ${JSON.stringify(this.opts)}`);
    }
    return pre?.call(this, file);
  };
  return instance;
};
