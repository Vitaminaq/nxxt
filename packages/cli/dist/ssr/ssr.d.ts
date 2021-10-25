import { InlineConfig } from "vite";
import { NxxtUserConfig } from "../config";
export interface SSROptions {
    buildOptions: InlineConfig;
    config: NxxtUserConfig;
    runType?: "build" | "dev";
}
export declare class SSR {
    buildOptions: InlineConfig;
    isBuild: boolean;
    config: NxxtUserConfig;
    constructor({ buildOptions, runType, config }: SSROptions);
    setEnv(runType: SSROptions["runType"]): void;
}
