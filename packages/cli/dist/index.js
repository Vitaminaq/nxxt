import { mergeConfig } from 'vite';
export * from 'vite';
import path from 'path';
import fs from 'fs';
import jiti from 'jiti';
import 'chalk';
import 'pretty-bytes';
import 'boxen';

const cwd = process.cwd();
const resolveModule = (p) => jiti(path.resolve(cwd))(p).default;
const resolve = (p) => path.resolve(process.cwd(), p);
const fileTypes = ["js", "ts"];
const getTypeFile = (p) => {
    const fts = fileTypes.filter((t) => fs.existsSync(resolve(`${p}.${t}`)));
    return fts.length ? `${p}.${fts[0]}` : null;
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
    const { NODE_ENV } = process.env;
    if (!NODE_ENV || NODE_ENV !== mode) {
        process.env.NODE_ENV = mode;
    }
    buildConfig.mode = mode;
    viteOptions = mergeConfig(viteOptions || {}, buildConfig);
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

// register store modules hook
const registerModules = (components, router, store, isServer, reqConfig) => {
    return components
        .filter((i) => typeof i.registerModule === 'function')
        .forEach((component) => {
        component.registerModule({
            route: router.currentRoute,
            store,
            router,
            isServer,
            reqConfig,
        });
    });
};
// prefetch data hook
const prefetchData = (components, router, store, isServer) => {
    const asyncDatas = components.filter((i) => typeof i.asyncData === 'function');
    return Promise.all(asyncDatas.map((i) => {
        return i.asyncData({
            route: router.currentRoute.value,
            store,
            router,
            isServer,
        });
    }));
};
// ssr custom hook
const getAsyncData = (router, store, isServer, reqConfig) => {
    return new Promise(async (resolve) => {
        const { matched, fullPath, query } = router.currentRoute.value;
        // current components
        const components = matched.map((i) => {
            return i.components.default;
        });
        // register store module
        registerModules(components, router, store, isServer, reqConfig);
        const { pd } = query;
        const isServerPage = store.ssrPath === fullPath;
        // prefetch data
        if ((isServer && Number(pd)) || (!isServer && !isServerPage)) {
            await prefetchData(components, router, store, isServer);
        }
        !isServer && store.ssrPath && store.$setSsrPath('');
        resolve();
    });
};

export { defaultNxxtConfigFile, defineNxxtConfig, getAsyncData, getClientEntry, getNxxtConfig, getServerEntry, getSsrTransformCustomDir, mergeCompilerOptions, mergeNxxtConfig, mergePwa, mergePxToRem };
