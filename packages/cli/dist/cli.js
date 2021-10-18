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

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var jiti__default = /*#__PURE__*/_interopDefaultLegacy(jiti);
var vue__default = /*#__PURE__*/_interopDefaultLegacy(vue);
var vueJsx__default = /*#__PURE__*/_interopDefaultLegacy(vueJsx);
var vueLegacy__default = /*#__PURE__*/_interopDefaultLegacy(vueLegacy);

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

const express = require('express');
const serialize = require('serialize-javascript');
const ip = require('ip');
// const appConfig = require('./services/app-config');
async function server(clientOptions, root = process.cwd(), isProd = process.env.RUN_TYPE === 'build') {
    const resolve = (p) => path__default.resolve(process.cwd(), p);
    const indexProd = isProd
        ? fs__default.readFileSync(resolve('dist/client/index.html'), 'utf-8')
        : '';
    const manifest = isProd
        ?
            require('./dist/client/ssr-manifest.json')
        : {};
    const app = express();
    let vite$1;
    if (!isProd) {
        vite$1 = await vite.createServer({
            root,
            mode: process.env.NODE_ENV,
            logLevel: 'info',
            server: {
                middlewareMode: true,
            },
            ...clientOptions
        });
        app.use(vite$1.middlewares);
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
        const routeCache = require('route-cache');
        app.use(routeCache.cacheSeconds(60, (req) => {
            const { v, pd } = req.query;
            // 预取数据模式不做缓存
            return !Number(pd) && v && `${req.path}${v}`;
        }));
    }
    // appConfig(app);
    app.use('*', async (req, res) => {
        try {
            const url = req.originalUrl;
            console.log('当前ssr路径：', url);
            let template, render;
            if (!isProd) {
                template = fs__default.readFileSync(resolve('index.html'), 'utf-8');
                template = await vite$1.transformIndexHtml(url, template);
                render = (await vite$1.ssrLoadModule('/src/entry-server.ts'))
                    .render;
            }
            else {
                template = indexProd;
                render = require('./dist/server/entry-server.js').render;
            }
            // req.headers.cookie
            const [appHtml, preloadLinks, store] = await render(url, manifest, req.query);
            // 读取配置文件，注入给客户端
            const config = require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` }).parsed;
            const state = '<script>window.__INIT_STATE__=' +
                serialize(store, { isJSON: true }) + ';' +
                'window.__APP_CONFIG__=' + serialize(config, { isJSON: true }) +
                '</script>';
            const html = template
                .replace(`<!--preload-links-->`, preloadLinks)
                .replace(`<!--app-html-->`, appHtml)
                .replace(`<!--app-store-->`, state);
            // 禁用send的弱缓存
            res.status(200)
                .set({
                'Content-Type': 'text/html',
                'Cache-Control': 'no-cache',
            })
                .send(html);
        }
        catch (e) {
            vite$1 && vite$1.ssrFixStacktrace(e);
            console.log(e.stack);
            res.status(500).end(e.stack);
        }
    });
    app.listen(9010, () => {
        console.log('http://localhost:9010');
        console.log(`http://${ip.address()}:9010`);
    });
    return { app };
}

const cli = cac.cac('nxxt');
// dev
cli
    .command('[root]') // default command
    .alias('serve')
    .action(() => {
    // 获取构建参数
    const { clientOptions, serverOptions } = getBaseBuildConfig(getNxxtConfig());
    server(clientOptions);
});
// build
cli
    .command('build [root]')
    .action(() => {
    // 获取构建参数
    const { clientOptions, serverOptions } = getBaseBuildConfig(getNxxtConfig());
    // 服务端渲染构建
    vite.build(clientOptions).then(() => {
        vite.build(serverOptions);
    });
});
cli.help();
cli.version(require('../package.json').version);
cli.parse();
