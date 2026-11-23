const pluginPath = require.resolve('react-native-worklets/plugin', { paths: [process.cwd()] });
const plugin = require(pluginPath);
require.cache[pluginPath].exports = function (api, options, dirname) {
  console.log(`[pid ${process.pid}] worklets plugin instance, options: ${JSON.stringify(options)}`);
  return plugin(api, options, dirname);
};
