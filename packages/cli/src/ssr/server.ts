import express, { Express, Request, Response } from 'express';
import { SSR } from './ssr';
import { resolve } from '../utils';

export class Server {
    public ssr: SSR;
    public app: Express;

    public constructor(ssr: SSR) {
        this.ssr = ssr;
        this.app = express();
        this.middleware();
        this.listen();
    }

    public async middleware() {
        const { app } = this;
        if (!this.ssr.isBuild) {
            app.use(this.ssr.devServer.middlewares);
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
            app.use(
                require('route-cache').cacheSeconds(60, (req: any) => {
                    const { v, pd } = req.query;
                    // 预取数据模式不做缓存
                    return !Number(pd) && v && `${req.path}${v}`;
                })
            );
        }
        this.registerRoute();
    }

    public registerRoute() {
        this.app.use('*', async (req: Request, res: Response) => {
            try {
                const html = await this.ssr._render(req);
                // 禁用send的弱缓存
                res.status(200)
                    .set({
                        'Content-Type': 'text/html',
                        'Cache-Control': 'no-cache',
                    })
                    .send(html);
            } catch (e: any) {
                const { devServer } = this.ssr;
                devServer && devServer.ssrFixStacktrace(e);
                console.log(e.stack);
                res.status(500).end(e.stack);
            }
        });
    }

    public listen() {
        return this.app.listen(9010, () => {
            console.log('http://localhost:9010');
            console.log(`http://${require('ip').address()}:9010`);
        })
    }
}