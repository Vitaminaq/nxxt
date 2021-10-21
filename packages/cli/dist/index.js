'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var config = require('./config-07369acc.js');
var vite = require('vite');
require('path');
require('fs');
require('jiti');



exports.defaultNxxtConfigFile = config.defaultNxxtConfigFile;
exports.defineNxxtConfig = config.defineNxxtConfig;
exports.getClientEntry = config.getClientEntry;
exports.getNxxtConfig = config.getNxxtConfig;
exports.getServerEntry = config.getServerEntry;
exports.getSsrTransformCustomDir = config.getSsrTransformCustomDir;
exports.mergeCompilerOptions = config.mergeCompilerOptions;
exports.mergeNxxtConfig = config.mergeNxxtConfig;
exports.mergePwa = config.mergePwa;
exports.mergePxToRem = config.mergePxToRem;
for (var k in vite) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) exports[k] = vite[k];
}
