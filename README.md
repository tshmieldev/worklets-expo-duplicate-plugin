# Two worklets Babel plugins in an Expo app

An Expo app set up with the [Bundle Mode setup](https://docs.swmansion.com/react-native-worklets/docs/bundleMode/setup) gets `react-native-worklets/plugin` from two places:

- `babel.config.js`, with the Bundle Mode options, as the docs say;
- `babel-preset-expo`, with no options, which adds it whenever it can resolve it (`node_modules/babel-preset-expo/build/configs/expo.js:105`).

Babel does not merge a preset's plugin with the same plugin in `plugins`, so both run on every file.

## How this app was made

1. `npx create-expo-app@latest --template blank@sdk-58` (first commit).
2. `npx expo install react-native-worklets`.
3. `npx expo customize babel.config.js`, then the docs' Babel step: the plugin in `plugins` with `bundleMode` and `strictGlobal`.
4. The docs' Metro step, Expo tab: `metro.config.js`.
5. The `metro` and `metro-runtime` 0.87.1 patches from `packages/react-native-worklets/bundleMode/patches/patch-package`, matching the installed Metro: `npm dedupe`, `npm install --save-dev patch-package`, copy into `patches/`.

## Run

```sh
npm install
npx patch-package
NODE_OPTIONS='--require ./probe.js' npx expo export --platform ios --dev --clear --max-workers 1
```

`probe.js` is not part of the app. It is preloaded into each process and prints once every time Babel creates an instance of the worklets plugin, with its options.

## Output

```
[pid 95378] worklets plugin instance, options: {"bundleMode":true,"strictGlobal":true}
[pid 95378] worklets plugin instance, options: {}
[pid 95378] worklets plugin instance, options: {}
[pid 95378] worklets plugin instance, options: {}
[pid 95378] worklets plugin instance, options: {}
iOS Bundled 3468ms index.js (714 modules)
```

The instance with options comes from `babel.config.js`. Every `{}` instance is the copy added by `babel-preset-expo`; Babel creates it again for each preset configuration it builds.

## Control

Change the preset to `['babel-preset-expo', { worklets: false }]` and run the same command:

```
[pid 95558] worklets plugin instance, options: {"bundleMode":true,"strictGlobal":true}
iOS Bundled 3347ms index.js (714 modules)
```

## Versions

expo 58.0.26, babel-preset-expo 58.0.x, react-native 0.88.1, react-native-worklets 0.13.0, metro and metro-runtime 0.87.1 (patched).
