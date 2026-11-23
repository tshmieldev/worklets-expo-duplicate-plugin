# Two worklets Babel plugin instances in Expo

Following the [Bundle Mode setup](https://docs.swmansion.com/react-native-worklets/docs/bundleMode/setup) in an Expo app makes Babel run the `react-native-worklets/plugin` twice on every file.

`babel.config.js` follows the docs: the plugin goes in `plugins`, with the Bundle Mode options.

```js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [['react-native-worklets/plugin', workletsPluginOptions]],
};
```

`babel-preset-expo` also adds the plugin, with no options, whenever `react-native-worklets` is installed (`node_modules/babel-preset-expo/build/configs/expo.js:105`):

```js
    if (options.worklets !== false && options.reanimated !== false) {
        const workletsPluginPath = (0, _resolveModule.resolveModule)(api, 'react-native-worklets/plugin');
        if (workletsPluginPath) {
            plugins.push([
                require(workletsPluginPath)
            ]);
        }
```

Babel does not merge a preset's plugin with the same plugin in `plugins`, so both run.

## Run

```sh
npm install
npm run repro
npm run control
```

`repro.js` wraps the plugin to print when an instance is created and when its `pre()` runs, then transforms `App.js` once.

## Output

`npm run repro`:

```
worklets plugin instance created, options: {"bundleMode":true,"strictGlobal":true}
worklets plugin instance created, options: {}
  pre() on App.js, options: {"bundleMode":true,"strictGlobal":true}
  pre() on App.js, options: {}
```

`npm run control` passes `{ worklets: false }` to `babel-preset-expo`:

```
worklets plugin instance created, options: {"bundleMode":true,"strictGlobal":true}
  pre() on App.js, options: {"bundleMode":true,"strictGlobal":true}
```

## Versions

- babel-preset-expo 58.0.26 (Expo SDK 58)
- react-native-worklets 0.13.0
- @babel/core 7.29.13
