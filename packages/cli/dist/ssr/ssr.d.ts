import { InlineConfig, ViteDevServer } from "vite";
import { Request } from "express";
import { Server } from "./server";
import { NxxtUserConfig } from "../config";
export interface SSROptions {
    buildOptions: InlineConfig;
    config: NxxtUserConfig;
    runType?: "build" | "dev";
}
export declare class SSR {
    buildOptions: InlineConfig;
    devServer: ViteDevServer;
    app: Server;
    render: any;
    template: string;
    isBuild: boolean;
    config: NxxtUserConfig;
    constructor({ buildOptions, runType, config }: SSROptions);
    setEnv(runType: SSROptions["runType"]): void;
    createServer(): Promise<void>;
    _render(req: Request): Promise<string>;
}
