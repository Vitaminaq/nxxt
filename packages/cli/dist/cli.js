'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var vite = require('vite');

var path = require('path');

var jiti = require('jiti');

var vue = require('@vitejs/plugin-vue');

var vueJsx = require('@vitejs/plugin-vue-jsx');

var legacy = require('@vitejs/plugin-legacy');

var vitePluginPwa = require('vite-plugin-pwa');

function _interopDefaultLegacy(e) {
  return e && _typeof(e) === 'object' && 'default' in e ? e["default"] : e;
}

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

var jiti__default = /*#__PURE__*/_interopDefaultLegacy(jiti);

var vue__default = /*#__PURE__*/_interopDefaultLegacy(vue);

var vueJsx__default = /*#__PURE__*/_interopDefaultLegacy(vueJsx);

var legacy__default = /*#__PURE__*/_interopDefaultLegacy(legacy);

var defaultNxxtConfigFile = 'nxxt.config';
var cwd = process.cwd();

var getNxxtConfig = function getNxxtConfig() {
  return jiti__default(path__default.resolve(cwd))("./".concat(defaultNxxtConfigFile))["default"];
};

var ssrTransformCustomDir = function ssrTransformCustomDir() {
  return {
    props: [],
    needRuntime: true
  };
};

var buildOptions = {
  plugins: [legacy__default({
    targets: ['defaults']
  }), vueJsx__default(), vue__default({
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
  }), vitePluginPwa.VitePWA({
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
  })],
  resolve: {
    alias: {
      '@': path__default.resolve(__dirname, './src')
    }
  },
  css: {
    postcss: {
      plugins: [require('postcss-pxtorem')({
        rootValue: 37.5,
        propList: ['*']
      })]
    }
  },
  build: {
    rollupOptions: {
      // 生产环境忽略无用包-暂不解决
      external: []
    }
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  }
};
console.log(buildOptions);
vite.build(buildOptions);
console.log(getNxxtConfig());
