// import express, { Express, Request, Response } from "express";
// import { resolve } from 'pathe';
// import { isBuild } from '../utils/env';
// import { renderHtml } from './render';
// import { showBanner, getDirFiles, resolveModule } from '../utils/utils';
// import { NpxtConfig } from '../utils/config';

// const getUserMiddleware = () => {
//   return getDirFiles('middleware').map(i => {
//     return resolveModule(`./middleware/${i}`);
//   })
// }

// export class Server {
//   public app: Express;
//   public ctx: NpxtConfig;

//   public constructor(ctx: NpxtConfig) {
//     this.app = express();
//     this.ctx = ctx;
//     this.middleware();
//     this.listen();
//   }

//   public async middleware() {
//     const { app } = this;

//     console.log('middleware');

//     // custom middleware
//     getUserMiddleware().forEach(mid => mid(app));

//     const build = isBuild();
    
//     if (!build) {
//       if (!this.ctx.devServer) return;
//       app.use(this.ctx.devServer.middlewares);
//     } else {
//       app.use(require("compression")());
//       app.use(
//         require("serve-static")(resolve("dist/client"), {
//           index: false,
//           setHeaders: (res: any) => {
//             res.setHeader("Cache-Control", "public,max-age=31536000");
//           },
//         })
//       );
//     }
//     this.registerRoute();
//   }

//   public registerRoute() {
//     console.log('registerRoute');
//     this.app.use("*", async (req: Request, res: Response) => {
//       console.log('111111111111111111111111');
//       if (req.method.toLocaleLowerCase() !== 'get' || req.originalUrl === '/favicon.ico')
//         return;
//       try {
//         console.log('ppppppppppppppppppppppppp');
//         const html = await renderHtml(req, this.ctx);
//         // 禁用send的弱缓存
//         res
//           .status(200)
//           .set({
//             "Content-Type": "text/html",
//             "Cache-Control": "no-cache",
//           })
//           .send(html);
//       } catch (e: any) {
//         const { devServer } = this.ctx;
//         devServer && devServer.ssrFixStacktrace(e);
//         console.log(e.stack);
//         res.status(500).end(e.stack);
//       }
//     });
//   }

//   public listen() {
//     const { app } = this;
//     return app.listen(3000, () => {
//       return showBanner();
//     });
//   }
// }
