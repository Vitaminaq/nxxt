import { createServer, InlineConfig, ViteDevServer } from "vite";
import { Request } from "express";
const serialize = require("serialize-javascript");
import { Server } from "./server";
import { renderHtml } from "./render";
import { getTemplate, resolve } from "../utils";
import { getServerEntry, NxxtUserConfig } from "../config";

export interface SSROptions {
  buildOptions: InlineConfig;
  config: NxxtUserConfig;
  runType?: "build" | "dev";
}

export class SSR {
  public buildOptions: InlineConfig;
  public devServer: ViteDevServer;
  public app: Server;
  public render: any;
  public template: string = "";
  public isBuild: boolean = false;
  public config: NxxtUserConfig;

  public constructor({ buildOptions, runType, config }: SSROptions) {
    this.isBuild = runType === "build";
    this.setEnv(runType);
    this.buildOptions = buildOptions;
    this.config = config;
    this.createServer();
  }

  public setEnv(runType: SSROptions["runType"]) {
    process.env.NXXT_RUN_TYPE = runType || "dev";
  }

  public async createServer() {
    if (!this.isBuild) {
      this.devServer = await createServer({
        root: process.cwd(),
        mode: process.env.NODE_ENV,
        logLevel: "info",
        server: {
          middlewareMode: true,
        },
        ...this.buildOptions
      });
    }
    this.app = new Server(this);
  }
  public async _render(req: Request) {
    const url = req.originalUrl;
    if (!this.isBuild) {
      const { transformIndexHtml, ssrLoadModule } = this.devServer;
      const template = getTemplate("index.html");
      this.template = await transformIndexHtml(url, template);
      this.render = (await ssrLoadModule(`/${getServerEntry()}`)).render;
    } else {
      this.template = getTemplate("dist/client/index.html");
      this.render = require(resolve("dist/server/entry-server.js")).render;
    }
    const { app, store } = await this.render(url, req.query);

    const { rootHtml, preloadLinks } = await renderHtml(
      app,
      this.isBuild ? require(resolve("dist/client/ssr-manifest.json")) : {}
    );

    // 读取配置文件，注入给客户端
    // const config = require('dotenv').config({ path: resolve(`.env.${process.env.NODE_ENV}`) }).parsed;
    // console.log('读取到的配置', process.env.NODE_ENV, config);
    const state =
      "<script>window.__INIT_STATE__=" +
      serialize(store, { isJSON: true }) +
      ";" +
      // 'window.__APP_CONFIG__=' + serialize(config, { isJSON: true }) +
      "</script>";

    const html = this.template
      .replace(`<!--preload-links-->`, preloadLinks)
      .replace(`<!--app-html-->`, rootHtml)
      .replace(`<!--app-store-->`, state);

    return html;
  }
}
