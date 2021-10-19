import { renderToString } from '@vue/server-renderer';
import { App, VNode, RendererNode, RendererElement } from 'vue';

export class Render {

}

export const renderHtml = async (app: App<any> | VNode<RendererNode, RendererElement>, manifest: any): Promise<{
    rootHtml: string;
    preloadLinks: string;
}> => {
    // 生成html字符串
	const ctx: any = {};
	const rootHtml = await renderToString(app, ctx);

	// 生成资源预取数组
	const preloadLinks = ctx.modules
		? renderPreloadLinks(ctx.modules, manifest)
		: '';
	return { rootHtml, preloadLinks };
}

export const renderPreloadLinks = (
	modules: Set<string>,
	manifest: { [key: string]: string[] }
) => {
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

export const renderPreloadLink = (file: string) => {
	if (file.endsWith('.js')) {
        return `<link rel="modulepreload" crossorigin href="${file}">`
      } else if (file.endsWith('.css')) {
        return `<link rel="stylesheet" href="${file}">`
      } else if (file.endsWith('.woff')) {
        return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
      } else if (file.endsWith('.woff2')) {
        return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
      } else if (file.endsWith('.gif')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/gif">`
      } else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`
      } else if (file.endsWith('.png')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/png">`
      } else {
        // TODO
        return ''
      }
}
