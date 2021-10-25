'use strict';

var vite = require('vite');
var path = require('path');
var fs = require('fs');
var jiti = require('jiti');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var jiti__default = /*#__PURE__*/_interopDefaultLegacy(jiti);

const cwd = process.cwd();
const resolveModule = (p) => jiti__default(path__default.resolve(cwd))(p).default;
const resolve = (p) => path__default.resolve(process.cwd(), p);
const getTemplate = (p) => fs__default.readFileSync(resolve(p), "utf-8");
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

// import { template as vueTemplate } from '@nxxt/vue-app';
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
    // resolveVueTemplate(vueTemplate.dir, './entry-server.ts');
};
const getClientEntry = () => {
    return getTypeFile("src/entry-client");
};
const mergeNxxtConfig = (inlineConfig) => {
    const buildConfig = inlineConfig;
    const nxxtConfig = getNxxtConfig();
    let { viteOptions, serverEntry } = nxxtConfig;
    const mode = inlineConfig.mode || nxxtConfig.mode || "production";
    process.env.NODE_ENV = mode;
    buildConfig.mode = mode;
    viteOptions = vite.mergeConfig(viteOptions || {}, buildConfig);
    serverEntry = serverEntry || getServerEntry() || '';
    return {
        ...nxxtConfig,
        viteOptions,
        serverEntry,
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

exports.defaultNxxtConfigFile = defaultNxxtConfigFile;
exports.defineNxxtConfig = defineNxxtConfig;
exports.getClientEntry = getClientEntry;
exports.getDirFiles = getDirFiles;
exports.getNxxtConfig = getNxxtConfig;
exports.getServerEntry = getServerEntry;
exports.getSsrTransformCustomDir = getSsrTransformCustomDir;
exports.getTemplate = getTemplate;
exports.mergeCompilerOptions = mergeCompilerOptions;
exports.mergeNxxtConfig = mergeNxxtConfig;
exports.mergePwa = mergePwa;
exports.mergePxToRem = mergePxToRem;
exports.resolve = resolve;
exports.resolveModule = resolveModule;
