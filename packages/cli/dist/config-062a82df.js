'use strict';

var vite = require('vite');
var path = require('path');
var fs = require('fs');
var jiti = require('jiti');
var chalk = require('chalk');
var prettyBytes = require('pretty-bytes');
var boxen = require('boxen');
var vueApp = require('@nxxt/vue-app');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var jiti__default = /*#__PURE__*/_interopDefaultLegacy(jiti);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var prettyBytes__default = /*#__PURE__*/_interopDefaultLegacy(prettyBytes);
var boxen__default = /*#__PURE__*/_interopDefaultLegacy(boxen);

const cwd = process.cwd();
const resolveModule = (p) => jiti__default(path__default.resolve(cwd))(p).default;
const resolve = (p1, p) => path__default.resolve(p || process.cwd(), p1);
const isExitFile = (n) => fs__default.existsSync(resolve(n));
const getTemplate = (p) => fs__default.readFileSync(resolve(p), "utf-8");
const getDevTemplate = (p, n) => {
    if (p)
        return fs__default.readFileSync(path__default.resolve(p, n), "utf-8");
    return getTemplate(n);
};
const fileTypes = ["js", "ts"];
const getTypeFile = (p) => {
    const fts = fileTypes.filter((t) => fs__default.existsSync(resolve(`${p}.${t}`)));
    return fts.length ? `${p}.${fts[0]}` : null;
};
const getDirFiles = (folderName) => {
    const path = resolve(folderName);
    if (!fs__default.existsSync(path))
        return [];
    return fs__default.readdirSync(path);
};
function getMemoryUsage() {
    // https://nodejs.org/api/process.html#process_process_memoryusage
    const { heapUsed, rss } = process.memoryUsage();
    return { heap: heapUsed, rss };
}
function getFormattedMemoryUsage() {
    const { heap, rss } = getMemoryUsage();
    return `Memory usage: ${chalk__default.bold(prettyBytes__default(heap))} (RSS: ${prettyBytes__default(rss)})`;
}
function showBanner(nxxt) {
    const titleLines = [];
    const messageLines = [];
    const label = (name) => chalk__default.bold.cyan(`▸ ${name}:`);
    titleLines.push(`${label('Environment')} ${process.env.NODE_ENV}`);
    titleLines.push(`${label('Rendering')}   server-side`);
    titleLines.push('\n' + getFormattedMemoryUsage());
    const { render } = nxxt;
    const { port = 3000 } = render.ssr.config;
    messageLines.push(chalk__default.bold('\nListening to：'));
    messageLines.push('  👉 ' + chalk__default.underline.blue(`http://localhost:${port}`));
    messageLines.push('  👉 ' + chalk__default.underline.blue(`http://${require("ip").address()}:${port}`));
    process.stdout.write(boxen__default([titleLines.join('\n'), messageLines.join('\n')].join('\n'), {
        borderColor: 'green',
        borderStyle: 'round',
        padding: 1,
        margin: 1
    }));
}

const defaultNxxtConfigFile = "nxxt.config";
const defineNxxtConfig = (options) => {
    return options;
};
const getNxxtConfig = () => {
    if (!getTypeFile(defaultNxxtConfigFile))
        return {};
    return resolveModule(`./${defaultNxxtConfigFile}`);
};
const getServerEntry = () => {
    return getTypeFile("src/entry-server");
};
const mergeNxxtConfig = (inlineConfig) => {
    const buildConfig = inlineConfig;
    const nxxtConfig = getNxxtConfig();
    let { viteOptions, serverEntry } = nxxtConfig;
    const mode = inlineConfig.mode || nxxtConfig.mode || "production";
    const { NODE_ENV } = process.env;
    if (!NODE_ENV || NODE_ENV !== mode) {
        process.env.NODE_ENV = mode;
    }
    buildConfig.mode = mode;
    serverEntry = serverEntry || getServerEntry() || '';
    let defaultTemplateDir = '';
    // custom index.html
    if (!isExitFile('index.html')) {
        const { dir } = vueApp.template;
        buildConfig.root = dir;
        defaultTemplateDir = dir;
        serverEntry = resolve('entry-server.ts', dir);
    }
    viteOptions = vite.mergeConfig(viteOptions || {}, buildConfig);
    return {
        ...nxxtConfig,
        viteOptions,
        serverEntry,
        defaultTemplateDir
    };
};
const getSsrTransformCustomDir = (runTime = false) => {
    return () => {
        return {
            props: [],
            needRuntime: runTime,
        };
    };
};
const mergeCompilerOptions = ({ runtimeDirective = [], customDirective = [], customElement = [], }) => {
    const directiveTransforms = {};
    runtimeDirective.forEach((r) => {
        directiveTransforms[r] = getSsrTransformCustomDir(true);
    });
    customDirective.forEach((c) => {
        directiveTransforms[c] = getSsrTransformCustomDir();
    });
    return {
        directiveTransforms,
        isCustomElement: (tag) => {
            return customElement.includes(tag);
        },
    };
};
const mergePxToRem = (options) => {
    if (typeof options === "boolean")
        return {
            rootValue: 37.5,
            propList: ["*"],
        };
    return options;
};
const mergePwa = (options) => {
    if (typeof options === "boolean")
        return {
            strategies: "generateSW",
            manifest: {},
            workbox: {
                cacheId: "nxxt",
                sourcemap: false,
                globIgnores: ["node_modules/**", "*.js", "*.css"],
                globPatterns: [],
                runtimeCaching: [
                    {
                        urlPattern: /\/.*(\?|&)v=.*/,
                        handler: "StaleWhileRevalidate",
                    },
                    {
                        urlPattern: /\/api\/.*(\?|&)/,
                        handler: "NetworkFirst",
                    },
                    {
                        urlPattern: /\.(?:png|gif|jpg|jpeg|webp|svg)$/,
                        handler: "StaleWhileRevalidate",
                    },
                ],
            },
        };
    return options;
};

exports.defineNxxtConfig = defineNxxtConfig;
exports.getDevTemplate = getDevTemplate;
exports.getDirFiles = getDirFiles;
exports.getServerEntry = getServerEntry;
exports.getTemplate = getTemplate;
exports.mergeCompilerOptions = mergeCompilerOptions;
exports.mergeNxxtConfig = mergeNxxtConfig;
exports.mergePwa = mergePwa;
exports.mergePxToRem = mergePxToRem;
exports.resolve = resolve;
exports.resolveModule = resolveModule;
exports.showBanner = showBanner;
