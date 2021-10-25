import express, { Express, Request, Response } from "express";
import { Render } from "./render";
import { resolve, getDirFiles, resolveModule } from "../utils";

const getUserMiddleware = () => {
  return getDirFiles('middleware').map(i => {
    return resolveModule(`./middleware/${i}`);
  })
}

export class Server {
  public render: Render;
  public app: Express;

  public constructor(render: Render) {
    this.render = render;
    this.app = express();
    this.middleware();
    this.listen();
  }

  public async middleware() {
    const { app, render } = this;

    // custom middleware
    getUserMiddleware().forEach(mid => mid(app));
    
    if (!render.ssr.isBuild) {
      if (!this.render.devServer) return;
      app.use(this.render.devServer.middlewares);
    } else {
      app.use(require("compression")());
      app.use(
        require("serve-static")(resolve("dist/client"), {
          index: false,
          setHeaders: (res: any) => {
            res.setHeader("Cache-Control", "public,max-age=31536000");
          },
        })
      );
      // 响应拦截
      app.use(
        require("route-cache").cacheSeconds(60, (req: any) => {
          const { v, pd } = req.query;
          // 预取数据模式不做缓存
          return !Number(pd) && v && `${req.path}${v}`;
        })
      );
    }
    this.registerRoute();
  }

  public registerRoute() {
    this.app.use("*", async (req: Request, res: Response) => {
      if (req.method.toLocaleLowerCase() !== 'get' || req.originalUrl === '/favicon.ico')
        return;
      console.log('当前ssr路径', req.method, req.originalUrl);
      try {
        const html = await this.render.renderHtml(req);
        // 禁用send的弱缓存
        res
          .status(200)
          .set({
            "Content-Type": "text/html",
            "Cache-Control": "no-cache",
          })
          .send(html);
      } catch (e: any) {
        const { devServer } = this.render;
        devServer && devServer.ssrFixStacktrace(e);
        console.log(e.stack);
        res.status(500).end(e.stack);
      }
    });
  }

  public listen() {
    const { app, render } = this;
    const { port = 3000 } = render.ssr.config;
    return app.listen(port, () => {
      console.log(`http://localhost:${port}`);
      console.log(`http://${require("ip").address()}:${port}`);
    });
  }
}
