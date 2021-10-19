import { InlineConfig, ViteDevServer } from 'vite';
import { Request } from 'express';
import { Server } from './server';
export interface SSROptions {
    buildOptions: InlineConfig;
    runType?: 'build' | 'dev';
}
export declare class SSR {
    buildOptions: InlineConfig;
    devServer: ViteDevServer;
    app: Server;
    render: any;
    template: string;
    isBuild: boolean;
    constructor({ buildOptions, runType }: SSROptions);
    setEnv(runType: SSROptions['runType']): void;
    createServer(): Promise<void>;
    _render(req: Request): Promise<string>;
}
