import { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export const ssrTransformCustomDir = () => {
	return {
		props: [],
		needRuntime: true,
	};
};

export const buildOptions: UserConfig = {
	root: process.cwd(),
    plugins: [
		legacy({
			targets: ['defaults'],
		}),
		vueJsx(),
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
		}) as any,
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
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	css: {
		postcss: {
			plugins: [
				require('postcss-pxtorem')({
					rootValue: 37.5,
					propList: ['*'],
				}),
			],
		},
	},
	build: {
		rollupOptions: {
			// 生产环境忽略无用包-暂不解决
			external: [],
		},
	},
	esbuild: {
		jsxFactory: 'h',
		jsxFragment: 'Fragment',
	},
}