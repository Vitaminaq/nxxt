'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var config = require('./config-062a82df.js');
var vite = require('vite');
require('path');
require('fs');
require('jiti');
require('chalk');
require('pretty-bytes');
require('boxen');
require('@nxxt/vue-app');



exports.defineNxxtConfig = config.defineNxxtConfig;
for (var k in vite) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) exports[k] = vite[k];
}
