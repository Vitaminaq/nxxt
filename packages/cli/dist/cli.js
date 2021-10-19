'use strict';

var cac = require('cac');
var vite = require('vite');
var path = require('path');
var fs = require('fs');
var jiti = require('jiti');
var vue = require('@vitejs/plugin-vue');
var vueJsx = require('@vitejs/plugin-vue-jsx');
var vueLegacy = require('@vitejs/plugin-legacy');
var vitePluginPwa = require('vite-plugin-pwa');
var express = require('express');
var serverRenderer = require('@vue/server-renderer');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var jiti__default = /*#__PURE__*/_interopDefaultLegacy(jiti);
var vue__default = /*#__PURE__*/_interopDefaultLegacy(vue);
var vueJsx__default = /*#__PURE__*/_interopDefaultLegacy(vueJsx);
var vueLegacy__default = /*#__PURE__*/_interopDefaultLegacy(vueLegacy);
var express__default = /*#__PURE__*/_interopDefaultLegacy(express);

const defaultNxxtConfigFile = 'nxxt.config';
const cwd = process.cwd();
const fileTypes = ['js', 'ts', 'mjs'];
const getNxxtConfig = () => {
    const configFileTypes = fileTypes.filter((t) => {
        return fs__default.existsSync(path__default.resolve(cwd, `${defaultNxxtConfigFile}.${t}`));
    });
    if (!configFileTypes)
        return null;
    return jiti__default(path__default.resolve(cwd))(`./${defaultNxxtConfigFile}`).default;
};
const mergeConfig = (inlineConfig) => {
    const nxxtConfig = getNxxtConfig();
    const mode = inlineConfig.mode || nxxtConfig.mode || 'production';
    process.env.NODE_ENV = mode;
    return {
        ...inlineConfig,
        ...nxxtConfig,
        mode,
    };
};

