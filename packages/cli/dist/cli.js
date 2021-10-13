'use strict';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var cac = require('cac');

var vite = require('vite');

var path = require('path');

var fs = require('fs');

var jiti = require('jiti');

var vue = require('@vitejs/plugin-vue');

var vueJsx = require('@vitejs/plugin-vue-jsx');

var vueLegacy = require('@vitejs/plugin-legacy');

var vitePluginPwa = require('vite-plugin-pwa');

function _interopDefaultLegacy(e) {
  return e && _typeof(e) === 'object' && 'default' in e ? e["default"] : e;
}

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

var jiti__default = /*#__PURE__*/_interopDefaultLegacy(jiti);

var vue__default = /*#__PURE__*/_interopDefaultLegacy(vue);

var vueJsx__default = /*#__PURE__*/_interopDefaultLegacy(vueJsx);

var vueLegacy__default = /*#__PURE__*/_interopDefaultLegacy(vueLegacy);

var defaultNxxtConfigFile = 'nxxt.config';
var cwd = process.cwd();
var fileTypes = ['js', 'ts', 'mjs'];

var getNxxtConfig = function getNxxtConfig() {
  var configFileTypes = fileTypes.filter(function (t) {
    return fs__default.existsSync(path__default.resolve(cwd, "".concat(defaultNxxtConfigFile, ".").concat(t)));
  });
  if (!configFileTypes) return null;
  return jiti__default(path__default.resolve(cwd))("./".concat(defaultNxxtConfigFile))["default"];
};

var ssrTransformCustomDir = function ssrTransformCustomDir() {
  return {
    props: [],
    needRuntime: true
  };
};

var getBaseOptions = function getBaseOptions(options) {
  var pwa = options.pwa,
      jsx = options.jsx,
      pxToRem = options.pxToRem,
      legacy = options.legacy,
      _options$alias = options.alias,
      alias = _options$alias === void 0 ? {} : _options$alias;
  var plugins = [vue__default({
    template: {
      compilerOptions: {
        directiveTransforms: {
          'img-lazy-load': ssrTransformCustomDir,
          rescroll: ssrTransformCustomDir
        },
        isCustomElement: function isCustomElement(tag) {
          if (tag === 'wx-open-launch-weapp') return true;
          return false;
        }
      }
    }
  })];
  legacy && plugins.push(vueLegacy__default({
    targets: ['defaults']
  }));
  jsx && plugins.push(vueJsx__default());
  pwa && plugins.push(vitePluginPwa.VitePWA({
    strategies: 'generateSW',
    manifest: {},
    workbox: {
      cacheId: 'kbb',
      sourcemap: false,
      globIgnores: ['node_modules/**', '*.js', '*.css'],
      globPatterns: [],
      runtimeCaching: [{
        urlPattern: /\/.*(\?|&)v=.*/,
        handler: 'StaleWhileRevalidate'
      }, {
        urlPattern: /\/api\/.*(\?|&)/,
        handler: 'NetworkFirst'
      }, {
        urlPattern: /\.(?:png|gif|jpg|jpeg|webp|svg)$/,
        handler: 'StaleWhileRevalidate'
      }]
    }
  }));
  var baseOptions = {
    plugins: plugins,
    resolve: {
      alias: _objectSpread({
        '@': path__default.resolve(process.cwd(), './src')
      }, alias)
    }
  };
  pxToRem && (baseOptions.css = {
    postcss: {
      plugins: [require('postcss-pxtorem')({
        rootValue: 37.5,
        propList: ['*']
      })]
    }
  });
  jsx && (baseOptions.esbuild = {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  });
  return baseOptions;
};

var getClientOptions = function getClientOptions(options) {
  var baseOptions = getBaseOptions(options);
  return _objectSpread(_objectSpread({}, baseOptions), {}, {
    build: _objectSpread(_objectSpread({}, baseOptions.build), {}, {
      ssrManifest: true,
      outDir: 'dist/client'
    })
  });
};

var getServerOptions = function getServerOptions(options) {
  var baseOptions = getBaseOptions(options);
  return _objectSpread(_objectSpread({}, baseOptions), {}, {
    build: _objectSpread(_objectSpread({}, baseOptions.build), {}, {
      ssr: options.serverEntry,
      outDir: 'dist/server'
    })
  });
};

var getBaseBuildConfig = function getBaseBuildConfig(customConfig) {
  return {
    clientOptions: getClientOptions(customConfig),
    serverOptions: getServerOptions(customConfig)
  };
};

var cli = cac.cac('nxxt'); // dev

cli.command('[root]') // default command
.alias('serve').action(function () {
  console.log('不好意思，此功能正在开发中');
}); // build

cli.command('build [root]').action(function () {
  // 获取构建参数
  var _getBaseBuildConfig = getBaseBuildConfig(getNxxtConfig()),
      clientOptions = _getBaseBuildConfig.clientOptions,
      serverOptions = _getBaseBuildConfig.serverOptions; // 服务端渲染构建


  vite.build(clientOptions).then(function () {
    vite.build(serverOptions);
  });
});
cli.help();
cli.version(require('../package.json').version);
cli.parse();
