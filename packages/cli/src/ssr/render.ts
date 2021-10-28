import { renderToString } from "@vue/server-renderer";
import { App, VNode, RendererNode, RendererElement } from "vue";
import { Request } from "express";
import { getTemplate, resolve } from "../utils";
import { getAsyncData } from './hook';
import { SSR } from "./ssr";
import { Server } from './server';
import { getServerEntry } from "../config";
import { createServer, ViteDevServer } from "vite";
import dotenv from 'dotenv'
const serialize = require("serialize-javascript");

export class Render {
  public ssr: SSR;
  public devServer: ViteDevServer | null = null;

  public constructor(ssr: SSR) {
    this.ssr = ssr;
    this.init();
  }

  public async init() {
    const { isBuild, buildOptions } = this.ssr;
    if (!isBuild) {
      this.devServer = await createServer({
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

  public async renderHtml(req: Request) {
    const url = req.originalUrl;
    const { isBuild } = this.ssr;
    let template = '';
    let render;

    if (!isBuild) {
      if (!this.devServer) return;
      const { transformIndexHtml, ssrLoadModule } = this.devServer;
      template = getTemplate("index.html");
      template = await transformIndexHtml(url, template);
      render = (await ssrLoadModule(`/${getServerEntry()}`)).render;
    } else {
      template = getTemplate("dist/client/index.html");
      render = require(resolve("dist/server/entry-server.js")).render;
    }
    const main = await Promise.resolve(render(req.query));

    const { app, store } = main;

    await serverRender(req, main);

    const { rootHtml, preloadLinks } = await renderRootHtml(
      app,
      isBuild ? require(resolve("dist/client/ssr-manifest.json")) : {}
    );

    // 读取配置文件，注入给客户端
    const baseConfig = dotenv.config({ path: resolve('.env') }).parsed;
    const config = dotenv.config({ path: resolve(`.env.${process.env.NODE_ENV}`) }).parsed;

    const state =
      "<script>window.__INIT_STATE__=" +
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

export const serverRender = async (req: Request, main: any) => {
  const { router, store } = main;

  const { originalUrl, query } = req;
	// sync url
	router.push(originalUrl);

	await router.isReady();
	const { pd } = router.currentRoute.value.query;

	Number(pd) && store.$setSsrPath(originalUrl);
	return getAsyncData(router, store, true, query as any);
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
