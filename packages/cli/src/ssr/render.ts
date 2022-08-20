import { renderToString } from "@vue/server-renderer";
import { resolve } from 'pathe';
import { App, VNode, RendererNode, RendererElement } from "vue";
import type { Request } from "express";
import { getTemplate, getDevTemplate } from "../utils/utils";
import { isBuild } from '../utils/env';
import { NpxtConfig } from '../utils/config';

export async function renderHtml(req: Request, { devServer }: NpxtConfig) {
    // const serialize = require("serialize-javascript");
    const url = req.originalUrl;
    const build = isBuild();
    let template = '';
    let render;

    if (!build) {
      const { transformIndexHtml, ssrLoadModule } = devServer;
      template = getDevTemplate('', "index.html");
      template = await transformIndexHtml(url, template);
      render = (await ssrLoadModule('/entry-server.ts')).render;
    } else {
      template = getTemplate("dist/client/index.html");
      render = require(resolve("dist/server/entry-server.js")).render;
    }
    const main = await Promise.resolve(render(req.query));

    const { app } = main;

    await serverRender(req, main);

    const { rootHtml, preloadLinks } = await renderRootHtml(
      app,
      isBuild ? require(resolve("dist/client/ssr-manifest.json")) : {}
    );

    console.log(rootHtml, '9999999999999999999999');

    const html = template
      .replace(`<!--preload-links-->`, preloadLinks)
      .replace(`<!--app-html-->`, rootHtml);

    return html;
}
export const serverRender = async (req: Request, main: any) => {
  const { router, store } = main;

  const { originalUrl, query } = req;
	// sync url
	router.push(originalUrl);

	await router.isReady();
} 

export const renderRootHtml = async (
  app: App<any> | VNode<RendererNode, RendererElement>,
  manifest: any
): Promise<{
  rootHtml: string;
  preloadLinks: string;
}> => {
  const ctx: any = {};
  // render vue to html
  const rootHtml = await renderToString(app, ctx);

  // get preload source
  const preloadLinks = ctx.modules
    ? renderPreloadLinks(ctx.modules, manifest)
    : "";
  return { rootHtml, preloadLinks };
};

export const renderPreloadLinks = (
  modules: Set<string>,
  manifest: { [key: string]: string[] }
) => {
  let links = "";
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
};

export const renderPreloadLink = (file: string) => {
  if (file.endsWith(".js")) {
    return `<link rel="modulepreload" crossorigin href="${file}">`;
  } else if (file.endsWith(".css")) {
    return `<link rel="stylesheet" href="${file}">`;
  } else if (file.endsWith(".woff")) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
  } else if (file.endsWith(".woff2")) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
  } else if (file.endsWith(".gif")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/gif">`;
  } else if (file.endsWith(".jpg") || file.endsWith(".jpeg")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`;
  } else if (file.endsWith(".png")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/png">`;
  } else {
    // TODO
    return "";
  }
};