const ssrTransformCustomDir = () => {
    return {
        props: [],
        needRuntime: true,
    };
};
const getBaseOptions = (options) => {
    const { pwa, jsx, pxToRem, legacy, alias = {} } = options;
    const plugins = [
        vue__default({
            template: {
                compilerOptions: {
                    directiveTransforms: {
                        'img-lazy-load': ssrTransformCustomDir,
                        rescroll: ssrTransformCustomDir,
                    },
                    isCustomElement: (tag) => {
                        if (tag === 'wx-open-launch-weapp')
                            return true;
                        return false;
                    },
                },
            },
        }),
    ];
    legacy && plugins.push(vueLegacy__default({
        targets: ['defaults'],
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
            runtimeCaching: [
                {
                    urlPattern: /\/.*(\?|&)v=.*/,
                    handler: 'StaleWhileRevalidate',
                },
                {
                    urlPattern: /\/api\/.*(\?|&)/,
                    handler: 'NetworkFirst',
                },
                {
                    urlPattern: /\.(?:png|gif|jpg|jpeg|webp|svg)$/,
                    handler: 'StaleWhileRevalidate',
                },
            ],
        },
    }));
    const baseOptions = {
        plugins,
        resolve: {
            alias: {
                '@': path__default.resolve(process.cwd(), './src'),
                ...alias
            },
        },
    };
    pxToRem && (baseOptions.css = {
        postcss: {
            plugins: [
                require('postcss-pxtorem')({
                    rootValue: 37.5,
                    propList: ['*'],
                }),
            ],
        },
    });
    jsx && (baseOptions.esbuild = {
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

const resolve = (p) => path__default.resolve(process.cwd(), p);
const getTemplate = (p) => fs__default.readFileSync(resolve(p), 'utf-8');

class Server {
    constructor(ssr) {
        this.ssr = ssr;
        this.app = express__default();
        this.middleware();
        this.listen();
    }
    async middleware() {
        const { app } = this;
        if (!this.ssr.isBuild) {
            app.use(this.ssr.devServer.middlewares);
        }
        else {
            app.use(require('compression')());
            app.use(require('serve-static')(resolve('dist/client'), {
                index: false,
                setHeaders: (res) => {
                    res.setHeader('Cache-Control', 'public,max-age=31536000');
                },
            }));
            // 响应拦截
            app.use(require('route-cache').cacheSeconds(60, (req) => {
                const { v, pd } = req.query;
                // 预取数据模式不做缓存
                return !Number(pd) && v && `${req.path}${v}`;
            }));
        }
        this.registerRoute();
    }
    registerRoute() {
        this.app.use('*', async (req, res) => {
            try {
                const html = await this.ssr._render(req);
                // 禁用send的弱缓存
                res.status(200)
                    .set({
                    'Content-Type': 'text/html',
                    'Cache-Control': 'no-cache',
                })
                    .send(html);
            }
            catch (e) {
                const { devServer } = this.ssr;
                devServer && devServer.ssrFixStacktrace(e);
                console.log(e.stack);
                res.status(500).end(e.stack);
            }
        });
    }
    listen() {
        return this.app.listen(9010, () => {
            console.log('http://localhost:9010');
            console.log(`http://${require('ip').address()}:9010`);
        });
    }
}

const renderHtml = async (app, manifest) => {
    // 生成html字符串
    const ctx = {};
    const rootHtml = await serverRenderer.renderToString(app, ctx);
    // 生成资源预取数组
    const preloadLinks = ctx.modules
        ? renderPreloadLinks(ctx.modules, manifest)
        : '';
    return { rootHtml, preloadLinks };
};
const renderPreloadLinks = (modules, manifest) => {
    let links = '';
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
    if (file.endsWith('.js')) {
        return `<link rel="modulepreload" crossorigin href="${file}">`;
    }
    else if (file.endsWith('.css')) {
        return `<link rel="stylesheet" href="${file}">`;
    }
    else if (file.endsWith('.woff')) {
        return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
    }
    else if (file.endsWith('.woff2')) {
        return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
    }
    else if (file.endsWith('.gif')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/gif">`;
    }
    else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`;
    }
    else if (file.endsWith('.png')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/png">`;
    }
    else {
        // TODO
        return '';
    }
};

const serialize = require('serialize-javascript');
class SSR {
    constructor({ buildOptions, runType }) {
        this.template = '';
        this.isBuild = false;
        this.isBuild = runType === 'build';
        this.setEnv(runType);
        this.buildOptions = buildOptions;
        this.createServer();
    }
    setEnv(runType) {
        process.env.NXXT_RUN_TYPE = runType || 'dev';
    }
    async createServer() {
        if (!this.isBuild) {
            this.devServer = await vite.createServer({
                root: process.cwd(),
                mode: process.env.NODE_ENV,
                logLevel: 'info',
                server: {
                    middlewareMode: true,
                },
                ...this.buildOptions
            });
        }
        this.app = new Server(this);
    }
    async _render(req) {
        const url = req.originalUrl;
        if (!this.isBuild) {
            const { transformIndexHtml, ssrLoadModule } = this.devServer;
            const template = getTemplate('index.html');
            this.template = await transformIndexHtml(url, template);
            this.render = (await ssrLoadModule('/src/entry-server.ts')).render;
        }
        else {
            this.template = getTemplate('dist/client/index.html');
            this.render = require('./dist/server/entry-server.js').render;
        }
        const { app, store } = await this.render(url, req.query);
        const { rootHtml, preloadLinks } = await renderHtml(app, this.isBuild ? require('./dist/client/ssr-manifest.json') : {});
        // 读取配置文件，注入给客户端
        // const config = require('dotenv').config({ path: resolve(`.env.${process.env.NODE_ENV}`) }).parsed;
        // console.log('读取到的配置', process.env.NODE_ENV, config);
        const state = '<script>window.__INIT_STATE__=' +
            serialize(store, { isJSON: true }) + ';' +
            // 'window.__APP_CONFIG__=' + serialize(config, { isJSON: true }) +
            '</script>';
        const html = this.template
            .replace(`<!--preload-links-->`, preloadLinks)
            .replace(`<!--app-html-->`, rootHtml)
            .replace(`<!--app-store-->`, state);
        return html;
    }
}

const cli = cac.cac('nxxt');
// function cleanOptions<Options extends GlobalCLIOptions>(
//   options: Options
// ): Omit<Options, keyof GlobalCLIOptions> {
//   const ret = { ...options }
//   delete ret['--']
//   delete ret.c
//   delete ret.config
//   delete ret.r
//   delete ret.root
//   delete ret.base
//   delete ret.l
//   delete ret.logLevel
//   delete ret.clearScreen
//   delete ret.d
//   delete ret.debug
//   delete ret.f
//   delete ret.filter
//   delete ret.m
//   delete ret.mode
//   return ret
// }
cli
    .option('-m, --mode <mode>', `[string] set env mode`);
// dev
cli
    .command('[root]') // default command
    .alias('serve')
    .action((root, options) => {
    const config = mergeConfig({
        root,
        ...options
    });
    // 获取构建参数
    const clientOptions = getClientOptions(config);
    new SSR({
        buildOptions: clientOptions
    });
});
// build
cli
    .command('build [root]')
    .action((root, options) => {
    const config = mergeConfig({
        root,
        ...options
    });
    const { clientOptions, serverOptions } = getBaseBuildConfig(config);
    vite.build(clientOptions);
    vite.build(serverOptions);
});
// start
cli
    .command('start [root]')
    .action((root, options) => {
    const config = mergeConfig({
        root,
        ...options
    });
    // 获取构建参数
    const clientOptions = getClientOptions(config);
    new SSR({
        buildOptions: clientOptions,
        runType: 'build'
    });
});
cli.help();
cli.version(require('../package.json').version);
cli.parse();
