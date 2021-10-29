'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

var dependencies = {
	"@wefly/vue-store-next": "^1.0.1",
	vue: "3.1.5",
	"vue-router": "4.0.10"
};

const template = {
    dependencies,
    dir: path__default.join(__dirname, '..', 'template'),
    files: [
        'App.vue',
        'main.ts',
        'entry-client.ts',
        'entry-server.ts',
        'router.ts',
        'store.ts'
    ]
};

exports.template = template;
