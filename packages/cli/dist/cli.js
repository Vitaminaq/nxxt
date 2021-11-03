'use strict';

var cac = require('cac');
var vite = require('vite');
var path = require('path');
var fs = require('fs');
var jiti = require('jiti');
var chalk = require('chalk');
var prettyBytes = require('pretty-bytes');
var boxen = require('boxen');
var vueApp = require('@nxxt/vue-app');
var vue = require('@vitejs/plugin-vue');
var vueJsx = require('@vitejs/plugin-vue-jsx');
var vueLegacy = require('@vitejs/plugin-legacy');
var vitePluginPwa = require('vite-plugin-pwa');
var serverRenderer = require('@vue/server-renderer');
var hook = require('@nxxt/hook');
var express = require('express');
var dotenv = require('dotenv');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var jiti__default = /*#__PURE__*/_interopDefaultLegacy(jiti);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var prettyBytes__default = /*#__PURE__*/_interopDefaultLegacy(prettyBytes);
var boxen__default = /*#__PURE__*/_interopDefaultLegacy(boxen);
var vue__default = /*#__PURE__*/_interopDefaultLegacy(vue);
var vueJsx__default = /*#__PURE__*/_interopDefaultLegacy(vueJsx);
var vueLegacy__default = /*#__PURE__*/_interopDefaultLegacy(vueLegacy);
var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var dotenv__default = /*#__PURE__*/_interopDefaultLegacy(dotenv);

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

const getBaseOptions = (options) => {
    const { pwa, jsx, pxToRem, legacy, alias = {}, compilerOptions, viteOptions } = options;
    const baseOptions = { ...viteOptions };
    let { plugins = [], esbuild = {}, resolve = {}, css = {} } = baseOptions;
    plugins = [
        ...plugins,
        vue__default({
            template: {
                compilerOptions: compilerOptions ? mergeCompilerOptions(compilerOptions) : {}
            }
        })
    ];
    legacy && plugins.push(vueLegacy__default({
        targets: ['defaults'],
    }));
    jsx && plugins.push(vueJsx__default());
    pwa && plugins.push(vitePluginPwa.VitePWA(mergePwa(pwa)));
    baseOptions.plugins = plugins;
    baseOptions.resolve = {
        ...resolve,
        alias: {
            ...resolve.alias,
            '@': path__default.resolve(process.cwd(), './src'),
            ...alias
        }
    };
    pxToRem && (baseOptions.css = {
        ...css,
        postcss: {
            plugins: [
                require('postcss-pxtorem')(mergePxToRem(pxToRem)),
            ],
        },
    });
    jsx && (baseOptions.esbuild = {
        ...esbuild,
        jsxFactory: 'h',
        jsxFragment: 'Fragment',
    });
    return baseOptions;
};

const getClientOptions = (options) => {
    const baseOptions = getBaseOptions(options);
    return {
        ...baseOptions,
        build: {
            ...baseOptions.build,
            ssrManifest: true,
            outDir: 'dist/client'
        }
    };
};

const getServerOptions = (options) => {
    const baseOptions = getBaseOptions(options);
    return {
        ...baseOptions,
        build: {
            ...baseOptions.build,
            ssr: options.serverEntry,
            outDir: 'dist/server'
        }
    };
};

const getBaseBuildConfig = (customConfig) => {
    return {
        clientOptions: getClientOptions(customConfig),
        serverOptions: getServerOptions(customConfig)
    };
};

const getUserMiddleware = () => {
    return getDirFiles('middleware').map(i => {
        return resolveModule(`./middleware/${i}`);
    });
};
class Server {
    constructor(render) {
        this.render = render;
        this.app = express__default();
        this.middleware();
        this.listen();
    }
    async middleware() {
        const { app, render } = this;
        // custom middleware
        getUserMiddleware().forEach(mid => mid(app));
        if (!render.ssr.isBuild) {
            if (!this.render.devServer)
                return;
            app.use(this.render.devServer.middlewares);
        }
        else {
            app.use(require("compression")());
            app.use(require("serve-static")(resolve("dist/client"), {
                index: false,
                setHeaders: (res) => {
                    res.setHeader("Cache-Control", "public,max-age=31536000");
                },
            }));
            // 响应拦截
            app.use(require("route-cache").cacheSeconds(60, (req) => {
                const { v, pd } = req.query;
                // 预取数据模式不做缓存
                return !Number(pd) && v && `${req.path}${v}`;
            }));
        }
        this.registerRoute();
    }
    registerRoute() {
        this.app.use("*", async (req, res) => {
            if (req.method.toLocaleLowerCase() !== 'get' || req.originalUrl === '/favicon.ico')
                return;
            try {
                const html = await this.render.renderHtml(req);
                // 禁用send的弱缓存
                res
                    .status(200)
                    .set({
                    "Content-Type": "text/html",
                    "Cache-Control": "no-cache",
                })
                    .send(html);
            }
            catch (e) {
                const { devServer } = this.render;
                devServer && devServer.ssrFixStacktrace(e);
                console.log(e.stack);
                res.status(500).end(e.stack);
            }
        });
    }
    listen() {
        const { app, render } = this;
        const { port = 3000 } = render.ssr.config;
        return app.listen(port, () => {
            return showBanner(this);
        });
    }
}

