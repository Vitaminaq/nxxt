'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hook = require('./hook-269f8629.js');
var vite = require('vite');
require('path');
require('fs');
require('jiti');



exports.defaultNxxtConfigFile = hook.defaultNxxtConfigFile;
exports.defineNxxtConfig = hook.defineNxxtConfig;
exports.getAsyncData = hook.getAsyncData;
exports.getClientEntry = hook.getClientEntry;
exports.getNxxtConfig = hook.getNxxtConfig;
exports.getServerEntry = hook.getServerEntry;
exports.getSsrTransformCustomDir = hook.getSsrTransformCustomDir;
exports.mergeCompilerOptions = hook.mergeCompilerOptions;
exports.mergeNxxtConfig = hook.mergeNxxtConfig;
exports.mergePwa = hook.mergePwa;
exports.mergePxToRem = hook.mergePxToRem;
for (var k in vite) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) exports[k] = vite[k];
}
