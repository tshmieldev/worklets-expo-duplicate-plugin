# Two worklets Babel plugin instances in Expo

An Expo app set up with the [Bundle Mode setup](https://docs.swmansion.com/react-native-worklets/docs/bundleMode/setup) runs `react-native-worklets/plugin` twice on every file: once from `babel.config.js`, with the Bundle Mode options, and once from `babel-preset-expo`, with no options.

## Setup

An Expo SDK 58 app, with every step of the Bundle Mode setup page:

- `babel.config.js`: the plugin in `plugins` with `bundleMode: true` and `strictGlobal: true`, and `babel-preset-expo` in `presets`.
- `metro.config.js`: the Expo tab, `getBundleModeMetroConfig(getDefaultConfig(__dirname))`.
- The `metro` and `metro-runtime` patches from `packages/react-native-worklets/bundleMode/patches/patch-package` (0.87.1, matching the installed Metro), applied with `patch-package` on `postinstall`.

`babel-preset-expo` adds the plugin itself whenever it can resolve it (`node_modules/babel-preset-expo/build/configs/expo.js:105`):

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

Both scripts bundle the app for iOS with Metro (`expo export --platform ios --dev --clear --max-workers 1`). `probe.js` is preloaded into every process with `NODE_OPTIONS=--require`. It wraps the plugin to print when an instance is created and when its `pre()` runs on `App.js`. Nothing in `node_modules` is edited except by the two Metro patches.

`npm run control` is the same build with `{ worklets: false }` passed to `babel-preset-expo`.

## Output

`npm run repro`:

```
[pid 89812] worklets plugin instance created, options: {"bundleMode":true,"strictGlobal":true}
[pid 89812] worklets plugin instance created, options: {}
[pid 89812] worklets plugin instance created, options: {}
[pid 89812]   pre() on App.js, options: {"bundleMode":true,"strictGlobal":true}
[pid 89812]   pre() on App.js, options: {}
[pid 89812] worklets plugin instance created, options: {}
[pid 89812] worklets plugin instance created, options: {}
iOS Bundled 3647ms index.js (822 modules)
```

`npm run control`:

```
[pid 89930] worklets plugin instance created, options: {"bundleMode":true,"strictGlobal":true}
[pid 89930]   pre() on App.js, options: {"bundleMode":true,"strictGlobal":true}
iOS Bundled 3680ms index.js (822 modules)
```

`App.js` goes through `pre()` twice in the repro and once in the control. The extra `options: {}` instances in the repro are Babel building the preset's config more than once; each build creates another instance of the preset's copy.

## Versions

- expo 58.0.26, babel-preset-expo 58.0.26
- react-native 0.88.1, react 19.3.0
- react-native-worklets 0.13.0
- metro 0.87.1, metro-runtime 0.87.1 (patched)
