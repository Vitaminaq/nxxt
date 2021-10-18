import { Main } from './main';
import { renderToString } from '@vue/server-renderer';

import { getAsyncData, ReqConfig } from '@/services/publics';

export async function render(
	url: string,
	manifest: { [key: string]: string[] },
	reqConfig: ReqConfig
) {
	const { app, router, store } = new Main(reqConfig);

	// 同步url
	router.push(url);

	// 根据参数决定是否需要预取数据
	await router.isReady();
	const { pd } = router.currentRoute.value.query;
	// 根据参数决定是否需要预取数据
	Number(pd) && store.$setSsrPath(url);
	await getAsyncData(router, store, true, reqConfig);

	// 生成html字符串
	const ctx: any = {};
	const html = await renderToString(app, ctx);

	// 生成资源预取数组
	const preloadLinks = ctx.modules
		? renderPreloadLinks(ctx.modules, manifest)
		: [];
	return [html, preloadLinks, store];
}

function renderPreloadLinks(
	modules: Set<string>,
	manifest: { [key: string]: string[] }
) {
	let links = '';
	const seen = new Set();
	modules.forEach((id: string) => {
		const files = manifest[id];

		if (files) {
			files.forEach((file: string) => {
				if (!seen.has(file)) {
					seen.add(file);
					links += renderPreloadLink(file);
				}
			});
		}
	});
	return links;
}

function renderPreloadLink(file: string) {
	if (file.endsWith('.js')) {
		return `<link rel="modulepreload" crossorigin href="${file}">`;
	} else if (file.endsWith('.css')) {
		return `<link rel="stylesheet" href="${file}">`;
	} else {
		return '';
	}
}
