'use strict';

var cac = require('cac');
var vite = require('vite');
var hook = require('./hook-80b78a8e.js');
var vue = require('@vitejs/plugin-vue');
var vueJsx = require('@vitejs/plugin-vue-jsx');
var vueLegacy = require('@vitejs/plugin-legacy');
var path = require('path');
var vitePluginPwa = require('vite-plugin-pwa');
var serverRenderer = require('@vue/server-renderer');
var express = require('express');
var dotenv = require('dotenv');
require('fs');
require('jiti');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

var vue__default = /*#__PURE__*/_interopDefaultLegacy(vue);
var vueJsx__default = /*#__PURE__*/_interopDefaultLegacy(vueJsx);
var vueLegacy__default = /*#__PURE__*/_interopDefaultLegacy(vueLegacy);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var dotenv__default = /*#__PURE__*/_interopDefaultLegacy(dotenv);

const getBaseOptions = (options) => {
    const { pwa, jsx, pxToRem, legacy, alias = {}, compilerOptions, viteOptions } = options;
    const baseOptions = { ...viteOptions };
    let { plugins = [], esbuild = {}, resolve = {}, css = {} } = baseOptions;
    plugins = [
        ...plugins,
        vue__default({
            template: {
                compilerOptions: compilerOptions ? hook.mergeCompilerOptions(compilerOptions) : {}
            }
        })
    ];
    legacy && plugins.push(vueLegacy__default({
        targets: ['defaults'],
    }));
    jsx && plugins.push(vueJsx__default());
    pwa && plugins.push(vitePluginPwa.VitePWA(hook.mergePwa(pwa)));
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
                require('postcss-pxtorem')(hook.mergePxToRem(pxToRem)),
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
    return hook.getDirFiles('middleware').map(i => {
        return hook.resolveModule(`./middleware/${i}`);
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
            app.use(require("serve-static")(hook.resolve("dist/client"), {
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
            console.log('当前ssr路径', req.method, req.originalUrl);
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
            console.log(`http://localhost:${port}`);
            console.log(`http://${require("ip").address()}:${port}`);
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
        const { isBuild, buildOptions } = this.ssr;
        if (!isBuild) {
            this.devServer = await vite.createServer({
                root: process.cwd(),
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
        const { isBuild } = this.ssr;
        let template = '';
        let render;
        if (!isBuild) {
            if (!this.devServer)
                return;
            const { transformIndexHtml, ssrLoadModule } = this.devServer;
            template = hook.getTemplate("index.html");
            template = await transformIndexHtml(url, template);
            render = (await ssrLoadModule(`/${hook.getServerEntry()}`)).render;
        }
        else {
            template = hook.getTemplate("dist/client/index.html");
            render = require(hook.resolve("dist/server/entry-server.js")).render;
        }
        const main = await Promise.resolve(render(req.query));
        const { app, store } = main;
        await serverRender(req, main);
        const { rootHtml, preloadLinks } = await renderRootHtml(app, isBuild ? require(hook.resolve("dist/client/ssr-manifest.json")) : {});
        // 读取配置文件，注入给客户端
        const baseConfig = dotenv__default.config({ path: hook.resolve('.env') }).parsed;
        const config = dotenv__default.config({ path: hook.resolve(`.env.${process.env.NODE_ENV}`) }).parsed;
        const state = "<script>window.__INIT_STATE__=" +
            serialize(store, { isJSON: true }) + ";" +
            'window.__APP_CONFIG__=' + serialize({ ...baseConfig, ...config }, { isJSON: true }) +
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
    await hook.getAsyncData(router, store, true, query);
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
    const config = hook.mergeNxxtConfig({
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
    const config = hook.mergeNxxtConfig({
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
    const config = hook.mergeNxxtConfig({
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
