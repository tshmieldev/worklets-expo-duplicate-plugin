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

`probe.js` is not part of the app. It is preloaded into each process and prints one line each time a worklets plugin instance starts transforming `App.js`, with that instance's options.

## Output

```
worklets plugin transforms App.js, options: {"bundleMode":true,"strictGlobal":true}
worklets plugin transforms App.js, options: {}
iOS Bundled 3745ms index.js (714 modules)
```

The first line is the plugin from `babel.config.js`. The second is the copy added by `babel-preset-expo`.

## Control

Change the preset to `['babel-preset-expo', { worklets: false }]` and run the same command:

```
worklets plugin transforms App.js, options: {"bundleMode":true,"strictGlobal":true}
iOS Bundled 3222ms index.js (714 modules)
```

## Versions

expo 58.0.26, babel-preset-expo 58.0.x, react-native 0.88.1, react-native-worklets 0.13.0, metro and metro-runtime 0.87.1 (patched).
