import fs from 'fs';
import path from 'path';
import { createServer } from 'vite';
const express = require('express');
const serialize = require('serialize-javascript');
const ip = require('ip');

// const appConfig = require('./services/app-config');

export async function server(
	clientOptions,
	root = process.cwd(),
	isProd = process.env.RUN_TYPE === 'build'
) {
	const resolve = (p: any) => path.resolve(process.cwd(), p);

	const indexProd = isProd
		? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
		: '';

	const manifest = isProd
		?
		require('./dist/client/ssr-manifest.json')
		: {};

	const app: any = express();

	let vite: any;
	if (!isProd) {
		vite = await createServer({
			root,
			mode: process.env.NODE_ENV,
			logLevel: 'info',
			server: {
				middlewareMode: true,
			},
			...clientOptions
		});
		app.use(vite.middlewares);
	} else {
		app.use(require('compression')());
		app.use(
			require('serve-static')(resolve('dist/client'), {
				index: false,
				setHeaders: (res: any) => {
					res.setHeader('Cache-Control', 'public,max-age=31536000');
				},
			})
		);
		// 响应拦截
		const routeCache = require('route-cache');
		app.use(
			routeCache.cacheSeconds(60, (req: any) => {
				const { v, pd } = req.query;
				// 预取数据模式不做缓存
				return !Number(pd) && v && `${req.path}${v}`;
			})
		);
	}
	// appConfig(app);
	app.use('*', async (req: any, res: any) => {
		try {
			const url = req.originalUrl;
			console.log('当前ssr路径：', url);
			let template, render;
			if (!isProd) {
				template = fs.readFileSync(resolve('index.html'), 'utf-8');
				template = await vite.transformIndexHtml(url, template);
				render = (await vite.ssrLoadModule('/src/entry-server.ts'))
					.render;
			} else {
				template = indexProd;
				render = require('./dist/server/entry-server.js').render;
			}

			// req.headers.cookie
			const [appHtml, preloadLinks, store] = await render(url, manifest, req.query);

			// 读取配置文件，注入给客户端
			const config = require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` }).parsed;
			const state =
				'<script>window.__INIT_STATE__=' +
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
		} catch (e: any) {
			vite && vite.ssrFixStacktrace(e);
			console.log(e.stack);
			res.status(500).end(e.stack);
		}
	});

	app.listen(9010, () => {
		console.log('http://localhost:9010');
		console.log(`http://${ip.address()}:9010`);
	})

	return { app };
}
