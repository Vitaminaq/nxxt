import { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueLegacy from '@vitejs/plugin-legacy';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export const ssrTransformCustomDir = () => {
	return {
		props: [],
		needRuntime: true,
	};
};

export const getBaseOptions = (options: any): UserConfig => {
    const { pwa, jsx, pxToRem, legacy, alias = {} } = options;
    const plugins = [
        vue({
            template: {
                compilerOptions: {
                    directiveTransforms: {
                        'img-lazy-load': ssrTransformCustomDir,
                        rescroll: ssrTransformCustomDir,
                    },
                    isCustomElement: (tag: string) => {
                        if (tag === 'wx-open-launch-weapp') return true;
                        return false;
                    },
                },
            },
        }),
    ]
    legacy && plugins.push(
        vueLegacy({
            targets: ['defaults'],
        })
    )
    jsx && plugins.push(vueJsx());
    pwa && plugins.push(
        VitePWA({
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
        }) as any
    )
    const baseOptions: any = {
        plugins,
        resolve: {
            alias: {
                '@': path.resolve(process.cwd(), './src'),
                ...alias
            },
        },
    }
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
    })
    return baseOptions;
}