const serialize = require("serialize-javascript");
class Render {
    constructor(ssr) {
        this.devServer = null;
        this.ssr = ssr;
        this.init();
    }
    async init() {
        const { isBuild, buildOptions, config } = this.ssr;
        if (!isBuild) {
            this.devServer = await vite.createServer({
                root: config.root,
                mode: process.env.NODE_ENV,
                logLevel: "info",
                server: {
                    middlewareMode: true,
                },
                ...buildOptions
            });
        }
        new Server(this);
    }
    async renderHtml(req) {
        const url = req.originalUrl;
        const { isBuild, config } = this.ssr;
        let template = '';
        let render;
        if (!isBuild) {
            if (!this.devServer)
                return;
            const { defaultTemplateDir } = config;
            const { transformIndexHtml, ssrLoadModule } = this.devServer;
            template = getDevTemplate(defaultTemplateDir || '', "index.html");
            template = await transformIndexHtml(url, template);
            render = (await ssrLoadModule(defaultTemplateDir ? '/entry-server.ts' : `/${getServerEntry()}`)).render;
        }
        else {
            template = getTemplate("dist/client/index.html");
            render = require(resolve("dist/server/entry-server.js")).render;
        }
        const main = await Promise.resolve(render(req.query));
        const { app, store } = main;
        await serverRender(req, main);
        const { rootHtml, preloadLinks } = await renderRootHtml(app, isBuild ? require(resolve("dist/client/ssr-manifest.json")) : {});
        // 读取配置文件，注入给客户端
        const baseparsed = dotenv__default.config({ path: resolve('.env') }).parsed;
        const parsed = dotenv__default.config({ path: resolve(`.env.${process.env.NODE_ENV}`) }).parsed;
        const state = "<script>window.__INIT_STATE__=" +
            serialize(store, { isJSON: true }) + ";" +
            'window.__APP_CONFIG__=' + serialize({ ...baseparsed, ...parsed }, { isJSON: true }) +
            "</script>";
        const html = template
            .replace(`<!--preload-links-->`, preloadLinks)
            .replace(`<!--app-html-->`, rootHtml)
            .replace(`<!--app-store-->`, state);
        return html;
    }
}
const serverRender = async (req, main) => {
    const { router, store } = main;
    const { originalUrl, query } = req;
    // sync url
    router.push(originalUrl);
    await router.isReady();
    const { pd } = router.currentRoute.value.query;
    Number(pd) && store.$setSsrPath(originalUrl);
    return hook.getAsyncData(router, store, true, query);
};
const renderRootHtml = async (app, manifest) => {
    const ctx = {};
    // render vue to html
    const rootHtml = await serverRenderer.renderToString(app, ctx);
    // get preload source
    const preloadLinks = ctx.modules
        ? renderPreloadLinks(ctx.modules, manifest)
        : "";
    return { rootHtml, preloadLinks };
};
const renderPreloadLinks = (modules, manifest) => {
    let links = "";
    const seen = new Set();
    modules.forEach((id) => {
        const files = manifest[id];
        if (files) {
            files.forEach((file) => {
                if (!seen.has(file)) {
                    seen.add(file);
                    links += renderPreloadLink(file);
                }
            });
        }
    });
    return links;
};
const renderPreloadLink = (file) => {
    if (file.endsWith(".js")) {
        return `<link rel="modulepreload" crossorigin href="${file}">`;
    }
    else if (file.endsWith(".css")) {
        return `<link rel="stylesheet" href="${file}">`;
    }
    else if (file.endsWith(".woff")) {
        return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
    }
    else if (file.endsWith(".woff2")) {
        return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
    }
    else if (file.endsWith(".gif")) {
        return ` <link rel="preload" href="${file}" as="image" type="image/gif">`;
    }
    else if (file.endsWith(".jpg") || file.endsWith(".jpeg")) {
        return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`;
    }
    else if (file.endsWith(".png")) {
        return ` <link rel="preload" href="${file}" as="image" type="image/png">`;
    }
    else {
        // TODO
        return "";
    }
};

class SSR {
    constructor({ buildOptions, runType, config }) {
        this.isBuild = false;
        this.isBuild = runType === "build";
        this.setEnv(runType);
        this.buildOptions = buildOptions;
        this.config = config;
        new Render(this);
    }
    setEnv(runType) {
        process.env.NXXT_RUN_TYPE = runType || "dev";
    }
}

const cli = cac.cac("nxxt");
function cleanOptions(options) {
    const ret = { ...options };
    delete ret['--'];
    // delete ret.c
    // delete ret.config
    // delete ret.r
    // delete ret.root
    // delete ret.base
    // delete ret.l
    // delete ret.logLevel
    // delete ret.clearScreen
    // delete ret.d
    // delete ret.debug
    // delete ret.f
    // delete ret.filter
    // delete ret.m
    // delete ret.mode
    return ret;
}
cli.option("-m, --mode <mode>", `[string] set env mode`);
// dev
cli
    .command("[root]") // default command
    .alias("serve")
    .action((root, options) => {
    const config = mergeNxxtConfig({
        root,
        ...cleanOptions(options),
    });
    const buildOptions = getClientOptions(config);
    new SSR({
        buildOptions,
        config
    });
});
// build
cli
    .command("build [root]")
    .action(async (root, options) => {
    const config = mergeNxxtConfig({
        root,
        ...cleanOptions(options),
    });
    const { clientOptions, serverOptions } = getBaseBuildConfig(config);
    vite.build(clientOptions);
    vite.build(serverOptions);
});
// start
cli
    .command("start [root]")
    .action((root, options) => {
    const config = mergeNxxtConfig({
        root,
        ...cleanOptions(options),
    });
    const buildOptions = getClientOptions(config);
    new SSR({
        buildOptions,
        config,
        runType: "build",
    });
});
cli.help();
cli.version(require("../package.json").version);
cli.parse();
