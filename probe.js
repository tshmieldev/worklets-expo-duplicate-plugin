const path = require('path');

const pluginPath = require.resolve('react-native-worklets/plugin', { paths: [process.cwd()] });
const plugin = require(pluginPath);
require.cache[pluginPath].exports = function (api, options, dirname) {
  const instance = plugin(api, options, dirname);
  const pre = instance.pre;
  instance.pre = function (file) {
    if (path.basename(file.opts.filename ?? '') === 'App.js') {
      console.log(`worklets plugin transforms App.js, options: ${JSON.stringify(options ?? {})}`);
    }
    return pre?.call(this, file);
  };
  return instance;
};
