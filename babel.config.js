/** @type {import('react-native-worklets/plugin').PluginOptions} */
const workletsPluginOptions = {
  bundleMode: true,
  strictGlobal: true,
};

module.exports = {
  presets: [
    process.env.PRESET_WORKLETS_FALSE
      ? ['babel-preset-expo', { worklets: false }]
      : 'babel-preset-expo',
  ],
  plugins: [['react-native-worklets/plugin', workletsPluginOptions]],
};
